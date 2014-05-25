/**
 * @author springyu
 * @userfor  �༭����ҳ��Դ��
 * @date  2013-2-20
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */
;(function($, D) {
	var clearTime, readyFun = [
	function() {
		$('#page span').text('�༭Դ����');
	},
	function() {

		$('#dcms_box_edit_prototype').bind('click', function(event) {
			event.preventDefault();
			var $pageId = $('#pageId'), $draftId = $('#draftId'), data = {
				action : 'pagePrototypeAction',
				event_submit_do_getPagePrototype : true,
				pageId : $pageId.val(),
				draftId : $draftId.val()
			};
			$.post(D.domain + '/page/box/json.html?_input_charset=UTF-8', data, function(text) {
				if(text) {
					var json = $.parseJSON(text);
					if(json && json.status === 'success') {
						D.Msg['confirm']({
							'title' : 'ҳ��ԭ��',
							'body' : '<div class="prototype-body"><textarea id="prototype_content">' + json.data.content + '</textarea></div>',
							'noclose' : true,
							'success' : function(evt) {
								var $prototype = $('#prototype_content'), content = $prototype.val();
								delete data['event_submit_do_getPagePrototype'];
								var regPrototype = /\$!\{content_placeholder\}/;
								if(!regPrototype.test(content)) {
									alert('$!{content_placeholder}�����ڣ�����Ӵ���Ŀ��');
									return;
								}
								//<link rel="stylesheet" href="http://style.c.aliimg.com/css/lib/fdev-v4/core/fdev-float.css" />
								//regPrototype = /style.c.aliimg.com\S+fdev-float.css/;
								//if(!regPrototype.test(content)) {
									//alert('fdev-float.css�ļ���ʽ�����ڣ�����Ӵ���Ŀ��');
									//return;
								//}

								//regPrototype = /static.c.aliimg.com\S+extension-min.css/;
								//if(!regPrototype.test(content)) {
									//alert('extension-min.css�ļ���ʽ�����ڣ�����Ӵ���Ŀ��');
									//return;
								//}

								//regPrototype = /\$!\{grids_fdev_css\}/;
								//if(!regPrototype.test(content)) {
									//alert('$!{grids_fdev_css}�����ڣ�����Ӵ���Ŀ��');
									//return;
								//}

								//console.log(regPrototype.exec(content));
								data['event_submit_do_savePagePrototype'] = true;
								data['prototype'] = content;
								//console.log(data);
								$.post(D.domain + '/page/box/json.html?_input_charset=UTF-8', data, function(_text) {
									if(_text) {
										var _json = $.parseJSON(_text);
										evt.data.dialog.dialog('close');
										if(_json && _json.status === 'success') {
											D.Msg.tip({
												timeout : 5000,
												message : "����ɹ���"
											});
										} else {
											D.Msg.error({
												timeout : 5000,
												message : _json.msg
											});
										}
									}
								});

							}
						});
					} else {
						D.Msg.error({
							timeout : 5000,
							message : json.msg
						});
					}
				}
			});

		});

		/**
		 * ���淽��
		 */
		$('#dcms_box_grid_save').bind('click', function(event) {
			event.preventDefault();
			saveDraft();
		});

		$('#dcms_box_grid_pre').bind('click', function(event) {
			event.preventDefault();
			window.location = D.domain + '/page/box/preview_page.html?draftId=' + $('#draftId').val() + '&from=' + $('#from').val();
		});
		$('#dcms_box_edit_design').bind('click', function(event) {
			var draftId = $('#draftId').val();
			window.location = D.domain + '/page/box/new_page_design.html?draft_id=' + draftId + '&from=' + $('#from').val();

		});
		$('.js-btn-fdlint').bind('click', function(event) {
			event.preventDefault();
			D.fdlint('#textarea-content');
		});

	}];
	var saveDraft = function() {
		var data = {};
		data['action'] = 'BoxDraftAction';
		data['event_submit_do_savePageDraft'] = true;
		data['draftId'] = $('#draftId').val();
		data['content'] = $('#textarea-content').val();

		data['resourceId'] = $('#pageId').val();

		$.post(D.domain + '/page/box/json.html?_input_charset=UTF-8', data, function(text) {
			if(text) {
				var json = $.parseJSON(text);
				if(clearTime) {
					window.clearTimeout(clearTime);
				}
				if(json.success) {
					clearTime = D.Msg.tip({
						timeout : 5000,
						message : '����ɹ�'
					});
				} else {
					clearTime = D.Msg.error({
						timeout : 5000,
						message : json.message
					});
				}

			}
		});
	};

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
