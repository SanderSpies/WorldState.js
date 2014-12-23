'use strict';

var _getNodesIdMap = require('./_getNodesIdMap');
var _linkNode = require('./_linkNode');

function _linkNodes(input, allNodes) {
  var nodes = input.nodes;
  var edges = input.edges;
  var combinedNodes = [];
  if (nodes) {
    combinedNodes = combinedNodes.concat(nodes);
  }
  if (allNodes) {
    combinedNodes = combinedNodes.concat(allNodes);
  }
  var nodesIdMap = _getNodesIdMap({}, combinedNodes);

  for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i];
    _linkNode(node, nodesIdMap, edges);
  }
}

module.exports = _linkNodes;
