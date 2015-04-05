# mkc
JavaScript Multi-Key LRU Cache

## Overview

mkc is a node package that implements a multi-key LRU cache. Usage is pretty
straight forward, here's an example:

```js
// Require the library
var mkc = require('mkc');

// Create a new cache of size 4
var cache = mkc({ size: 4 });

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
