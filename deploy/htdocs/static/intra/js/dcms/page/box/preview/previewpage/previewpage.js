/**
 * @author springyu
 */
;(function($, D) {
    var readyFun = [
    /**
     * 计算iframe高度
     */
    function() {
        //D.previewIframe();
        $(window).scroll(D.previewIframe());
        $(window).resize(D.previewIframe());
        setTimeout(D.previewIframe(), 50);

    },
    //多浏览器预览
	function() {
		$('#multipreview').bind('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			$('#js_preview').css('display','inline-block');
			var oForm = $('#daftForm')[0],
			//
			param = 'pageId=' + oForm.pageId.value +'&draftId='+ oForm.draftId.value+ "&";
			D.MultiBrowser.request({
				targetId : '#dcms-view-page',
				param : param,
				isIframe:true,
				targetUrl : D.domain + '/page/open/previewBoxPage.html?'
			});
		});

	},
    /**
     * 提交方法实现
     */
    function() {
        $('#dcms_box_grid_submit').bind('click', function(event) {
            event.preventDefault();
            var pageId = $('#pageId').val();
            if(!pageId) {
                D.showSettingDialog(submitDraft);
                return;
            }
            submitDraft(pageId);
        });
    }];

    function submitDraft(pageId) {
        var draftForm = $('#daftForm'),$pageId = $('#pageId');
        draftForm[0].action.value = 'PageManager';
        draftForm.find('#dcms-form-event-type').attr('name', 'event_submit_do_submitBoxPage');
        draftForm.attr('target', '_self');
        draftForm.attr('action', '');
        if (!$pageId.val()){
            $pageId.val(pageId);
        }
        draftForm.submit();
    }

    $(function() {
        $.each(readyFun, function(i, fn) {
            try {
                fn();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            }
        })
    });

})(dcms, FE.dcms);
