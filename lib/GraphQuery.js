'use strict';

/**
 * TODO:
 * - currently we iterate too much over everything, which we can prevent with
 *   object structures in several places: edges, nodes, etc.
 * - look into caching for query parts
 */

var GraphQuery = function GraphQuery(graph) {
  this.props = graph.props;
  this.query = [];
};

var GraphQueryParamsEnum = {
  NODES: 1,
  OUT: 2,
  IN: 3
};

function _nodeHasValues(node, optKeys, opt) {
  for (var i = 0, l = optKeys.length; i < l; i++) {
    var optKey = optKeys[i];
    if (!node[optKey] || node[optKey] !== opt[optKey]) {
      return false;
    }
  }
  return true;
}

function _findNodes(nodes, opt) {
  // TODO: perhaps possible to create property trees?
  var results = [];
  var optKeys = Object.keys(opt);
  for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i];
    if (_nodeHasValues(node, optKeys, opt)) {
      results[results.length] = node;
    }
  }
  return results;
}

function _findNodesById (nodes, ids) {
  var idMap = _getNodesIdMap(nodes);
  var results = [];
  for (var i = 0, l = ids.length; i < l; i++) {
    results[results.length] = idMap[ids[i]];
  }
  return results;
}

function _getNodesIdMap(nodes) {
  // TODO: caching
  var nodeKeys = {};
  for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodeKeys[i];
    nodeKeys[node.id] = node;
  }
  return nodeKeys;
}

function _edgeMatchesOptions(edge, options) {
  if (!options) {
    return true;
  }
  return !((options.lessThanOrEqualTo && edge.weight > options.lessThanOrEqualTo) ||
    (options.lessThan && edge.weight >= options.lessThan) ||
    (options.greaterThanOrEqualTo && edge.weight < options.greaterThanOrEqualTo) ||
    (options.greaterThan && edge.weight <= options.greaterThan) ||
    (options.equals && edge.weight !== options.equals) ||
    (options.notEquals && edge.weight === options.notEquals));
}

function _findIncomingNodes(nodes, edges, edgeLabel, options) {
  // TODO: use an edges map
  var nodeKeys = _getNodesIdMap(nodes);
  var foundNodeIds = {};
  for (var i = 0, l = edges.length; i < l; i++) {
    var edge = edges[i];
    if (nodeKeys[edge.target] && _edgeMatchesOptions(edge, options)) {
      if (!edgeLabel || edgeLabel[edge.label]) {
        foundNodeIds[edge.source] = true;
      }
    }
  }
  return _findNodesById(nodes, foundNodeIds);
}

function _findOutgoingNodes(nodes, edges, edgeLabel, options) {
  // TODO: use an edges map
  var nodeKeys = _getNodesIdMap(nodes);
  var foundNodeIds = {};
  for (var i = 0, l = edges.length; i < l; i++) {
    var edge = edges[i];
    if (nodeKeys[edge.source] && _edgeMatchesOptions(edge, options)) {
      if (!edgeLabel || edgeLabel[edge.label]) {
        foundNodeIds[edge.target] = true;
      }
    }
  }
  return _findNodesById(nodes, foundNodeIds);
}

function _getEdgeLabels(edgeLabels, edge) {
  var result = {};
  var edges = edge.split(' ');
  for (var i = 0, l = edges.length; i < l; i++) {
    result[edgeLabels[edges[i]]] = true;
  }
  return result;
}

GraphQuery.prototype = {

  addQuery: function GraphQuery$addQuery(opt) {
    this.query.push(opt);
    return this;
  },

  nodes: function GraphQuery$nodes(nodesOptions) {
    return this.addToQuery({queryParam: GraphQueryParamsEnum.NODES, value: nodesOptions, options: null});
  },

  out: function GraphQuery$out(edgeLabel, edgeOptions) {
    var _edgeLabel = _getEdgeLabels(this.props.edgeLabels, edgeLabel);
    return this.addToQuery({queryParam: GraphQueryParamsEnum.OUT, value: _edgeLabel, options: edgeOptions});
  },

  in: function GraphQuery$in(edgeLabel, edgeOptions) {
    var _edgeLabel = _getEdgeLabels(this.props.edgeLabels, edgeLabel);
    return this.addToQuery({queryParam: GraphQueryParamsEnum.IN, value: _edgeLabel, options: edgeOptions});
  },

  all: function GraphQuery$all() {
    var props = this.props;
    var query = this.query;
    var currentNodes = props.nodes;
    var edges = props.edges;
    for (var i = 0, l = query.length; i < l; i++) {
      var queryPart = query[i];
      var queryPartValue = queryPart.value;
      var queryPartOptions = queryPart.options;
      if (queryPart === GraphQueryParamsEnum.NODES) {
        currentNodes = _findNodes(currentNodes, queryPartValue);
      }
      else if (queryPart === GraphQueryParamsEnum.OUT) {
        currentNodes = _findOutgoingNodes(currentNodes, edges, queryPartValue, queryPartOptions);
      }
      else if (queryPart === GraphQueryParamsEnum.IN) {
        currentNodes = _findIncomingNodes(currentNodes, edges, queryPartValue, queryPartOptions);
      }
    }
    return currentNodes;
  },

  edges: function Graph$edges() {
    // TODO: return list of found edges instead of nodes
  },

  observe: function Graph$observe(observer) {
    // TODO: add an observer of the query
  }

};

module.exports = GraphQuery;
