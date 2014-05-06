'use strict';

var ImmutableGraphArray = require('worldstate/Base/ImmutableGraphArray');


/**
 * Brands
 *
 * @constructor
 * @lends Brands
 */
var Brands = function Brands(obj) {
  this.__private.graph = new ImmutableGraphArray(obj);
};

Brands.prototype = {
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
  enableVersioning: function Brands$enableVersioning() {
    this.__private.graph.enableVersioning();
  },

  /**
   * Save a version (versioning must be enabled)
   *
   * @param name {string} name of the version
   */
  saveVersion: function Brands$saveVersion(name) {
    this.__private.graph.saveVersion(name);
  },

  /**
   * Restore a previous version
   *
   * @param name {string} name of the version
   */
  restoreVersion: function Brands$restoreVersion(name) {
    this.__private.graph.restoreVersion(name);
  },

  /**
   * Get all the versions
   *
   * @return {[{name:string, ref:object}]}
   */
  getVersions: function Brands$getVersions() {
    return this.__private.graph.historyRefs;
  },

  changeReferenceTo: function Brands$changeReferenceTo(obj) {
    this.__private.graph.changeReferenceTo(obj);
  },

  changeValueTo: function Brands$changeValueTo(val) {
    this.__private.graph.changeValueTo(val);
  },

  /**
   * @return {[]}
   */
  read: function Brands$read() {
    return this.__private.graph.__private.refToObj.ref;
  },

  /**
   * Get items that have the given conditions
   *
   * @param conditions {Object.<*, *>}
   * @return {[]}
   */
  where: function Brands$where(conditions) {
    return this.__private.graph.where(conditions);
  },

  /**
   * Get item at given position
   *
   * @param {number} position
   * @return {object}
   */
  at: function Brands$at(position) {
    return this.__private.graph.at(position);
  },

  /**
   * Insert item
   *
   * @param item {{}}
   */
  insert: function Brands$insert(item) {
    this.__private.graph.insert(item);
  },

  /**
   * Insert multiple items. Items with the same id property get replaced with the new version.
   *
   * @param items {[{}]}
   */
  insertMulti: function Brands$insertMulti(items) {
    this.__private.graph.insertMulti(items);
  }
};

module.exports = Brands;