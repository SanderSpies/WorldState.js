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
    getImmutableObject =
        require('./ImmutableGraphRegistry').getImmutableObject;
  }

  ImmutableGraphObject.call(this, array);
  this.length = array.length;
};
var ImmutableGraphObjectPrototype = ImmutableGraphObject.prototype;
var getImmutableObject;

// public API
ImmutableGraphArray.prototype = {

  /**
   * @private
   */
  __private: {
    refToObj: null,
    parents: [],
    saveHistory: false,
    historyRef: null,
    historyRefs: [],
    cachedWhereResults: [],
    changedKeys: [],
    removeKeys: []
  },
  length: 0,
  enableVersioning: ImmutableGraphObjectPrototype.enableVersioning,
  saveVersion: ImmutableGraphObjectPrototype.saveVersion,
  restoreVersion: ImmutableGraphObjectPrototype.restoreVersion,
  getVersions: ImmutableGraphObjectPrototype.getVersions,
  changeReferenceTo: ImmutableGraphObjectPrototype.changeReferenceTo,
  changeValueTo: ImmutableGraphObjectPrototype.changeValueTo,
  wrapped: ImmutableGraphObjectPrototype.wrapped,
  read: ImmutableGraphObjectPrototype.read,
  __changed: ImmutableGraphObjectPrototype.__changed,
  __childChanged: ImmutableGraphObjectPrototype.__childChanged,
  __aggregateChangedChildren:
      ImmutableGraphObjectPrototype.__aggregateChangedChildren,
  remove: ImmutableGraphObjectPrototype.remove,
  afterChange: ImmutableGraphObjectPrototype.afterChange,

  /**
   * Insert a new item into the array
   *
   * @param {{}} newItem
   */
  insert: function(newItem) {
    this._insert(newItem);
    this.__changed();
  },

  /**
   *
   * @param {{}} newItem2
   * @private
   */
  _insert: function(newItem2) {
    var newItem = getReferenceTo(newItem2);
    var __private = this.__private;
    var refToArray = __private.refToObj;
    var refToArrayRef = refToArray.ref;

    var alreadyInserted = false;
    var newItemId = newItem.ref.id;
    if (newItemId) {
      var position = -1;
      for (var i = 0, l = refToArrayRef.length; i < l; i++) {
        if (refToArrayRef[i].ref.id === newItemId) {
          position = i;
          break;
        }
      }

      if (position > -1) {
        alreadyInserted = true;
        removeReference(refToArrayRef[position].ref);
        refToArrayRef[position] = newItem;
      }
    }

    if (!alreadyInserted) {
      var key = refToArrayRef.length;
      refToArrayRef[key] = newItem;
      this.length++;
    }
  },

  /**
   * Insert multiple items into the array
   *
   * @param {[]} newItems
   */
  insertMulti: function(newItems) {
    for (var i = 0, l = newItems.length; i < l; i++) {
      var newItem = newItems[i];
      this._insert(newItem);
    }
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
    return containers;
  }

};

module.exports = ImmutableGraphArray;
