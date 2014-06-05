/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var WorldStateMixin = require('worldstate/src/Helpers/ReactWorldStateMixin');

var CommandKeys = require('../Commands/CommandKeys');
var CommandRegistry = require('../Commands/CommandRegistry');
require('../Commands/RemoveTodoItemCommand');


var TodoListItemComponent = React.createClass({

  mixins: [WorldStateMixin],

  render: function() {
    var props = this.props;
    var i = props.item.read();
    var item = <li>
      <div className="view">
        <input type="checkbox" className="toggle" />
        <label>{i.text}</label>
        <button className="destroy" onClick={this.onDeleteClick}></button>
      </div>
      <input className="edit" />
    </li>;
    return item;
  },

  onDeleteClick: function() {
    CommandRegistry.executeCommand(CommandKeys.RemoveTodoItem, {item: this.props.item});
  }

});

module.exports = TodoListItemComponent;
