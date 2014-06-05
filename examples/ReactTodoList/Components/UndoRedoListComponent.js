/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var UndoRedoListComponent = React.createClass({

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
      return <div />;
    }
    var lis = [];
    for (var i = 0, l = versions.length; i < l; i++) {
      var version = versions[i];
      lis[i] = <div onClick={this.restore} data-position={i}>{version.name}</div>;
    }

    return <aside className="UndoRedoList">
        <ul>
          {lis}
        </ul>
      </aside>;
  }

});

module.exports = UndoRedoListComponent;
