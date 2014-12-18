'use strict';

var Graph = require('worldstate-js');

var input = require('graph/example');


var graph = Graph.create(input);
var friendsOfSander = graph.nodes({name: 'Sander Spies'}).out('friend');

console.log('friends of Sander:', friendsOfSander.all());
console.log('friends of friends of Sander:', friendsOfSander.out('friend').all());

friendsOfSander.observe(function() {
  console.log(friendsOfSander.all());
});

graph.add([
  {
    // vertex
  },
  {
    // edge
  },
  {
    // edgeLabel
  }
]);
