'use strict';

var React = require('react');
var WorldStateMixin = require('worldstate/Helpers/ReactWorldStateMixin');

var TodoListItemComponent = React.createClass({

  mixins: [WorldStateMixin],

  render: function() {
    var item = <li></li>;
    return item;
  }

});

module.exports = TodoListItemComponent;
