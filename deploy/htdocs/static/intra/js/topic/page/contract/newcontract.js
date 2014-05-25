/**
 * @author wb-zhangchunyi
 * @usefor 制作合同
 * @date   2013.07.22
 */
;(function($, T) {
	var readyFun = [
	    function(){
	    	$('span.account').each(function(i, el) {
                var $el = $(el),
                    length = $el.text().lenB();
                
                if (length > 20) {
                    $el.text($el.text().cut(20, '...'));
                }
            });
	    	
	    	$('a.apply-btn').bind('click', function(e) {
	    		e.preventDefault();
	        });
	    	 
            $('a.ok').live('click', function(e) {
				$('#vertify-form').attr('action',$('#vertify-form').attr('action')+'&type=confirm');
                $('#vertify-form').submit();
            });
	    }
	    
	];
	
	$(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
	
	

})(jQuery, FE.tools);