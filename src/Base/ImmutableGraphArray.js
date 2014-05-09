'use strict';

var ImmutableGraphObject = require('./ImmutableGraphObject');
var ReferenceRegistry = require('./ReferenceRegistry');

var clone = require('./clone');



/**
 * ImmutableGraphArray
 *
 * @param {[]} array
 * @constructor
 */
var ImmutableGraphArray = function ImmutableGraphArray(array) {
  if (!getImmutableObject) {
    getImmutableObject =
        require('./ImmutableGraphRegistry').getImmutableObject;
  }

  ImmutableGraphObject.call(this, array);
};
var ImmutableGraphObjectPrototype = ImmutableGraphObject.prototype;
var getImmutableObject;

// public API
ImmutableGraphArray.prototype = {

  /**
   * @private
   */
  __private: {
    connectionEndPoints: {},
    connectionStartPoints: {},
    refToObj: null,
    parents: [],
    saveHistory: false,
    historyRef: null,
    historyRefs: [],
    cachedWhereResults: []
  },

  enableVersioning: ImmutableGraphObjectPrototype.enableVersioning,
  saveVersion: ImmutableGraphObjectPrototype.saveVersion,
  restoreVersion: ImmutableGraphObjectPrototype.restoreVersion,
  getVersions: ImmutableGraphObjectPrototype.getVersions,
  changeReferenceTo: ImmutableGraphObjectPrototype.changeReferenceTo,
  changeValueTo: ImmutableGraphObjectPrototype.changeValueTo,
  wrapped: ImmutableGraphObjectPrototype.wrapped,
  read: ImmutableGraphObjectPrototype.read,
  changed: ImmutableGraphObjectPrototype.changed,
  __childChanged: ImmutableGraphObjectPrototype.__childChanged,

  /**
   * Insert a new item into the array
   *
   * @param {{}} newItem
   */
  insert: function(newItem) {
    var __private = this.__private;
    this._insert(newItem);
    this.changed(clone(__private.refToObj));
  },

  /**
   *
   * @param {{}} newItem
   * @private
   */
  _insert: function(newItem) {
    var __private = this.__private;
    var refToArray = __private.refToObj;
    var refToArrayRef = refToArray.ref;

    var alreadyInserted = false;
    var newItemId = newItem.id;

    if (newItemId) {

      var position = -1;
      for (var i = 0, l = refToArrayRef.length; i < l; i++) {
        if (refToArrayRef[i].id === newItemId) {
          position = i;
          break;
        }
      }

      if (position > -1) {
        alreadyInserted = true;
        refToArrayRef[position] = newItem;
      }
    }

    if (!alreadyInserted) {
      var key = refToArrayRef.length;
      refToArrayRef[key] = newItem;
    }
  },

  /**
   * Insert multiple items into the array
   *
   * @param {[]} newItems
   */
  insertMulti: function(newItems) {
    var __private = this.__private;

    for (var i = 0, l = newItems.length; i < l; i++) {
      var newItem = newItems[i];
      this._insert(newItem);
    }

    this.changed(clone(__private.refToObj));
  },

  /**
   * Retrieve an item from the array at the specified position
   *
   * @param {number} position
   * @return {*}
   */
  at: function(position) {
    return getImmutableObject(this.__private.refToObj.ref[position]);
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
      }
    }

    // wrap into ImmutableObjects
    var containers = [];
    for (i = 0, l = results.length; i < l; i++) {
      containers[containers.length] =
          getImmutableObject(results[i], this, parentKeys[i]);
    }

    return containers;
  },

  remove: function(obj) {
    // not implemented yet
  }

};

module.exports = ImmutableGraphArray;
