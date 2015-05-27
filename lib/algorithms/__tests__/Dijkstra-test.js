'use strict';

// example data extracted from wikipedia example
jest.autoMockOff();

var exampleData = {

  nodes: [
    {
      id: 2,
      label: 'b'
    },
    {
      id: 3,
      label: 'c'
    },

    {
      id: 4,
      label: 'd'
    },
    {
      id: 5,
      label: 'e'
    },
    {
      id: 6,
      label: 'f'
    },
    {
      id: 1,
      label: 'a'
    }
  ],

  edges: [
    {
      source: 1,
      target: 2,
      weight: 7,
      label: 1
    },
    {
      source: 1,
      target: 3,
      weight: 9,
      label: 1
    },
    {
      source: 1,
      target: 6,
      weight: 14,
      label: 1
    },
    {
      source: 2,
      target: 3,
      weight: 10,
      label: 1
    },
    {
      source: 2,
      target: 4,
      weight: 15,
      label: 1
    },
    {
      source: 3,
      target: 6,
      weight: 2,
      label: 1
    },
    {
      source: 3,
      target: 4,
      weight: 11,
      label: 1
    },
    {
      source: 6,
      target: 5,
      weight: 9,
      label: 1
    },
    {
      source: 4,
      target: 5,
      weight: 6,
      label: 1
    }
  ],

  edgeLabels: {
    distance: {
      id: 1
    }
  }
};

var worldstate = require('../../');
var graph = worldstate.create(exampleData);
var Dijkstra = require('../Dijkstra');
describe('Dijkstra algorithm', function() {

  it('should have the correct path', function() {
    Dijkstra(graph.props.nodes[5], graph.props.adjacencyMatrices[1]);
    var node = graph.props.nodes[3];
    while (node) {
      node = node.previousNode;
    }
  });

});
