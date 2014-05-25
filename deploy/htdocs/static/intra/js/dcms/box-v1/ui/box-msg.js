/**
 * @userfor Message - ��Ϣ��ʾ��ȷ�϶Ի���
 * @author zhaoyang.maozy
 * @date 2012.11.15
 */
(function($, D) {
	D.Msg = D.Msg || {};

	/**
	 * ��ʾ��Ϣ��
	 * option.title:����
	 * option.body:��ʾ����
	 * option.complete: ��ɺ���
     * option.dbClickSelector:��Ӧ˫����Ч��ѡ������Ĭ����.js-dialog�£��д�ֵ˫��Ч����ȷ��Ч��һ��
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
            
            //���ж�������㣬�����ID��class
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
            //˫���¼���Ч
            if (option.dbClickSelector){
                dialogEl.off('dblclick.boxmsg', option.dbClickSelector);
                dialogEl.on('dblclick.boxmsg', option.dbClickSelector, evtData, function(evt){
                    handleSuccess(evt);
                });
            }
            
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
            
            function handleSuccess(evt){
                option.success && option.success(evt);
                D.BoxTools && D.BoxTools.setEdited && D.BoxTools.setEdited();
                // alert��confirmĬ�϶���
                if (option.onlymsg || !option.noclose){
                    option.close && option.close(evtData);
                    dialog.dialog('close');
                }
            }
		});
	}

	/**
	 * ��ʾ��Ϣ��
	 * option.title:����
	 * option.body:��ʾ����
	 * option.success: ��ȷ���ص�����
	 * setting: �Ի�������
	 */
	D.Msg['alert'] = function(option, setting) {
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
	D.Msg['confirm'] = function(option, setting) {
		showMsgBox(option, setting);
	};
	/**
	 * ������ʾ��Ϣ ��������Ļ�Ϸ�����Ӱ�쵱ǰ����
	 */
	D.Msg['error'] = function(data) {
		prompt.call(this, data);
	};
	/**
	 * ��ʾ��Ϣ ��������Ļ�Ϸ�����Ӱ�쵱ǰ����
	 */
	D.Msg['tip'] = function(data) {
		data.className = 'tip-ok';
		prompt.call(this, data);
	};
	/**
	 * ��ʾ��Ϣ����
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
