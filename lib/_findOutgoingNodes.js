'use strict';

var _edgeMatchesOptions = require('./_edgeMatchesOptions');
var keys = Object.keys;

function _findOutgoingNodes(nodes, edgeLabel, options) {
  var i, l;
  var _nodes = [];
  var edgeLabelsKeys = keys(edgeLabel);
  for (i = 0, l = nodes.length; i < l; i++) {
    var __worldStateOut = nodes[i].__worldState.out;
    for (var j = 0, l2 = edgeLabelsKeys.length; j < l2; j++) {
      var edgeLabelKey = edgeLabelsKeys[j];
      var edge = __worldStateOut[edgeLabelKey];
      for (var k = 0, l3 = edge.length; k < l3; k++) {
        var edgeEntry = edge[k].edge;
        if (_edgeMatchesOptions(edgeEntry, options)) {
          _nodes.push(edgeEntry.targetNode);
        }
      }
    }
  }

  return _nodes;
}


module.exports = _findOutgoingNodes;
