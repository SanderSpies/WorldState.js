'use strict';

/**
 * TODO:
 * - currently we iterate too much over everything, which we can prevent with
 *   object structures in several places: edges, nodes, etc.
 * - look into caching for query parts
 */

var GraphQuery = function GraphQuery(graph, opt) {
  this.props = graph.props;
  this.query = [opt];
};

var GraphQueryParamsEnum = {
  NODES: 1,
  OUT: 2,
  IN: 3,
  FILTER: 4
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
  var idKeys = Object.keys(ids);
  for (var i = 0, l = idKeys.length; i < l; i++) {
    results[i] = idMap[idKeys[i]];
  }
  return results;
}

function _getNodesIdMap(nodes) {
  // TODO: caching
  var nodeKeys = {};
  for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i];
    nodeKeys[node.id] = node;
  }
  return nodeKeys;
}

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

function _findIncomingNodes(allNodes, nodes, edges, edgeLabel, options) {
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
  return _findNodesById(allNodes, foundNodeIds);
}

function _findOutgoingNodes(allNodes, nodes, edges, edgeLabel, options) {
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
  return _findNodesById(allNodes, foundNodeIds);
}

function _getEdgeLabels(edgeLabels, edge) {
  if (!edge) {
    return null;
  }
  var result = {};
  var edges = edge.split(' ');
  for (var i = 0, l = edges.length; i < l; i++) {
    var edgeLabel = edgeLabels[edges[i]];
    if (edgeLabel) {
      result[edgeLabel.id] = true;
    }
  }
  return result;
}

GraphQuery.prototype = {

  addToQuery: function GraphQuery$addQuery(opt) {
    this.query.push(opt);
    return this;
  },

  nodes: function GraphQuery$nodes(nodesOptions) {
    return this.addToQuery({queryParam: GraphQueryParamsEnum.NODES, value: nodesOptions, options: null});
  },

  filter: function GraphQuery$filter(filterFn) {
    return this.addToQuery({queryParam: GraphQueryParamsEnum.FILTER, value: filterFn, options: null});
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
    var GraphQueryParamsEnumNODES = GraphQueryParamsEnum.NODES;
    var GraphQueryParamsEnumOUT = GraphQueryParamsEnum.OUT;
    var GraphQueryParamsEnumIN = GraphQueryParamsEnum.IN;
    var GraphQueryParamsEnumFilter = GraphQueryParamsEnum.FILTER;
    for (var i = 0, l = query.length; i < l; i++) {
      var queryPart = query[i];
      var queryPartType = queryPart.queryParam;
      var queryPartValue = queryPart.value;
      var queryPartOptions = queryPart.options;
      if (queryPartType === GraphQueryParamsEnumNODES) {
        currentNodes = _findNodes(currentNodes, queryPartValue);
      }
      else if (queryPartType === GraphQueryParamsEnumOUT) {
        currentNodes = _findOutgoingNodes(props.nodes, currentNodes, edges, queryPartValue, queryPartOptions);
      }
      else if (queryPartType === GraphQueryParamsEnumIN) {
        currentNodes = _findIncomingNodes(props.nodes, currentNodes, edges, queryPartValue, queryPartOptions);
      }
      else if (queryPartType === GraphQueryParamsEnumFilter) {
        // TODO: implement
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
