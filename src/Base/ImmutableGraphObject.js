'use strict';

require('setimmediate');

/* @type {ReferenceRegistry} */
var ReferenceRegistry = require('./ReferenceRegistry');

var clone = require('./clone');
var resolveObject = ReferenceRegistry.resolveObject;
var removeReference = ReferenceRegistry.removeReference;


/**
 * Bundle all child changes into 1
 * @param {function} fn
 * @this {ImmutableGraphObject}
 */
function aggregateChangedChildren(fn) {
  var __private = this.__private;
  if (__private.currentChildAggregation) {
    clearImmediate(__private.currentChildAggregation);
  }
  __private.currentChildAggregation = setImmediate(fn);
}

var isArray = Array.isArray;



/**
 * @lends {ImmutableGraphObject}
 * @param {{}} obj
 * @constructor
 */
var ImmutableGraphObject = function ImmutableGraphObject(obj) {
  if (!mergeWithExistingImmutableObject) {
    var ImmutableGraphRegistry = require('./ImmutableGraphRegistry');
    mergeWithExistingImmutableObject =
        ImmutableGraphRegistry.mergeWithExistingImmutableObject;
    setReferences = ImmutableGraphRegistry.setReferences;
    getImmutableObject = ImmutableGraphRegistry.getImmutableObject;
    removeImmutableGraphObject =
        ImmutableGraphRegistry.removeImmutableGraphObject;
  }

  this.__private = {
    refToObj: null,
    parents: [],
    saveHistory: false,
    historyRefs: [],
    changeListener: null,
    changedKeys: {},
    removeKeys: [],
    currentChildAggregation: null,
    currentChildEvent: null
  };

  this.changeReferenceTo(obj);
};

var getImmutableObject;
var mergeWithExistingImmutableObject;
var setReferences;
var removeImmutableGraphObject;

ImmutableGraphObject.prototype = {
  /**
   * @private
   */
  __private: {
    refToObj: null,
    parents: [],
    saveHistory: false,
    historyRefs: [],
    changeListener: null,
    changedKeys: {},
    removeKeys: [],
    currentChildAggregation: null,
    currentChildEvent: null
  },

  /**
   * Executes after the current actions, like insert and
   * changeValueTo, have completed
   *
   * @param {function} fn
   */
  afterChange: function(fn) {
    this.__private.changeListener = fn;
  },

  /**
   * Enable versioning for this graph object
   */
  enableVersioning: function() {
    var __private = this.__private;
    __private.saveHistory = true;
  },

  /**
   * Save current version
   *
   * @param {string} name
   */
  saveVersion: function(name) {
    var __private = this.__private;
    var historyRefs = __private.historyRefs;
    historyRefs[historyRefs.length] = {
      name: name,
      ref: clone(__private.refToObj.ref)
    };
  },

  /**
   * Get the stored versions of this graph object
   *
   * @return {[{ref:{}}]}
   */
  getVersions: function() {
    return this.__private.historyRefs;
  },

  /**
   * Restore the given version of the graph
   *
   * @param {{ref:{}}} version
   */
  restoreVersion: function(version) {
    var __private = this.__private;
    __private.refToObj = resolveObject(version.ref);
  },

  /**
   * Change the reference (pointing to a different memory address)
   *
   * @param {{ref:{}}} newObj
   */
  changeReferenceTo: function(newObj) {
    var __private = this.__private;
    var oldRefToObj = __private.refToObj;
    var oldRef;
    if (oldRefToObj) {
      oldRef = oldRefToObj.ref;
    }
    __private.refToObj = resolveObject(newObj);
    mergeWithExistingImmutableObject(this);
    if (oldRef) {
      removeReference(oldRef);
    }
    this._changed();
  },

  /**
   * Change the value (changing the value of the memory address)
   *
   * @param {{}} newValue
   */
  changeValueTo: function(newValue) {
    var __private = this.__private;
    var oldRef = __private.refToObj.ref;
    var newRefToObj = clone(resolveObject(newValue));
    setReferences(__private.refToObj, newRefToObj.ref);
    removeReference(oldRef);
    this._changed();
  },

  /**
   * Get a wrapped object
   *
   * @return {{}}
   */
  wrapped: function() {
    var __private = this.__private;
    var refToObjRef = __private.refToObj.ref;

    var wrap = {};
    var keys = Object.keys(refToObjRef);
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      if (refToObjRef.hasOwnProperty(key)) {
        var value = refToObjRef[key];
        if (typeof value === 'object') {
          wrap[key] = getImmutableObject(value.ref, this, key);
        }
      }
    }

    return wrap;
  },

  /**
   * Get the current object
   *
   * @return {{}}
   */
  read: function() {
    return this.__private.refToObj.ref;
  },

  /**
   * To inform that the graph has changed
   *
   * @private
   */
  _changed: function() {
    var __private = this.__private;
    var parents = __private.parents;
    var refToObj = __private.refToObj;
    var i;
    var l;
    if (parents) {
      for (i = 0, l = parents.length; i < l; i++) {
        var parent = parents[i];
        parent.parent.__childChanged(parent.parentKey, refToObj);
      }
    }
  },

  /**
   * Performed when a child has changed
   *
   * @param {string} key
   * @param {{}} newValue
   * @private
   */
  __childChanged: function(key, newValue) {
    var self = this;
    var __private = self.__private;
    var refToObj = __private.refToObj;
    var removeKeys = __private.removeKeys;
    var changedKeys = __private.changedKeys;

    if (!newValue && isArray(refToObj.ref)) {
      removeKeys[removeKeys.length] = key;
    }
    else {
      changedKeys[key] = newValue;
    }

    aggregateChangedChildren.call(this, function() {
      var __private = self.__private;
      var refToObj = __private.refToObj;
      var newRefToObj = {ref: clone(refToObj.ref)};
      var changeListener = __private.changeListener;
      var removeKeys = __private.removeKeys;

      var i;
      var l;
      for (i = 0, l = removeKeys.length; i < l; i++) {
        var removeKey = removeKeys[i];
        newRefToObj.ref.splice(removeKey, 1);
      }
      __private.removeKeys = [];

      var changedKeys = __private.changedKeys;
      var keys = Object.keys(changedKeys);
      for (i = 0, l = keys.length; i < l; i++) {
        var changeKey = keys[i];
        var value = changedKeys[changeKey];
        newRefToObj.ref[changeKey] = value;
      }
      __private.changedKeys = {};

      setReferences(__private.refToObj, newRefToObj.ref);

      self._changed();
      if (isArray(newRefToObj.ref)) {
        self.length = newRefToObj.ref.length;
      }
      if (changeListener) {
        if (__private.currentChildEvent) {
          clearTimeout(__private.currentChildEvent);
        }
        __private.currentChildEvent = setTimeout(function() {
          changeListener.apply();
        }, 0);
      }
    });
  },

  /**
   * Remove this graph object
   */
  remove: function() {
    var __private = this.__private;
    removeReference(__private.refToObj.ref);
    removeImmutableGraphObject(__private.refToObj);
    this._changed();
  }

};

module.exports = ImmutableGraphObject;
