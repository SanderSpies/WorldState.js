'use strict';

var ImmutableGraphObject = require('worldstate/Base/ImmutableGraphObject');

var Items = require('./Items');

/**
 * Card
 *
 * @constructor
 * @lends Card
 */
var Card = function Card(obj) {
  this.__private.graph = new ImmutableGraphObject(obj);
};

Card.prototype = {
  /**
   * @private
   */
  __private: {
    graph: null,
    wrappers: null
  },

  /**
   * @returns {Items}
   */
  items: function Card$items() {
    var wrappers = this.__private.wrappers;
    if (!wrappers.items) {
      wrappers.items = new Items(this.__private.graph.__private.refToObj.ref.items.ref);
    }
    return wrappers.items;
  },


  enableVersioning: function Card$enableVersioning() {
    this.__private.graph.enableVersioning();
  },

  saveVersion: function Card$saveVersion(name) {
    this.__private.graph.saveVersion(name);
  },

  restoreVersion: function Card$restoreVersion(name) {
    this.__private.graph.restoreVersion(name);
  },

  getVersions: function Card$getVersions() {
    return this.__private.graph.historyRefs;
  },

  changeReferenceTo: function Card$changeReferenceTo(obj) {
    this.__private.graph.changeReferenceTo(obj);
  },

  changeValueTo: function Card$changeValueTo(val) {
    this.__private.graph.changeValueTo(val);
  },

  /**
   * @return {}}
   */
  read: function Card$read() {
    return this.__private.graph.__private.refToObj.ref;
  }
};

module.exports = Card;