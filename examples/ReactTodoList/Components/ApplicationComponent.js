'use strict';

var React = require('react');
var WorldStateMixin = require('worldstate/Helpers/ReactWorldStateMixin');

var TodoList = require('../Graph/TodoList');
var todoList = TodoList.newInstance();

var ApplicationComponent = React.createClass({

  mixins: [WorldStateMixin],

  render: function() {
    return <TodoList items={todoList.items()} />
  }

});

module.exports = ApplicationComponent;
