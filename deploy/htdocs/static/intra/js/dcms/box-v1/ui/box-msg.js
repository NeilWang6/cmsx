/**
 * @userfor Message - 信息提示框、确认对话框
 * @author zhaoyang.maozy
 * @date 2012.11.15
 */
(function($, D) {
	D.Msg = D.Msg || {};

	/**
	 * 显示信息框
	 * option.title:标题
	 * option.body:提示内容
	 * option.complete: 完成函数
     * option.dbClickSelector:对应双击生效的选择器，默认在.js-dialog下；有此值双击效果和确定效果一致
	 */
	function showMsgBox(option, setting) {
		option = option || {};
		option.title && $('.js-dialog h5').html(option.title);
		$('.js-dialog section').html(option.body || '');
		var okBtn = $('.js-dialog .btn-submit'), cancelBtn = $('.js-dialog .btn-cancel');
		var closeBtn = $('.js-dialog .close');
		okBtn.unbind('click');
		closeBtn.unbind('click');
		if(option.onlymsg) {
			cancelBtn.hide();
		} else {
			cancelBtn.show();
		}
		if(option.isShowBtn && option.isShowBtn === 'hidden') {
			cancelBtn.parent().hide();
		}
        if (option.open && typeof option.open === 'function'){
            option.open();
        }
		$.use(['ui-dialog', 'ui-draggable'], function() {
			var dialogEl = $('.js-dialog');
            
            //如有多个浮出层，请另加ID或class
			var dialog = dialogEl.dialog($.extend({
				center : true,
				draggable : {
					handle : "header",
					containment : 'body'
				},
				fixed : true
			}, setting || {})), evtData = {
				dialog : dialog
			};
			$('.js-dialog .btn-cancel, .js-dialog .close').bind('click', evtData, function() {
				option.close && option.close(evtData);
				dialog.dialog('close');

			});
			okBtn.bind('click', evtData, function(evt, diaData) {
                handleSuccess(evt);
	         });
            //双击事件生效
            if (option.dbClickSelector){
                dialogEl.off('dblclick.boxmsg', option.dbClickSelector);
                dialogEl.on('dblclick.boxmsg', option.dbClickSelector, evtData, function(evt){
                    handleSuccess(evt);
                });
            }
            
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
            
            function handleSuccess(evt){
                option.success && option.success(evt);
                D.BoxTools && D.BoxTools.setEdited && D.BoxTools.setEdited();
                // alert或confirm默认都关
                if (option.onlymsg || !option.noclose){
                    option.close && option.close(evtData);
                    dialog.dialog('close');
                }
            }
		});
	}

	/**
	 * 提示信息框
	 * option.title:标题
	 * option.body:提示内容
	 * option.success: 点确定回调函数
	 * setting: 对话框设置
	 */
	D.Msg['alert'] = function(option, setting) {
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
	D.Msg['confirm'] = function(option, setting) {
		showMsgBox(option, setting);
	};
	/**
	 * 错误提示信息 出现在屏幕上方，不影响当前操作
	 */
	D.Msg['error'] = function(data) {
		prompt.call(this, data);
	};
	/**
	 * 提示信息 出现在屏幕上方，不影响当前操作
	 */
	D.Msg['tip'] = function(data) {
		data.className = 'tip-ok';
		prompt.call(this, data);
	};
	/**
	 * 提示信息方法
	 * @param {Object} data
	 */
	function prompt(data) {
		var _config = {
			timeout : 3000,
			className : 'tip-error'
		}, config = $.extend({}, _config, data), clearTime, $prompt = $('#prompt_tip'), $win = $(window), width = $win.width();
		if($prompt.length <= 0) {
			$('body').append('<div class="' + config.className + '" id="prompt_tip"></div>');
			$prompt = $('#prompt_tip');
		} else {
			if(!$prompt.hasClass(config.className)) {
				$prompt.removeClass();
				$prompt.addClass(config.className);
			}
		}

		$prompt.html(config.message);
		$prompt.attr('title', config.message);
		$prompt.css('display', 'inline-block');
		$prompt.css('left', (width - $prompt.width()) / 2);
		clearTime = setTimeout(function() {
			$prompt.hide();
		}, config.timeout);
		return clearTime;
	}

})(dcms, FE.dcms);
