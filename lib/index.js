'use strict';

var GraphQuery = require('./GraphQuery');
var assign = require('./Object.assign');
var _linkNodes = require('./_linkNodes');
var _indexOf = require('./_indexOf');
var _getNodeEdges = require('./_getNodeEdges');
var _getNodesEdges = require('./_getNodesEdges');

function Graph(input) {
  _linkNodes(input, []); // modifies the input variable - yay for side-effects
  this.props = input;
  this.props.cache = {};
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
  var concat = Array.prototype.concat;
  for (var i = 0, l = edges.length; i < l; i++) {
    var _edge = edges[i];
    var edge = edges[i].edge;

    if (_indexOf(changeMap, _edge) === -1) {
      changeMap.push(_edge);

      var childEdges = [];
      var sourceNode = edge.sourceNode;
      var targetNode = edge.targetNode;
      if (sourceNode) {
        childEdges = concat.call(childEdges, _getNodeEdges(sourceNode, edges)[0]);
      }
      if (targetNode) {
        childEdges = concat.call(childEdges, _getNodeEdges(targetNode, edges)[0]);
      }

      _fillChangeMap(changeMap, childEdges);
    }
  }
}

function _orderChangeMap(map) {
  console.log('re-arrange the change map:', map);

}

function _getIdealChangeMap(edges) {
  var map = [];
  _fillChangeMap(map, edges);
  _orderChangeMap(map);
  return map;
}

function _handleChangedNodes(values, allNodes, allEdges) {
  var nodes = values.nodes || [];
  var i, l;
  _linkNodes(values, allNodes);

  var idealChangeMap = _getIdealChangeMap(_getNodesEdges(values.nodes, allEdges));
  // first create ideal change map (to minimize amount of mutation)
  // we now have the order of influenced stuff, so... work your magic!
  console.log('ideal change map:', idealChangeMap);
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
    var propsEdgeLabels = props.edgeLabels;
    var concat = Array.prototype.concat;
    var push = Array.prototype.push;
    var i, l;
    props.nodes = concat.call([], props.nodes);
    for (i = 0, l = nodes.length; i < l; i++) {
      var node = nodes[i];
      push.call(props.nodes, node);
    }

    props.edges = concat.call([], props.edges);
    for (i = 0, l = edges.length; i < l; i++) {
      var edge = edges[i];
      push.call(props.edges, edge);
    }
    for (i = 0, l = edgeLabelsKeys.length; i < l; i++) {
      var edgeLabelKey = edgeLabelsKeys[i];
      var edgeLabel = {};
      edgeLabel[edgeLabelKey] = edgeLabels[edgeLabelKey];
      props.edgeLabels = _addEdgeLabel(propsEdgeLabels, edgeLabel);
    }
    _handleChangedNodes(values, props.nodes, props.edges);
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
