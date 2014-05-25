/**
 * @author springyu
 * @userfor  �������Ԥ�����
 * @date  2013-1-7
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */
;(function($, D) {
	MultiBrowser = {
		/**
		 * @param args{	isIframe:�Ƿ�ʹ��iframeչʾ��� Ĭ�ϣ�true
		 * 				targetId: isIframeΪfalse, ��ѡ����������Ԫ��id��class
		 * 				targetUrl:��ѡ ����URL.
		 * 				param:targetUrlΪ�����ѡ,������ѡ�����ڼ��url����Ĳ�����}
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
	 * ������Ŀ
	 */
	MultiBrowser.config = {
		targetUrl : D.domain + '/page/view_context.htm?',
		targetId : "#dcms-view-page",
		isIframe : true

	};
	//����
	MultiBrowser.CONSTANTS = {
		checkUrl : D.domain + "/page/multiview.html?",
	}
	D.MultiBrowser = MultiBrowser;
})(dcms, FE.dcms);
