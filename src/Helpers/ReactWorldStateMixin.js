'use strict';


/**
 *
 * @type {{shouldComponentUpdate: shouldComponentUpdate}}
 */
var ReactWorldStateMixin = {
  __oldProp: {},

  /**
   * @param {{}} nextProps
   * @return {boolean}
   * @this {ReactComponent}
   */
  shouldComponentUpdate: function(nextProps) {
    for (var key in nextProps) {
      if (!nextProps.hasOwnProperty(key) || !nextProps[key].read) {
        continue;
      }
      var nextPropKey = nextProps[key].read();
      if (!this.__oldProp[key]) {
        this.__oldProp[key] = nextPropKey;
        return true;
      }
      else {
        if (this.__oldProp[key] !== nextPropKey) {
          this.__oldProp[key] = nextPropKey;
          return true;
        }
      }
    }
    return false;
  },

  // do NOT remove this!
  componentDidMount: function() {
    this.__oldProp = {};
    var nextProps = this.props;
    for (var key in nextProps) {
      if (!nextProps.hasOwnProperty(key) || !nextProps[key].read) {
        continue;
      }
      var nextPropKey = nextProps[key].read();
      this.__oldProp[key] = nextPropKey;
    }
  }
};

module.exports = ReactWorldStateMixin;
