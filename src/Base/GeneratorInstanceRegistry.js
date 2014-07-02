'use strict';

// recipe for disaster (AKA memory leaks)
var instances = {};

var GeneratorInstanceRegistry = {

  registerInstance: function(obj, instance) {
    instances[obj.__worldStateUniqueId] = instance;
  },

  removeInstance: function(obj) {
    instances[obj.__worldStateUniqueId] = null;
  },

  getInstance: function(obj) {
    return instances[obj.__worldStateUniqueId] || null;
  }

};

module.exports = GeneratorInstanceRegistry;
