/**
 * @fileoverview jQuery config for alicn
 * @author Edgar
 * @date 130327
 * */

if ( window.lofty ){
    jQuery.noConflict();
    define( 'gallery/jquery/jquery@VERSION', function(){
        return jQuery;
    } );
}
