'use strict';

var graph = {

  nodes: [
    {
      id: 1,
      value: {

      }
    },
    {
      id: 2,
      value: {

      }
    },
    {
      id: 3,
      value: {

      }
    }
  ],

  edges: [
    {
      source: 1,
      target: 2,
      weight: 0,
      label: 1
    },
    {
      source: 2,
      target: 3,
      weight: 0,
      label: 1
    }
  ],

  edgeLabels: {
    friend: {
      id: 1
    }
  }

};

module.exports = graph;
