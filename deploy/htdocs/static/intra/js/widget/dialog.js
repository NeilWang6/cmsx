/**
 * @userfor Message - ��Ϣ��ʾ��ȷ�϶Ի���
 * @author zhaoyang.maozy
 * @author lusheng.linls �޸ĳ���Ӫworkƽ̨ͨ�õ�
 * @date 2012.11.15
 */

;(function($, T){
	T.Msg = T.Msg || {};

	/**
	 * ��ʾ��Ϣ��
	 * option.title:����
	 * option.body:��ʾ����
	 * option.complete: ��ɺ���
	 */
	function showMsgBox(option, setting) {
		option = option || {};
		option.title && $('.js-dialog-basic h5').html(option.title);
		$('.js-dialog-basic section').html(option.body || '');
		var okBtn = $('.js-dialog-basic .btn-submit'), cancelBtn = $('.js-dialog-basic .btn-cancel');
		var closeBtn = $('.js-dialog-basic .close');
		okBtn.unbind('click');
		closeBtn.unbind('click');
		if(option.onlymsg) {
			cancelBtn.css({
				"display" : 'none'
			});
		}else{
			cancelBtn.css({
				"display" : 'inline-block'
			});
		}
		$.use(['ui-dialog', 'ui-draggable'], function() {
			//���ж�������㣬�����ID��class
			var dialog = $('.js-dialog-basic').dialog($.extend({
				center : true,
				draggable : true,
				fixed : true
			}, setting || {})), evtData = {
				dialog : dialog
			};
			$('.js-dialog-basic .btn-cancel, .js-dialog-basic .close').bind('click', evtData, function() {
				option.close&&option.close(evtData);
				dialog.dialog('close');
			});
			option.success && okBtn.bind('click', evtData, option.success);
			if(option.complete) {
				// ȷ��
				okBtn.bind('click', $.extend(evtData, {
					'ok' : true
				}), option.complete);
				// ȡ��
				cancelBtn.bind('click', $.extend(evtData, {
					'ok' : false
				}), option.complete);
				closeBtn.bind('click', $.extend(evtData, {
					'ok' : false
				}), option.complete);
			}
			// alert��confirmĬ�϶���
			(option.onlymsg || !option.noclose) && okBtn.bind('click', function() {
				option.close&&option.close(evtData);
				dialog.dialog('close');
			});
		});
	}

	/**
	 * ��ʾ��Ϣ��
	 * option.title:����
	 * option.body:��ʾ����
	 * option.success: ��ȷ���ص�����
	 * setting: �Ի�������
	 */
	T.Msg['alert'] = function(option, setting) {
		var opt = $.extend(option || {}, {
			onlymsg : true
		});
		showMsgBox(opt, setting);
	};
	/**
	 * ȷ����Ϣ��
	 * option.title:����
	 * option.body:��ʾ����
	 * option.success: ��ȷ���ص�����
	 * option.complete: ��ɺ�������
	 * setting: �Ի�������
	 */
	T.Msg['confirm'] = function(option, setting) {
		showMsgBox(option, setting);
	};

})(jQuery, FE.tools);