'use strict';

var GraphQuery = function GraphQuery() {
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
  var results = [];
  for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i];
    if (ids[node.id]) {
      results.push(node);
    }
  }
  return results;
}

function _getNodesIdMap(nodes) {
  var nodeKeys = {};
  for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodeKeys[i];
    nodeKeys[node.id] = true;
  }
  return nodeKeys;
}

function _findIncomingNodes(nodes, edges, edgeLabel) {
  var nodeKeys = _getNodesIdMap(nodes);
  var foundNodeIds = {};
  for (var i = 0, l = edges.length; i < l; i++) {
    var edge = edges[i];
    if (nodeKeys[edge.target] && edge.label === edgeLabel) {
      foundNodeIds[edge.source] = true;
    }
  }
  return _findNodesById(nodes, foundNodeIds);
}

function _findOutgoingNodes(nodes, edges, edgeLabel) {
  var nodeKeys = _getNodesIdMap(nodes);
  var foundNodeIds = {};
  for (var i = 0, l = edges.length; i < l; i++) {
    var edge = edges[i];
    if (nodeKeys[edge.source] && edge.label === edgeLabel) {
      foundNodeIds[edge.target] = true;
    }
  }
  return _findNodesById(nodes, foundNodeIds);
}

GraphQuery.prototype = {

  addQuery: function GraphQuery$addQuery(opt) {
    this.query.push(opt);
    return this;
  },

  nodes: function GraphQuery$nodes(nodesOptions) {
    return this.addToQuery({queryParam: GraphQueryParamsEnum.NODES, value: nodesOptions});
  },

  out: function GraphQuery$out(edgeLabel) {
    var _edgeLabel = this.props.edgeLabels[edgeLabel];
    return this.addToQuery({queryParam: GraphQueryParamsEnum.OUT, value: _edgeLabel});
  },

  in: function GraphQuery$in(edgeLabel) {
    var _edgeLabel = this.props.edgeLabels[edgeLabel];
    return this.addToQuery({queryParam: GraphQueryParamsEnum.IN, value: _edgeLabel});
  },

  all: function GraphQuery$all() {
    var props = this.props;
    var query = this.query;
    var currentNodes = props.nodes;
    var edges = props.edges;
    for (var i = 0, l = query.length; i < l; i++) {
      var queryPart = query[i];
      var queryPartValue = queryPart.value;
      if (queryPart === GraphQueryParamsEnum.NODES) {
        currentNodes = _findNodes(currentNodes, queryPartValue);
      }
      else if (queryPart === GraphQueryParamsEnum.OUT) {
        currentNodes = _findOutgoingNodes(currentNodes, edges, queryPartValue);
      }
      else if (queryPart === GraphQueryParamsEnum.IN) {
        currentNodes = _findIncomingNodes(currentNodes, edges, queryPartValue);
      }
    }
    return currentNodes;
  }

};

module.exports = GraphQuery;
