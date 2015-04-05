# mkc
JavaScript Multi-Key LRU Cache

## Overview

mkc is a node package that implements a multi-key LRU cache. It uses
[lru-cache](https://github.com/isaacs/node-lru-cache) under the hood but adds
functionality for handling mutli-keys and batch cache eviction (purging).

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

// Returns: [ { name: 'one' }, { name: 'two' } ]
cache.get({ key1: 'alpha' });

// Removes all entries with key1 === 'alpha'
cache.purge({ key1: 'alpha' });
```

## Documentation

Coming soon.

## License

MIT
