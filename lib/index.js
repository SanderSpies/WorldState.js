'use strict';

var GraphQuery = require('./GraphQuery');
var assign = require('./Object.assign');
var _indexOf = require('./_indexOf');
var keys = Object.keys;
var slice = Array.prototype.slice;
var concat = Array.prototype.concat;
var push = Array.prototype.push;
var idCounter = 0;
var _getNodesIdMap = require('./_getNodesIdMap');

function Graph(input) {
  this.props = input;
  var props = this.props;
  props.cache = {};
  props.versions = [];
  props.adjacencyMatrices = {};
  _adjustAdjacencyMatrices(props, input);
}

function _adjustAdjacencyMatrices(props, input) {
  var edgeLabels = assign({}, props.edgeLabels, input.edgeLabels);
  var edgeLabelKeys = keys(input.edgeLabels);
  var nodesIdMap = _getNodesIdMap(null, props.nodes);
  for (var j = 0, l2 = edgeLabelKeys.length; j < l2; j++) {
    var edgeLabelKey = edgeLabelKeys[j];
    var edgeLabel = edgeLabels[edgeLabelKey].id;
    if (!props.adjacencyMatrices[edgeLabel]) {
      props.adjacencyMatrices[edgeLabel] = {
        matrix: [],
        mappings: {}
      };
    }
    var adjacencyMatrixMapping = props.adjacencyMatrices[edgeLabel].mappings;
    var adjacencyMatrix = props.adjacencyMatrices[edgeLabel].matrix;
    var edges = input.edges;
    for (var i = 0, l = edges.length; i < l; i++) {
      var edge = edges[i];
      var source = edge.source;
      var target = edge.target;
      var weight = edge.weight;
      if (!adjacencyMatrixMapping[source]) {
        adjacencyMatrixMapping[source] = idCounter++;
      }
      if (!adjacencyMatrixMapping[target]) {
        adjacencyMatrixMapping[target] = idCounter++;
      }

      var mappedSourceId = adjacencyMatrixMapping[source];
      var mappedTargetId = adjacencyMatrixMapping[target];
      if (!adjacencyMatrix[mappedSourceId]) {
        adjacencyMatrix[mappedSourceId] = [];
      }
      adjacencyMatrix[mappedSourceId].push({source: mappedSourceId, target: mappedTargetId, weight: weight, sourceNode: nodesIdMap[source], targetNode: nodesIdMap[target]});
      if (!adjacencyMatrix[mappedTargetId]) {
        adjacencyMatrix[mappedTargetId] = [];
      }
      adjacencyMatrix[mappedTargetId].push({source: mappedSourceId, target: mappedTargetId, weight: weight, sourceNode: nodesIdMap[source], targetNode: nodesIdMap[target]});
    }
  }
}

Graph.prototype = assign({}, GraphQuery.prototype, {

  addToQuery: function Graph$addToQuery(opt) {
    return new GraphQuery(this, opt);
  },

  add: function Graph$add(values) {
    var props = this.props;
    var nodes = values.nodes;
    var edges = values.edges;

    props.nodes = concat.call(props.nodes, nodes);
    props.edges = concat.call(props.edges, edges);

    _adjustAdjacencyMatrices(this.props, values);
  },

  remove: function Graph$remove(values) {
    // redo
  },

  saveVersion: function Graph$saveVersion(name) {
    var props = this.props;
    var version = {
      name: name,
      nodes: props.nodes,
      edges: props.edges,
      edgeLabels: props.edgeLabels
    };
    push.call(this.props.versions, version);
  },

  restoreVersion: function Graph$restoreVersion(name) {
    var props = this.props;
    var versions = props.versions;
    for (var i = 0, l = versions.length; i < l; i++) {
      var version = versions[i];
      if (version.name === name) {
        props.edges = version.edges;
        props.nodes = version.nodes;
        props.edgeLabels = version.edgeLabels;
        break;
      }
    }
  },

  removeVersions: function Graph$removeVersions(versions) {
    // TODO: implement remove versions
  },

  getVersions: function Graph$getVersions() {
    return this.props.versions;
  }

});

Graph.create = function Graph$create(input) {
  return new Graph(input);
};

module.exports = Graph;
