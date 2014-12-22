'use strict';

function _edgeMatchesOptions(edge, options) {
  if (!options) {
    return true;
  }
  var edgeWeight = edge.weight;
  return !((options.lessThanOrEqualTo && edgeWeight > options.lessThanOrEqualTo) ||
  (options.lessThan && edgeWeight >= options.lessThan) ||
  (options.greaterThanOrEqualTo && edgeWeight < options.greaterThanOrEqualTo) ||
  (options.greaterThan && edgeWeight <= options.greaterThan) ||
  (options.equals && edgeWeight !== options.equals) ||
  (options.notEquals && edgeWeight === options.notEquals));
}

module.exports = _edgeMatchesOptions;
