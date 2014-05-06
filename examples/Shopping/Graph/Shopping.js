'use strict';

var ImmutableGraphObject = require('worldstate/Base/ImmutableGraphObject');

var UserInfo = require('./UserInfo');
var Orders = require('./Orders');
var Card = require('./Card');
var Shelves = require('./Shelves');
var Brands = require('./Brands');
var Features = require('./Features');
var Products = require('./Products');
var Canvas = require('./Canvas');

/**
 * Shopping
 *
 * @constructor
 * @lends Shopping
 */
var Shopping = function Shopping(obj) {
  this.__private.graph = new ImmutableGraphObject(obj);
};

Shopping.prototype = {
  /**
   * @private
   */
  __private: {
    graph: null,
    wrappers: null
  },

  /**
   * @returns {UserInfo}
   */
  userInfo: function Shopping$userInfo() {
    var wrappers = this.__private.wrappers;
    if (!wrappers.userInfo) {
      wrappers.userInfo = new UserInfo(this.__private.graph.__private.refToObj.ref.userInfo.ref);
    }
    return wrappers.userInfo;
  },

  /**
   * @returns {Orders}
   */
  orders: function Shopping$orders() {
    var wrappers = this.__private.wrappers;
    if (!wrappers.orders) {
      wrappers.orders = new Orders(this.__private.graph.__private.refToObj.ref.orders.ref);
    }
    return wrappers.orders;
  },

  /**
   * @returns {Card}
   */
  card: function Shopping$card() {
    var wrappers = this.__private.wrappers;
    if (!wrappers.card) {
      wrappers.card = new Card(this.__private.graph.__private.refToObj.ref.card.ref);
    }
    return wrappers.card;
  },

  /**
   * @returns {Shelves}
   */
  shelves: function Shopping$shelves() {
    var wrappers = this.__private.wrappers;
    if (!wrappers.shelves) {
      wrappers.shelves = new Shelves(this.__private.graph.__private.refToObj.ref.shelves.ref);
    }
    return wrappers.shelves;
  },

  /**
   * @returns {Brands}
   */
  brands: function Shopping$brands() {
    var wrappers = this.__private.wrappers;
    if (!wrappers.brands) {
      wrappers.brands = new Brands(this.__private.graph.__private.refToObj.ref.brands.ref);
    }
    return wrappers.brands;
  },

  /**
   * @returns {Features}
   */
  features: function Shopping$features() {
    var wrappers = this.__private.wrappers;
    if (!wrappers.features) {
      wrappers.features = new Features(this.__private.graph.__private.refToObj.ref.features.ref);
    }
    return wrappers.features;
  },

  /**
   * @returns {Products}
   */
  products: function Shopping$products() {
    var wrappers = this.__private.wrappers;
    if (!wrappers.products) {
      wrappers.products = new Products(this.__private.graph.__private.refToObj.ref.products.ref);
    }
    return wrappers.products;
  },

  /**
   * @returns {Canvas}
   */
  canvas: function Shopping$canvas() {
    var wrappers = this.__private.wrappers;
    if (!wrappers.canvas) {
      wrappers.canvas = new Canvas(this.__private.graph.__private.refToObj.ref.canvas.ref);
    }
    return wrappers.canvas;
  },


  enableVersioning: function Shopping$enableVersioning() {
    this.__private.graph.enableVersioning();
  },

  saveVersion: function Shopping$saveVersion(name) {
    this.__private.graph.saveVersion(name);
  },

  restoreVersion: function Shopping$restoreVersion(name) {
    this.__private.graph.restoreVersion(name);
  },

  getVersions: function Shopping$getVersions() {
    return this.__private.graph.historyRefs;
  },

  changeReferenceTo: function Shopping$changeReferenceTo(obj) {
    this.__private.graph.changeReferenceTo(obj);
  },

  changeValueTo: function Shopping$changeValueTo(val) {
    this.__private.graph.changeValueTo(val);
  },

  /**
   * @return {{favorites:string}}
   */
  read: function Shopping$read() {
    return this.__private.graph.__private.refToObj.ref;
  }
};

module.exports = Shopping;