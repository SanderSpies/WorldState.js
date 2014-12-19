'use strict';

var Graph = require('worldstate');

var input = require('./graph/example');

console.time('total');
var graph = Graph.create(input);
var friendsOfBruceBanner = graph.nodes({name: 'Bruce Banner'}).out('friend');
console.log('friends of Bruce Banner:', friendsOfBruceBanner.all());
console.log('friends of friends of Bruce Banner:', friendsOfBruceBanner.out('friend').all());
var bestFriendOfTonyStark = graph.nodes({name: 'Tony Stark'}).out('friend', {greaterThan: .5});
console.log('best friend(s) of Tony Stark:', bestFriendOfTonyStark.all());
console.timeEnd('total');

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
