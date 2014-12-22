'use strict';

function _getNodeEdges(node, edges) {
  var nodeEdges = [];
  var __worldState = node.__worldState;
  if (__worldState) {
    var __worldStateOut = __worldState.out;
    var __worldStateIn = __worldState.in;
    var __worldStateOutKeys = Object.keys(__worldStateOut);
    var __worldStateInKeys = Object.keys(__worldStateIn);
    var i, l, key, edge;
    for (i = 0, l = __worldStateOutKeys.length; i < l; i++) {
      key = __worldStateOutKeys[i];
      edge = __worldStateOut[key];
      nodeEdges.push(edge);
    }
    for (i = 0, l = __worldStateInKeys.length; i < l; i++) {
      key = __worldStateInKeys[i];
      edge = __worldStateIn[key];
      nodeEdges.push(edge);
    }
  }
  else {
    // TODO: get from existing edges - should be doable with existing function
  }
  return nodeEdges;
}

module.exports = _getNodeEdges;
