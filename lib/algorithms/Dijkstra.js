'use strict';

var _indexOf = require('../_indexOf');

function Dijkstra(nodes, edgeLabel, startNode) {
  var i, l;
  for (i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i];
    node.previousNode = null;
    node.value = Infinity;
  }
  startNode.value = 0;
  var u;

  for (i = 0, l = nodes.length; i < l; i++) {
    var _node = nodes[i];
    var edges = _node.__worldState.out[edgeLabel];
    if (!edges) {
      continue;
    }
    for (var j = 0, l2 = edges.length; j < l2; j++) {
      var edge = edges[j].edge;
      var alternative = _node.value + edge.weight;
      var targetNode = edge.targetNode;
      if (alternative < targetNode.value) {
        targetNode.value = alternative;
        targetNode.previousNode = _node;
      }
    }
  }
}

module.exports = Dijkstra;
