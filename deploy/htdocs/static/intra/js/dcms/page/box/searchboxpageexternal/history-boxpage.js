/**
 * @author qiuxiaoquan
 * @userfor  发布记录相关JS
 * @date  2013-2-22
 * @modify  
 */
;(function($, D) {
	D.historyBoxPage = function() {
		/**
		 *发布记录
		 **/
		$('.dcms-box-list').delegate('.js-history-box-page', 'click', function(event) {
			event.preventDefault();
			
			var that = this, $self = $(that), pageId = $self.data('page-id'), copyForm = $('#copyForm');
			$.get(D.domain + '/page/box/historyBoxPage.htm', {
				pageId : pageId
			}, function(text) {
			 
				
				D.Msg['alert']({
					'title' : '发布记录',
					'body' : '<div >' + text + '</div>'	
				});
			
			}, 'text');
             
		});
		/**
		 * 弹出窗口 回溯
		 */
		$('body').delegate('.js-page-revert', 'click', function(event) {
			event.preventDefault();
			var _this = $(this), pageId = _this.data('pageId');
			revertId = _this.data('revertId');
			$.getJSON(D.domain + '/page/box/can_edit_page.htm', {
				'pageId' : pageId,'revertId' : revertId
			}, D.EditPage.edit, 'text');
			
		});
		/**
		 * 弹出窗口 预览
		 */
		/*
		$('body').delegate('.js-page-revert-preview', 'click', function(event) {
			event.preventDefault();
			var _this = $(this), pageId = _this.data('pageId');
			revertId = _this.data('revertId');
			window.location = D.domain + '/page/box/preview_box_page_version.html?revertId=' + revertId  + (pageId ? '&pageId=' + pageId: '');
			//var url== D.domain + '/page/box/preview_box_page_version.html?revertId=' + revertId  + (pageId ? '&pageId=' + pageId: '');
			//window.open(url);
			            			
		});
		*/
		
	};
	
})(dcms, FE.dcms);
