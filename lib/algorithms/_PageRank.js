'use strict';

var dampingFactor = .85;

function PageRank(nodes, edgeLabel) {
  var i, l, node;
  var nrOfDocuments = nodes.length;
  for (i = 0, l = nrOfDocuments; i < l; i++) {
    node = nodes[i];
    node.pageRank = 1 - dampingFactor;
  }
  for (i = 0, l = nrOfDocuments; i < l; i++) {
    node = nodes[i];
    var j, l2;
    var edges = node.__worldState.out[edgeLabel];
    if (!edges) {
      for (j = 0, l2 = nrOfDocuments; j < l2; j++) {
        var node2 = nodes[j];
        if (node2 !== node) {
          node2.pageRank += dampingFactor * node.pageRank / (nodes.length - 1);
        }
      }
    }
    else {
      for (j = 0, l2 = edges.length; j < l2; j++) {
        var targetNode = edges[j].edge.targetNode;
        targetNode.pageRank += dampingFactor * node.pageRank / edges.length;
      }
    }
  }
}

module.exports = PageRank;
