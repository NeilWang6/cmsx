/**
 * lofty adapter
 * */

fmd('lofty/adapter',['config','assets','event'],function( config, assets, event ){
    
    /* for config amd */
    config.register({
        keys: 'amd',
        rule: function( current, key, val ){
            config.set({
                async: val
            });
        }
    });
    
    /* for debug log */
    event.on( 'requireFailed', function( meta ){
        
        meta.truth = true;
        
        if ( !meta.id || meta.id.indexOf('.css') > 0 ){
            meta.truth = false;
        }// else {
        //    var asset = assets.make( meta.id );
            
        //    ( asset.plugin && asset.plugin === 'non' ) && ( meta.truth = false );
        //}
        
    } );
});
