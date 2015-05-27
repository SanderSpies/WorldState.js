'use strict';

var _indexOf = require('../_indexOf');

function Dijkstra(source, adjacencyMatrix) {
  var queue = [source];
  var usedNodes = {};
  var matrix = adjacencyMatrix.matrix;
  var mappings = adjacencyMatrix.mappings;
  while(queue.length) {
    var node = queue.shift();
    var edges = matrix[mappings[node.id]];
    for (var j = 0, l2 = edges.length; j < l2; j++) {
      var edge = edges[j];
      var alternative = (node.value || 0) + edge.weight;
      var targetNode = edge.targetNode;
      var targetNodeValue = targetNode.value;
      if (!targetNodeValue || alternative < targetNodeValue) {
        targetNode.value = alternative;
        targetNode.previousNode = node;
      }
      if (!usedNodes[targetNode.id]) {
        queue.push(targetNode);
        usedNodes[targetNode.id] = true;
      }
    }
  }
}

module.exports = Dijkstra;
