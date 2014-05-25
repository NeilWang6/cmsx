/**
 * @author springyu
 * @userfor  多浏览器预览检测
 * @date  2013-1-7
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
 */
;(function($, D) {
	MultiBrowser = {
		/**
		 * @param args{	isIframe:是否使用iframe展示结果 默认：true
		 * 				targetId: isIframe为false, 可选，检测结果存放元素id或class
		 * 				targetUrl:可选 检测的URL.
		 * 				param:targetUrl为空则必选,其它可选，放在检测url后面的参数。}
		 */
		request : function(args) {
			var self = this, config = $.extend({}, self.config, args);
			var checkUrl = MultiBrowser.CONSTANTS.checkUrl, screenUrl = 'surl=' + encodeURIComponent(config.targetUrl + config.param);
			if(config.isIframe) {
				$(config.targetId).attr('src', checkUrl + screenUrl);
			} else {
				var tempStr = '<form id="submit_box_multi_browser" action="' + checkUrl + '" method="get" target="_blank">';
				tempStr += '<input type="hidden" name="surl" value="' + config.targetUrl + config.param + '">';
				tempStr += '</form>';
				var oForm = $(tempStr);
				var tempForm = $('#submit_box_multi_browser');
				tempForm.remove();
				oForm.appendTo('body');
				oForm.trigger('submit');
			}

		}
	};
	/**
	 * 配置项目
	 */
	MultiBrowser.config = {
		targetUrl : D.domain + '/page/view_context.htm?',
		targetId : "#dcms-view-page",
		isIframe : true

	};
	//常量
	MultiBrowser.CONSTANTS = {
		checkUrl : D.domain + "/page/multiview.html?",
	}
	D.MultiBrowser = MultiBrowser;
})(dcms, FE.dcms);
