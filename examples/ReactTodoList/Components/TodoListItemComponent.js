'use strict';

var React = require('react');
var WorldStateMixin = require('worldstate/Helpers/ReactWorldStateMixin');

var TodoListItemComponent = React.createClass({

  mixins: [WorldStateMixin],

  render: function() {
    var props = this.props;
    var item = <li onClick={this.onClick}>
      {props.text}
    </li>;
    return item;
  },

  onClick: function() {
    console.log('CLICK')
  }

});

module.exports = TodoListItemComponent;
