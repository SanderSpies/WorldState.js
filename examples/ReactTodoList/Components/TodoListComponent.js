'use strict';

var React = require('react');
var WorldStateMixin = require('worldstate/Helpers/ReactWorldStateMixin');

var TodoListComponent = React.createClass({

  mixins: [WorldStateMixin],

  render: function() {
    var items = this.props.items;
    for (var i = 0, l = items.length; i < l; i++) {
      <TodoListItem item={items.at(i).read()} />
    }

    var list = <ul>
      {items}
    </ul>;
    return list;
  }

});

module.exports = TodoListComponent;
