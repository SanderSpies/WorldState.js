'use strict';

var React = require('react');
var WorldStateMixin = require('worldstate/Helpers/ReactWorldStateMixin');

var TodoList = require('../Graph/TodoList');
var todoList = TodoList.newInstance({
  items: []
});

var ApplicationComponent = React.createClass({

  mixins: [WorldStateMixin],

  render: function() {
    var todoList = this.props.todoList;
    return <TodoList items={todoList.items()} />;
  }

});

todoList.afterChange(function(){
  React.renderComponent(<ApplicationComponent todoList={todoList} />);
});

React.renderComponent(<ApplicationComponent todoList={todoList} />);

module.exports = ApplicationComponent;
