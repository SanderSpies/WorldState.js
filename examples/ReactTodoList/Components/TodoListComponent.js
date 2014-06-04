/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var WorldStateMixin = require('worldstate/src/Helpers/ReactWorldStateMixin');

var TodoListItem = require('./TodoListItemComponent');

var CommandKeys = require('../Commands/CommandKeys');
var CommandRegistry = require('../Commands/CommandRegistry');
require('../Commands/AddTodoItemCommand');

var TodoListComponent = React.createClass({

  mixins: [WorldStateMixin],

  render: function() {
    var items = this.props.items;
    var res = [];
    var l = items.read().length;
    for (var i = 0; i < l; i++) {
      res.push(<TodoListItem key={i} item={items.at(i)} />);
    }

    var list = <div>

      <header id="header">
     <h1>Todos</h1>
     <input placeholder="What needs to be done?" id="new-todo" ref="newTodo" onKeyPress={this._onKeyPress} />
     <section id="main">
      <input readOnly={true} checked="checked" type="checkbox" id="toggle-all" />
      <ul id="todo-list">
        {res}
      </ul>
     </section>
     <footer id="footer">
       <span id="todo-count">
       </span>
       <ul id="filters">
        <li></li>
        <li></li>
        <li></li>
       </ul>
     </footer>
    </header>
    </div>;

    return list;
  },
  _onKeyPress: function(e) {
    if (e.keyCode === 13) {
      var domNode = this.refs.newTodo.getDOMNode();
      CommandRegistry.executeCommand(CommandKeys.AddTodoItem, {text: domNode.value});
      domNode.value = '';
    }
  }

});

module.exports = TodoListComponent;
