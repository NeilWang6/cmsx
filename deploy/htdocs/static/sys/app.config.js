(function( env ) {
    'use strict';

    // lofty configs
    var configs = {
        resolve: function( id ) {
            var rStyle = /\.css(?:\?|$)/,
                rSys = /^(sys)(\/\w+)+/;

            var type = rStyle.test( id ) ? 'css/' : 'js/';

            if ( rSys.test( id ) ){
				var parts = id.split('/');
                id = 'sys/' + type + parts.slice( 1 ).join('/');
            }
            return id;
        }
    };

    if( typeof env.lofty !== 'undefined' ) {
        // for lofty
        env.lofty.config(configs);
    }

    if( typeof exports !== 'undefined' && env === exports ) {
        // for node.js
        exports.configs = configs;
    }

})(this);