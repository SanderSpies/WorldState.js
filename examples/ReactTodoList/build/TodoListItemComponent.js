/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var WorldStateMixin = require('worldstate/src/Helpers/ReactWorldStateMixin');

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
    console.log('clicked remove on item:', this.props.item.read().text);
    this.props.item.remove();
  }

});

module.exports = TodoListItemComponent;
