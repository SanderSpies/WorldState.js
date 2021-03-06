'use strict';

var WorldState = require('worldstate');

var input = require('./graph/example');
console.profile('total');

var graph = WorldState.create(input);
var friendsOfBruceBanner = graph.nodes({name: 'Bruce Banner'}).out('friend');
console.log('friends of Bruce Banner:', friendsOfBruceBanner.all());


var testNodes = [];
for (var i = 5, l = 2000000; i < l; i++) {
  testNodes.push({id: i, name: 'Random Evil Bad Guy'});
}

graph.add({
  nodes: testNodes,
  edges: [{
    source: 6,
    target: 1,
    label: 2
  }
  ],
  edgeLabels: {
    enemy: {
      id: 2
    }
  }
});

console.log('friends of friends of Bruce Banner:', friendsOfBruceBanner.out('friend').all());
var bestFriendOfTonyStark = graph.nodes({name: 'Tony Stark'}).out('friend', {greaterThan: .5});
console.log('best friend(s) of Tony Stark:', bestFriendOfTonyStark.all());


// TODO: removal

console.log('nr of added bad guys:', graph.nodes({name:'Random Evil Bad Guy'}).all().length);
console.log(graph.nodes({name:'Bruce Banner'}).in('enemy').all());
console.log(graph.nodes({name:'Bruce Banner'}).outEdges());
console.log('filter testing:', graph.filter(function(node){
  return node.name.indexOf('ony') > -1;
}).all());

var bruce = graph.nodes({name: 'Tony Stark'}).all();
console.log(bruce);

console.log('pleh:', graph.nodes(bruce).in('friend').all());

console.profileEnd('total');

//
//friendsOfSander.observe(function() {
//  console.log(friendsOfSander.all());
//});
//
//graph.add([
//  {
//    // vertex
//  },
//  {
//    // edge
//  },
//  {
//    // edgeLabel
//  }
//]);
