'use strict';

var sizeof = require( 'js-sizeof' );

function expired( record ) {
    return record.expires && record.expires < +new Date();
}

var TinyCache = function() {
    var self = this;
    self.cache = {};
    self._hits = 0;
    self._misses = 0;
    self._size = 0;

    return self;
};

TinyCache.prototype = {
    get size() {
        return this._size;
    },
    get memsize() {
        return sizeof( this.cache ); /* Returns the approximate memory usage of all objects stored in the cache and cache overhead */
    },
    get hits() {
        return this._hits;
    },
    get misses() {
        return this._misses;
    }
};

TinyCache.prototype.put = function( key, value, time ) {
    var self = this;

    if ( self.cache[ key ] ) {
        clearTimeout( self.cache[ key ].timeout );
    }

    self.cache[ key ] = {
        value: value,
        expires: !isNaN( time ) ? ( time + new Date() ) : null,
        timeout: !isNaN( time ) ? setTimeout( self.del.bind( self, key ), time ) : null
    };

    ++self._size;
};

TinyCache.prototype.del = function( key ) {
    var self = this;
    var record = self.cache[ key ];

    if ( !record ) {
        return false;
    }

    clearTimeout( record.timeout );

    var isExpired = expired( record );
    delete self.cache[ key ];
    --self._size;
    return !isExpired;
};

TinyCache.prototype.clear = function() {
    var self = this;

    for ( var key in self.cache ) {
        clearTimeout( self.cache[ key ].timeout );
    }

    self.cache = {};
    self._size = 0;
};

TinyCache.prototype.get = function( key ) {
    var self = this;
    var record = self.cache[ key ];
    
    if ( !record ) {
        ++self._misses;
        return null;
    }

    if ( expired( record ) ) {
        ++self._misses;
        self.del( key );
        return null;
    }

    ++self._hits;
    return record.value;
};

TinyCache.shared = new TinyCache();

if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = TinyCache;
}
else if ( typeof define === 'function' && define.amd ) {
    /* global define */
    define( [], function() {
        return TinyCache;
    } );
}
else {
    /* global window */
    window.TinyCache = TinyCache;
}