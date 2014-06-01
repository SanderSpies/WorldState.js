/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var WorldStateMixin = require('worldstate/src/Helpers/ReactWorldStateMixin');

var TodoListItem = require('./TodoListItemComponent');


var TodoListComponent = React.createClass({

  mixins: [WorldStateMixin],

  render: function() {
    var items = this.props.items;
    var res = [];
    console.log('bla:', items.length());
    var l = items.read().length;
    for (var i = 0; i < l; i++) {
      res.push(<TodoListItem item={items.at(i)} />);
    }

    var list = <ul id="TodoList">
      {res}
    </ul>;

    return list;
  }

});

module.exports = TodoListComponent;
