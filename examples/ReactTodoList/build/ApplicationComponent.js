/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var WorldStateMixin = require('worldstate/src/Helpers/ReactWorldStateMixin');
var ImmutableGraphRegistry = require('worldstate/src/Base/ImmutableGraphRegistry');
/**
 * @type {TodoList}
 */
var TodoList = require('../Graph/TodoList');

/**
 * @type {Item}
 */
var Item = require('../Graph/Item');

var graph = require('../Graph/Graph');
var todoList = TodoList.newInstance({
  items: [

  ]
});


graph.graph = todoList;

var TodoListComponent = require('./TodoListComponent');


var ApplicationComponent = React.createClass({displayName: 'ApplicationComponent',

  mixins: [WorldStateMixin],

  render: function() {
    var todoList = graph.graph;
    return TodoListComponent( {items:todoList.items()} );
  }

});

React.renderComponent(ApplicationComponent( {todoList:todoList} ), document.getElementById('todoapp'));

todoList.afterChange(function() {
  React.renderComponent(ApplicationComponent( {todoList:todoList} ), document.getElementById('todoapp'));
});

module.exports = ApplicationComponent;
