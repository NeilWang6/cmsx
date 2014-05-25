/**
 * @package FD.app.cms.box.favoritelist
 * @author: zhaoyang.maozy 
 * @Date: 2012-03-15
 */

 ;(function($, D){
        readyFun = [
        /**
         * 点击用户名，标签进行搜索
         */
        function(){
           $('.page-body .search-key').click(function(e){
               e.preventDefault();
               var kw=$.trim($(this).text());
               $('#keyword').val(kw);
               $('#search-lib').submit();
           });
        } 
    ];
    
 
    $(function(){
    	$.each(readyFun, function(i, fn){
            try {
            	fn();
            } catch(e) {
                if ($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            }   		
    	})
    });    

 })(dcms, FE.dcms);
