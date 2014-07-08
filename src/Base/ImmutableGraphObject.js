'use strict';

require('setimmediate');

/* @type {ReferenceRegistry} */
var ReferenceRegistry = require('./ReferenceRegistry');
var EdgeRegistry = require('./EdgeRegistry');

var clone = require('./clone');
var createMicroTask = require('./createMicroTask');
var removeReference = ReferenceRegistry.removeReference;
var resolveObject = ReferenceRegistry.resolveObject;

var getReferenceTo = ReferenceRegistry.getReferenceTo;
var isArray = Array.isArray;
var counterAggregate = 0;
var waitingPromise = null;


/**
 * Bundle all child changes into one
 *
 * @param {ImmutableGraphObject} self
 * @param {function} fn
 * @this {ImmutableGraphObject}
 */
function aggregrateChangedChildrenWithPromises(self, fn) {
  var __private = self.__private;
  var localCounterAggregate = counterAggregate;

  __private.currentChildAggregation = (new Promise(function(resolve) {
    localCounterAggregate = counterAggregate++;
    __private.isBusy = true;
    resolve();
  }))
    .then(function() {
      if (localCounterAggregate === 0) {
        fn.call(self);
      }
      else if (waitingPromise) {
        waitingPromise.call(self);
        waitingPromise = null;
      }
    })
    .catch(function(e) {
      console.log('Should not happen (please report to https://github.com/SanderSpies/WorldState.js/issues):', e);
    });
}

function aggregrateChangedChildrenWithSetImmediate(self, fn) {
  var __private = self.__private;
  if (__private.currentChildAggregation) {
    clearImmediate(__private.currentChildAggregation);
  }
  __private.isBusy = true;
  __private.currentChildAggregation = setImmediate(fn);
}

var aggregateChangedChildren;
if (typeof window !== 'undefined' && 'Promise' in window) {
  aggregateChangedChildren = aggregrateChangedChildrenWithPromises;
}
else {
  aggregateChangedChildren = aggregrateChangedChildrenWithSetImmediate;
}


/**
 * Update the children's parent keys
 *
 * @param {ImmutableGraphObject} self
 */
function updateChildrenParentKeys(self) {
  var __private = self.__private;
  var refToObjRef = __private.refToObj.ref;

  for (var i = 0, l = refToObjRef.length; i < l; i++) {
    var parents = getImmutableObject(refToObjRef[i].ref).__private.parents;
    for (var j = 0, l2 = parents.length; j < l2; j++) {
      var parent = parents[j];
      if (parent.parent === self) {
        parent.parentKey = i;
        break;
      }
    }
  }
}

/**
 * ImmutableGraphObject
 *
 * @lends {ImmutableGraphObject}
 * @param {{}} obj
 * @constructor
 */
var ImmutableGraphObject = function ImmutableGraphObject(obj) {
  if (!mergeWithExistingImmutableObject) {
    var ImmutableGraphRegistry = require('./ImmutableGraphRegistry');
    mergeWithExistingImmutableObject =
        ImmutableGraphRegistry.mergeWithExistingImmutableObject;
    setReferences = ImmutableGraphRegistry.setReferences;
    getImmutableObject = ImmutableGraphRegistry.getImmutableObject;
    removeImmutableGraphObject =
        ImmutableGraphRegistry.removeImmutableGraphObject;
    changeReferenceId = ImmutableGraphRegistry.changeReferenceId;
    restoreReferences = ImmutableGraphRegistry.restoreReferences;
  }

  this.__private = {
    refToObj: null,
    parents: [],
    saveHistory: false,
    historyRefs: [],
    changeListeners: [],
    changedKeys: {},
    removeKeys: [],
    currentChildAggregation: null,
    currentChildEvent: null
  };

  this.changeReferenceTo(obj);
};

var getImmutableObject;
var mergeWithExistingImmutableObject;
var setReferences;
var removeImmutableGraphObject;
var changeReferenceId;
var restoreReferences;

ImmutableGraphObject.prototype = {

  __private: {
    isBusy: false,
    refToObj: null,
    parents: [],
    saveHistory: false,
    historyRefs: [],
    changeListeners: [],
    changedKeys: {},
    removeKeys: [],
    currentChildAggregation: null,
    currentChildEvent: null
  },

  /**
   * Executes once after the current actions, like insert and
   * changeValueTo, have completed
   *
   * @param {function} fn
   */
  afterChange: function(fn) {
    var __private = this.__private;
    var changeListeners = __private.changeListeners;
    changeListeners[changeListeners.length] = {
      fn: fn,
      once: true
    };
  },

  addChangeListener: function(fn, context) {
    var __private = this.__private;
    var changeListeners = __private.changeListeners;
    changeListeners[changeListeners.length] = {
      fn: fn,
      context: context,
      once: false
    };
  },

  /**
   * Enable versioning for this graph object
   */
  enableVersioning: function() {
    var __private = this.__private;
    __private.saveHistory = true;
  },

  /**
   * Save current version
   *
   * @param {string} name
   * @param {boolean} delayed
   */
  saveVersion: function(name, delayed) {
    var __private = this.__private;
    var historyRefs = __private.historyRefs;

    function setHistory() {
      historyRefs[historyRefs.length] = {
        name: name,
        ref: clone(__private.refToObj.ref)
      };
    }

    if (!delayed) {
      setHistory();
    }
    else {
      setImmediate(setHistory);
    }
  },

  /**
   * Get the stored versions of this graph object
   *
   * @return {[{ref:{}}]}
   */
  getVersions: function() {
    return this.__private.historyRefs;
  },

  /**
   * Restore the given version of the graph
   *
   * @param {{ref:{}}} version
   */
  restoreVersion: function(version) {
    var __private = this.__private;
    var oldRefToObj = __private.refToObj;
    var newRefToObj = getReferenceTo(version.ref);

    restoreReferences(oldRefToObj, newRefToObj, true);
    this.__changed();
  },

  /**
   * Change the reference (pointing to a different memory address)
   *
   * @param {{ref:{}}} newObj
   */
  changeReferenceTo: function(newObj) {
    var __private = this.__private;
    var oldRefToObj = __private.refToObj;
    var oldRef;
    if (oldRefToObj) {
      oldRef = oldRefToObj.ref;
    }

    var resolvedObject = resolveObject(newObj);
    __private.refToObj = resolvedObject;
    mergeWithExistingImmutableObject(this);
    if (oldRef) {
      changeReferenceId(this, resolvedObject.ref.__worldStateUniqueId,
        oldRef.__worldStateUniqueId);
    }

    if (oldRef) {
      removeReference(oldRef);
    }
    this.__changed();
  },

  /**
   * Change the value (changing the value of the memory address)
   *
   * @param {{}} newValue
   */
  changeValueTo: function(newValue) {
    var self = this;
    //createMicroTask(function(){
      var __private = self.__private;
      var oldRefToObj = __private.refToObj;
      var oldRef = oldRefToObj.ref;
      var newRefToObj = clone(resolveObject(newValue));
      setReferences(__private.refToObj, newRefToObj.ref);
      removeReference(oldRef);
      self.__changed();
    //});
  },

  /**
   * Get a wrapped object
   *
   * @return {{}}
   */
  wrapped: function() {
    var __private = this.__private;
    var refToObjRef = __private.refToObj.ref;

    var wrap = {};
    var keys = Object.keys(refToObjRef);
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      if (refToObjRef.hasOwnProperty(key)) {
        var value = refToObjRef[key];
        if (typeof value === 'object') {
          wrap[key] = getImmutableObject(value.ref, this, key);
        }
      }
    }

    return wrap;
  },

  /**
   * Get the current object
   *
   * @return {{}}
   */
  read: function() {
    return this.__private.refToObj.ref;
  },

  /**
   * To inform that the graph has changed
   *
   * @param {{parents:{}}} opt
   * @private
   */
  __changed: function(opt) {
    var self = this;
    var __private = self.__private;
    var parents = opt && opt.parents ? opt.parents : __private.parents;
    var refToObj = __private.refToObj;
    var i;
    var l;

    if (parents) {
      for (i = 0, l = parents.length; i < l; i++) {
        var parent = parents[i];
        parent.parent.__childChanged(parent.parentKey, refToObj);
      }
    }

    // inform incoming edges of changes
    if (self.getIncomingEdges) {
      var incomingEdges = self.getIncomingEdges();
      if (incomingEdges) {
        for (i = 0, l = incomingEdges.length; i < l; i++) {
          incomingEdges[i].origin.__changed();
        }
      }
    }

    self.__informChangeListeners();
  },

  /**
   * Gets executed to perform all the child changes at once
   *
   * @private
   */
  __aggregateChangedChildren: function() {
    var __private = this.__private;
    var self = this;
    var refToObj = __private.refToObj;

    ReferenceRegistry.removeReference(refToObj.ref);

    var newRefToObj = {ref: clone(refToObj.ref)};
    var newRefToObjRef = newRefToObj.ref;
    var removeKeys = __private.removeKeys;

    var i;
    var l;
    for (i = 0, l = removeKeys.length; i < l; i++) {
      var removeKey = removeKeys[i];
      newRefToObjRef.splice(removeKey, 1);
    }

    __private.removeKeys = [];

    var changedKeys = __private.changedKeys;
    var keys = Object.keys(changedKeys);
    for (i = 0, l = keys.length; i < l; i++) {
      var changeKey = keys[i];
      var value = changedKeys[changeKey];
      newRefToObjRef[changeKey] = value;
    }
    __private.changedKeys = {};
    setReferences(__private.refToObj, newRefToObjRef);
    self.__changed();
    if (isArray(newRefToObjRef)) {
      updateChildrenParentKeys(self);
    }
  },

  __informChangeListeners: function() {
    var __private = this.__private;
    var changeListeners = __private.changeListeners;

    if (changeListeners.length) {
      __private.isBusy = false;
      __private.currentChildEvent =
        waitingPromise = function() {
          createMicroTask(function() {
            if (!__private.isBusy) {
              for (var i = 0, l = changeListeners.length; i < l; i++) {
                var changeListener = changeListeners[i];
                changeListener.fn.call(changeListener.context);
                if (changeListener.once) {
                  changeListeners.splice(i, 1);
                }
              }
            }
          });
        };
      var self = this;
      createMicroTask(function() {
        if (waitingPromise) {
          waitingPromise.call(self);
          waitingPromise = null;
        }
      });
    }
  },

  /**
   * Performed when a child has changed.
   *
   * @param {string} key
   * @param {ImmutableGraphObject|ImmutableGraphArray} newValue
   * @private
   */
  __childChanged: function(key, newValue) {
    var __private = this.__private;
    var refToObj = __private.refToObj;
    var removeKeys = __private.removeKeys;
    var changedKeys = __private.changedKeys;

    if (!newValue && isArray(refToObj.ref)) {
      removeKeys[removeKeys.length] = key;
    }
    else {
      changedKeys[key] = newValue;
    }

    var self = this;
    aggregateChangedChildren(this, function() {
      counterAggregate = 0;
      __private.currentChildAggregation = null;
      __private.isBusy = false;

      self.__aggregateChangedChildren();
    });
  },

  /**
   * Remove this graph object
   */
  remove: function() {
    var self = this;
    createMicroTask(function() {
      var __private = self.__private;
      var refToObj = __private.refToObj;
      var refToObjRef = refToObj.ref;
      removeReference(refToObjRef);
      var parents = __private.parents;
      require('./ImmutableGraphRegistry').removeImmutableGraphObject(refToObj);
      if (isArray(refToObjRef)) {
        refToObj.ref = [];
      }

      self.__changed({parents: parents});
    });
  },

  /**
   * Get the WorldState.js generated id
   *
   * @return {number}
   */
  generatedId: function() {
    return this.__private.refToObj.ref.__worldStateUniqueId;
  },

  /**
   * Change one or more properties of this object
   *
   * @param {{}} newProperties
   */
  changePropertiesTo: function(newProperties) {
    var self = this;
    createMicroTask(function(){
      var __private = self.__private;
      var newValue = clone(__private.refToObj.ref);
      for (var key in newProperties) {
        if (newProperties.hasOwnProperty(key)) {
          newValue[key] = newProperties[key];
        }
      }
      self.changeValueTo(newValue);
    });
  },

  /**
   * Add an edge to another object
   *
   * @param
   */
  addEdgeTo: function(topic, otherObject) {
    EdgeRegistry.addEdge(topic, this, otherObject);
  },

  /**
   * Remove an edge
   *
   * @param
   */
  removeEdgeTo: function(topic, otherObject) {
    EdgeRegistry.removeEdge(topic, this, otherObject);
  },

  /**
   * Get edges that originate from this object
   *
   */
  getOutgoingEdges: function() {
    return EdgeRegistry.getOutgoingEdges(this);
  },

  /**
   * Get edges that end up at this object
   */
  getIncomingEdges: function() {
    return EdgeRegistry.getIncomingEdges(this);
  }

};

module.exports = ImmutableGraphObject;
