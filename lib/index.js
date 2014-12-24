'use strict';

var GraphQuery = require('./GraphQuery');
var assign = require('./Object.assign');
var _linkNodes = require('./_linkNodes');
var _indexOf = require('./_indexOf');
var _getNodeEdges = require('./_getNodeEdges');
var _getNodesEdges = require('./_getNodesEdges');
var keys = Object.keys;

function Graph(input) {
  _linkNodes(input, []); // modifies the input variable - yay for side-effects
  this.props = input;
  this.props.cache = {};
  this.props.versions = [];
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
    var edge = _edge.edge;
    if (_indexOf(changeMap, edge) === -1) {
      changeMap.push(edge);
      var childEdges = [];
      var sourceNode = edge.sourceNode;
      var targetNode = edge.targetNode;
      if (sourceNode) {
        childEdges = concat.call(childEdges, _getNodeEdges(sourceNode));
      }
      if (targetNode) {
        childEdges = concat.call(childEdges, _getNodeEdges(targetNode));
      }

      _fillChangeMap(changeMap, childEdges);
    }
  }
}

function _getIdealChangeMap(edges) {
  var map = [];
  _fillChangeMap(map, edges);
  return map;
}

function _recreateEdge(edges, edge) {
  var newEdge = {
    source: edge.source,
    target: edge.target,
    label: edge.label,
    sourceNode: edge.sourceNode,
    targetNode: edge.targetNode,
    weight: edge.weight
  };


  var out = edge.sourceNode.__worldState.out[edge.label];
  var _in = edge.targetNode.__worldState.in[edge.label];

  var outPosition = -1;
  var i, l;
  for (i = 0, l = out.length; i < l; i++) {
    var outItem = out[i];
    if (outItem.edge === edge) {
      outPosition = i;
      break;
    }
  }

  out[outPosition].edge = newEdge;

  var inPosition = -1;
  for (i = 0, l = _in.length; i < l; i++) {
    var inItem = _in[i];
    if (inItem.edge === edge) {
      inPosition = i;
      break;
    }
  }

  _in[inPosition].edge = newEdge;

  edges[_indexOf(edges, edge)] = newEdge;
}

function _handleChangedNodes(values, allNodes, edges) {
  _linkNodes(values, allNodes);
  var recreateEdges = _getIdealChangeMap(_getNodesEdges(values.nodes));
  var recreateNodes = [];
  var i, l, edge;
  for (i = 0, l = recreateEdges.length; i < l; i++) {
    edge = recreateEdges[i];
    var sourceNode = edge.sourceNode;
    var targetNode = edge.targetNode;
    if (_indexOf(recreateNodes, sourceNode) === -1) {
      recreateNodes.push(sourceNode);
    }
    if (_indexOf(recreateNodes, targetNode) === -1) {
      recreateNodes.push(targetNode);
    }
  }

  for (i = 0, l = recreateEdges.length; i < l; i++) {
    edge = recreateEdges[i];
    _recreateEdge(edges, edge);
  }
}

Graph.prototype = assign({}, GraphQuery.prototype, {

  addToQuery: function Graph$addToQuery(opt) {
    return new GraphQuery(this, opt);
  },

  add: function Graph$add(values) {
    var props = this.props;
    var nodes = values.nodes;
    var edges = values.edges;
    var edgeLabels = values.edgeLabels;
    var edgeLabelsKeys = keys(values.edgeLabels);
    var propsEdgeLabels = props.edgeLabels;
    var concat = Array.prototype.concat;

    props.nodes = concat.call(props.nodes, nodes);
    props.edges = concat.call(props.edges, edges);

    for (var i = 0, l = edgeLabelsKeys.length; i < l; i++) {
      var edgeLabelKey = edgeLabelsKeys[i];
      var edgeLabel = {};
      edgeLabel[edgeLabelKey] = edgeLabels[edgeLabelKey];
      props.edgeLabels = _addEdgeLabel(propsEdgeLabels, edgeLabel);
    }
    console.log('TODO: recreate edge labels...');

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

  removeEdgeLabel: function Graph$removeEdgeLabel(edgeLabel) {
    _removeEdgeLabel(this.props.edgeLabels, edgeLabel);
  },

  saveVersion: function Graph$saveVersion(name) {
    var props = this.props;
    var version = {
      name: name,
      nodes: props.nodes,
      edges: props.edges,
      edgeLabels: props.edgeLabels
    };
    this.props.versions.push(version);
  },

  restoreVersion: function Graph$restoreVersion(name) {
    var versions = this.props.versions;
    for (var i = 0, l = versions.length; i < l; i++) {
      var version = versions[i];
      if (version.name === name) {
        console.log('TODO: restore old version');
        break;
      }
    }
  },

  getVersions: function Graph$getVersions() {
    return this.props.versions;
  }

});

Graph.create = function Graph$create(input) {
  return new Graph(input);
};

module.exports = Graph;
