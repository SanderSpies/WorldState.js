/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var WorldStateMixin = require('worldstate/src/Helpers/ReactWorldStateMixin');

var CommandKeys = require('../Commands/CommandKeys');
var CommandRegistry = require('../Commands/CommandRegistry');
require('../Commands/RemoveTodoItemCommand');


var TodoListItemComponent = React.createClass({displayName: 'TodoListItemComponent',

  mixins: [WorldStateMixin],

  render: function() {
    var props = this.props;
    var i = props.item.read();
    var item = React.DOM.li(null, 
      React.DOM.div( {className:"view"}, 
        React.DOM.input( {type:"checkbox", className:"toggle"} ),
        React.DOM.label(null, i.text),
        React.DOM.button( {className:"destroy", onClick:this.onDeleteClick})
      ),
      React.DOM.input( {className:"edit"} )
    );
    return item;
  },

  onDeleteClick: function() {
    CommandRegistry.executeCommand(CommandKeys.RemoveTodoItem, {item: this.props.item});
  }

});

module.exports = TodoListItemComponent;
