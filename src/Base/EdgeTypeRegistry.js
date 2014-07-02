'use strict';

var edgeTypes = {};

var EdgeTypeRegistry = {

  registerEdgeType: function(topic) {
    var topicName = Object.keys(topic)[0];
    if (edgeTypes[topicName]) {
      return edgeTypes[topicName];
    }

    return edgeTypes[topicName] = {};
  }

};

module.exports = EdgeTypeRegistry;
