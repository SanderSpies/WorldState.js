'use strict';

function _linkNodes(input) {
  var nodes = input.nodes;
  var edges = input.edges;
  for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i];
    var nodeId = node.id;
    node.__worldState = {
      in: {},
      out: {}
    };
    var node__worldState = node.__worldState;
    var node__worldStateOut = node__worldState.out;
    var node__worldStateIn = node__worldState.in;
    for (var j = 0, l2 = edges.length; j < l2; j++) {
      var edge = edges[j];
      var edgeLabel = edge.label;
      var isSource = false;
      var searchForNode = -1;
      if (edge.source === nodeId) {
        isSource = true;
        searchForNode = edge.target;
        if (!node__worldStateOut[edgeLabel]) {
          node__worldStateOut[edgeLabel] = [];
        }
        node__worldStateOut[edgeLabel].push({
          edge: edge
        });
      }
      else if (edge.target === nodeId) {
        searchForNode = edge.source;
        if (!node__worldStateIn[edgeLabel]) {
          node__worldStateIn[edgeLabel] = [];
        }
        node__worldStateIn[edgeLabel].push({
          edge: edge
        });
      }

      for (var k = 0, l3 = nodes.length; k < l3; k++) {
        var node2 = nodes[k];
        if (searchForNode === node2.id) {
          if (isSource) {
            edge.sourceNode = node;
            edge.targetNode = node2;
          }
          else {
            edge.sourceNode = node2;
            edge.targetNode = node;
          }
        }
      }
    }
  }
}

module.exports = _linkNodes;