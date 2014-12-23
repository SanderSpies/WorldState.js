'use strict';

var _getNodesIdMap = require('./_getNodesIdMap');
var keys = Object.keys;

function _findNodesById (cache, nodes, ids) {
  var idMap;
  if (cache.allNodes) {
    idMap = cache.allNodesIdMap;
  }
  else {
    idMap = cache.allNodesIdMap = _getNodesIdMap(cache, nodes);
  }
  var results = [];
  var idKeys = keys(ids);
  for (var i = 0, l = idKeys.length; i < l; i++) {
    results[i] = idMap[idKeys[i]];
  }
  return results;
}

module.exports = _findNodesById;
