'use strict';

var keys = Object.keys;

function _getNodeEdges(node, edges) {

  var nodeEdges = [];
  var __worldState = node.__worldState;
  if (__worldState) {
    var __worldStateOut = __worldState.out;
    var __worldStateIn = __worldState.in;
    var __worldStateOutKeys = keys(__worldStateOut);
    var __worldStateInKeys = keys(__worldStateIn);
    var i, l, key, edgeItems, edge, j, k;
    for (i = 0, l = __worldStateOutKeys.length; i < l; i++) {
      key = __worldStateOutKeys[i];
      edgeItems = __worldStateOut[key];
      for (j = 0, k = edgeItems.length; j < k; j++) {
        edge = edgeItems[j];
        nodeEdges.push(edge);
      }
    }
    for (i = 0, l = __worldStateInKeys.length; i < l; i++) {
      key = __worldStateInKeys[i];
      edgeItems = __worldStateIn[key];
      for (j = 0, k = edgeItems.length; j < k; j++) {
        edge = edgeItems[j];
        nodeEdges.push(edge);
      }
    }
  }
  else {

  }
  return nodeEdges;
}

module.exports = _getNodeEdges;
