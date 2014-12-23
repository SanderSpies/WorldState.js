'use strict';

var _indexOf = require('./_indexOf');
var _getNodeEdges = require('./_getNodeEdges');

function _getNodesEdges(nodes, edges){
  var allEdges = [];
  for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i];
    var nodeEdges = _getNodeEdges(node, edges);
    for (var j = 0, l2 = nodeEdges.length; j < l2; j++) {
      var nodeEdge = nodeEdges[j];
      if (_indexOf(allEdges, nodeEdge) === -1) {
        allEdges = allEdges.concat(nodeEdge);
      }
    }
  }
  return allEdges;
}

module.exports = _getNodesEdges;
