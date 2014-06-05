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


var ApplicationComponent = React.createClass({

  mixins: [WorldStateMixin],

  render: function() {
    var todoList = graph.graph;
    return <div>
      <div style={{textAlign: 'center', marginTop:20}}>
        <input type="button" onClick={add200} value="Add 200 items"/>
        <input type="button" onClick={change200} value="Change 200 items"/>
        <input type="button" onClick={remove200} value="Remove 200 items"/>
      </div>
      <section id="todoapp">
        <TodoListComponent items={todoList.items()} />
      </section>
    </div>;
  }

});

React.renderComponent(<ApplicationComponent todoList={todoList} />, document.getElementById('container'));

todoList.afterChange(function() {
  React.renderComponent(<ApplicationComponent todoList={todoList} />, document.getElementById('container'));
});

var idCounter = 0;
function add200() {
  console.time('Adding 200 items');

  for (var i = 0, l = 200; i < l; i++) {
    todoList.items().insert(Item.newInstance({
      text: 'something' + i,
      id: idCounter++
    }));
  }

  todoList.afterChange(function(){
    requestAnimationFrame(function(){
      React.renderComponent(<ApplicationComponent todoList={todoList} />, document.getElementById('container'), function() {
        console.timeEnd('Adding 200 items');
      });
    });
  });
}

function change200(){
  console.time('Change 200 items');

  for (var i = 0, l = 200; i < l; i++) {
    todoList.items().at(i).changeValueTo({
      text: 'change' + i,
      id: 10000 + i
    });
  }

  todoList.afterChange(function(){
    requestAnimationFrame(function(){
      React.renderComponent(<ApplicationComponent todoList={todoList} />, document.getElementById('container'), function() {
        console.timeEnd('Change 200 items');
      });
    });
  });
}

function remove200() {
  console.time('Remove 200 items');

  for (var i = 0, l = 200; i < 200; i++){
    todoList.items().at(0).remove();
  }

  todoList.afterChange(function(){
    requestAnimationFrame(function(){
      React.renderComponent(<ApplicationComponent todoList={todoList} />, document.getElementById('container'), function() {
        console.timeEnd('Remove 200 items');
      });
    });
  });
}


module.exports = ApplicationComponent;
