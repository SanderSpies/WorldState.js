'use strict';

var push = Array.prototype.push;

function _linkNode(node, nodesIdMap, edgesIdMap) {
  var nodeId = node.id;
  var edges = edgesIdMap[nodeId];
  if (!edges) {
    return;
  }
  if (!node.__worldState) {
    node.__worldState = {
      in: {},
      out: {}
    };
  }
  var node__worldState = node.__worldState;
  var node__worldStateOut = node__worldState.out;
  var node__worldStateIn = node__worldState.in;

  for (var j = 0, l2 = edges.length; j < l2; j++) {
    var edge = edges[j].edge;
    var edgeLabel = edge.label;
    var isSource = false;
    var searchForNode = -1;
    var targetNode;
    var sourceNode;
    if (edge.source === nodeId) {
      isSource = true;
      searchForNode = edge.target;
      if (!node__worldStateOut[edgeLabel]) {
        node__worldStateOut[edgeLabel] = [];
      }
      push.call(node__worldStateOut[edgeLabel], {
        edge: edge
      });
      edge.sourceNode = node;
      sourceNode = node;
      targetNode = nodesIdMap[searchForNode];
      edge.targetNode = targetNode;

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

      push.call(targetNode__worldStateIn[edgeLabel], {
        edge: edge
      });

    } else if (edge.target === nodeId) {
      searchForNode = edge.source;
      if (!node__worldStateIn[edgeLabel]) {
        node__worldStateIn[edgeLabel] = [];
      }

      push.call(node__worldStateIn[edgeLabel], {
        edge: edge
      });

      edge.targetNode = targetNode = node;
      sourceNode = nodesIdMap[searchForNode];
      edge.sourceNode = sourceNode;

      if (!sourceNode.__worldState) {
        sourceNode.__worldState = {
          in: {},
          out: {}
        };
      }
      var sourceNode__worldStateOut = sourceNode.__worldState.out;
      if (!sourceNode__worldStateOut[edgeLabel]) {
        sourceNode__worldStateOut[edgeLabel] = [];
      }

      push.call(sourceNode__worldStateOut[edgeLabel], {
        edge: edge
      });
    }
  }
}

module.exports = _linkNode;
