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
    var item = React.DOM.li( {onClick:this.onClick}, 
      React.DOM.div( {className:"view"}, 
        React.DOM.input( {type:"checkbox", className:"toggle"} ),
        React.DOM.label(null, i.text)
      ),
      React.DOM.input( {className:"edit"} )
    );
    return item;
  },

  onClick: function() {
    console.log('CLICK')
  }

});

module.exports = TodoListItemComponent;
