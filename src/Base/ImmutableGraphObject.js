'use strict';

var ReferenceRegistry = require('./ReferenceRegistry');

var clone = require('./clone');
var cloneDeep = require('lodash-node/modern/objects/cloneDeep');
var resolveObject = ReferenceRegistry.resolveObject;


var ImmutableGraphObject = function ImmutableGraphObject(obj) {
  this.__private = {
    connectionEndPoints: {},
    connectionStartPoints: {},
    refToObj: null,
    parents: [],
    saveHistory: false,
    historyRef: null,
    historyRefs: []
  };

  this.changeReferenceTo(obj);
};

var getImmutableObject;

ImmutableGraphObject.prototype = {
  __private: {
    connectionEndPoints: {},
    connectionStartPoints: {},
    refToObj: null,
    parents: [],
    saveHistory: false,
    historyRef: null,
    historyRefs: []
  },

  enableVersioning: function () {
    var __private = this.__private;
    __private.saveHistory = true;
    __private.historyRef = cloneDeep(__private.refToObj);
  },

  saveVersion: function (name) {
    var __private = this.__private;
    var historyRefs = __private.historyRefs;
    historyRefs[historyRefs.length] = {
      name: name,
      ref: __private.historyRef.ref
    };
  },

  getVersions: function () {
    return this.__private.historyRefs;
  },

  restoreVersion: function (version) {
    var __private = this.__private;
    __private.refToObj = resolveObject(version.ref);
  },

  changeReferenceTo: function (newObj) {
    var __private = this.__private;
    __private.refToObj = resolveObject(newObj.ref || newObj);
    this.changed(clone(__private.refToObj));
  },

  changeValueTo: function (newArrayInput) {
    var __private = this.__private;
    __private.refToObj.ref = resolveObject(newArrayInput).ref;
    this.changed(clone(__private.refToObj));
  },

  wrapped: function () {
    var __private = this.__private;
    var refToObjRef = __private.refToObj.ref;
    if (!getImmutableObject) {
      getImmutableObject = require('./ImmutableGraphRegistry').getImmutableObject;
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

  read: function () {
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
        parent.parent.__childChanged(parent.parentKey, refToObj.ref, oldReference);
      }
    }

    var connectionEndPoints = __private.connectionEndPoints;
    var keys = Object.keys(connectionEndPoints);
    for (i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      connectionEndPoints[key].changed(oldReference);
    }
  },

  __childChanged: function (key, newValue, _oldReference) {
    var __private = this.__private;
    var refToObj = __private.refToObj;
    var refToObjRef = refToObj.ref;

    refToObj.ref = clone(refToObjRef);
    refToObj.ref[key] = newValue;

    var oldReference = clone(refToObj);
    oldReference.ref[key] = _oldReference;

    if (__private.saveHistory) {
      __private.historyRef = oldReference;
    }

    this.changed(oldReference);
  },

  addConnection: function (opt) {
    var key = opt.startPointName;
    this.__private.connectionStartPoints[key] = opt.reference;
    opt.reference.__private.connectionEndPoints[opt.endPointName] = this;
  },

  getConnection: function (connectionKey) {
    var __private = this.__private;
    return __private.connectionStartPoints[connectionKey] ||
      __private.connectionEndPoints[connectionKey];
  },

  remove: function() {
    // not implemented yet
  }

};

module.exports = ImmutableGraphObject;