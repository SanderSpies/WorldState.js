'use strict';

jest.autoMockOff();

var exampleData = {
  nodes: [
    {
      id: 1,
      label: 'A'
    },
    {
      id: 2,
      label: 'B'
    },
    {
      id: 3,
      label: 'C'
    },
    {
      id: 4,
      label: 'D'
    }
  ],
  edges: [
    {
      source: 1,
      target: 2,
      label: 1
    },
    {
      source: 1,
      target: 3,
      label: 1
    },
    {
      source: 2,
      target: 3,
      label: 1
    },
    {
      source: 4,
      target: 3,
      label: 1
    }
  ],
  edgeLabels: {
    pageRank: {
      id: 1
    }
  }
};


var worldstate = require('../../');
var graph = worldstate.create(exampleData);
var PageRank = require('../PageRank');
PageRank(graph.props.nodes, 1);
console.log(graph.props.nodes);