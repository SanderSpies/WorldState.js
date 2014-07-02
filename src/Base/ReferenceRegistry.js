'use strict';

var _arrayReferences = [];
var _objectReferences = [];
var isArray = Array.isArray;
var isObjectArray = require('./isObjectArray');
var uniqueIdCounter = 1;


/**
 * Keeps track of references to objects
 *
 * @lends {ReferenceRegistry}
 */
var ReferenceRegistry = {

  _getArrayReferences: function() {
    return _arrayReferences;
  },

  _getObjectReferences: function() {
    return _objectReferences;
  },

  findObjectReference: function(obj) {
    var reference = _objectReferences[obj.__worldStateUniqueId];
    if (reference && reference.ref === obj) {
      return reference;
    }
    return null;
  },

  findArrayReference: function(obj) {
    var reference = _arrayReferences[obj.__worldStateUniqueId];
    if (reference && reference.ref === obj) {
      return reference;
    }
    return null;
  },

  /**
   * Remove an existing reference
   *
   * @param {{ref:{}}} obj
   */
  removeReference: function(obj) {
    delete _objectReferences[obj.__worldStateUniqueId];
    delete _arrayReferences[obj.__worldStateUniqueId];
  },

  /**
   * Get an existing reference or create a new one
   *
   * @param {{__worldStateUniqueId:number}} obj
   * @return {{ref:{}}}
   */
  getReferenceTo: function(obj) {
    var reference;
    var izArray = isArray(obj);
    if (obj.__worldStateUniqueId) {
      if (izArray) {
        reference = ReferenceRegistry.findArrayReference(obj);
      }
      else {
        reference = ReferenceRegistry.findObjectReference(obj);
      }
      if (reference) {
        return reference;
      }
    }
    var id = uniqueIdCounter++;
    obj.__worldStateUniqueId = id;

    var ref;
    if (izArray) {
      ref = _arrayReferences[id] = {
        ref: obj
      };
    }
    else {
      ref = _objectReferences[id] = {
        ref: obj
      };
    }
    return ref;
  },

  /**
   * Resolve an object and it's inner objects to use reference objects
   *
   * @param {{__worldStateUniqueId}} obj
   * @return {{ref: {}}}
   */
  resolveObject: function(obj, currentChain) {
    var stop = false;
    if (!currentChain) {
      currentChain = {};
    }
    if (obj.__worldStateUniqueId) {
      currentChain[obj.__worldStateUniqueId] = true;
    }

    var val;
    var i;
    var l;
    if (isObjectArray(obj)) {
      var refToArray = ReferenceRegistry.getReferenceTo(obj);
      var newArray = refToArray.ref;
      for (i = 0, l = obj.length; i < l; i++) {
        val = obj[i];
        if (val.ref) {
          newArray[i] = val;
        }
        else {
          newArray[i] = ReferenceRegistry.resolveObject(obj[i], currentChain);
        }
      }
      return refToArray;
    }
    else { // an object
      var refToObj = ReferenceRegistry.getReferenceTo(obj);
      var newObj = refToObj.ref;
      var keys = Object.keys(obj);
      for (i = 0, l = keys.length; i < l; i++) {
        var key = keys[i];
        val = obj[key];
        if (typeof val === 'object' && !val.ref) {
          if (currentChain[obj.__worldStateUniqueId]) {
            newObj[key] = ReferenceRegistry.getReferenceTo(val);
          }
          else {
            newObj[key] = ReferenceRegistry.resolveObject(val, currentChain);
          }
        }
      }
      return refToObj;
    }
  }

};

module.exports = ReferenceRegistry;
