/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var UndoRedoListComponent = React.createClass({displayName: 'UndoRedoListComponent',

  restore: function(e) {
    var position = e.target.dataset.position;
    var version = this.props.items.getVersions()[position];
    this.props.items.restoreVersion(version);
    this.props.items.__private.graph.__changed();
  },

  render: function() {
    var props = this.props;
    var versions = props.items.getVersions();
    if(!versions){
      return React.DOM.div(null );
    }
    var lis = [];
    for (var i = 0, l = versions.length; i < l; i++) {
      var version = versions[i];
      lis[i] = React.DOM.div( {onClick:this.restore, 'data-position':i}, version.name);
    }

    return React.DOM.aside( {className:"UndoRedoList"}, 
        React.DOM.ul(null, 
          lis
        )
      );
  }

});

module.exports = UndoRedoListComponent;
