'use strict';

var _findNodesById = require('./_findNodesById');
var _edgeMatchesOptions = require('./_edgeMatchesOptions');
var _getNodesIdMap = require('./_getNodesIdMap');

function _findOutgoingNodes(allNodes, nodes, edges, edgeLabel, options) {
  // TODO: use an edges map
  var nodeKeys = _getNodesIdMap(nodes);
  var foundNodeIds = {};
  for (var i = 0, l = edges.length; i < l; i++) {
    var edge = edges[i];
    if (nodeKeys[edge.source] && _edgeMatchesOptions(edge, options)) {
      if (!edgeLabel || edgeLabel[edge.label]) {
        foundNodeIds[edge.target] = true;
      }
    }
  }
  return _findNodesById(allNodes, foundNodeIds);
}

module.exports = _findOutgoingNodes;
