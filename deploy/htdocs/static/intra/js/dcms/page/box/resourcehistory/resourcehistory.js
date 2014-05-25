/**
 * @author qiuxiaoquan
 * @userfor  页面的发布记录相关JS
 * @date  2013-2-24
 * @modify  
 */
;(function($, D) {
	 var readyFun = [
	 function() {       
		    /**
			 * 页面 回溯
			 */
			$('body').delegate('.js-page-revert', 'click', function(event) {
				event.preventDefault();
				var _this = $(this), id = _this.data('pageId'),
				revertId = _this.data('revertId'),type=_this.data('type'),url,editFunc,params;
				if(type == 'RT_PAGE') {
					url = '/page/box/can_edit_page.htm';
					editFunc = D.EditPage.edit;
					params = {'pageId':id,'revertId':revertId};
				} else if(type == 'public_block' || type == 'module') {
					url='/page/box/can_edit_module.html';
					editFunc = D.EditModule.edit;
					var codeType = (type == 'public_block' ? 'visual':'code');
					params = {'type':type,'moduleId':id,'revertId':revertId,'codeType':codeType};
				}
				$.getJSON(D.domain + url, params, editFunc, 'text');
				
			});
	 }];

	$(function() {
		$.each(readyFun, function(i, fn) {
			try {
				fn();
			} catch (e) {
				if($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			}
		})
	});
	
})(dcms, FE.dcms);
