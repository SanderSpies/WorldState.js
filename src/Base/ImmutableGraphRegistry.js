'use strict';

var ImmutableGraphArray = require('./ImmutableGraphArray');
var ImmutableGraphObject = require('./ImmutableGraphObject');
var ReferenceRegistry = require('./ReferenceRegistry');
var clone = require('./clone');

var getReferenceTo = ReferenceRegistry.getReferenceTo;
var isArray = Array.isArray;

var _arrays = [];
var _objects = [];

function _addParent(imo, newParent, parentKey) {
  var i;
  var l;
  var existingParents = imo.__private.parents;
  var hasParent = false;
  for (i = 0, l = existingParents.length; i < l; i++) {
    var existingParent = existingParents[i];
    if (existingParent.parent === newParent) {
      hasParent = true;
      break;
    }
  }

  if (!hasParent) {
    existingParents[existingParents.length] = {
      parent: newParent,
      parentKey: parentKey
    };
  }
}

function _find(objects, obj) {
  return _findAll(objects, obj)[0];
}

function _findAll(objects, obj) {
  var imos = [];
  for (var i = 0, l = objects.length; i < l; i++) {
    var existingObject = objects[i];
    var refToObj = existingObject.__private.refToObj;
    if (refToObj && refToObj.ref === obj) {
      imos[imos.length] = existingObject;
    }
  }
  return imos;
}

function _getImmutableObject(obj, parent, parentKey) {
  var imo = _find(_objects, obj);
  if (!imo) {
    imo = new ImmutableGraphObject(obj);
  }
  if (parent && parentKey != null) {
    _addParent(imo, parent, parentKey);
  }

  _objects[_objects.length] = imo;
  return imo;
}

function _getImmutableArray(array, parent, parentKey) {
  var imo = _find(_arrays, array);
  if (!imo) {
    imo = new ImmutableGraphArray(array);
  }
  if (parent && parentKey != null) {
    _addParent(imo, parent, parentKey);
  }

  _arrays[_arrays.length] = imo;
  return imo;
}

var ImmutableGraphRegistry = {

  mergeWithExistingImmutableObject: function(imo) {
    var imoPrivate = imo.__private;
    var imoRefToObj = imoPrivate.refToObj;
    if (!imoPrivate.realParent && imoPrivate.parents.length) {
      imoPrivate.realParent = imoPrivate.parents[0];
    }
    var realParents = [];
    var imoParents = imoPrivate.parents;
    for (var i = 0, l = imoParents.length; i < l; i++) {
      var imoParent = imoParents[i];
      if (imoParent === imoPrivate.realParent) {
        realParents[realParents.length] = imoParent;
      }
    }

    // ensure the parent is removed from the other children
    var otherImos = [];
    for (i = 0, l = _objects.length; i < l; i++) {
      var obj = _objects[i];
      var objPrivate = obj.__private;
      if (objPrivate.parents.indexOf(realParents[0]) > -1 &&
          objPrivate.refToObj.ref !== imoRefToObj.ref) {
        otherImos[otherImos.length] = obj;
      }
    }

    if (otherImos && otherImos.length) {
      var p2 = otherImos[0].__private.parents;
      var position = p2.indexOf(realParents[0]);
      var newParents = p2.slice();
      newParents.splice(position, 1);
      otherImos[0].__private.parents = newParents;
    }

    // set the real parents
    imoPrivate.parents = realParents;

    if (imoRefToObj) {
      var imoRefToObjRef = imoRefToObj.ref;
      var results = [];
      for (i = 0, l = _objects.length; i < l; i++) {
        var obj2 = _objects[i];
        if (obj2.__private.refToObj.ref === imoRefToObjRef && obj2 !== imo) {
          results[results.length] = obj2;
        }
      }

      if (results.length) {
        var resultPrivate = results[0].__private;
        resultPrivate.parents =
            resultPrivate.parents.concat(imoPrivate.parents);
        imoPrivate.parents = resultPrivate.parents;
        imoPrivate.refToObj = resultPrivate.refToObj;
      }
    }
  },

  getImmutableObject: function(obj, parent, parentKey) {
    if (isArray(obj)) {
      return _getImmutableArray(obj, parent, parentKey);
    }
    else if (typeof obj === 'object') {
      return _getImmutableObject(obj, parent, parentKey);
    }
  },

  setReferences: function(reference, newValue) {
    var res;
    if (isArray(reference.ref)) {
      res = _findAll(_arrays, reference.ref);
    }
    else {
      res = _findAll(_objects, reference.ref);
    }

    var newRef = getReferenceTo(newValue);
    for (var i = 0, l = res.length; i < l; i++) {
      res[i].__private.refToObj = newRef;
    }
  },

  removeImmutableGraphObject: function(reference) {
    var res;
    if (isArray(reference)) {
      res = _findAll(_arrays, reference.ref);
    }
    else {
      res = _findAll(_objects, reference.ref);
    }
    for (var i = 0, l = res.length; i < l; i++) {
      res[i].__private.refToObj = null;
      var position = _objects.indexOf(res[i]);
      if (position > -1) {
        var newObjects = _objects.slice();
        newObjects.splice(position, 1);
        _objects = newObjects;
      }
      position = _arrays.indexOf(res[i]);
      if (position > -1) {
        var newArrays = _arrays.slice();
        newArrays.splice(position, 1);
        _arrays = newArrays;
      }
    }
  }
};

module.exports = ImmutableGraphRegistry;
