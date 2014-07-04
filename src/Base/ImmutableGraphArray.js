'use strict';

/* @type {ImmutableGraphObject} */
var ImmutableGraphObject = require('./ImmutableGraphObject');
/* @type {ReferenceRegistry} */
var ReferenceRegistry = require('./ReferenceRegistry');

var clone = require('./clone');
var createMicroTask = require('./createMicroTask');
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
    var self = this;
    createMicroTask(function(){
      var __private = self.__private;
      var oldRefToObj = __private.refToObj;
      var oldRefToObjRef = oldRefToObj.ref;
      self._insert(newItem, -1);
      setReferences(oldRefToObj, clone(oldRefToObjRef));
      removeReference(oldRefToObjRef);
      self.__changed();
    });
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
    var self = this;
    createMicroTask(function() {
      var __private = self.__private;
      var oldRefToObj = __private.refToObj;
      var oldRefToObjRef = oldRefToObj.ref;

      for (var i = 0, l = newItems.length; i < l; i++) {
        var newItem = newItems[i];
        self._insert(newItem, -1);
      }

      setReferences(oldRefToObj, clone(oldRefToObjRef));
      removeReference(oldRefToObjRef);
      self.__changed();
    });
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
    var self = this;
    createMicroTask(function() {
      var __private = self.__private;
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
      self.changeValueTo(newArray);
    });
  },

  /**
   * Insert an item at the given position.
   *
   * @param {number} position
   * @param {ImmutableGraphObject|ImmutableGraphArray} newItem
   */
  insertAt: function(position, newItem) {
    var self = this;
    createMicroTask(function() {
      var __private = self.__private;
      var oldRefToObj = __private.refToObj;
      var oldRefToObjRef = oldRefToObj.ref;
      self._insert(newItem, position);
      setReferences(oldRefToObj, clone(oldRefToObjRef));
      removeReference(oldRefToObjRef);
      self.__changed();
    });
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
    var self = this;
    createMicroTask(function() {
      var __private = self.__private;
      var directiveKeys = Object.keys(orderDirectives);
      var _orderDirectives = directiveKeys.reverse();
      var oldRefToObj = __private.refToObj;
      var newArray = clone(oldRefToObj.ref);
      for (var i = 0, l = directiveKeys.length; i < l; i++) {
        var key = directiveKeys[i];
        var value = _orderDirectives[key];
        var sortFn;
        var isDescending = _orderDirectives[directiveKeys[i]];

        var type = typeof newArray[0].ref[key];
        if (type === 'function') {
          newArray = newArray.sort(value);
          continue;
        }
        else if (type === 'number') {
          if (!isDescending) {
            sortFn = function(a, b) {
              return a.ref[key] - b.ref[key];
            };
          }
          else {
            sortFn = function(a, b) {
              return -(a.ref[key] - b.ref[key]);
            };
          }
        }
        else if (type === 'string') {
          sortFn = function(a, b) {
            // needs a polyfill for < IE11 and other old browsers
            return isDescending ? b.ref[key].localeCompare(a.ref[key]) :
                a.ref[key].localeCompare(b.ref[key]);
          };
        }
        else if (type === 'boolean') {
          sortFn = function(a, b) {
            if (isDescending) {
              if (b.ref[key] < a.ref[key]) {
                return -1;
              }
              if (b.ref[key] > a.ref[key]) {
                return 1;
              }
              else {
                return 0;
              }
            }
            else {
              if (b.ref[key] > a.ref[key]) {
                return -1;
              }
              if (b.ref[key] < a.ref[key]) {
                return 1;
              }
              else {
                return 0;
              }
            }
          };
        }
        newArray = newArray.sort(sortFn);
      }
      for (i = 0, l = newArray.length; i < l; i++) {
        var parents = getImmutableObject(newArray[i].ref).__private.parents;
        for (var j = 0, l2 = parents.length; j < l2; j++) {
          var parent = parents[j];
          if (parent.parent === self) {
            parent.parentKey = i;
            break;
          }
        }
      }
      self.changeValueTo(newArray);
    });
  },

  groupBy: function() {

  }

};

module.exports = ImmutableGraphArray;
