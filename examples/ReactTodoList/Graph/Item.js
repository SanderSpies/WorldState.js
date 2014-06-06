/**
 * Generated by worldstate.js
 */
'use strict';

var ImmutableGraphObject = require('worldstate/src/Base/ImmutableGraphObject');
var ImmutableGraphRegistry =
    require('worldstate/src/Base/ImmutableGraphRegistry');




/**
 * A factory for {Item}
 *
 * @lends {Item}
 */
var ItemFactory = {
  /**
   * @param {[{id:number,text:string,isComplete:boolean,editMode:boolean}]} obj JSON input data
   * @param {{}} parent
   * @param {string} parentKey
   * @return {ItemPrototype}
   */
  newInstance: function Item$newInstance(obj, parent, parentKey) {

    /**
     * Item
     *
     * @constructor
     * @param {[{id:number,text:string,isComplete:boolean,editMode:boolean}]} obj JSON input data
     */
    var ItemClass = function ItemClass(obj, parent, parentKey) {
      this.__private = {
        graph: null,
        wrappers: {}
      };
      this.__private.graph = ImmutableGraphRegistry.getImmutableObject(obj, parent, parentKey);
    };
    ItemClass.prototype = ItemPrototype;
    var instance = new ItemClass(obj, parent, parentKey);

    return instance;
  }
};


/**
 * @lends {ItemPrototype}
 */
var ItemPrototype = {
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
   * @this {ItemPrototype}
   */
  changeReferenceTo: function Item$changeReferenceTo(obj) {
    this.__private.graph.changeReferenceTo(obj);
  },

  /**
   * Change value
   *
   * @param {[{id:number,text:string,isComplete:boolean,editMode:boolean}]} val
   * @this {ItemPrototype}
   */
  changeValueTo: function Item$changeValueTo(val) {
    this.__private.graph.changeValueTo(val);
  },

  /**
   * Enable versioning
   *
   * @this {ItemPrototype}
   */
  enableVersioning: function Item$enableVersioning() {
    this.__private.graph.enableVersioning();
  },

  /**
   * Get all the versions
   *
   * @return {[{name:string, ref:object}]}
   * @this {ItemPrototype}
   */
  getVersions: function Item$getVersions() {
    return this.__private.graph.getVersions();
  },

  /**
   * Get the actual immutable object
   *
   * @return {{id:number,text:string,isComplete:boolean,editMode:boolean}}
   * @this {ItemPrototype}
   */
  read: function Item$read() {
    return this.__private.graph.__private.refToObj.ref;
  },

  /**
   * Restore a version
   *
   * @param {{name:string, ref:object}} version version to restore
   * @this {ItemPrototype}
   */
  restoreVersion: function Item$restoreVersion(version) {
    this.__private.graph.restoreVersion(version);
  },

  /**
   * Save a version (versioning must be enabled)
   *
   * @param {string} name name of the version
   * @this {ItemPrototype}
   */
  saveVersion: function Item$saveVersion(name) {
    this.__private.graph.saveVersion(name);
  },

  /**
   * Executes after the current actions, like insert and
   * changeValueTo, have completed
   *
   * @param {function} fn
   * @param {boolean} once
   * @this {ItemPrototype}
   */
  afterChange: function Item$afterChange(fn, once) {
    this.__private.graph.afterChange(fn, once);
  },

  /**
   * Remove this part of the graph
   *
   * @this {ItemPrototype}
   */
  remove: function Item$remove() {
    this.__private.graph.remove();
  },

  /**
   * Get the WorldState.js generated id
   *
   * @return {number}
   */
  generatedId: function() {
    return this.__private.graph.generatedId();
  }

};

module.exports = ItemFactory;
