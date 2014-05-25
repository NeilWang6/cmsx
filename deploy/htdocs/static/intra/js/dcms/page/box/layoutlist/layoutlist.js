/**
 * @package FD.app.cms.box.pagelib
 * @author: zhaoyang.maozy 
 * @Date: 2012-01-10
 */

 ;(function($, D){
    readyFun = [
     
        /**
         * ��ҳ����
         */
        function(){
        	//$('#js-search-page').submit();
        	FE.dcms.doPage();
        },
        /**
		 * ɾ��
		 */
		function() {
			$('.delete')
					.click(
							function(e) {
								e.preventDefault();
								var _this = $(this), layoutId = _this
										.data('layout-id');
								if (confirm('ȷ��ɾ��?')) {
									location.href= D.domain + '/page/box/delete_layout.htm?layoutId=' + layoutId;  
								}
							});
		},
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
