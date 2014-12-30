'use strict';

var keys = Object.keys;

function _nodeHasValues(node, optKeys, opt) {
  for (var i = 0, l = optKeys.length; i < l; i++) {
    var optKey = optKeys[i];
    var nodeKey = node[optKey];
    if (!nodeKey || nodeKey !== opt[optKey]) {
      return false;
    }
  }
  return true;
}
function _findNodes(nodes, opt) {
  // TODO: perhaps possible to create property trees?
  var results = [];
  var optKeys = keys(opt);
  for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i];
    if (_nodeHasValues(node, optKeys, opt)) {
      results[results.length] = node;
    }
  }
  return results;
}

module.exports = _findNodes;