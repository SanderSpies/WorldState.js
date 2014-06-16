/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var WorldStateMixin = require('worldstate/src/Helpers/ReactWorldStateMixin');

var TodoActions = require('../Actions/TodoActions');

var TodoListItemComponent = React.createClass({displayName: 'TodoListItemComponent',

  mixins: [WorldStateMixin],

  render: function() {
    var props = this.props;
    var i = props.item.read();

    var className = '';
    if (i.isComplete) {
      className = 'completed'
    }
    else if (i.editMode) {
      className = 'editing';
    }

    var item = React.DOM.li( {className:className}, 
      React.DOM.div( {className:"view"}, 
        React.DOM.input( {ref:"checkbox", onChange:this.onCheckBoxChange, type:"checkbox", checked:i.isComplete, className:"toggle"} ),
        React.DOM.label( {onDoubleClick:this.onDoubleClick}, i.text),
        React.DOM.button( {className:"destroy", onClick:this.onDeleteClick})
      ),
      React.DOM.input( {className:"edit", ref:"input", defaultValue:i.text, onKeyPress:this.onKeyPress, onBlur:this.onBlur})
    );
    return item;
  },

  onDeleteClick: function() {
    TodoActions.removeTodoItem({item: this.props.item});
    this.delete = true;
  },

  onDoubleClick: function() {
    if (!this.delete) {
      TodoActions.toggleEditMode({item: this.props.item});
    }
  },

  onKeyPress:function(e){
    if(e.keyCode === 13) {
      this.onBlur();
    }
  },

  onBlur:function() {
    TodoActions.toggleEditMode({item: this.props.item});
    TodoActions.updateTodoItem({item: this.props.item,
        text: this.refs.input.getDOMNode().value});
  },

  onCheckBoxChange: function() {
    TodoActions.updateTodoItem({item: this.props.item,
        isComplete: this.refs.checkbox.getDOMNode().checked});
  },

  componentDidUpdate: function() {
    var props = this.props;
    var i = props.item.read();
    if (i.editMode) {
      this.refs.input.getDOMNode().focus();
    }
  }

});

module.exports = TodoListItemComponent;
