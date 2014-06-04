/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var WorldStateMixin = require('worldstate/src/Helpers/ReactWorldStateMixin');

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
    console.log('clicked remove on item:', this.props.item.read().text);
    this.props.item.remove();
  }

});

module.exports = TodoListItemComponent;
