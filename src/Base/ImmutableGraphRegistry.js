'use strict';

var ImmutableGraphArray = require('./ImmutableGraphArray');
var ImmutableGraphObject = require('./ImmutableGraphObject');
var ReferenceRegistry = require('./ReferenceRegistry');

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

function _getImmutableObject(obj, parent, parentKey) {
  var imo = _find(_objects, obj);
  if (!imo) {
    imo = new ImmutableGraphObject(obj);
  }
  if (parent && parentKey) {
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
  if (parent && parentKey) {
    _addParent(imo, parent, parentKey);
  }
  _arrays[_arrays.length] = imo;
  return imo;
}

var ImmutableGraphRegistry = {

  mergeWithExistingImmutableObject: function(imo) {
    if (imo.__private.refToObj) {
      var refToObjRef = imo.__private.refToObj.ref;
      var results = _objects.filter(function(obj) {
        return obj.__private.refToObj.ref === refToObjRef && obj !== imo;
      });
      if (results.length) {
        results[0].__private.parents = results[0].__private.parents.concat(imo.__private.parents);
        imo.__private = results[0].__private;
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
  }

};

module.exports = ImmutableGraphRegistry;
