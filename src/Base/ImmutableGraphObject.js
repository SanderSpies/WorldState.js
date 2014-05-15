'use strict';

var ReferenceRegistry = require('./ReferenceRegistry');

var clone = require('./clone');
var resolveObject = ReferenceRegistry.resolveObject;
var removeReference = ReferenceRegistry.removeReference;



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
    historyRefs: []
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
    historyRefs: []
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
    var __private = this.__private;
    var refToObj = __private.refToObj;
    var newRefToObj = {ref: clone(refToObj.ref)};
    if (!newValue && Array.isArray(refToObj.ref)) {
      var newRef = newRefToObj.ref.slice();
      newRef.splice(key, 1);
      newRefToObj.ref = newRef;
      this.length--;
    }
    else {
      newRefToObj.ref[key] = newValue;
    }

    setReferences(__private.refToObj, newRefToObj.ref);
    this.changed();
  },

  remove: function() {
    var __private = this.__private;
    removeReference(__private.refToObj.ref);
    removeImmutableGraphObject(__private.refToObj);
    this.changed();
  }

};

module.exports = ImmutableGraphObject;
