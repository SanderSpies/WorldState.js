'use strict';

var _getNodesIdMap = require('./_getNodesIdMap');

function _findNodesById (nodes, ids) {
  var idMap = _getNodesIdMap(nodes);
  var results = [];
  var idKeys = Object.keys(ids);
  for (var i = 0, l = idKeys.length; i < l; i++) {
    results[i] = idMap[idKeys[i]];
  }
  return results;
}

module.exports = _findNodesById;
