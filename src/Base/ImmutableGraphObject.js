'use strict';

require('setimmediate');

var ReferenceRegistry = require('./ReferenceRegistry');
var clone = require('./clone');
var resolveObject = ReferenceRegistry.resolveObject;
var removeReference = ReferenceRegistry.removeReference;

function aggregateChangedChildren(fn) {
  var __private = this.__private;
  if (__private.currentChildAggregation) {
    clearImmediate(__private.currentChildAggregation);
  }
  __private.currentChildAggregation = setImmediate(fn);
}

var isArray = Array.isArray;



/**
 *
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

  afterChange: function(fn) {
    this.__private.changeListener = fn;
  },

  enableVersioning: function() {
    var __private = this.__private;
    __private.saveHistory = true;
  },

  saveVersion: function(name) {
    var __private = this.__private;
    var historyRefs = __private.historyRefs;
    historyRefs[historyRefs.length] = {
      name: name,
      ref: clone(__private.refToObj.ref)
    };
  },

  getVersions: function() {
    return this.__private.historyRefs;
  },

  restoreVersion: function(version) {
    var __private = this.__private;
    __private.refToObj = resolveObject(version.ref);
  },

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
    this.changed();
  },

  changeValueTo: function(newValue) {
    var __private = this.__private;
    var oldRef = __private.refToObj.ref;
    var newRefToObj = clone(resolveObject(newValue));
    setReferences(__private.refToObj, newRefToObj.ref);
    removeReference(oldRef);
    this.changed();
  },

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

  read: function() {
    return this.__private.refToObj.ref;
  },

  changed: function() {
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

      self.changed();
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

  remove: function() {
    var __private = this.__private;
    removeReference(__private.refToObj.ref);
    removeImmutableGraphObject(__private.refToObj);
    this.changed();
  }

};

module.exports = ImmutableGraphObject;
