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

var start = window.performance.now();

var ReferenceRegistry = require('worldstate/src/Base/ReferenceRegistry');
var ImmutableGraphRegistry = require('worldstate/src/Base/ImmutableGraphRegistry');


var ApplicationComponent = React.createClass({

  mixins: [WorldStateMixin],

  render: function() {
    return <div>
      <div style={{textAlign: 'center', marginTop:20}}>
        <input type="button" onClick={add200} value="Add 200 items 1 by 1"/>
        <input type="button" onClick={add200AtOnce} value="Add 200 items at once"/>
        <input type="button" onClick={change200} value="Change 200 items 1 by 1"/>
        <input type="button" onClick={remove200} value="Remove 200 items 1 by 1"/>
        <input type="button" onClick={removeAll} value="Remove items"/>
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
 // requestAnimationFrame(function() {
    React.renderComponent(<ApplicationComponent todoList={todoList} />, document.getElementById('container'), function(){
      var end = window.performance.now();
      var duration = end - start;

      console.log('Duration:', duration);
    });
 // });
});


// testing code
var idCounter = 0;
function add200() {
  start = window.performance.now();
  for (var i = 0, l = 200; i < l; i++) {
    todoList.items().insert(Item.newInstance({
      text: 'something' + i,
      id: idCounter++
    }));
  }
}

function add200AtOnce() {
  requestAnimationFrame(function(){
    start = window.performance.now();
    var items = [];
    for (var i = 0, l = 200; i < l; i++) {
      items[i] = {text: 'another' + i, id: 900000 + i}
    }

    todoList.items().insertMultiRaw(items);
  });
}

function change200() {
  start = window.performance.now();
  for (var i = 0, l = 200; i < l; i++) {
    todoList.items().at(i).changeValueTo({
      text: 'change' + i,
      id: 10000 + i
    });
  }
}

function remove200() {
  requestAnimationFrame(function(){
    start = window.performance.now();
    for (var i = 0, l = 200; i < l; l--) {
      var item = todoList.items().at(l - 1);
      item.remove();
    }
  });
}

function removeItems() {
  requestAnimationFrame(function(){
    start = window.performance.now();
    TodoActions.removeAllTodoItems();
  });
}


module.exports = ApplicationComponent;
