/**
 * author jiankai.xujk
 * date 2012-5.4
 */

(function( $, pitaya ){
    var define = pitaya.define,
        register = pitaya.register;
    
    var flowObj = {
        init: function( require, exports ) {
            var $authSteps = $('#wholesale-steps'),
				$modTip = $('#mod-tip-section'),
				$stepFirst = $('#mod-step-1st'),
                $stepSecond = $('#content');

            // first step
            $('#agree-btn').bind('click', function(e) {
                e.preventDefault();
				$authSteps.hide();
				$modTip.hide();
                $stepFirst.hide();
                $stepSecond.fadeIn('slow');
            });
        }
    };

    define( 'flow', flowObj );
	register('flow');
})( jQuery, FE.operation.pitaya );
    
