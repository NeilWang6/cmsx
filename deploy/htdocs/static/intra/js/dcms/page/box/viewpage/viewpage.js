/**
 * @package FD.app.cms.viewpage
 * @author: hongss
 * @Date: 2011-03-011
 */

;(function($, D) {
	var confirmEl = $('#dcms-message-confirm');
	var readyFun = [
	/**
	 * 隐藏/显示 规则选择模块
	 */
	function() {
		setIframeHeight();
		$(window).resize(function() {
			setIframeHeight();
		});
	},
	/**
	 * 二维码相关
	 */
	function() {
        //生成二维码
        $('#tips-qcode').qrcode({
            text:$('#dcms-view-page').attr('src'),
            width:120,
            height:120
        });
        //显示、隐藏二维码
        $('.trigger-qrcode .btn-gray').click(function(e){
            e.preventDefault();
            $(this).parent().toggleClass('show');
        });
        //隐藏二维码
        $('.trigger-qrcode .tui-tips-white .close').click(function(e){
            e.preventDefault();
            $(this).closest('.trigger-qrcode').removeClass('show');
        });
	},
	//多浏览器预览
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
						content = "已经向预发布机下发同步指定，等几分钟可绑定预发布机预览";
					} else if(data.success == false) {
						content = "系统错误，请联系管理员";
					}
					D.Message.confirm(confirmEl, {
						msg : content,
						title : '立即同步模板'
					});
				}
			}).fail(function() {
				D.Message.confirm(confirmEl, {
					msg : '向预发布机下发同步指定失败',
					title : '立即同步模板'
				});
			});
		});
	},
	function() {
		//处理后台渲染出错情况，如：offer过期等问题
		$('#dcms-view-page').bind('load', function() {
			var that = this, doc = $(that.contentDocument.document || that.contentWindow.document);
			var $tips = doc.find('#error_tips'),$btnSubmit = $('#check_page');
			if($tips && $tips.length&&$tips.html()) {
				$btnSubmit.unbind();
				D.Msg.confirm({
					'title' : '提示',
					'isShowBtn':"hidden",
					'body' : $tips.html()
				});
			} else {
				$btnSubmit.removeClass('btn-disabled');
				$btnSubmit.addClass('btn-blue');
				//绑定提交审核
				var $audit = $('#dcms-page-audit');
				var pubIntervalTime=""+$('#pubIntervalTime').val();
				$btnSubmit.click(function() {
                    if(pubIntervalTime==""){
                        $audit.submit();
                    }else{
                        D.Msg.confirm({
                            'title' : '提示',
                            'body' : '此页面被设置为“定时发布”，如果你选择立即发布，可能会将其他人待发布的区块发布上线。',
                            'success' : function(evt) {
                                $("#pubNowFlag").val("true");
								$audit.submit();
                            }
                        }, {
                            'open':function(o){
                                var dialogEl = $(this),
                                    subBtnEl = dialogEl.find('.btn-submit');
                                dialogEl.off('click.pubSetTime', '.pub-settime');
                                subBtnEl.text('立即发布');
                                if (!dialogEl.find('.pub-settime')[0]){
                                    subBtnEl.after(' <button class="btn-basic btn-gray btn-cancel pub-settime">定时发布</button>');
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
