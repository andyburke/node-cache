# tinycache
[![NPM version](https://badge.fury.io/js/tinycache.png)](http://badge.fury.io/js/tinycache)
[![Build Status](https://travis-ci.org/andyburke/tinycache.png?branch=master)](https://travis-ci.org/andyburke/tinycache)
[![Coverage Status](https://coveralls.io/repos/andyburke/tinycache/badge.png)](https://coveralls.io/r/andyburke/tinycache)

A simple, small (~100 lines) in-memory cache for node.js or the browser (~1.5KB minified).

## Installation

    npm install tinycache

## Usage

### Node
```javascript
var TinyCache = require( 'tinycache' );
var cache = new TinyCache();

// now just use the cache

cache.put( 'foo', 'bar' );
console.log( cache.get( 'foo' ) );

// that wasn't too interesting, here's the good part

cache.put( 'houdini', 'disapear', 100 ); // Time in ms
console.log( 'Houdini will now ' + cache.get( 'houdini' ) );

setTimeout( function() {
  console.log( 'Houdini is ' + cache.get( 'houdini' ) );
}, 200 );
    
// don't want to allocate separate caches?
// there's also a default shared cache:
var sharedCache = Cache.shared;
sharedCache.put( 'foo', 'bar' );

// or you could grab it in a one-liner
var theSharedCache = require( 'tinycache' ).shared;
```
### Browser

#### Using Component (http://component.io)

    component install andyburke/tinycache
    
    ...
    
    var TinyCache = require( 'tinycache' );
    ...
    
#### By hand
```html
<script src="tinycache.min.js"></script>
<script>
    var cache = new TinyCache();
    cache.put( 'foo', 'bar' );
</script>
```

## API

### put = function(key, value, time)

* Simply stores a value. 
* If time isn't passed in, it is stored forever.
* Will actually remove the value in the specified time (via `setTimeout`)

### get = function(key)

* Retreives a value for a given key

### del = function(key)

* Deletes a key, returns a boolean indicating if the key existed and was deleted

### clear = function()

* Deletes all keys

### size = function()

* Returns the current number of entries in the cache

### memsize = function()

* Returns the approximate size in bytes of the cache (including all objects stored and cache overhead)

This is a rough estimate, using the js-sizeof library.

### hits = function()

* Returns the number of cache hits

### misses = function()

* Returns the number of cache misses.

## Contributing
 
* Fork the project.
* Make your feature addition or bug fix.
* Ensure it passes jshint using .jshintrc settings.
* Ensure it matches .jsbeautifyrc settings.
* Ensure all tests are passing.
* Add any relevant tests.
* Send me a pull request.

## Thanks

Many thanks to Paul Tarjan for the first iteration of this library (https://github.com/ptarjan/node-cache).

## CHANGELOG
0.1.11
------
* JSHint: use single quotes

0.1.10
------
* Fix an accidental dependency screwup
* Update docs on memsize()

0.1.9
-----
* Add/update some tests

0.1.8
-----
* Fix tests

0.1.7
-----
* Add dependency on js-sizeof and attempt to actually calculate rough in-memory cache size
* Fix an issue with size()

0.1.6
-----
* Integrate some upstream changes like:
  - hold size variable in memory instead of recalculating each time
  - minor cleanups/fixes
  
0.1.5
-----
* Remove an unnecessary anonymous function call

0.1.4
-----
* Fix tests

0.1.3
-----
* Fix component.json

0.1.2
-----
* Integrate testing from @brianreavis
* Add BSD License file via @brianreavis
* 'use strict';
* Pass jshint
* jsbeautify

