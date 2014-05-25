/**
 * @package FD.app.cms.viewpage
 * @author: hongss
 * @Date: 2011-03-011
 */

;(function($, D) {
	var confirmEl = $('#dcms-message-confirm');
	var readyFun = [
	/**
	 * ����/��ʾ ����ѡ��ģ��
	 */
	function() {
		setIframeHeight();
		$(window).resize(function() {
			setIframeHeight();
		});
	},
	/**
	 * ��ά�����
	 */
	function() {
        //���ɶ�ά��
        $('#tips-qcode').qrcode({
            text:$('#dcms-view-page').attr('src'),
            width:120,
            height:120
        });
        //��ʾ�����ض�ά��
        $('.trigger-qrcode .btn-gray').click(function(e){
            e.preventDefault();
            $(this).parent().toggleClass('show');
        });
        //���ض�ά��
        $('.trigger-qrcode .tui-tips-white .close').click(function(e){
            e.preventDefault();
            $(this).closest('.trigger-qrcode').removeClass('show');
        });
	},
	//�������Ԥ��
	function() {
		$('#multipreview').bind('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			$('#js_preview').css('display', 'inline-block');
			var param = 'pageId=' + $('#dcms-page-audit')[0].pageId.value + "&";
			D.MultiBrowser.request({
				targetId : '#dcms-view-page',
				param : param,
				isIframe : true,
				targetUrl : D.domain + '/page/open/previewBoxPage.html?'
			});
		});

	},
	function() {
		$('#preview').click(function() {
			$('#action').val(0);
			$('#choose-rule-form').submit();
		});
	},
	function() {
		$('#fault-preview').click(function() {
			$('#action').val(1);
			$('#choose-rule-form').submit();
		});
	},
	function() {
		$('#sync-bt').click(function() {
			var _this = $(this);
			var param = _this.data('param');
			$.ajax({
				url : D.domain + "/page/appCommand.html?" + param,
				type : "GET"
			}).done(function(o) {
				if(!!o) {
					var data = $.parseJSON(o);
					var content = '';
					if(data.success == true) {
						content = "�Ѿ���Ԥ�������·�ͬ��ָ�����ȼ����ӿɰ�Ԥ������Ԥ��";
					} else if(data.success == false) {
						content = "ϵͳ��������ϵ����Ա";
					}
					D.Message.confirm(confirmEl, {
						msg : content,
						title : '����ͬ��ģ��'
					});
				}
			}).fail(function() {
				D.Message.confirm(confirmEl, {
					msg : '��Ԥ�������·�ͬ��ָ��ʧ��',
					title : '����ͬ��ģ��'
				});
			});
		});
	},
	function() {
		//�����̨��Ⱦ����������磺offer���ڵ�����
		$('#dcms-view-page').bind('load', function() {
			var that = this, doc = $(that.contentDocument.document || that.contentWindow.document);
			var $tips = doc.find('#error_tips'),$btnSubmit = $('#check_page');
			if($tips && $tips.length&&$tips.html()) {
				$btnSubmit.unbind();
				D.Msg.confirm({
					'title' : '��ʾ',
					'isShowBtn':"hidden",
					'body' : $tips.html()
				});
			} else {
				$btnSubmit.removeClass('btn-disabled');
				$btnSubmit.addClass('btn-blue');
				//���ύ���
				var $audit = $('#dcms-page-audit');
				var pubIntervalTime=""+$('#pubIntervalTime').val();
				$btnSubmit.click(function() {
                    if(pubIntervalTime==""){
                        $audit.submit();
                    }else{
                        D.Msg.confirm({
                            'title' : '��ʾ',
                            'body' : '��ҳ�汻����Ϊ����ʱ�������������ѡ���������������ܻὫ�����˴����������鷢�����ߡ�',
                            'success' : function(evt) {
                                $("#pubNowFlag").val("true");
								$audit.submit();
                            }
                        }, {
                            'open':function(o){
                                var dialogEl = $(this),
                                    subBtnEl = dialogEl.find('.btn-submit');
                                dialogEl.off('click.pubSetTime', '.pub-settime');
                                subBtnEl.text('��������');
                                if (!dialogEl.find('.pub-settime')[0]){
                                    subBtnEl.after(' <button class="btn-basic btn-gray btn-cancel pub-settime">��ʱ����</button>');
                                }
                                dialogEl.on('click', '.pub-settime', function(){
                                    $("#pubNowFlag").val("false");
                                    $audit.submit();
                                });
                            }
                        });
                    }
				});
			}

		});
	}];

	$(function() {
		for(var i = 0, l = readyFun.length; i < l; i++) {
			try {
				readyFun[i]();
			} catch(e) {
				if($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			} finally {
				continue;
			}
		}
	});

	function setIframeHeight() {
		var winHeight = $(window).height(), headHeight = $('.dcms-header-view').outerHeight() || 0;
		//$('#dcms-view-container').css('height', (winHeight-headHeight)+'px');
		$('#dcms-view-container iframe').attr('height', winHeight - headHeight);
	}

})(dcms, FE.dcms);
