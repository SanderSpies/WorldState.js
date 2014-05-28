'use strict';


/**
 *
 * @type {{shouldComponentUpdate: shouldComponentUpdate}}
 */
var ReactWorldStateMixin = {

  /**
   * @param {{}} nextProps
   * @return {boolean}
   * @this {ReactComponent}
   */
  shouldComponentUpdate: function(nextProps) {
    for (var key in nextProps) {
      if (!nextProps.hasOwnProperty(key)) {
        continue;
      }
      var oldProp = this.props[key].read();
      var nextProp = nextProps[key].read();
      if (oldProp !== nextProp) {
        return true;
      }
    }

    return false;
  }
};

module.exports = ReactWorldStateMixin;
