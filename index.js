'use strict';

function now() {
    return ( new Date() ).getTime();
}

function expired( record ) {
    return record.expire && record.expire < now();
}

var TinyCache = function() {
    var self = this;
    self.cache = {};
    self.debug = false;
    self.hitCount = 0;
    self.missCount = 0;
    self.size = 0;

    return self;
};

TinyCache.prototype.put = function( key, value, time ) {
    var self = this;

    if ( self.cache[ key ] ) {
        clearTimeout( self.cache[ key ].timeout );
    }

    var record = {
        value: value,
        expire: time ? ( time + now() ) : null
    };

    if ( record.expire ) {
        var timeout = setTimeout( self.del.bind( self, key ), time );
        record.timeout = timeout;
    }

    self.cache[ key ] = record;
    ++self.size;
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
    --self.size;
    return !isExpired;
};

TinyCache.prototype.clear = function() {
    var self = this;

    for ( var key in self.cache ) {
        clearTimeout( self.cache[ key ].timeout );
    }

    self.cache = {};
    self.size = 0;
};

TinyCache.prototype.get = function( key ) {
    var self = this;
    var record = self.cache[ key ];
    if ( typeof record != "undefined" ) {
        if ( !expired( record ) ) {
            ++self.hitCount;
            return record.value;
        }
        else {
            self.del( key );
        }
    }
    ++self.missCount;
    return null;
};

TinyCache.prototype.size = TinyCache.prototype.memsize = function() {
    return this.size;
};

TinyCache.prototype.hits = function() {
    var self = this;
    return self.hitCount;
};

TinyCache.prototype.misses = function() {
    var self = this;
    return self.missCount;
};

TinyCache.shared = new TinyCache();

if ( typeof( module ) !== 'undefined' && typeof( module.exports ) !== 'undefined' ) {
    module.exports = TinyCache;
}
else {
    /* globals define, window */
    if ( typeof( define ) === 'function' && define.amd ) {
        define( [], function() {
            return TinyCache;
        } );
    }
    else {
        window.TinyCache = TinyCache;
    }
}
