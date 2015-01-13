'use strict';

var push = Array.prototype.push;

function _filter(nodes, filterFunc) {
  var results = [];
  for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i];
    var isCorrect = filterFunc.call(null, node);
    if (isCorrect) {
      push.call(results, node);
    }
  }

  return results;
}

module.exports = _filter;
