/**
 * @package FD.app.cms.viewpage
 * @author: zhaoyang
 * @Date: 2013-07-27
 */

 ;(function($, D){
     var confirmEl = $('#dcms-message-confirm');
     var readyFun = [
        function() { 
        	/**
    		 * 修改积木盒子动成页面
    		 */
    		$('.edit-box-page').click(function(event) {
    			event.preventDefault();
    			var _this = $(this), pageId = _this.data('page-id');
    			$.getJSON(D.domain + '/page/box/can_edit_page.htm', {
    				'pageId' : pageId
    			}, D.EditPage.edit, 'text');
    			return false
    		});
        }
     ];
     
     $(function(){
         for (var i=0, l=readyFun.length; i<l; i++) {
             try {
                 readyFun[i]();
             } catch(e) {
                 if ($.log) {
                     $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                 }
             } finally {
                 continue;
             }
         }
     });     

 })(dcms, FE.dcms);
