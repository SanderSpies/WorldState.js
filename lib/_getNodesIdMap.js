'use strict';

function _getNodesIdMap(cache, nodes) {
  var nodeKeys = {};
  for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i];
    nodeKeys[node.id] = node;
  }
  cache.nodesIdMap = nodeKeys;
  return nodeKeys;
}

module.exports = _getNodesIdMap;
