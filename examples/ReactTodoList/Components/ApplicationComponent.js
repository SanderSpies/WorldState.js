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
    //console.log('render:', todoList.items().read());
    return <TodoListComponent items={todoList.items()} />;
  }

});



React.renderComponent(<ApplicationComponent todoList={todoList} />, document.getElementById('container'));

setTimeout(function(){
  console.time('Adding 200 items');
  for (var i = 0, l = 200; i < l; i++) {
    todoList.items().insert(Item.newInstance({
      text: 'something' + i,
      id: i
    }));
  }

  todoList.afterChange(function(){
    requestAnimationFrame(function(){
      React.renderComponent(<ApplicationComponent todoList={todoList} />, document.getElementById('container'), function() {
        console.timeEnd('Adding 200 items');
      });
    });
  });

}, 100);

setTimeout(function() {
  //console.log('start');
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

}, 200);

setTimeout(function() {
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

}, 300);

setTimeout(function(){
  var items = [];
  for (var i = 0, l = 200; i < l; i++) {
    items[i] = {text: 'another' + i, id:900000 + i}
  }
  console.time('Add 200 items at once (raw)');
  var old = todoList.items().read();
  todoList.items().insertMultiRaw(items);
  todoList.afterChange(function(){
    requestAnimationFrame(function(){
      React.renderComponent(<ApplicationComponent todoList={todoList} />, document.getElementById('container'), function() {
        console.timeEnd('Add 200 items at once (raw)');
      });
    });
  });
}, 400);

setTimeout(function(){
  console.time('Remove at once');
  todoList.items().remove();
  todoList.afterChange(function(){
    requestAnimationFrame(function(){
      React.renderComponent(<ApplicationComponent todoList={todoList} />, document.getElementById('container'), function() {
        console.timeEnd('Remove at once');
      });
    });
  });
}, 500);



module.exports = ApplicationComponent;
