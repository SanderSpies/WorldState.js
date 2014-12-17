'use strict';

var GraphQuery = require('./GraphQuery');

function Graph(input) {
  this.props = input;
}

function findEdgesTo(edges, nodeId) {
  var result = [];
  for (var i = 0, l = edges.length; i < l; i++) {
    var edge = edges[i];
    if (edge.target === nodeId) {
      result[result.length] = edge;
    }
  }
  return result;
}

function findEdgesFrom(edges, nodeId) {
  var result = [];
  for (var i = 0, l = edges.length; i < l; i++) {
    var edge = edges[i];
    if (edge.source === nodeId) {
      result[result.length] = edge;
    }
  }
  return result;
}

function recreateImmutableChain(changedNodes) {
  // recursively look for edges and recreate them
}

function _addNode(nodes, node) {

}

function _addEdge(edges, edge) {

}

Graph.prototype = {

  addToQuery: function(opt) {
    return new GraphQuery(this, opt);
  },

  add: function Graph$add(values) {
    // TODO: recreate necessary graph parts
    // TODO: invalidate query caches
  },

  addNode: function Graph$addNode(node) {

  },

  addEdge: function Graph$addEdge(edge) {

  }

};

// mixin GraphQuery here

Graph.create = function Graph$create(input) {
  return new Graph(input);
};

module.exports = Graph;
