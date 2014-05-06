'use strict';

var ImmutableGraphObject = require('WorldState/Base/ImmutableGraphObject');

var TodoListItems = require('./TodoListItems');
var TodoListCars = require('./TodoListCars');

var TodoList = function TodoList(obj) {
  this.__private.graph = new ImmutableGraphObject(obj);
};

TodoList.prototype = {
  __private: {
    graph: null,
    wrappers: null
  },

details: function TodoList$details(){//object},  items: function TodoList$items() {
    var wrappers = this.__private.wrappers;
    if (!wrappers.items) {
      wrappers.items = new TodoListItems(this.__private.graph.__private.refToObj.ref.items.ref);
    }
    return wrappers.items;
  },

  cars: function TodoList$cars() {
    var wrappers = this.__private.wrappers;
    if (!wrappers.cars) {
      wrappers.cars = new TodoListCars(this.__private.graph.__private.refToObj.ref.cars.ref);
    }
    return wrappers.cars;
  },


  enableVersioning: function TodoList$enableVersioning() {
    this.__private.graph.enableVersioning();
  },

  saveVersion: function TodoList$saveVersion(name) {
    this.__private.graph.saveVersion(name);
  },

  restoreVersion: function TodoList$restoreVersion(name) {
    this.__private.graph.restoreVersion(name);
  },

  getVersions: function TodoList$getVersions() {
    return this.__private.graph.historyRefs;
  },

  changeReferenceTo: function TodoList$changeReferenceTo(obj) {
    this.__private.graph.changeReferenceTo(obj);
  },

  changeValueTo: function TodoList$changeValueTo(val) {
    this.__private.graph.changeValueTo(val);
  },

  read: function TodoList$read() {
    return this.__private.graph.__private.refToObj.ref;
  }
};

module.exports = TodoList;