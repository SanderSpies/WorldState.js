'use strict';

var ImmutableGraphArray = require('worldstate/Base/ImmutableGraphArray');


/**
 * Canvas
 *
 * @constructor
 * @lends Canvas
 */
var Canvas = function Canvas(obj) {
  this.__private.graph = new ImmutableGraphArray(obj);
};

Canvas.prototype = {
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
  enableVersioning: function Canvas$enableVersioning() {
    this.__private.graph.enableVersioning();
  },

  /**
   * Save a version (versioning must be enabled)
   *
   * @param name {string} name of the version
   */
  saveVersion: function Canvas$saveVersion(name) {
    this.__private.graph.saveVersion(name);
  },

  /**
   * Restore a previous version
   *
   * @param name {string} name of the version
   */
  restoreVersion: function Canvas$restoreVersion(name) {
    this.__private.graph.restoreVersion(name);
  },

  /**
   * Get all the versions
   *
   * @return {[{name:string, ref:object}]}
   */
  getVersions: function Canvas$getVersions() {
    return this.__private.graph.historyRefs;
  },

  changeReferenceTo: function Canvas$changeReferenceTo(obj) {
    this.__private.graph.changeReferenceTo(obj);
  },

  changeValueTo: function Canvas$changeValueTo(val) {
    this.__private.graph.changeValueTo(val);
  },

  /**
   * @return {[]}
   */
  read: function Canvas$read() {
    return this.__private.graph.__private.refToObj.ref;
  },

  /**
   * Get items that have the given conditions
   *
   * @param conditions {Object.<*, *>}
   * @return {[]}
   */
  where: function Canvas$where(conditions) {
    return this.__private.graph.where(conditions);
  },

  /**
   * Get item at given position
   *
   * @param {number} position
   * @return {object}
   */
  at: function Canvas$at(position) {
    return this.__private.graph.at(position);
  },

  /**
   * Insert item
   *
   * @param item {{}}
   */
  insert: function Canvas$insert(item) {
    this.__private.graph.insert(item);
  },

  /**
   * Insert multiple items. Items with the same id property get replaced with the new version.
   *
   * @param items {[{}]}
   */
  insertMulti: function Canvas$insertMulti(items) {
    this.__private.graph.insertMulti(items);
  }
};

module.exports = Canvas;