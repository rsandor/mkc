# mkc

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

// Removes all entries with key1 === 'alpha'
cache.purge({ key1: 'alpha' });
```

## Documentation

### new MultiKeyCache( [options] )
Creates a new multi-key cache with the given options. The options should follow
the same format given to the [lru-cache](https://github.com/isaacs/node-lru-cache)
constructor.

##### Example
```js
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

### .reset()
Clears the entire cache.

## License

MIT
