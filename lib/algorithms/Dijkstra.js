'use strict';

var _indexOf = require('../_indexOf');

function Dijkstra(source, edgeLabel) {
  var queue = [source];
  var usedNodes = {};
  while(queue.length) {
    var node = queue.shift();
    var edges = node.__worldState.out[edgeLabel];
    if (!edges) {
      continue;
    }
    for (var j = 0, l2 = edges.length; j < l2; j++) {
      var edge = edges[j].edge;
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
