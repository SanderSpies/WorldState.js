'use strict';


/**
 * Keep track of references to objects.
 *
 */
var _references = [];
var isArray = Array.isArray;

var ReferenceRegistry = {

  getReferenceTo: function (obj) {
    for (var i = 0, l = _references.length; i < l; i++) {
      var reference = _references[i];
      if (reference.ref === obj) {
        return reference;
      }
    }

    var ref = _references[_references.length] = {
      ref: obj
    };

    return ref;
  },

  resolveObject: function (obj) {
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
