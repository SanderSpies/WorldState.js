'use strict';

var ImmutableGraphObject = require('worldstate/Base/ImmutableGraphObject');


/**
 * UserInfo
 *
 * @constructor
 * @lends UserInfo
 */
var UserInfo = function UserInfo(obj) {
  this.__private.graph = new ImmutableGraphObject(obj);
};

UserInfo.prototype = {
  /**
   * @private
   */
  __private: {
    graph: null,
    wrappers: null
  },


  enableVersioning: function UserInfo$enableVersioning() {
    this.__private.graph.enableVersioning();
  },

  saveVersion: function UserInfo$saveVersion(name) {
    this.__private.graph.saveVersion(name);
  },

  restoreVersion: function UserInfo$restoreVersion(name) {
    this.__private.graph.restoreVersion(name);
  },

  getVersions: function UserInfo$getVersions() {
    return this.__private.graph.historyRefs;
  },

  changeReferenceTo: function UserInfo$changeReferenceTo(obj) {
    this.__private.graph.changeReferenceTo(obj);
  },

  changeValueTo: function UserInfo$changeValueTo(val) {
    this.__private.graph.changeValueTo(val);
  },

  /**
   * @return {{name:string,address:string}}
   */
  read: function UserInfo$read() {
    return this.__private.graph.__private.refToObj.ref;
  }
};

module.exports = UserInfo;