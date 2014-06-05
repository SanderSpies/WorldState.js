/**
 * @jsx React.DOM
 */
'use strict';

var clone = require('worldstate/src/Base/clone')
var React = require('react');

var UndoRedoListComponent = React.createClass({

  restore: function(e) {
    var position = e.target.dataset.position;
    var version = this.props.items.getVersions()[position];
    this.props.items.restoreVersion(version);
  },

  render: function() {
    var props = this.props;
    var versions = props.items.getVersions();
    if (!versions) {
      return <div />;
    }
    var lis = [];
    for (var i = 0, l = versions.length; i < l; i++) {
      var version = versions[i];
      lis[i] = <li onClick={this.restore} data-position={i}>{version.name}</li>;
    }

    return <aside className="UndoRedoList">
        <h1>Restore a different version:</h1>

        <ul>
          {lis}
        </ul>
      </aside>;
  }

});

module.exports = UndoRedoListComponent;
