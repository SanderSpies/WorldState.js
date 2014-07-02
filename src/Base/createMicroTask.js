require('setimmediate');

function createMicroTask(fn, context, beforeFn) {
  if (typeof window !== 'undefined' && 'Promise' in window) {
    var self = this;
    (new Promise(function(resolve) {
      if (beforeFn) {
        beforeFn.call(context);
      }

      resolve();})).then(function(){
        fn.call(context);
      });
  }
  else {
    if (beforeFn) {
      beforeFn.call(context);
    }

    setImmediate(function(){
      fn.call(context);
    });
  }
}

module.exports = createMicroTask;
