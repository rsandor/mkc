'use strict';

var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var beforeEach = lab.beforeEach;
var expect = require('code').expect;

var MultiKeyCache = require('../index');

describe('mkc', function () {
  describe('interface', function () {
    var cache = new MultiKeyCache();

    it('should expose a `set` method', function (done) {
      expect(cache.set).to.exist();
      expect(typeof cache.set).to.equal('function');
      done();
    });

    it('should expose a `get` method', function (done) {
      expect(cache.get).to.exist();
      expect(typeof cache.get).to.equal('function');
      done();
    });

    it('should expose a `has` method', function (done) {
      expect(cache.has).to.exist();
      expect(typeof cache.has).to.equal('function');
      done();
    });

    it('should expose a `purge` method', function (done) {
      expect(cache.purge).to.exist();
      expect(typeof cache.purge).to.equal('function');
      done();
    });

    it('should expose a `reset` method', function (done) {
      expect(cache.reset).to.exist();
      expect(typeof cache.reset).to.equal('function');
      done();
    });

    it('should expose a `itemCount` method', function(done) {
      expect(cache.itemCount).to.be.a.function();
      expect(cache.itemCount()).to.equal(0);
      done();
    });

    it('should expose a `length` method', function(done) {
      expect(cache.length).to.be.a.function();
      expect(cache.length()).to.equal(0);
      done();
    });
  }); // end 'interface'

  describe('behaviors', function () {
    var cache;

    beforeEach(function (done) {
      cache = new MultiKeyCache();
      done();
    });

    it('should not find values that are not in the cache', function (done) {
      expect(cache.get({})).to.not.exist();
      expect(cache.get({anything: 'anything'})).to.not.exist();
      done();
    });

    it('should set and get values', function (done) {
      var keyValuesOne = { k1: 'a', k2: 'one' };
      var keyValuesTwo = { k1: 'b', k2: 'one' };
      var keyValuesThree = { k1: 'c' };
      var objectOne = 'one';
      var objectTwo = 'two';
      var objectThree = 'three';

      cache.set(keyValuesOne, objectOne);
      cache.set(keyValuesTwo, objectTwo);
      cache.set(keyValuesThree, objectThree);

      expect(cache.get(keyValuesOne)).to.equal(objectOne);
      expect(cache.get(keyValuesTwo)).to.equal(objectTwo);
      expect(cache.get(keyValuesThree)).to.equal(objectThree);

      done();
    });

    it('should get and set values with keys in different orders', function (done) {
      var keyValuesA = { k1: 'a', k2: 'b' };
      var keyValuesB = { k2: 'b', k1: 'a' };
      var valueA = { alpha: 'beta', gamma: 'delta' };

      cache.set(keyValuesA, valueA);
      var valueB = cache.get(keyValuesB);
      expect(valueA).to.equal(valueB);

      done();
    });

    it('reset the cache', function (done) {
      var keyValues = { a: 'a'};
      cache.set(keyValues, 'example');
      cache.reset();
      expect(cache.get(keyValues)).to.not.exist();
      done();
    });

    it('should purge values', function (done) {
      cache.set({ a: '1', b: '1' }, '1-1');
      cache.set({ a: '1', b: '2' }, '1-2');
      cache.set({ a: '1', b: '3' }, '1-3');
      cache.set({ a: '2', b: '1' }, '2-1');
      cache.set({ a: '2', b: '2' }, '2-2');

      cache.purge({ a: '1' });

      ['1', '2', '3'].forEach(function (n) {
        expect(cache.get({ a: '1', b: n })).to.not.exist();
      });

      done();
    });

    it('should report when items are in the cache', function (done) {
      var hasKey = { a: '1', b: '1' };
      var hasNotKey = { a: '1', b: '2' };
      cache.set(hasKey, '1-1');
      expect(cache.has(hasKey)).to.be.true();
      expect(cache.has(hasNotKey)).to.be.false();
      done();
    });

    it('should gracefully handle invalid purges', function (done) {
      cache.purge({ b: 47 });
      cache.set({ a: 12 });
      cache.purge({ a: 13 });
      done();
    });
  }); // end 'behaviors'

  describe('lru', function () {
    it('should properly evict entries', function (done) {
      var cache = new MultiKeyCache({ max: 2 });
      cache.set({ k: 1 }, 'one');
      cache.set({ k: 2 }, 'two');
      cache.get({ k: 1 });
      cache.set({ k: 3 }, 'three');
      expect(cache.get({ k: 2 })).to.not.exist();
      done();
    });

    it('should override dispose option', function (done) {
      var cache = new MultiKeyCache({
        max: 2,
        dispose: function (key, value) {
          done();
        }
      });
      cache.set({ a: '1', b: '2' }, '1-2');
      cache.purge({ a: '1' });
    });

    it('should gracefully handle invalid disposals', function (done) {
      var cache = new MultiKeyCache();
      cache._dispose('{"a":1}');
      cache.set({ a: 1 });
      cache._dispose('{"a":3}');
      cache.set({ b: 2 });
      cache._keyMap['b'][2] = [];
      cache._dispose('{"b":2}');
      done();
    });
  });
}); // end 'mkc'
