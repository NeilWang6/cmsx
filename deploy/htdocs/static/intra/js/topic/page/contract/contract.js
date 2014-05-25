/**
 * author arcthur.cheny
 * date 2011-8.8
 */
jQuery.namespace('FE.operation.pitaya');
(function( $, pitaya ){
	
    var define = pitaya.define,
        register = pitaya.register;
        
    var formObj = {
        init: function( require, exports ) {
            var that = this,
                flag = false;

            $('span.account').each(function(i, el) {
                var $el = $(el),
                    length = $el.text().lenB();
                
                if (length > 20) {
                    $el.text($el.text().cut(20, '...'));
                }
            });
            
            $("#wholesale-main").delegate("span.action", "click", function(){
                that._dialog();
            });
            
            $('#confirm-step').bind('click', function(e) {
                e.preventDefault();
                
                window.location.reload();
            });
            
            $('a.apply-btn').bind('click', function(e) {
                e.preventDefault();
            });
            $('a.ok').live('click', function(e) {
				$('#vertify-form').attr('action',$('#vertify-form').attr('action')+'&type=confirm');
                $('#vertify-form').submit();
            });
			
			$('a.okbuyer').live('click', function(e) {
	            $('#vertify-form').submit();
	        });
			
			$('a.apply-btn-refuse').bind('click', function(e) {
                e.preventDefault();
            });
            $('a.okrefuse').live('click', function(e) {
				$('#vertify-form').attr('action',$('#vertify-form').attr('action')+'&type=refuse');
                $('#vertify-form').submit();
            });
        },
        
        _dialog: function() {
            $.use('ui-dialog', function(){
                $('#mod-dialog').dialog({
                    "fixed": true,
                    "center": true,
                    "shim": true,
                    "fadeIn": 200,
                    "fadeOut": 100
                });
            });
        }
    };
   
    define( 'form-globel', formObj);
    
    register('form-globel');
})( jQuery, FE.operation.pitaya );
