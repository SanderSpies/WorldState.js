'use strict';

var isArray = Array.isArray;
var keys = Object.keys;
var push = Array.prototype.push;

var _filter = require('./_filter');
var _getNodesIdMap = require('./_getNodesIdMap');
var _findIncomingNodes = require('./_findIncomingNodes');
var _findNodes = require('./_findNodes');
var _findOutgoingNodes = require('./_findOutgoingNodes');

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
    push.call(this.query, opt);
    return this;
  },

  nodes: function GraphQuery$nodes(nodesOptions) {
    console.assert(typeof nodesOptions === 'object', 'No options object was given.');
    return this.addToQuery({queryParam: GraphQueryParamsEnum.NODES, value: nodesOptions, options: null});
  },

  filter: function GraphQuery$filter(filterFn) {
    console.assert(typeof filterFn === 'function', 'No filter function was given.');
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
    var adjacencyMatrices = props.adjacencyMatrices;
    var GraphQueryParamsEnumNODES = GraphQueryParamsEnum.NODES;
    var GraphQueryParamsEnumOUT = GraphQueryParamsEnum.OUT;
    var GraphQueryParamsEnumIN = GraphQueryParamsEnum.IN;
    var GraphQueryParamsEnumFilter = GraphQueryParamsEnum.FILTER;
    if (query) {
      for (var i = 0, l = query.length; i < l; i++) {
        var queryPart = query[i];
        var queryPartType = queryPart.queryParam;
        var queryPartValue = queryPart.value;
        var queryPartOptions = queryPart.options;
        if (queryPartType === GraphQueryParamsEnumNODES) {
          if (!isArray(queryPartValue)) {
            currentNodes = _findNodes(currentNodes, queryPartValue);
          } else {
            currentNodes = queryPartValue;
          }
        }
        else if (queryPartType === GraphQueryParamsEnumOUT) {
          currentNodes = _findOutgoingNodes(currentNodes, adjacencyMatrices, queryPartValue, queryPartOptions);
        }
        else if (queryPartType === GraphQueryParamsEnumIN) {
          currentNodes = _findIncomingNodes(currentNodes, adjacencyMatrices, queryPartValue, queryPartOptions);
        }
        else if (queryPartType === GraphQueryParamsEnumFilter) {
          currentNodes = _filter(currentNodes, queryPartValue)
        }
      }
    }
    return currentNodes;
  },

  outEdges: function Graph$outEdges() {
    var props = this.props;
    var all = this.all();
    var edges = [];
    var adjacencyMatrices = props.adjacencyMatrices;
    var adjacencyMatrixKeys = keys(adjacencyMatrices);
    var idMap = keys(_getNodesIdMap(null, all));
    for (var i = 0, l = adjacencyMatrixKeys.length; i < l; i++) {
      var adjacencyMatrixKey = adjacencyMatrixKeys[i];
      var adjacencyMatrix = adjacencyMatrices[adjacencyMatrixKey];
      for (var j = 0, l2 = idMap.length; j < l2; j++) {
        var id = idMap[j];
        var outEdges = adjacencyMatrix.matrix[adjacencyMatrix.mappings[id]];
        for (var k = 0, l3 = outEdges.length; k < l3; k++) {
          var outEdge = outEdges[k];
          edges.push(outEdge);
        }
      }
    }
    return edges;
  },

  inEdges: function Graph$inEdges() {
    var all = this.all();
    var edges = [];
    for (var i = 0, l = all.length; i < l; i++) {
      var inItems = all[i].__worldState.in;
      var inItemsKeys = keys(inItems);
      for (var j = 0, l2 = inItemsKeys.length; j < l2; j++) {
        var inItemsKey = inItemsKeys[j];
        var inItem = inItems[inItemsKey];
        for (var k = 0, l3 = inItem.length; k < l3; k++) {
          var inItemItem = inItem[k];
          push.call(edges, inItemItem.edge);
        }
      }
    }
    return edges;
  },

  observe: function Graph$observe(observer) {
    // TODO: add an observer of the query
  }

};

module.exports = GraphQuery;
