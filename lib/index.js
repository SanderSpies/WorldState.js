'use strict';

var GraphQuery = require('./GraphQuery');
var assign = require('./Object.assign');

function Graph(input) {
  _linkNodes(input); // modifies the input variable
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

function _linkNodes(input) {
  var nodes = input.nodes;
  var edges = input.edges;
  for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i];
    var nodeId = node.id;
    node.__worldState = {
      in: {},
      out: {}
    };
    var node__worldState = node.__worldState;
    var node__worldStateOut = node__worldState.out;
    var node__worldStateIn = node__worldState.in;
    for (var j = 0, l2 = edges.length; j < l2; j++) {
      var edge = edges[j];
      var edgeLabel = edge.label;
      var isSource = false;
      var searchForNode = -1;
      if (edge.source === nodeId) {
        isSource = true;
        searchForNode = edge.target;
        node__worldStateOut[edgeLabel] = {
          edge: edge
        };
      }
      else if (edge.target === nodeId) {
        searchForNode = edge.source;
        node__worldStateIn[edgeLabel] = {
          edge: edge
        };
      }

      for (var k = 0, l3 = nodes.length; k < l3; k++) {
        var node2 = nodes[k];
        if (searchForNode === node2.id) {
          if (isSource) {
            edge.sourceNode = node;
            edge.targetNode = node2;
          }
          else {
            edge.sourceNode = node2;
            edge.targetNode = node;
          }
        }
      }
    }
  }
}

Graph.prototype = assign({}, GraphQuery.prototype, {

  addToQuery: function(opt) {
    return new GraphQuery(this, opt);
  },

  add: function Graph$add(values) {
    var props = this.props;
    var nodes = values.nodes;
    var edges = values.edges;
    var edgeLabels = values.edgeLabels;
    var propsNodes = props.nodes;
    var propsEdges = props.edges;
    var propsEdgeLabels = props.edgeLabels;
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
    var props = this.props;
    var nodes = values.nodes;
    var edges = values.edges;
    var edgeLabels = values.edgeLabels;
    var propsNodes = props.nodes;
    var propsEdges = props.edges;
    var propsEdgeLabels = props.edgeLabels;
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
  },

  saveVersion: function Graph$saveVersion(name) {
    // TODO: after immutable everything
  },

  restoreVersion: function Graph$restoreVersion(name) {
    // TODO: after immutable everything
  }

});

Graph.create = function Graph$create(input) {
  return new Graph(input);
};

module.exports = Graph;
