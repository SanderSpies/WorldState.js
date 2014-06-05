'use strict';

/* @type {ImmutableGraphArray} */
var ImmutableGraphArray = require('./ImmutableGraphArray');
/* @type {ImmutableGraphObject} */
var ImmutableGraphObject = require('./ImmutableGraphObject');
/* @type {ReferenceRegistry} */
var ReferenceRegistry = require('./ReferenceRegistry');

var clone = require('./clone');
var getReferenceTo = ReferenceRegistry.getReferenceTo;
var isArray = Array.isArray;


/**
 * @type {Object.<number, object>}
 */
var _arrays = {};


/**
 * @type {Object.<number, object>}
 */
var _objects = {};


/**
 * Add a parent to the immutable object
 *
 * @param {ImmutableGraphObject|ImmutableGraphArray} imo
 * @param {ImmutableGraphObject|ImmutableGraphArray} newParent
 * @param {string} parentKey
 * @private
 */
function _addParent(imo, newParent, parentKey) {
  var i;
  var l;
  var existingParents = imo.__private.parents;
  var hasParent = false;

  // check if the parent isn't already present
  for (i = 0, l = existingParents.length; i < l; i++) {
    var existingParent = existingParents[i];
    if (existingParent.parent === newParent) {
      hasParent = true;
      break;
    }
  }

  // if the parent is not present then add it
  if (!hasParent) {
    existingParents[existingParents.length] = {
      parent: newParent,
      parentKey: parentKey
    };
  }
}


/**
 * Find a reference in the given array
 *
 * @param {[]} objects
 * @param {{}|[]} obj
 * @return {ImmutableGraphObject|ImmutableGraphArray}
 * @private
 */
function _find(objects, obj) {
  return _findAll(objects, obj)[0];
}


/**
 * Find all matching references in the given array
 *
 * @param {[]} objects
 * @param {{}} obj
 * @return {ImmutableGraphObject|ImmutableGraphArray}
 * @private
 */
function _findAll(objects, obj) {
  var id = obj.__worldStateUniqueId;
  var imos = [];
  if (id && objects[id]) {
    var data = objects[id];
    for (var i = 0, l = data.length; i < l; i++) {
      var existingObject = data[i];
      if (existingObject.__private.refToObj.ref === obj) {
        imos[imos.length] = existingObject;
      }
    }
  }
  return imos;
}


/**
 * Get an immutable object
 *
 * @param {{}} obj
 * @param {ImmutableGraphObject|ImmutableGraphArray} parent
 * @param {string} parentKey
 * @return {ImmutableGraphObject}
 * @private
 */
function _getImmutableObject(obj, parent, parentKey) {
  // try to get an existing immutable object
  var imo = _find(_objects, obj);

  // if we don't have one, create one
  if (!imo) {
    imo = new ImmutableGraphObject(obj);
    var id = obj.__worldStateUniqueId;
    if (!_objects[id]) {
      _objects[id] = [];
    }
    var objects = _objects[id];
    objects[objects.length] = imo;
  }

  // add parent if necessary
  if (parent && parentKey != null) {
    _addParent(imo, parent, parentKey);
  }

  return imo;
}


/**
 * Get an immutable array
 *
 * @param {[]} array
 * @param {ImmutableGraphObject|ImmutableGraphArray} parent
 * @param {string} parentKey
 * @return {ImmutableGraphObject|ImmutableGraphArray}
 * @private
 */
function _getImmutableArray(array, parent, parentKey) {
  // try to get an existing immutable array
  var imo = _find(_arrays, array);

  // if we don't have one, create one
  if (!imo) {
    imo = new ImmutableGraphArray(array);
    var id = array.__worldStateUniqueId;
    if (!_arrays[id]) {
      _arrays[id] = [];
    }
    var arrays = _arrays[id];
    arrays[arrays.length] = imo;
  }

  // add parent if necessary
  if (parent && parentKey != null) {
    _addParent(imo, parent, parentKey);
  }

  return imo;
}


/**
 * ImmutableGraphRegistry
 *
 * The Immutable Graph Registry stores all the Immutable Objects for
 * global manipulation
 *
 * @lends {ImmutableGraphRegistry}
 */
var ImmutableGraphRegistry = {

  /**
   * Change the reference id and ensures it's correct within the registry
   *
   * @param {ImmutableGraphObject|ImmutableGraphArray} obj
   * @param {number} newId
   * @param {number} oldId
   */
  changeReferenceId: function(obj, newId, oldId) {
    if (isArray(obj)) {
      delete _arrays[oldId];
      var arrays = _arrays[newId];
      if (!arrays) {
        _arrays[newId] = [];
        arrays = _arrays[newId];
      }
      arrays[arrays.length] = obj;
    }
    else {
      delete _objects[oldId];
      var objects = _objects[newId];
      if (!objects) {
        _objects[newId] = [];
        objects = _objects[newId];
      }
      objects[objects.length] = obj;
    }
  },

  /**
   * Recursively restore references
   *
   * @param {{ref:{}}} oldRef
   * @param {{ref:{}}} newRef
   */
  restoreReferences: function(oldRef, newRef) {
    if (oldRef) {
      var imoId = oldRef.ref.__worldStateUniqueId;
      var imos = _objects[imoId] || _arrays[imoId];

      if (!imos) {
        return;
      }

      if (oldRef !== newRef) {
        for (var i = 0, l = imos.length; i < l; i++) {
          var imo = imos[i];
          ImmutableGraphRegistry.
            setReferences(imo.__private.refToObj, newRef.ref);
          ImmutableGraphRegistry.
            changeReferenceId(imo, newRef.ref.__worldStateUniqueId,
              oldRef.ref.__worldStateUniqueId);
        }

        var newRefRef = newRef.ref;
        var oldRefRef = oldRef.ref;
        for (var key in newRefRef) {
          var value = newRefRef[key];
          if (typeof value === 'object') {
            if (oldRefRef[key] !== newRefRef[key] || oldRefRef[key].ref !== newRefRef[key].ref) {
              ImmutableGraphRegistry.restoreReferences(oldRefRef[key],
                newRefRef[key]);
            }
          }
        }
      }
    }
  },

  /**
   * Merge ImmutableGraphObjects into one
   *
   * @param {ImmutableGraphObject|ImmutableGraphArray} imo
   */
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
    var keys = Object.keys(_objects);
    var key;
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      var value = _objects[key];
      for (var j = 0, l2 = value.length; j < l2; j++) {
        var obj = value[j];
        var objPrivate = obj.__private;
        if (objPrivate.parents.indexOf(realParents[0]) > -1 &&
          objPrivate.refToObj.ref !== imoRefToObj.ref) {
          otherImos[otherImos.length] = obj;
        }
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

      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        var dd = _objects[key];
        for (var j2 = 0, l3 = dd.length; j2 < l3; j2++) {
          var obj2 = dd[j2];
          if (obj2.__private.refToObj.ref === imoRefToObjRef && obj2 !== imo) {
            results[results.length] = obj2;
          }
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

  /**
   * Get an immutable object
   *
   * @param {{ref:{}|[]}} obj
   * @param {ImmutableGraphObject|ImmutableGraphArray} parent
   * @param {string} parentKey
   * @return {ImmutableGraphObject|ImmutableGraphArray}
   */
  getImmutableObject: function(obj, parent, parentKey) {
    if (isArray(obj)) {
      return _getImmutableArray(obj, parent, parentKey);
    }
    else if (typeof obj === 'object') {
      return _getImmutableObject(obj, parent, parentKey);
    }
  },

  /**
   * Set the references to multiple immutable graph objects at once
   *
   * @param {{ref:{}}} reference
   * @param {{}} newValue
   */
  setReferences: function(reference, newValue) {
    var oldId = reference.ref.__worldStateUniqueId;

    var res;
    if (isArray(reference.ref)) {
      res = _findAll(_arrays, reference.ref);
    }
    else {
      res = _findAll(_objects, reference.ref);
    }
    var newRef = getReferenceTo(newValue);

    delete _objects[oldId];
    delete _arrays[oldId];

    for (var i = 0, l = res.length; i < l; i++) {
      var res2 = res[i];
      res2.__private.refToObj = newRef;
      var id = newValue.__worldStateUniqueId;
      if (isArray(newValue)) {
        if (!_arrays[id]) {
          _arrays[id] = [];
        }

        _arrays[id][_arrays[id].length] = res2;
      }
      else {
        if (!_objects[id]) {
          _objects[id] = [];
        }
        _objects[id][_objects[id].length] = res2;
      }
    }
  },

  /**
   * Remove an immutable graph object
   *
   * @param {{ref:{}}} reference
   */
  removeImmutableGraphObject: function(reference) {
    var foundImos;
    var id = reference.ref.__worldStateUniqueId;
    if (isArray(reference)) {
      foundImos = _findAll(_arrays, reference.ref);
    }
    else {
      foundImos = _findAll(_objects, reference.ref);
    }

    for (var i = 0, l = foundImos.length; i < l; i++) {
      var imo = foundImos[i];
      imo.__private.refToObj = null;
      var objects = _objects[id];
      if (objects) {
        var position = objects.indexOf(imo);
        if (position > -1) {
          var newObjects = objects.slice();
          newObjects.splice(position, 1);
          _objects[id] = newObjects;
        }
      }
      var arrays = _arrays[id];
      if (arrays) {
        position = arrays.indexOf(imo);
        if (position > -1) {
          var newArrays = arrays.slice();
          newArrays.splice(position, 1);
          _arrays[id] = newArrays;
        }
      }
    }
  }
};

module.exports = ImmutableGraphRegistry;
