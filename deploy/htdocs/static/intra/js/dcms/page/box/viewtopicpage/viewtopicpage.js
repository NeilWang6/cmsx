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
	 * 提交 审核
	 */
	function() {
		var $audit = $('#dcms-page-audit'), $submit_pass = $audit.find('#btn_check_page'), $submit_reject = $audit.find('#btn_check_page_reject');
		$submit_pass.click(function() {
			$("#field_checkType").val("pass");
			$(".js-dialog").find("h5").text("提示");
			$(".js-dialog").find("section").html("<i class='tui-icon-36 icon-question'></i><div class='msg'>确定要审核通过吗？</div>");			
			var dialog = $(".js-dialog").dialog({
				center:true,
				fixed:true
			});
			$(".js-dialog .btn-cancel, .js-dialog .close").unbind('click');
			$(".js-dialog .btn-submit").unbind('click');
			$(".js-dialog .btn-submit").click(function(){
				$audit.submit();
			});
			$(".js-dialog .btn-cancel, .js-dialog .close").click(function(){
				dialog.dialog('close');
			});
		});
		$submit_reject.click(function() {
			$("#field_checkType").val("reject");
			$(".js-dialog").find("h5").text("不通过原因");
			$(".js-dialog").find("section").html("<textarea class='js-remark remark' name='remark' placeholder='请填写页面未通过审核原因，字数限制在1000个字符内。'></textarea>");
			var dialog = $(".js-dialog").dialog({
				center:true,
				fixed:true
			});
			$(".js-dialog .btn-cancel, .js-dialog .close").unbind('click');
			$(".js-dialog .btn-submit").unbind('click');
			$(".js-dialog .btn-cancel, .js-dialog .close").click(function(){
				dialog.dialog('close');
			});
			$(".js-dialog .btn-submit").click(function(){
				var remark = $(".js-remark").val();
				if(remark==""){
					alert("请填写不通过原因。");
				}else if(remark.length>1000){
					//TODO 最好能页面上显示剩余可填写字符数。
					alert("字数超出最大长度限制，请控制在1000字符内。");
				}else{
					$("#field_remark").val(remark);
					$audit.submit();					
				}
			});
		});
	},
	//多浏览器预览
	function() {
		$('#multipreview').bind('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			$('#js_preview').css('display','inline-block');
			var param = 'pageId=' + $('#dcms-page-audit')[0].pageId.value + "&";
			D.MultiBrowser.request({
				targetId : '#dcms-view-page',
				param : param,
				isIframe:true,
				targetUrl : D.domain + '/page/open/previewBoxPage.html?'
			});
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
		$('#dcms-view-container iframe').attr('height', winHeight - headHeight);
	}

})(dcms, FE.dcms);
