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

var TodoListComponent = require('./TodoListComponent');

console.log(TodoList);

var todoList = TodoList.newInstance({
  items: [
    {id:1, text: 'dddd'}
  ]
});

var ApplicationComponent = React.createClass({

  mixins: [WorldStateMixin],

  render: function() {
    var todoList = this.props.todoList;
    console.log('render:', todoList.items().read());
    return <TodoListComponent items={todoList.items()} />;
  }

});



React.renderComponent(<ApplicationComponent todoList={todoList} />, document.getElementById('container'));

setTimeout(function(){
  console.time('Adding 210 items');
  for (var i = 0, l = 210; i < l; i++) {
    todoList.items().insert(Item.newInstance({
      text: 'something' + i,
      id: i
    }));
  }

  todoList.afterChange(function(){
    React.renderComponent(<ApplicationComponent todoList={todoList} />, document.getElementById('container'), function() {
      console.timeEnd('Adding 210 items');
    });
  });

}, 100);

setTimeout(function() {
  console.log('start');
  console.time('Change 5 items');

  for (var i = 0, l = 5; i < l; i++) {
    todoList.items().at(i).changeValueTo({
      text: 'change' + i,
      id: 10000 + i
    });
  }

  todoList.afterChange(function(){
    React.renderComponent(<ApplicationComponent todoList={todoList} />, document.getElementById('container'), function() {
      console.timeEnd('Change 5 items');
    });
  });

}, 1000);

setTimeout(function(){
  console.log('oh hai there');
  todoList.items().at(0).changeValueTo({
    text:'fafafa',
    id: 1
  });
  todoList.afterChange(function(){
    React.renderComponent(<ApplicationComponent todoList={todoList} />, document.getElementById('container'), function() {
      console.log('oh hai 2');
    });
  });
}, 3000);

setTimeout(function() {
  console.time('Remove 200 items');
  for (var i = 0, l = 200; i < 200; i++){
    todoList.items().at(0).remove();
  }

  todoList.afterChange(function(){
    React.renderComponent(<ApplicationComponent todoList={todoList} />, document.getElementById('container'), function() {
      console.timeEnd('Remove 200 items');
    });
  });

}, 5000);





module.exports = ApplicationComponent;
