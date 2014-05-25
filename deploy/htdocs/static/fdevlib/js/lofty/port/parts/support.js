/**
 * lofty support
 * */

/* support jQuery module */
window.jQuery && (define('gallery/jquery/jqueryLatest', function(){ return jQuery; }), lofty.config({alias:{'jquery':'gallery/jquery/jqueryLatest'}}));
window.af && (define('gallery/appframework/appframework', function(){ return af; }), lofty.config({alias:{'jquery':'gallery/appframework/appframework'}}));

/* support test environment */
window.lofty && ( window.lofty.test = {} );
