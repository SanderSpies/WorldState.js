'use strict';

var keys = Object.keys;

function _nodeHasValues(node, optKeys, opt) {
  for (var i = 0, l = optKeys.length; i < l; i++) {
    var optKey = optKeys[i];
    var nodeKey = node[optKey];
    if (!nodeKey){
      return false;
    }
    var optValue = opt[optKey];
    if (nodeKey !== optValue) {
      return false;
    }
  }
  return true;
}

function _findNodes(nodes, opt) {
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
