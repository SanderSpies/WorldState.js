'use strict';

var _references = [];
var isArray = Array.isArray;


/**
 * Keeps track of references to objects
 *
 * @lends {ReferenceRegistry}
 */
var ReferenceRegistry = {

  /**
   * Find an existing reference
   *
   * @param {{}} obj
   * @return {{ref:{}}|null}
   */
  findReference: function(obj) {
    for (var i = 0, l = _references.length; i < l; i++) {
      var reference = _references[i];
      if (reference.ref === obj) {
        return reference;
      }
    }
    return null;
  },

  /**
   * Remove an existing reference
   *
   * @param {{ref:{}}} obj
   */
  removeReference: function(obj) {
    var ref = ReferenceRegistry.findReference(obj);
    if (ref) {
      var position = _references.indexOf(ref);
      var newReferences = _references.slice();
      newReferences.splice(position, 1);
      _references = newReferences;
    }
  },

  /**
   * Get an existing reference or create a new one
   *
   * @param {{}} obj
   * @return {{ref:{}}}
   */
  getReferenceTo: function(obj) {
    var reference = ReferenceRegistry.findReference(obj);
    if (reference) {
      return reference;
    }

    var ref = _references[_references.length] = {
      ref: obj
    };

    return ref;
  },

  /**
   * Resolve an object and it's inner objects to use reference objects
   *
   * @param {{}} obj
   * @return {{ref: {}}}
   */
  resolveObject: function(obj) {
    var val;
    var i;
    var l;
    if (isArray(obj)) {
      var refToArray = ReferenceRegistry.getReferenceTo(obj);
      var newArray = refToArray.ref;
      for (i = 0, l = obj.length; i < l; i++) {
        val = obj[i];
        if (val.ref) {
          newArray[i] = val;
        }
        else {
          newArray[i] = ReferenceRegistry.resolveObject(obj[i]);
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
          newObj[key] = ReferenceRegistry.resolveObject(val);
        }
      }
      return refToObj;
    }
  }

};

module.exports = ReferenceRegistry;
