/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var WorldStateMixin = require('worldstate/src/Helpers/ReactWorldStateMixin');

var TodoListItem = require('./TodoListItemComponent');

var TodoActions = require('../Actions/TodoActions');

var TodoListComponent = React.createClass({

  mixins: [WorldStateMixin],

  render: function() {
    var props = this.props;
    var items = props.items;
    var filter = props.filter;

    var todoComponents = [];
    var itemsRead = items.read();
    if (itemsRead) {
      var l = itemsRead.length;
      for (var i = 0; i < l; i++) {
        var item = items.at(i);
        var isComplete = item.read().isComplete;
        if (filter === 1 && isComplete) {
          continue;
        } else if (filter === 2 && !isComplete) {
          continue;
        }
        todoComponents[todoComponents.length] = <TodoListItem key={item.generatedId()} item={item} />;
      }

      var todoCount = items.where({isComplete:false}).length;
      var completed = items.length() - todoCount;
      console.log('items:', items.length());
      var completeBtn;
      if (completed > 0) {
        completeBtn = <button onClick={this.onClearCompletedClick} id="clear-completed">Clear completed ({completed})</button>;
      }
    }
    var list = <div>

      <header id="header">
     <h1>Todos</h1>
     <input placeholder="What needs to be done?" id="new-todo" ref="newTodo" onKeyPress={this._onKeyPress} />
     <section id="main">
      <input readOnly={true} checked={todoCount === 0} ref="checkbox" onChange={this.onAllChange} type="checkbox" id="toggle-all" />
      <ul id="todo-list">
        {todoComponents}
      </ul>
     </section>
     <footer id="footer">
       <span id="todo-count">
        <strong>{todoCount} </strong>
        items left
       </span>
       <ul id="filters">
        <li><a href="#">All </a></li>
        <li><a href="#Active"> Active </a></li>
        <li><a href="#Completed">Completed</a></li>
       </ul>
        {completeBtn}
     </footer>
    </header>
    </div>;
    return list;
  },

  _onKeyPress: function(e) {
    if (e.keyCode === 13) {
      var domNode = this.refs.newTodo.getDOMNode();
      TodoActions.addTodoItem({text: domNode.value});
      domNode.value = '';
    }
  },

  onAllChange: function() {
    TodoActions.updateAllTodoItems({checked: this.refs.checkbox.getDOMNode().checked});
  },

  onClearCompletedClick: function() {
    TodoActions.removeCompletedTodo();
  }

});

module.exports = TodoListComponent;
