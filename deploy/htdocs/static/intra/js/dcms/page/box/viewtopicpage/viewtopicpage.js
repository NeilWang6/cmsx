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
	 * �ύ ���
	 */
	function() {
		var $audit = $('#dcms-page-audit'), $submit_pass = $audit.find('#btn_check_page'), $submit_reject = $audit.find('#btn_check_page_reject');
		$submit_pass.click(function() {
			$("#field_checkType").val("pass");
			$(".js-dialog").find("h5").text("��ʾ");
			$(".js-dialog").find("section").html("<i class='tui-icon-36 icon-question'></i><div class='msg'>ȷ��Ҫ���ͨ����</div>");			
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
			$(".js-dialog").find("h5").text("��ͨ��ԭ��");
			$(".js-dialog").find("section").html("<textarea class='js-remark remark' name='remark' placeholder='����дҳ��δͨ�����ԭ������������1000���ַ��ڡ�'></textarea>");
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
					alert("����д��ͨ��ԭ��");
				}else if(remark.length>1000){
					//TODO �����ҳ������ʾʣ�����д�ַ�����
					alert("����������󳤶����ƣ��������1000�ַ��ڡ�");
				}else{
					$("#field_remark").val(remark);
					$audit.submit();					
				}
			});
		});
	},
	//�������Ԥ��
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
