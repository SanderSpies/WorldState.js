'use strict';

var ImmutableGraphArray = require('./ImmutableGraphArray');
var ImmutableGraphObject = require('./ImmutableGraphObject');
var ReferenceRegistry = require('./ReferenceRegistry');
var clone = require('./clone');

var getReferenceTo = ReferenceRegistry.getReferenceTo;
var isArray = Array.isArray;

var _arrays = [];
var _objects = [];

function _addParent(imo, parent, parentKey) {
  var i;
  var l;
  var parents = imo.__private.parents;
  var hasParent = false;
  for (i = 0, l = parents.length; i < l; i++) {
    var parentO = parents[i];
    if (parentO.parent === parent) {
      hasParent = true;
      break;
    }
  }

  if (!hasParent) {
    parents[parents.length] = {
      parent: parent,
      parentKey: parentKey
    };
  }
}

function _find(objects, obj) {
  var imo;
  for (var i = 0, l = objects.length; i < l; i++) {
    var a = objects[i];
    if (a.__private.refToObj.ref === obj) {
      imo = a;
      break;
    }
  }
  return imo;
}

function _findAll(objects, obj) {
  var imos = [];
  for (var i = 0, l = objects.length; i < l; i++) {
    var a = objects[i];
    var refToObj = a.__private.refToObj;
    if (refToObj && refToObj.ref === obj) {
      imos[imos.length] = a;
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
    var realParents = imoPrivate.parents.filter(function(p) {
      return p === imoPrivate.realParent;
    });

    // ensure the parent is removed from the other children
    var otherImos = _objects.filter(function(obj) {
      var objPrivate = obj.__private;
      return objPrivate.parents.indexOf(realParents[0]) > -1 &&
        objPrivate.refToObj.ref !== imoRefToObj.ref;
    });

    if (otherImos && otherImos.length) {
      var p2 = otherImos[0].__private.parents;
      var position = p2.indexOf(realParents[0]);
      p2 = p2.slice(0, position).concat(p2.slice(position + 1));
      otherImos[0].__private.parents = p2;
    }

    // set the real parents
    imoPrivate.parents = realParents;

    if (imoRefToObj) {
      var imoRefToObjRef = imoRefToObj.ref;
      var results = _objects.filter(function(obj) {
        return obj.__private.refToObj.ref === imoRefToObjRef && obj !== imo;
      });
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
      if (position) {
        _objects = _objects.slice(0, position).concat(_objects.slice(position + 1));
      }
      position = _arrays.indexOf(res[i]);
      if (position) {
        _arrays = _arrays.slice(0, position).concat(_arrays.slice(position + 1));
      }
    }
  }
};

module.exports = ImmutableGraphRegistry;
