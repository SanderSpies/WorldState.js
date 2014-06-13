'use strict';

var clone = require('./clone');

var ObjectPool = function ObjectPool(opt) {
  this.__private = {
    increaseSize: opt.increaseSize || 1,
    availableObjects: [],
    usedObjects: [],
    template: opt.template
  }
};

ObjectPool.prototype = {

  __private: {
    increaseSize: -1,
    availableObjects: [],
    usedObjects: [],
    template: null
  },

  /**
   * Set the size of the object pool
   *
   * @param size
   */
  setPoolIncreaseSize: function(size) {
    this.__private.increaseSize = size;
  },

  getObject: function() {
    var __private = this.__private;
    var availableObjects = __private.availableObjects;
    var nrOfAvailableObjects = availableObjects.length;
    var existing = true;
    if (!nrOfAvailableObjects) {
      for (var i = 0, l = __private.increaseSize; i < l; i++) {
        availableObjects[i] = clone(__private.template);
        existing = false;
      }
    }
    return availableObjects.pop();
  },

  releaseObject: function(object) {
    var keys = Object.keys(object);

    // ensure we don't keep any references to other objects
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      var value = object[key];
      if (typeof value === 'object') {
        object[key] = null;
      }
    }

    this.__private.availableObjects.push(object);
  },

  removeAllAvailableObjects: function() {
    this.__private.availableObjects = [];
  }
}

module.exports = ObjectPool;
