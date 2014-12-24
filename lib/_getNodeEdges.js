'use strict';

var keys = Object.keys;
var push = Array.prototype.push;

function _getNodeEdges(node) {
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
        push.call(nodeEdges, edge);
      }
    }
    for (i = 0, l = __worldStateInKeys.length; i < l; i++) {
      key = __worldStateInKeys[i];
      edgeItems = __worldStateIn[key];
      for (j = 0, k = edgeItems.length; j < k; j++) {
        edge = edgeItems[j];
        push.call(nodeEdges, edge);
      }
    }
  }
  return nodeEdges;
}

module.exports = _getNodeEdges;
