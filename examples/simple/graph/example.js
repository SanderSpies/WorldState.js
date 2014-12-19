'use strict';

var graph = {

  nodes: [
    {
      id: 1,
      name: 'Bruce Banner'
    },
    {
      id: 2,
      name: 'Tony Stark'
    },
    {
      id: 3,
      name: 'Thor'
    },
    {
      id: 4,
      name: 'Loki'
    },
    {
      id: 5,
      name: 'Captain America'
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
      weight: 1,
      label: 1
    },
    {
      source: 2,
      target: 5,
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
