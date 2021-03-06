'use strict';

var _edgeMatchesOptions = require('./_edgeMatchesOptions');
var keys = Object.keys;
var push = Array.prototype.push;

function _findOutgoingNodes(nodes, adjacencyMatrices, edgeLabel, options) {
  var i, l;
  var _nodes = [];
  var edgeLabelsKeys = keys(edgeLabel);
  for (i = 0, l = edgeLabelsKeys.length; i < l; i++) {
    var edgeLabelKey = edgeLabelsKeys[i];
    var adjacencyMatrix = adjacencyMatrices[edgeLabelKey];
    var matrix = adjacencyMatrix.matrix;
    var mappings = adjacencyMatrix.mappings;
    for (var j = 0, l2 = nodes.length; j < l2; j++) {
      var node = nodes[j];
      var out = matrix[mappings[node.id]];
      for (var k = 0, l3 = out.length; k < l3; k++) {
        var edge = out[k];
        if (edge.target && _edgeMatchesOptions(edge, options)) {
          _nodes.push(edge.targetNode);
        }
      }
    }
  }
  return _nodes;
}

module.exports = _findOutgoingNodes;
