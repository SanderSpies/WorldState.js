/**
 * @jsx React.DOM
 */
'use strict';

var clone = require('worldstate/src/Base/clone')
var React = require('react');

var UndoRedoListComponent = React.createClass({displayName: 'UndoRedoListComponent',



  restore: function(e) {
    var position = e.target.dataset.position;
    var version = this.props.items.getVersions()[position];
    this.props.items.restoreVersion(version);
  },

  render: function() {
    var props = this.props;
    var versions = props.items.getVersions();
    if (!versions) {
      return React.DOM.div(null );
    }
    var lis = [];
    for (var i = 0, l = versions.length; i < l; i++) {
      var version = versions[i];
      lis[i] = React.DOM.li( {key:i, onClick:this.restore, 'data-position':i}, version.name);
    }
    return React.DOM.aside( {className:"UndoRedoList"}, 
        React.DOM.h1(null, "Restore a different version:"),
        React.DOM.ul(null, 
          lis
        )
      );
  }

});

module.exports = UndoRedoListComponent;
