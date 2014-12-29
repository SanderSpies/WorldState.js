WorldState.js
===
A graph library

Description
---
WorldState.js makes it possible to describe your domain as a graph inside the
browser, and perform queries on this graph.

Create a graph
---
WorldState.js expect the following format as input for the Graph:

```
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

```

The objects from this input are linked together for fast graph navigation. The
cost for this is O(V * E + V) when the graph is being loaded. If the graph is
very large, it might be wiser to have the graph inside a webworker.

Base queries
---
WorldState.js has the following chainable functions to navigate the graph:

`nodes(nodesOptions)`
Currently has a performance of O(V) - wonder if we could go to
O(nodeOptions.length) if we create property trees at creation time.

`filter(filterFunction)` O(V)


`out(edgeNames, edgeOptions)`
Should go towards O(E) where E are edges of the current nodes

`in(edgeNames, edgeOptions)`

`edges()`

`all()`

Algorithms
---


Graph manipulation
---
`add`

`remove`

Observe
---
TODO

Background
---

1. Immutability
---
WorldState.js has immutable edges and immutable objects. Edges are recursively
immutable, while objects are not. 


License
---
MIT license
