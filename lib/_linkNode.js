'use strict';

function _linkNode(node, nodesIdMap, edges) {
  var nodeId = node.id;
  if (!node.__worldState) {
    node.__worldState = {
      in: {},
      out: {}
    };
  }
  var node__worldState = node.__worldState;
  var node__worldStateOut = node__worldState.out;
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

    if (searchForNode === -1) {
      continue;
    }

    edge.sourceNode = node;
    var targetNode = nodesIdMap[searchForNode];
    edge.targetNode = targetNode;

    // add info to target node
    if (!targetNode.__worldState) {
      targetNode.__worldState = {
        in: {},
        out: {}
      };
    }
    var targetNode__worldStateIn = targetNode.__worldState.in;
    if (!targetNode__worldStateIn[edgeLabel]) {
      targetNode__worldStateIn[edgeLabel] = [];
    }

    targetNode__worldStateIn[edgeLabel].push({
      edge: edge
    });

  }
}

module.exports = _linkNode;
