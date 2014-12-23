'use strict';

var _edgeMatchesOptions = require('./_edgeMatchesOptions');
var keys = Object.keys;

function _findIncomingNodes(nodes, edgeLabel, options) {
  var i, l;
  var _nodes = [];
  var edgeLabelsKeys = keys(edgeLabel);
  for (i = 0, l = nodes.length; i < l; i++) {
    var __worldStateIn = nodes[i].__worldState.in;
    for (var j = 0, l2 = edgeLabelsKeys.length; j < l2; j++) {
      var edgeLabelKey = edgeLabelsKeys[j];
      var edge = __worldStateIn[edgeLabelKey];
      for (var k = 0, l3 = edge.length; k < l3; k++) {
        var edgeEntry = edge[k].edge;
        if (_edgeMatchesOptions(edgeEntry, options)) {
          _nodes.push(edgeEntry.sourceNode);
        }
      }
    }
  }

  return _nodes;
}

module.exports = _findIncomingNodes;
