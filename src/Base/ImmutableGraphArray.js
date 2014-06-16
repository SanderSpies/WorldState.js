'use strict';

/* @type {ImmutableGraphObject} */
var ImmutableGraphObject = require('./ImmutableGraphObject');
/* @type {ReferenceRegistry} */
var ReferenceRegistry = require('./ReferenceRegistry');

var clone = require('./clone');
var getReferenceTo = ReferenceRegistry.getReferenceTo;
var removeReference = ReferenceRegistry.removeReference;



/**
 * ImmutableGraphArray
 *
 * @lends {ImmutableGraphArray}
 * @param {[]} array
 * @constructor
 */
var ImmutableGraphArray = function ImmutableGraphArray(array) {
  if (!getImmutableObject) {
    var ImmutableGraphRegistry = require('./ImmutableGraphRegistry');
    getImmutableObject = ImmutableGraphRegistry.getImmutableObject;
    setReferences = ImmutableGraphRegistry.setReferences;
  }
  ImmutableGraphObject.call(this, array);
  this.length = array.length;
};
var ImmutableGraphObjectPrototype = ImmutableGraphObject.prototype;
var getImmutableObject;
var setReferences;

// public API
ImmutableGraphArray.prototype = {
  length: 0,
  __private: ImmutableGraphObjectPrototype.__private,
  enableVersioning: ImmutableGraphObjectPrototype.enableVersioning,
  saveVersion: ImmutableGraphObjectPrototype.saveVersion,
  restoreVersion: ImmutableGraphObjectPrototype.restoreVersion,
  getVersions: ImmutableGraphObjectPrototype.getVersions,
  changeReferenceTo: ImmutableGraphObjectPrototype.changeReferenceTo,
  changeValueTo: ImmutableGraphObjectPrototype.changeValueTo,
  wrapped: ImmutableGraphObjectPrototype.wrapped,
  generatedId: ImmutableGraphObjectPrototype.generatedId,
  read: ImmutableGraphObjectPrototype.read,
  __changed: ImmutableGraphObjectPrototype.__changed,
  __childChanged: ImmutableGraphObjectPrototype.__childChanged,
  __aggregateChangedChildren:
      ImmutableGraphObjectPrototype.__aggregateChangedChildren,
  __informChangeListeners:
      ImmutableGraphObjectPrototype.__informChangeListeners,
  remove: ImmutableGraphObjectPrototype.remove,
  afterChange: ImmutableGraphObjectPrototype.afterChange,

  /**
   * Insert a new item into the array
   *
   * @param {{}} newItem
   */
  insert: function(newItem) {
    var __private = this.__private;
    var oldRefToObj = __private.refToObj;
    var oldRefToObjRef = oldRefToObj.ref;
    this._insert(newItem, -1);
    setReferences(oldRefToObj, clone(oldRefToObjRef));
    removeReference(oldRefToObjRef);
    this.__changed();
  },

  /**
   *
   * @param {{}} newItem2
   * @param {number} position
   * @private
   */
  _insert: function(newItem2, position) {
    var newItem = getReferenceTo(newItem2);
    var __private = this.__private;
    var refToArray = __private.refToObj;
    var refToArrayRef = refToArray.ref;

    var alreadyInserted = false;
    var newItemId = newItem.ref.id;
    if (newItemId) {
      var positions = [];
      var i;
      var l;
      for (i = 0, l = refToArrayRef.length; i < l; i++) {
        if (refToArrayRef[i] && refToArrayRef[i].ref.id === newItemId) {
          positions[positions.length] = i;
        }
      }

      for (i = 0, l = positions.length; i < l; i++) {
        var position = positions[i];
        alreadyInserted = true;
        removeReference(refToArrayRef[position].ref);
        refToArrayRef[position] = newItem;
      }
    }

    if (!alreadyInserted) {
      if (position < 0) {
        var key = refToArrayRef.length;
        refToArrayRef[key] = newItem;
      }
      else {
        refToArrayRef.splice(position, 0, newItem);
      }
      this.length++;
    }
  },

  /**
   * Insert multiple items into the array
   *
   * @param {[]} newItems
   */
  insertMulti: function(newItems) {
    var __private = this.__private;
    var oldRefToObj = __private.refToObj;
    var oldRefToObjRef = oldRefToObj.ref;

    for (var i = 0, l = newItems.length; i < l; i++) {
      var newItem = newItems[i];
      this._insert(newItem, -1);
    }

    setReferences(oldRefToObj, clone(oldRefToObjRef));
    removeReference(oldRefToObjRef);
    this.__changed();
  },

  /**
   * Retrieve an item from the array at the specified position
   *
   * @param {number} position
   * @return {ImmutableGraphObject|ImmutableGraphArray}
   */
  at: function(position) {
    var ref = this.__private.refToObj.ref[position].ref;
    return getImmutableObject(ref, this, position);
  },

  /**
   * Filter the array on the given conditions
   *
   * @param {object} conditions
   * @param {boolean} cache
   * @return {Array}
   */
  where: function(conditions, cache) {
    // TODO: cache results, and give the same results back
    var refToArrayRef = this.__private.refToObj.ref;
    var results = [];
    var parentKeys = [];
    var j = 0;
    var i;
    var l;
    var containers = [];
    for (i = 0, l = refToArrayRef.length; i < l; i++) {
      var obj = refToArrayRef[i].ref;
      var show = true;
      var keys = Object.keys(conditions);
      for (var k = 0, l2 = keys.length; k < l2; k++) {
        var key = keys[k];
        if (obj[key] !== conditions[key]) {
          show = false;
        }
      }
      if (show) {
        results[j] = obj;
        parentKeys[j] = i;
        j++;
        containers[containers.length] =
          getImmutableObject(obj, this, i);
      }
    }

    // todo move function outside
    containers.changePropertiesTo = function() {

    };

    return containers;
  },

  /**
   * Change the properties for all the children of this array
   *
   * @param {{}} newProperties
   */
  changePropertiesTo: function(newProperties) {
    var __private = this.__private;
    var newArray = clone(__private.refToObj.ref);
    for (var i = 0, l = newArray.length; i < l; i++) {
      var item = clone(newArray[i].ref);
      for (var key in newProperties) {
        if (newProperties.hasOwnProperty(key)) {
          item[key] = newProperties[key];
        }
      }

      newArray[i].ref = item;
    }
    this.changeValueTo(newArray);
  },

  /**
   * Insert an item at the given position.
   *
   * @param {number} position
   * @param {ImmutableGraphObject|ImmutableGraphArray} newItem
   */
  insertAt: function(position, newItem) {
    var __private = this.__private;
    var oldRefToObj = __private.refToObj;
    var oldRefToObjRef = oldRefToObj.ref;
    this._insert(newItem, position);
    setReferences(oldRefToObj, clone(oldRefToObjRef));
    removeReference(oldRefToObjRef);
    this.__changed();
  },

  removeMulti: function(items) {
    // TODO
    /*var __private = this.__private;
    var refToObj = __private.refToObj;
    var refToObjRef = refToObj.ref;
    removeReference(refToObjRef);
    var parents = __private.parents;
    require('./ImmutableGraphRegistry').removeImmutableGraphObject(refToObj);
    if (isArray(refToObjRef)) {
      refToObj.ref = [];
    }
    this.__changed({parents: parents});*/
  },

  getPositionFor: function() {
    // todo
  },

  /**
   * Order the array
   *
   * @param {[{}]} orderDirectives
   */
  orderBy: function(orderDirectives) {
    var __private = this.__private;
    var _orderDirectives = orderDirectives.reverse();
    var currValues = __private.refToObj.ref;
    var bla = [];
    var i, l;
    for (i = 0, l = currValues.length; i < l; i++) {
      bla[i] = currValues[i].ref;
    }

    for (i = 0, l = _orderDirectives.length; i < l; i++) {
      var directive = _orderDirectives[i];

    }
  }

};

module.exports = ImmutableGraphArray;
