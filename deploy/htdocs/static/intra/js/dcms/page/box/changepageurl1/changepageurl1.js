/**
 * @author springyu
 * @userfor �л�ҳ��URL
 * @date 2013-03-12
 */

;(function($, D) {
	var readyFun = [

	function() {
		$('.operating-area').delegate('#btn_submit', 'click', function(evnet) {
			var thiat = this, $srcPageId =  $('#src_page_id'),srcPageId = $srcPageId.val(), targetPageId = $('#target_page_id').val();
			if(!srcPageId) {
				alert('������Դҳ��ID');
				return;
			}
			if(!targetPageId) {
				alert('������Ŀ��ҳ��ID');
				return;
			}
			var data = {
				srcPageId : srcPageId,
				targetPageId : targetPageId
			};
			$.post(D.domain + "/page/box/changePageUrl.html?_input_charset=utf-8", data, function(text) {
				if(text) {
					var json = $.parseJSON(text);
					if(json) {
						if(json.status === 'success') {
							alert('�ɹ��л�ҳ��URL');
							return;
						} else {

							if(json.data && json.data === 'notarget') {
								alert('������Ŀ��ҳ��ID�����ڣ�');
							} else if(json.data && json.data === 'nosrc') {
								alert('������Դҳ��ID�����ڣ�');
							} else {
								alert('�л�ʧ�ܣ�');
							}

							return;
						}
					}
				}
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
})(dcms, FE.dcms);
