/**
 * @author springyu
 */
;(function($, D) {
    var readyFun = [
    /**
     * iframe����Ӧ�߶�
     */
    function() {
        $(window).scroll(D.previewIframe());
        $(window).resize(D.previewIframe());
        setTimeout(D.previewIframe(), 50);

    },
      //�������Ԥ��
	function() {
		$('#multipreview').bind('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			$('#js_preview').css('display','inline-block');
			var draftId=$('#draftId').val(),templateId = $('#templateId').val(),flag = $('#flag').val();
			//
			param = 'flag=' + flag +'&draftId='+ draftId+ "&templateId="+templateId+"&";
			D.MultiBrowser.request({
				targetId : '#dcms-view-page',
				param : param,
				isIframe:true,
				targetUrl : D.domain + '/open/box/preview_draft.html?'
			});
		});

	},
    /**
     * �ύ����ʵ��
     */
    function() {
        $('#dcms_box_grid_submit').bind('click', function(event) {
            event.preventDefault();
           
            var templateId = $('#templateId').val();
            if(!templateId) {
                D.showSettingDialog(function() {
                    D.submitSuccess();
                });
                return;
            }

            D.submitSuccess();
        });
    }];

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
