'use strict';

function _filter(nodes, filterFunc) {
  var results = [];
  for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i];
    var isCorrect = filterFunc.call(null, node);
    if (isCorrect) {
      results.push(node);
    }
  }

  return results;
}

module.exports = _filter;
