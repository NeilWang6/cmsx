/**
 * @userfor Message - 信息提示框、确认对话框
 * @author zhaoyang.maozy
 * @author lusheng.linls 修改成运营work平台通用的
 * @date 2012.11.15
 */

;(function($, T){
	T.Msg = T.Msg || {};

	/**
	 * 显示信息框
	 * option.title:标题
	 * option.body:提示内容
	 * option.complete: 完成函数
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
			//如有多个浮出层，请另加ID或class
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
				// 确认
				okBtn.bind('click', $.extend(evtData, {
					'ok' : true
				}), option.complete);
				// 取消
				cancelBtn.bind('click', $.extend(evtData, {
					'ok' : false
				}), option.complete);
				closeBtn.bind('click', $.extend(evtData, {
					'ok' : false
				}), option.complete);
			}
			// alert或confirm默认都关
			(option.onlymsg || !option.noclose) && okBtn.bind('click', function() {
				option.close&&option.close(evtData);
				dialog.dialog('close');
			});
		});
	}

	/**
	 * 提示信息框
	 * option.title:标题
	 * option.body:提示内容
	 * option.success: 点确定回调函数
	 * setting: 对话框设置
	 */
	T.Msg['alert'] = function(option, setting) {
		var opt = $.extend(option || {}, {
			onlymsg : true
		});
		showMsgBox(opt, setting);
	};
	/**
	 * 确认信息框
	 * option.title:标题
	 * option.body:提示内容
	 * option.success: 点确定回调函数
	 * option.complete: 完成函数函数
	 * setting: 对话框设置
	 */
	T.Msg['confirm'] = function(option, setting) {
		showMsgBox(option, setting);
	};

})(jQuery, FE.tools);