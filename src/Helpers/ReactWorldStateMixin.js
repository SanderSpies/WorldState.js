'use strict';

var ReactWorldStateMixin = {

  shouldComponentUpdate: function(nextProps) {
    for (var key in nextProps) {
      if (!nextProps.hasOwnProperty(key)) {
        continue;
      }
      var __oldProps = this.__oldProps;
      if (!__oldProps) {
        this.__oldProps = {};
      }
      var nextProp = nextProps[key].read();
      if (__oldProps[key] !== nextProp) {
        __oldProps[key] = nextProp;
        return true;
      }
    }

    return false;
  }
};

module.exports = ReactWorldStateMixin;
