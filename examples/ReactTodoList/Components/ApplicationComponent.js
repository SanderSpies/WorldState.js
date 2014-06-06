/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var WorldStateMixin = require('worldstate/src/Helpers/ReactWorldStateMixin');

/**
 * @type {Item}
 */
var Item = require('../Graph/Item');

var todoList = require('../Graph/Graph');

var TodoListComponent = require('./TodoListComponent');
var UndoRedoListComponent = require('./UndoRedoListComponent');

var TodoActions = require('../Actions/TodoActions');

var ApplicationComponent = React.createClass({

  mixins: [WorldStateMixin],

  render: function() {
    var filter;

    return <div>
      <div style={{textAlign: 'center', marginTop:20}}>
        <input type="button" onClick={add200} value="Add 200 items 1 by 1"/>
        <input type="button" onClick={add200AtOnce} value="Add 200 items at once"/>
        <input type="button" onClick={change200} value="Change 200 items 1 by 1"/>
        <input type="button" onClick={remove200} value="Remove 200 items 1 by 1"/>
      </div>
      <section id="todoapp">
        <TodoListComponent items={todoList.items()} filter={todoList.read().filter} />
      </section>
      <UndoRedoListComponent items={todoList.items()} />
    </div>;
  }
});

window.addEventListener('hashchange', function(e){
  var filter = 0;
  var hash = location.hash;
  if (hash === '#Active') {
    filter = 1;
  }
  else if (hash === '#Completed') {
    filter = 2;
  }
  TodoActions.setFilter({filter: filter});
});

React.renderComponent(<ApplicationComponent todoList={todoList} />, document.getElementById('container'));

todoList.afterChange(function() {
  React.renderComponent(<ApplicationComponent todoList={todoList} />, document.getElementById('container'));
});


// testing code
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

function add200AtOnce() {

  console.time('Add 200 items at once (raw)');
  var items = [];
  for (var i = 0, l = 200; i < l; i++) {
      items[i] = {text: 'another' + i, id:900000 + i}
    }

    todoList.items().insertMultiRaw(items);
    todoList.afterChange(function(){

      requestAnimationFrame(function(){
        React.renderComponent(<ApplicationComponent todoList={todoList} />, document.getElementById('container'), function() {
          console.timeEnd('Add 200 items at once (raw)');
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
