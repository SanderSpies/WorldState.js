'use strict';

var GraphQuery = require('./GraphQuery');
var assign = require('./Object.assign');
var _linkNodes = require('./_linkNodes');
var _indexOf = require('./_indexOf');
var _getNodeEdges = require('./_getNodeEdges');
var _getNodesEdges = require('./_getNodesEdges');

function Graph(input) {
  _linkNodes(input); // modifies the input variable - yay for side-effects
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



function _fillChangeMap(changeMap, edges) {
  // get all the actual changed edges
  for (var i = 0, l = edges.length; i < l; i++) {
    var edge = edges[i];
    if (_indexOf(changeMap, edge) === -1) {
      changeMap.push(edge);
      _getIdealChangeMap(changeMap, [].concat(_getNodeEdges[edge.sourceNode]).concat(edge.targetNode));
    }
  }
}

function _orderChangeMap(map) {

}

function _getIdealChangeMap(edges) {
  var map = [];
  _fillChangeMap(map, edges);
  _orderChangeMap(map);
  return map;
}

function _handleChangedNodes(values, edges) {
  // first create ideal change map (to minimize amount of mutation)

  var idealChangeMap = _getIdealChangeMap(_getNodesEdges(values, edges));
  for (var i = 0, l = values.length; i < l; i++) {

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
    var edgeLabelsKeys = Object.keys(values.edgeLabels);
    var propsNodes = props.nodes;
    var propsEdges = props.edges;
    var propsEdgeLabels = props.edgeLabels;

    var i, l;
    for (i = 0, l = nodes.length; i < l; i++) {
      var node = nodes[i];
      props.nodes = _addNode(propsNodes, node);
      }
    for (i = 0, l = edges.length; i < l; i++) {
      var edge = edges[i];
      props.edges = _addEdge(propsEdges, edge);
    }
    for (i = 0, l = edgeLabelsKeys.length; i < l; i++) {
      var edgeLabelKey = edgeLabelsKeys[i];
      var edgeLabel = {};
      edgeLabel[edgeLabelKey] = edgeLabels[edgeLabelKey];
      props.edgeLabels = _addEdgeLabel(propsEdgeLabels, edgeLabel);
    }

    _handleChangedNodes(values.nodes, propsEdges);
  },

  addNode: function Graph$addNode(node) {
    _addNode(this.props.nodes, node);
    _handleChangedNodes([node]);
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
    _handleChangedNodes(nodes);
  },

  removeNode: function Graph$removeNode(node) {
    _removeNode(this.props.nodes, node);
    _handleChangedNodes([node]);
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
