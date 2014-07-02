'use strict';

var outgoingEdges = {};
var incomingEdges = {};

var EdgeRegistry = {

  addEdge: function(type, origin, destination, details) {
    var edge = {
      type: type,
      origin: origin,
      destination: destination,
      opts: details
    };
    var originId = origin.__private.refToObj.ref.__worldStateUniqueId;
    var destinationId = destination.__private.refToObj.ref.__worldStateUniqueId;

    if (!outgoingEdges[originId]) {
      outgoingEdges[originId] = [];
    }
    if (!incomingEdges[destinationId]) {
      incomingEdges[destinationId] = [];
    }

    // duplication is purely done for performance
    outgoingEdges[originId].push(edge);
    incomingEdges[destinationId].push(edge);
  },

  removeEdge: function(topic, origin, destination) {

  },

  getOutgoingEdges: function(obj) {
    if (!obj.__private.refToObj) {
      return null;
    }

    return outgoingEdges[obj.__private.refToObj.ref.__worldStateUniqueId];
  },

  getIncomingEdges: function(obj) {
    var refToObj = obj.__private.refToObj;
    if (!refToObj) {
      return null;
    }

   return incomingEdges[refToObj.ref.__worldStateUniqueId];
  },

  changeEdgeId: function(oldId, newId) {
    outgoingEdges[newId] = outgoingEdges[oldId];
    incomingEdges[newId] = incomingEdges[oldId];
    delete outgoingEdges[oldId];
    delete incomingEdges[oldId];
  },

  changeEdgeReference: function(oldId) {
    // TODO
    var outgoingEdges = outgoingEdges[oldId];
    var incomingEdges2 = [];
    for (var i = 0, l = outgoingEdges.length; i < l; i++) {
      incomingEdges2[i] = incomingEdges[outgoingEdges[i].destination];
    }
  }

};

module.exports = EdgeRegistry;
