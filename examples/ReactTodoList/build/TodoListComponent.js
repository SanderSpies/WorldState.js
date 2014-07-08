/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var WorldStateMixin = require('worldstate/src/Helpers/ReactWorldStateMixin');

var TodoListItem = require('./TodoListItemComponent');

var TodoActions = require('../Actions/TodoActions');

var TodoListComponent = React.createClass({displayName: 'TodoListComponent',

  mixins: [WorldStateMixin],

  render: function() {
    var props = this.props;
    var items = props.items;
    var filter = props.filter;

    var todoComponents = [];
    var itemsRead = items.read();
    if (itemsRead) {
      var l = itemsRead.length;
      for (var i = 0; i < l; i++) {
        var item = items.at(i);
        var isComplete = item.read().isComplete;
        if (filter === 1 && isComplete) {
          continue;
        } else if (filter === 2 && !isComplete) {
          continue;
        }
        todoComponents[todoComponents.length] = TodoListItem( {key:item.generatedId(), item:item} );
      }

      var todoCount = items.where({isComplete:false}).length;
      var completed = items.length() - todoCount;
      console.log('items:', items.length());
      var completeBtn;
      if (completed > 0) {
        completeBtn = React.DOM.button( {onClick:this.onClearCompletedClick, id:"clear-completed"}, "Clear completed (",completed,")");
      }
    }
    var list = React.DOM.div(null, 

      React.DOM.header( {id:"header"}, 
     React.DOM.h1(null, "Todos"),
     React.DOM.input( {placeholder:"What needs to be done?", id:"new-todo", ref:"newTodo", onKeyPress:this._onKeyPress} ),
     React.DOM.section( {id:"main"}, 
      React.DOM.input( {readOnly:true, checked:todoCount === 0, ref:"checkbox", onChange:this.onAllChange, type:"checkbox", id:"toggle-all"} ),
      React.DOM.ul( {id:"todo-list"}, 
        todoComponents
      )
     ),
     React.DOM.footer( {id:"footer"}, 
       React.DOM.span( {id:"todo-count"}, 
        React.DOM.strong(null, todoCount, " " ),
        "items left"
       ),
       React.DOM.ul( {id:"filters"}, 
        React.DOM.li(null, React.DOM.a( {href:"#"}, "All " )),
        React.DOM.li(null, React.DOM.a( {href:"#Active"},  " Active " )),
        React.DOM.li(null, React.DOM.a( {href:"#Completed"}, "Completed"))
       ),
        completeBtn
     )
    )
    );
    return list;
  },

  _onKeyPress: function(e) {
    if (e.keyCode === 13) {
      var domNode = this.refs.newTodo.getDOMNode();
      TodoActions.addTodoItem({text: domNode.value});
      domNode.value = '';
    }
  },

  onAllChange: function() {
    TodoActions.updateAllTodoItems({checked: this.refs.checkbox.getDOMNode().checked});
  },

  onClearCompletedClick: function() {
    TodoActions.removeCompletedTodo();
  }

});

module.exports = TodoListComponent;
