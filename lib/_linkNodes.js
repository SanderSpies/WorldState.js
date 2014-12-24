'use strict';

var _getNodesIdMap = require('./_getNodesIdMap');
var _linkNode = require('./_linkNode');
var concat = Array.prototype.concat;

function _getEdgesSourceIdMap(edges) {
  var map = {};
  for (var i = 0, l = edges.length; i < l; i++) {
    var edge = edges[i];
    var source = edge.source;
    if (!map[source]) {
      map[source] = [];
    }
    map[source].push({edge: edge});
  }
  return map;
}

function _linkNodes(input, allNodes) {
  var nodes = input.nodes;
  var edges = input.edges;
  var combinedNodes = [];
  if (nodes) {
    combinedNodes = concat.call(combinedNodes, nodes);
  }
  if (allNodes) {
    combinedNodes = concat.call(combinedNodes, allNodes);
  }
  var nodesIdMap = _getNodesIdMap({}, combinedNodes);
  var edgesSourceIdMap = _getEdgesSourceIdMap(edges);
  for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i];
    _linkNode(node, nodesIdMap, edgesSourceIdMap);
  }
}

module.exports = _linkNodes;
