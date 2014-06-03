/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var WorldStateMixin = require('worldstate/src/Helpers/ReactWorldStateMixin');

var TodoListItem = require('./TodoListItemComponent');


var TodoListComponent = React.createClass({displayName: 'TodoListComponent',

  mixins: [WorldStateMixin],

  render: function() {
    var items = this.props.items;
    var res = [];
    var l = items.read().length;
    for (var i = 0; i < l; i++) {
      res.push(TodoListItem( {key:i, item:items.at(i)} ));
    }

    var list = React.DOM.div(null, 

      React.DOM.header( {id:"header"}, 
     React.DOM.h1(null, "Todos"),
     React.DOM.input( {placeholder:"What needs to be done?", id:"new-todo"} ),
     React.DOM.section( {id:"main"}, 
      React.DOM.input( {readOnly:true, checked:"checked", type:"checkbox", id:"toggle-all"} ),
      React.DOM.ul( {id:"todo-list"}, 
        res
      )
     ),
     React.DOM.footer( {id:"footer"}, 
       React.DOM.span( {id:"todo-count"}
       ),
       React.DOM.ul( {id:"filters"}, 
        React.DOM.li(null),
        React.DOM.li(null),
        React.DOM.li(null)
       )
     )
    )
    );

    return list;
  }

});

module.exports = TodoListComponent;
