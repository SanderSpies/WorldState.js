'use strict';

var _indexOf = require('./_indexOf');
var _getNodeEdges = require('./_getNodeEdges');
var concat = Array.prototype.concat;

function _getNodesEdges(nodes){
  var allEdges = [];
  for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i];
    var nodeEdges = _getNodeEdges(node);
    for (var j = 0, l2 = nodeEdges.length; j < l2; j++) {
      var nodeEdge = nodeEdges[j];
      if (_indexOf(allEdges, nodeEdge) === -1) {
        allEdges = concat.call(allEdges, nodeEdge);
      }

    }
  }
  return allEdges;
}

module.exports = _getNodesEdges;
