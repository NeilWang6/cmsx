/**
 * @author zhaoyang.maozy
 * @userfor  发布记录相关JS
 * @date  2013-4-2
 * @modify  
 */
;(function($, D) {
	function ready() {
		/**
		 *发布记录
		 **/
		$('body').delegate('.box-versions', 'click', function(event) {
			event.preventDefault();
			
			var that = this, $self = $(that), resourceId = $self.data('res-id'), copyForm = $('#copyForm');
			$.get(D.domain + '/page/box/versions.htm', {
				resourceId : resourceId
			}, function(text) {
			 
				var style = '<style>.dialog-b section {line-height:14px !important;text-align: left!important;height:auto!important;}</style>';
				D.Msg['alert']({
					'title' : '发布记录',
					'body' : style + '<div style="line-height:auto">' + text + '</div>'	
				});
			
			}, 'text');
             
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
	ready();
	
})(dcms, FE.dcms);
