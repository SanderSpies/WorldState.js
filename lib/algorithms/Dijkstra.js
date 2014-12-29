'use strict';

// might work, might not work... not tested

var _indexOf = require('../_indexOf');

function Dijkstra(nodes, edgeLabel, startNode) {
  for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i];
    node.previousNode = null;
    node.value = Infinity;
  }
  startNode.value = 0;
  var usedEdges = [];

  function calculateShortestPath(previousNode, edge, node) {
    if (_indexOf(usedEdges, edge)) {
      return;
    }
    if (previousNode && (previousNode.value + edge.weight) < node.value) {
      node.value = previousNode.value + edge.weight;
      node.previousNode = previousNode;
      usedEdges.push(edge);
    }

    var edges = node.__worldState.out[edgeLabel];
    for (var i = 0, l = edges.length; i < l; i++) {
      var edge2 = edges[i].edge;
      calculateShortestPath(node, edge2, edge2.targetNode);
    }
  }

  calculateShortestPath(null, null, startNode);
}

module.exports = Dijkstra;
