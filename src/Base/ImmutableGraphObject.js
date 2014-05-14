'use strict';

var ReferenceRegistry = require('./ReferenceRegistry');

var clone = require('./clone');
var resolveObject = ReferenceRegistry.resolveObject;

/**
 *
 * @param obj
 * @constructor
 */
var ImmutableGraphObject = function ImmutableGraphObject(obj) {
  this.__private = {
    refToObj: null,
    parents: [],
    saveHistory: false,
    historyRef: null,
    historyRefs: []
  };

  this.changeReferenceTo(obj);
};

var getImmutableObject;
var mergeWithExistingImmutableObject;
var setReferences;

ImmutableGraphObject.prototype = {
  __private: {
    refToObj: null,
    parents: [],
    saveHistory: false,
    historyRef: null,
    historyRefs: []
  },

  enableVersioning: function() {
    var __private = this.__private;
    __private.saveHistory = true;
    __private.historyRef = clone(__private.refToObj);
  },

  saveVersion: function(name) {
    var __private = this.__private;
    var historyRefs = __private.historyRefs;
    historyRefs[historyRefs.length] = {
      name: name,
      ref: clone(__private.historyRef.ref)
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

    __private.refToObj = resolveObject(newObj.ref || newObj);

    if (!mergeWithExistingImmutableObject) {
      mergeWithExistingImmutableObject =
        require('./ImmutableGraphRegistry').mergeWithExistingImmutableObject;
    }

    mergeWithExistingImmutableObject(this);

    this.changed(clone(__private.refToObj));
  },

  changeValueTo: function(newValue) {
    var __private = this.__private;
    // __private.refToObj.ref = resolveObject(newValue).ref;
    if (!setReferences) {
      setReferences =
        require('./ImmutableGraphRegistry').setReferences;
    }
    var newRefToObj = clone(resolveObject(newValue));
    setReferences(__private.refToObj, newRefToObj.ref);
    this.changed(clone(__private.refToObj));
  },

  wrapped: function() {
    var __private = this.__private;
    var refToObjRef = __private.refToObj.ref;
    if (!getImmutableObject) {
      getImmutableObject =
        require('./ImmutableGraphRegistry').getImmutableObject;
    }
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

  changed: function(oldReference) {
    var __private = this.__private;
    var parents = __private.parents;
    var refToObj = __private.refToObj;
    var i;
    var l;
    if (parents) {
      for (i = 0, l = parents.length; i < l; i++) {
        var parent = parents[i];
        parent.parent.__childChanged(parent.parentKey, refToObj,
          oldReference);
      }
    }
  },

  __childChanged: function(key, newValue, _oldReference) {
    var __private = this.__private;
    var refToObj = __private.refToObj;

    if (!setReferences) {
      setReferences =
        require('./ImmutableGraphRegistry').setReferences;
    }

    var newRefToObj = {ref: clone(refToObj.ref)};

    newRefToObj.ref[key] = newValue;

    var oldRefToObj = __private.refToObj;

    setReferences(__private.refToObj, newRefToObj.ref);

    var oldReference = oldRefToObj;

    if (__private.saveHistory) {
      __private.historyRef = __private.refToObj;
    }

    this.changed(oldReference);
  },

  remove: function() {
    // not implemented yet
  }

};

module.exports = ImmutableGraphObject;
