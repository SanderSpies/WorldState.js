'use strict';

var _findOutgoingNodes = require('./_findOutgoingNodes');
var _findIncomingNodes = require('./_findIncomingNodes');
var _findNodes = require('./_findNodes');
var keys = Object.keys;

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
        currentNodes = _findOutgoingNodes(currentNodes, queryPartValue, queryPartOptions);
      }
      else if (queryPartType === GraphQueryParamsEnumIN) {
        currentNodes = _findIncomingNodes(currentNodes, queryPartValue, queryPartOptions);
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
