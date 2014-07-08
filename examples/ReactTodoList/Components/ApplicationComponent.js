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

var setState = null;
var context = null;

var ApplicationComponent = React.createClass({
   getInitialState: function() {
     return {
       bla: 0
     };
   },

  render: function() {
    return <div>
      <div style={{textAlign: 'center', marginTop:20}}>
        <input type="button" onClick={add200} value="Add 200 items 1 by 1"/>
        <input type="button" onClick={add200AtOnce} value="Add 200 items at once"/>
  <input type="button" onClick={insertAt5} value="Insert at 5"/><br />
  <input type="button" onClick={change200} value="Change 200 items 1 by 1"/>
  <input type="button" onClick={remove200} value="Remove 200 items 1 by 1"/>
  <input type="button" onClick={removeItems} value="Remove items"/>
  <input type="button" onClick={order} value="Order items"/>
      </div>
      <section id="todoapp">
        <TodoListComponent items={todoList.items()} filter={todoList.read().filter} />
      </section>
      <UndoRedoListComponent items={todoList.items()} />
    </div>;
  }, componentDidMount: function() {
    setState = this.setState;
    context = this;
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
var renderStack = [];
var isRenderBusy = false;
function render(fn) {
  if (renderStack.length && !isRenderBusy) {
    isRenderBusy = true;
    requestAnimationFrame(function(){
      renderStack.shift().call();
      render();
      isRenderBusy = false;
    });
  }
  else if (fn) {
    renderStack.push(fn);
    if (!isRenderBusy) {
      render();
    }
  }

}
todoList.addChangeListener(function() {

  render(function(){
    var start = window.performance.now();
    React.renderComponent(<ApplicationComponent todoList={todoList} />, document.getElementById('container'), function(){
      var end = window.performance.now();
      var duration = end - start;
      console.log('Render time:', duration);
    });
  });
});


// testing code
var idCounter = 1;
function add200() {
  start = window.performance.now();
  for (var i = 0, l = 200; i < l; i++) {
    todoList.items().insert(Item.newInstance({
      text: 'foo',
      id: idCounter++
    }));
  }
}

function add200AtOnce() {
  start = window.performance.now();
  var items = [];
  for (var i = 0, l = 200; i < l; i++) {
    items[i] = {text: 'another' + i, id: 900000 + i, test1: [1 + i, 2 + i, 4 + i], test2: ['a' + 1, 'b' + i, 'c' + i]};
  }
  todoList
    .items()
    .insertMultiRaw(items);
  setTimeout(function(){
    debugger;
  }, 0);
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
  start = window.performance.now();
  for (var i = 0, l = 200; i < l; l--) {
    var item = todoList.items().at(l - 1);
    item.remove();
  }
}

function removeItems() {
  start = window.performance.now();
  requestAnimationFrame(function(){
    TodoActions.removeAllTodoItems();
  });
}

function insertAt5() {
  start = window.performance.now();
  todoList.items().insertAt(5, Item.newInstance({
    text: 'inserted item',
    isComplete: false
  }));
}

function order() {
  start = window.performance.now();
  TodoActions.orderByTextAndCompleted();
}

module.exports = ApplicationComponent;
