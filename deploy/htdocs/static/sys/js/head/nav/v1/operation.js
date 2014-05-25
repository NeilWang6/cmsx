/**
 * @package FD.sys.head.nav
 * @author  Edgar
 * @version 1.0.110113
 */
FDEV.namespace('FD.sys.head');
(function( S ){
    S._addOver = function( node, over ){
        if ( !$(node) ) return;
        var el = $(node), over = over ? over : 'over', t1, t2;
        $E.addListener( el, 'mouseover', function(){
            clearTimeout(t1);
            var _this = this;
            t1 = setTimeout( function(){$D.addClass( _this, over );}, 200 );
        } );
        $E.addListener( el, 'mouseout', function(){
            clearTimeout(t2);
            var _this = this;
            t2 = setTimeout( function(){$D.removeClass( _this, over );}, 200 );
        } );
    };
    
    /**
     * cancel a tag default action
     * @method  cancelLink
     * @param   selector txt
     */
    S._cancelLink = function( txt ){
        var a = $$( txt );
        if ( a.length > 0 ){
            $E.addListener( a, 'click', function(e){
                $E.preventDefault(e);
                return false;
            });
        }
    };
    
    $E.onDOMReady(function(){
        S._addOver( 'market-over', 'market-nav-over' );
        S._cancelLink( '#market-over .to-others-a' );
    });
})(FD.sys.head);