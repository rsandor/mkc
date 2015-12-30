'use strict';

var stringify = require('json-stable-stringify');
var LRU = require('lru-cache');

/**
 * @module mkc
 * @author Ryan Sandor Richards
 */
module.exports = MultiKeyCache;

/**
 * Multi-Key LRU cache.
 * @class
 * @param {object} options Options for the cache.
 */
function MultiKeyCache(options) {
  options = options || {};

  var self = this;
  var dispose = options.dispose;

  options.dispose = function (key, value) {
    self._dispose(key);
    if (dispose) { dispose(key, value); }
  };

  this.cache = new LRU(options);
  this._keyMap = {};
}

/**
 * Hashes a set of key values into a single key.
 * @param {object} keyValues Key values to hash.
 * @return {string} The hash string for the set of key values.
 */
function hash(keyValues) {
  return stringify(keyValues);
}

/**
 * Parses a hashed key value set.
 * @param {string} key Key to parse.
 * @return {object} Set of key values represented by the key.
 */
function parse(key) {
  return JSON.parse(key);
}

/**
 * Removes mappings when objects are disposed by the LRU.
 * @param {string} keyHash Key hash for the disposed object.
 */
MultiKeyCache.prototype._dispose = function (keyHash) {
  var keyValues = parse(keyHash);
  for (var key in keyValues) {
    var value = keyValues[key];
    if (!this._keyMap[key]) {
      continue;
    }
    if (!Array.isArray(this._keyMap[key][value])) {
      continue;
    }
    var map = this._keyMap[key][value];
    var index = map.indexOf(keyHash);
    if (~index) {
      map.splice(index, 1);
    }
    if (map.length === 0) {
      delete this._keyMap[key][value];
    }
  }
};

/**
 * Puts an object into the cache with the given key values.
 * @param {object} keyValues Key values that identify the object in the cache.
 * @param object Object to store in the cache.
 */
MultiKeyCache.prototype.set = function (keyValues, object) {
  var keyHash = hash(keyValues);

  for (var key in keyValues) {
    var value = keyValues[key];
    if (!this._keyMap[key]) {
      this._keyMap[key] = {};
    }
    if (!this._keyMap[key][value]) {
      this._keyMap[key][value] = [];
    }
    this._keyMap[key][value].push(keyHash);
  }

  this.cache.set(keyHash, object);
};

/**
 * Gets and object from the cache with the given key values.
 * @param {Object} keyValues Key values that identify the object in the cache.
 * @return If found, the object with the given key values. `undefined`
 *   otherwise.
 */
MultiKeyCache.prototype.get = function (keyValues) {
  var keyHash = hash(keyValues);
  return this.cache.get(keyHash);
};

/**
 * Determines if an object exists in the cache for the given key values.
 * @param {Object} keyValues Key values that identify the object in the cache.
 * @return {Boolean} `true` if found, `false` otherwise.
 */
MultiKeyCache.prototype.has = function (keyValues) {
  var keyHash = hash(keyValues);
  return this.cache.has(keyHash);
};

/**
 * Removes all objects with the given key values.
 *
 * @example
 * // Add two objects
 * cache.set({ type: 'string', id: 1 }, 'one');
 * cache.set({ type: 'number', id: 1 }, 1);
 *
 * // Remove only objects with the key `type === 'string'`
 * // (only the object with type number will remain...)
 * cache.purge({ type: 'string' });
 *
 * @param {Object} keyValues Key values to identify the objects to remove.
 */
MultiKeyCache.prototype.purge = function (keyValues) {
  var delKeyHashSet = {};

  for (var key in keyValues) {
    var value = keyValues[key];

    if (!this._keyMap[key]) {
      continue;
    }
    if (!Array.isArray(this._keyMap[key][value])) {
      continue;
    }

    var map = this._keyMap[key][value];
    for (var i = 0; i < map.length; i++) {
      delKeyHashSet[map[i]] = true;
    }
  }

  for (var keyHash in delKeyHashSet) {
    this.cache.del(keyHash);
  }
};

/**
 * Clears the entire cache.
 */
MultiKeyCache.prototype.reset = function () {
  this.cache.reset();
  this._keyMap = {};
};

/**
 * Reports the number of items in the multi-key cache.
 * @return The number of items in the cache.
 */
MultiKeyCache.prototype.itemCount = function () {
  return this.cache.itemCount;
};

/**
 * Reports the total length of the items in the multi-key cache.
 * @return The length of the items in the cache.
 */
MultiKeyCache.prototype.length = function () {
  return this.cache.length;
};
