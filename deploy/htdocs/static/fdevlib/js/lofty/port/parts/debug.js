/**
 * lofty debug
 * */

lofty.on( 'existed', function( meta ){
    
    lofty.log( meta.id + ': already exists.' );
} );

lofty.on( 'compiled', function( meta ){
    
    lofty.log( meta.uid + ': compiled.' );
} );

lofty.on( 'compileFailed', function( ex, mod ){
    
    if ( !lofty.config('hasCatch') || lofty.config('debug') ){
        throw ex;
    }
} );

lofty.on( 'required', function( mod ){
    
    !mod.visits ? mod.visits = 1 : mod.visits++;
    lofty.log( mod.id + ': required ' + mod.visits + '.' );
} );
    
lofty.on( 'requireFailed', function( meta ){
    
    meta.truth && lofty.log( meta.id + ': does not exist.', 'warn' );
} );
    
lofty.on( 'requested', function( asset ){
    
    lofty.log( asset.url + ' requested.' );
} );

lofty.on( 'requestTimeout', function( asset ){
    
    lofty.log( 'request ' + asset.url + ' timeout.', 'warn' );
} );
