# mkc
![Build Status](https://travis-ci.org/rsandor/mkc.svg?branch=master)
[![Dependency Status](https://david-dm.org/rsandor/mkc.svg)](https://david-dm.org/rsandor/mkc)
[![devDependency Status](https://david-dm.org/rsandor/mkc/dev-status.svg)](https://david-dm.org/rsandor/mkc#info=devDependencies)

[![NPM](https://nodei.co/npm/mkc.png?compact=true)](https://nodei.co/npm/mkc)

Node implementation of a multi-key LRU cache. It uses
[lru-cache](https://github.com/isaacs/node-lru-cache) under the hood and adds
functionality for handling mutli-keys puts and batch cache eviction (purging).

## Usage

```js
// Require the library
var MultiKeyCache = require('mkc');

// Create a new cache
var cache = new MultiKeyCache({ max: 4 });

// Add a few entries to the cache
cache.set({ key1: 'alpha', key2: 'one' }, { name: 'one' });
cache.set({ key1: 'alpha', key2: 'two' }, { name: 'two' });
cache.set({ key1: 'beta', key2: 'one' }, { name: 'one' });

// Returns: { name: 'two' }
cache.get({ key1: 'alpha', key2: 'two' });

// Removes all entries with key1 === 'alpha'
cache.purge({ key1: 'alpha' });
```

## Documentation

### new MultiKeyCache( [options] )
Creates a new multi-key cache with the given options. The options should follow
the same format given to the [lru-cache](https://github.com/isaacs/node-lru-cache)
constructor.

```js
// Create a Multi-key LRU Cache that accepts strings and only holds 1024
// characters at maximum.
var myCache = new MultiKeyCache({
  max: 1024,
  length: function (string) {
    return string.length;
  }
});
```

### .set(keyValues, object)
Puts an object into the cache with the given key values.

### .get(keyValues)
Gets and object from the cache with the given key values.

### .purge(keyValues)
Removes all objects with the given key values.

```js
// Add a few objects...
cache.set({a: 1, b: 1}, '1-1');
cache.set({a: 1, b: 2}, '1-2');
cache.set({a: 1, b: 3}, '1-3');
cache.set({a: 2, b: 1}, '2-1');

// Removes everything except '2-1'
cache.purge({ a: 1 });
```

### .reset()
Clears the entire cache.


## Developing
To run tests simply execute `npm test` on the command line. You can also build
the jsdocs for the project using `npm run doc`.

## License

MIT
