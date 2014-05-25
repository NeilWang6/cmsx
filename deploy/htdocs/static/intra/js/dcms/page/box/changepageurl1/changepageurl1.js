/**
 * @author springyu
 * @userfor 切换页面URL
 * @date 2013-03-12
 */

;(function($, D) {
	var readyFun = [

	function() {
		$('.operating-area').delegate('#btn_submit', 'click', function(evnet) {
			var thiat = this, $srcPageId =  $('#src_page_id'),srcPageId = $srcPageId.val(), targetPageId = $('#target_page_id').val();
			if(!srcPageId) {
				alert('请输入源页面ID');
				return;
			}
			if(!targetPageId) {
				alert('请输入目标页面ID');
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
							alert('成功切换页面URL');
							return;
						} else {

							if(json.data && json.data === 'notarget') {
								alert('你输入目标页面ID不存在！');
							} else if(json.data && json.data === 'nosrc') {
								alert('你输入源页面ID不存在！');
							} else {
								alert('切换失败！');
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
