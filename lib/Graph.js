'use strict';

var GraphQuery = require('./GraphQuery');
var assign = Object.assign;

function Graph(input) {
  this.props = input;
}

function recreateImmutableChain(changedNodes) {
  // recursively look for edges and recreate them
}

function _addNode(nodes, node) {
  return nodes.concat([node]);
}

function _addEdge(edges, edge) {
  return edges.concat([edge]);
}

function _addEdgeLabel(edgeLabels, edgeLabel) {
  return assign({}, edgeLabels, edgeLabel);
}

function _removeNode(nodes, node) {
  var index = -1;
  for (var i = 0, l = nodes.length; i < l; i++) {
    var nodeItem = nodes[i];
    if (nodeItem === node) {
      index = i;
      break;
    }
  }
  if (index > -1) {
    return nodes.slice(0, index).concat(nodes.slice(index, nodes.length));
  }
  return nodes;
}

function _removeEdge(edges, edge) {
  var index = -1;
  for (var i = 0, l = edges.length; i < l; i++) {
    var edgeItem = edges[i];
    if (edgeItem === edge) {
      index = i;
      break;
    }
  }
  if (index > -1) {
    return edges.slice(0, index).concat(edges.slice(index, edges.length));
  }
  return edges;
}

function _removeEdgeLabel() {
  // TODO
}

// should increase query performance
function _compileStructure(input) {
  var nodes = input.nodes;
  var edges = input.edges;
  var i, j, l, l2, node;
  for (i = 0, l = nodes.length; i < l; i++) {
    node = nodes[i];
    node.__worldState = {
      in: {},
      out: {}
    };
    for (j = 0, l2 = edges.length; j < l2; j++) {
      var edge = edges[j];
      if (edge.source === node.id) {
        node.__worldState.out[edge.id] = edge;
      }
      else if (edge.target === node.id) {
        node.__worldState.in[edge.id] = edge;
      }
      for (j = 0, l2 = nodes.length; j < l2; j++) {
        // TODO: connect the edges to the actual objects
      }
    }
  }

}

Graph.prototype = {

  addToQuery: function(opt) {
    return new GraphQuery(this, opt);
  },

  add: function Graph$add(values) {
    var nodes = values.nodes;
    var edges = values.edges;
    var edgeLabels = values.edgeLabels;
    var propsNodes = this.props.nodes;
    var propsEdges = this.props.edges;
    var propsEdgeLabels = this.props.edgeLabels;
    var i, l;
    for (i = 0, l = nodes.length; i < l; i++) {
      var node = nodes[i];
      _addNode(propsNodes, node);
    }
    for (i = 0, l = edges.length; i < l; i++) {
      var edge = edges[i];
      _addEdge(propsEdges, edge);
    }
    for (i = 0, l = edgeLabels.length; i < l; i++) {
      var edgeLabel = edgeLabels[i];
      _addEdgeLabel(propsEdgeLabels, edgeLabel);
    }
  },

  addNode: function Graph$addNode(node) {
    _addNode(this.props.nodes, node);
  },

  addEdge: function Graph$addEdge(edge) {
    _addEdge(this.props.edges, edge);
  },

  addEdgeLabel: function Graph$addEdgeLabel(edgeLabel) {
    _addEdgeLabel(this.props.edgeLabels, edgeLabel);
  },

  remove: function Graph$remove(values) {
    var nodes = values.nodes;
    var edges = values.edges;
    var edgeLabels = values.edgeLabels;
    var propsNodes = this.props.nodes;
    var propsEdges = this.props.edges;
    var propsEdgeLabels = this.props.edgeLabels;
    var i, l;
    for (i = 0, l = nodes.length; i < l; i++) {
      var node = nodes[i];
      _removeNode(propsNodes, node);
    }
    for (i = 0, l = edges.length; i < l; i++) {
      var edge = edges[i];
      _removeEdge(propsEdges, edge);
    }
    for (i = 0, l = edgeLabels.length; i < l; i++) {
      var edgeLabel = edgeLabels[i];
      _removeEdgeLabel(propsEdgeLabels, edgeLabel);
    }
  },

  removeNode: function Graph$removeNode(node) {
    _removeNode(this.props.nodes, node);
  },

  removeEdge: function Graph$removeEdge(edge) {
    _removeEdge(this.props.edges, edge);
  },

  removeEdgeLabel: function Graph$addEdgeLabel(edgeLabel) {
    _removeEdgeLabel(this.props.edgeLabels, edgeLabel);
  }

};

Graph.create = function Graph$create(input) {
  return new Graph(input);
};

module.exports = Graph;
