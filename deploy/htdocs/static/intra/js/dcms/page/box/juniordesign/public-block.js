/**
 * @author springyu
 * @desc ����������ز���
 */

;(function($, D) {
	var editor = D.box.editor, root = this, _ = root._;
	editor.publicBlock = {
		//ɾ��ҳ��͹�������Ĺ�ϵ
		deletePublicBlock : function(elemInfo) {
			var data = {}, $pageId = $('#pageId');
			data['event_submit_do_deletePagePublicBlock'] = true;
			data['action'] = 'publicBlockAction';
			data['pageId'] = $pageId.val();
			data['publicBlockId'] = elemInfo.id;
			if ($pageId.length && $pageId.val()) {
				$.ajax(D.domain + '/page/box/json.html?_input_charset=UTF8', {
					data : data,
					type : 'POST',
					success : function(text) {
						console.log(text);
					}
				});
			}
		},
		/**
		 *
		 */
		getHtmlTemplate : function() {
			var html ='';
			$.ajax({
				url : D.domain+'/page/box/setPublicBlock.html',
				//type : "POST",
				//data : _value,
				async : false,
				success : function(_data) {
				 html = _data;
				},
				error : function(jqXHR, textStatus, errorThrown) {
					alert("���ӳ�ʱ�����ԣ�");
				}
			});
			return html;
		},
		//���������Ϊ���ù���
		setPublicBlock : function($target, fn) {
			var that = this, $Dialog = $('.js-dialog'), title = 'ϵͳ��ʾ', elemInfo = $target.data('eleminfo');
			$Dialog.addClass('ext-width');
			$('footer', $Dialog).show();
			$('.btn-submit', $Dialog).show();
			$('section', $Dialog).empty();
			//console.log(that.getHtmlTemplate());
			D.Msg['confirm']({
				'title' : title,
				'body' : that.getHtmlTemplate(),
				'noclose' : true,
				'success' : function(evt) {
					var $parent = $target.parent(), html = $parent.html(), $blockName = $('#block_name', $Dialog), $pageId = $('#pageId'),
					//
					$blockType=$('#block_type'),data = {
						content : html,
						elemInfo : JSON.stringify(elemInfo),
						name : $blockName.val(),
						pageId : $pageId.val(),
						blockType:$blockType.val(),
						action : 'publicBlockAction',
						'event_submit_do_settingPagePublicBlock' : true
					};
					$.post(D.domain + '/page/box/json.html?_input_charset=UTF8', data, function(text) {
						var json = $.parseJSON(text);
						//console.log(json);
						if (json && json.status === 'success') {
							if (json.source) {
								elemInfo.source = json.source;
								elemInfo.type = json.source;
							}
							if (json.versionId) {
								elemInfo.versionId = json.versionId;
							}
							if (json.publicBlockId) {
								elemInfo.id = json.publicBlockId;
							}
							if (data.name) {
								elemInfo.name = data.name;
							}
							var elems = JSON.stringify(elemInfo);
							$target.removeData('eleminfo');
							$target.attr('data-eleminfo');
							$target.attr('data-eleminfo', elems);
							typeof fn === 'function' && fn();
							evt.data.dialog.dialog('close');
						} else {
							alert('����ʧ�ܣ�');
							return;
						}
					});
				},
				'close' : function(evt) {
					$Dialog.removeClass('ext-width');
				}
			});

		}
	};

})(dcms, FE.dcms);
