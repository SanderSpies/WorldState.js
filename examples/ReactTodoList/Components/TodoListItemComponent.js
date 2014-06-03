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
    var item = <li onClick={this.onClick}>
      <div className="view">
        <input type="checkbox" className="toggle" />
        <label>{i.text}</label>
      </div>
      <input className="edit" />
    </li>;
    return item;
  },

  onClick: function() {
    console.log('CLICK')
  }

});

module.exports = TodoListItemComponent;
