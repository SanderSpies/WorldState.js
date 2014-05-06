'use strict';

var ImmutableGraphArray = require('worldstate/Base/ImmutableGraphArray');


/**
 * Items
 *
 * @constructor
 * @lends Items
 */
var Items = function Items(obj) {
  this.__private.graph = new ImmutableGraphArray(obj);
};

Items.prototype = {
  /**
   * @private
   */
  __private: {
    graph: null,
    wrappers: null
  },


  /**
   * Enable versioning
   */
  enableVersioning: function Items$enableVersioning() {
    this.__private.graph.enableVersioning();
  },

  /**
   * Save a version (versioning must be enabled)
   *
   * @param name {string} name of the version
   */
  saveVersion: function Items$saveVersion(name) {
    this.__private.graph.saveVersion(name);
  },

  /**
   * Restore a previous version
   *
   * @param name {string} name of the version
   */
  restoreVersion: function Items$restoreVersion(name) {
    this.__private.graph.restoreVersion(name);
  },

  /**
   * Get all the versions
   *
   * @return {[{name:string, ref:object}]}
   */
  getVersions: function Items$getVersions() {
    return this.__private.graph.historyRefs;
  },

  changeReferenceTo: function Items$changeReferenceTo(obj) {
    this.__private.graph.changeReferenceTo(obj);
  },

  changeValueTo: function Items$changeValueTo(val) {
    this.__private.graph.changeValueTo(val);
  },

  /**
   * @return {[]}
   */
  read: function Items$read() {
    return this.__private.graph.__private.refToObj.ref;
  },

  /**
   * Get items that have the given conditions
   *
   * @param conditions {Object.<*, *>}
   * @return {[]}
   */
  where: function Items$where(conditions) {
    return this.__private.graph.where(conditions);
  },

  /**
   * Get item at given position
   *
   * @param {number} position
   * @return {object}
   */
  at: function Items$at(position) {
    return this.__private.graph.at(position);
  },

  /**
   * Insert item
   *
   * @param item {{}}
   */
  insert: function Items$insert(item) {
    this.__private.graph.insert(item);
  },

  /**
   * Insert multiple items. Items with the same id property get replaced with the new version.
   *
   * @param items {[{}]}
   */
  insertMulti: function Items$insertMulti(items) {
    this.__private.graph.insertMulti(items);
  }
};

module.exports = Items;