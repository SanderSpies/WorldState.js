/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var WorldStateMixin = require('worldstate/src/Helpers/ReactWorldStateMixin');

var TodoActions = require('../Actions/TodoActions');

var TodoListItemComponent = React.createClass({

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

    var item = <li className={className}>
      <div className="view">
        <input ref="checkbox" onChange={this.onCheckBoxChange} type="checkbox" checked={i.isComplete} className="toggle" />
        <label onDoubleClick={this.onDoubleClick}>{i.text}</label>
        <button className="destroy" onClick={this.onDeleteClick}></button>
      </div>
      <input className="edit" ref="input" defaultValue={i.text} onKeyPress={this.onKeyPress} onBlur={this.onBlur}/>
    </li>;
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
