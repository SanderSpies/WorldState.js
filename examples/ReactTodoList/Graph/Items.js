/**
 * Generated by worldstate.js.
 */
'use strict';

var ImmutableGraphObject = require('worldstate/src/Base/ImmutableGraphObject');
var ImmutableGraphRegistry =
    require('worldstate/src/Base/ImmutableGraphRegistry');

/* @type Item */
var Item = require('./Item');


/**
 * A factory for {Items}
 *
 * @lends {Items}
 */
var ItemsFactory = {
  /**
   * @param {[{id:number,text:string,isComplete:boolean,editMode:boolean}]} obj JSON input data
   * @return {ItemsPrototype}
   */
  newInstance: function Items$newInstance(obj, parent, parentKey) {

    /**
     * Items
     *
     * @constructor
     * @param {[{id:number,text:string,isComplete:boolean,editMode:boolean}]} obj JSON input data
     */
    var ItemsClass = function ItemsClass(obj, parent, parentKey) {
      this.__private = {
        graph: null,
        wrappers: {}
      };
      this.__private.graph = ImmutableGraphRegistry.getImmutableObject(obj, parent, parentKey);
    };
    ItemsClass.prototype = ItemsPrototype;

    var instance = new ItemsClass(obj, parent, parentKey);
    return instance;
  }
};


/**
 * @lends {ItemsPrototype}
 */
var ItemsPrototype = {
  /**
   * @private
   * @struct
   */
  __private: {
    graph: null,
    wrappers: {}
  },

  /**
   * Change reference
   *
   * @param {[{id:number,text:string,isComplete:boolean,editMode:boolean}]} obj
   * @this {ItemsPrototype}
   */
  changeReferenceTo: function Items$changeReferenceTo(obj) {
    this.__private.graph.changeReferenceTo(obj);
  },

  /**
   * Change value
   *
   * @param {[{id:number,text:string,isComplete:boolean,editMode:boolean}]} val
   * @this {ItemsPrototype}
   */
  changeValueTo: function Items$changeValueTo(val) {
    this.__private.graph.changeValueTo(val);
  },

  /**
   * Enable versioning
   *
   * @this {ItemsPrototype}
   */
  enableVersioning: function Items$enableVersioning() {
    this.__private.graph.enableVersioning();
  },

  /**
   * Get all the versions
   *
   * @return {[{name:string, ref:object}]}
   * @this {ItemsPrototype}
   */
  getVersions: function Items$getVersions() {
    return this.__private.graph.getVersions();
  },

  /**
   * Get the actual immutable object
   *
   * @return {{id:number,text:string,isComplete:boolean,editMode:boolean}}
   * @this {ItemsPrototype}
   */
  read: function Items$read() {
    return this.__private.graph.__private.refToObj.ref;
  },

  /**
   * Restore a version
   *
   * @param {{name:string, ref:object}} version version to restore
   * @this {ItemsPrototype}
   */
  restoreVersion: function Items$restoreVersion(version) {
    this.__private.graph.restoreVersion(version);
  },

  /**
   * Save a version (versioning must be enabled)
   *
   * @param {string} name name of the version
   * @this {ItemsPrototype}
   */
  saveVersion: function Items$saveVersion(name) {
    this.__private.graph.saveVersion(name);
  },

  /**
   * Executes after the current actions, like insert and
   * changeValueTo, have completed
   *
   * @param {function} fn
   * @param {boolean} once
   * @this {ItemsPrototype}
   */
  afterChange: function Items$afterChange(fn, once) {
    this.__private.graph.afterChange(fn, once);
  },

  /**
   * Remove this part of the graph
   *
   * @this {ItemsPrototype}
   */
  remove: function Items$remove() {
    this.__private.graph.remove();
  },

  /**
   * Get the WorldState.js generated id
   *
   * @return {number}
   */
  generatedId: function() {
    return this.__private.graph.generatedId();
  },

  /**
   * Get item at given position
   *
   * @param {number} position
   * @return {ItemPrototype}
   * @this {ItemsPrototype}
   */
  at: function Items$at(position) {
    var item = this.__private.graph.at(position);
    return Item.newInstance(item.__private.refToObj.ref, this.__private.graph, position);
  },

  /**
   * Insert item
   *
   * @param {ItemPrototype} item
   * @this {ItemsPrototype}
   */
  insert: function Items$insert(item) {
    var realItem = item.__private.graph.__private.refToObj.ref;
    this.__private.graph.insert(realItem);
  },

  /**
   * Insert multiple items. Items with the same id property get replaced
   * with the new version.
   *
   * @param {[ItemPrototype]} items
   * @this {ItemsPrototype}
   */
  insertMulti: function Items$insertMulti(items) {
    var realItems = [];
    for (var i = 0, l = items.length; i < l; i++) {
      realItems[i] = items[i].__private.graph.__private.refToObj.ref;
    }
    this.insertMultiRaw(realItems);
  },

  /**
   * Insert multiple items. Items with the same id property get replaced
   * with the new version.
   *
   * @param {[ItemPrototype]} items
   * @this {ItemsPrototype}
   */
  insertMultiRaw: function Items$insertMultiRaw(items) {
    this.__private.graph.insertMulti(items);
  },

  /**
   * Get items that have the given conditions
   *
   * @param {Object.<*, *>} conditions
   * @param {boolean} cached
   * @return {[ItemPrototype]}
   * @this {ItemsPrototype}
   */
  where: function Items$where(conditions, cached) {
    var realItems = this.__private.graph.where(conditions, cached);
    var items = [];
    for (var i = 0, l = realItems.length; i < l; i++) {
      var realItem = realItems[i];
      items[i] = Item.newInstance(realItem.read());
    }
    return items;
  },

  /**
   * @return {number} length
   */
  length: function Items$length() {
    return this.__private.graph.length;
  }

};

module.exports = ItemsFactory;