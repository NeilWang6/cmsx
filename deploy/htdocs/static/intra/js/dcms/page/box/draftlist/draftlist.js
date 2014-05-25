/**
 * @package FD.app.cms.box.pagelib
 * @author: zhaoyang.maozy
 * @Date: 2012-01-10
 */

;
(function($, D) {
	var pageElm = $('#js-page-num'), searchForm = $('#js-search-page'), readyFun = [
	function() {
		$("#example").treeview();

	},
	function() {
		//$('#js-search-page').submit();
		FE.dcms.doPage();
	},
	/**
	 * ɾ��
	 */
	function() {
		$('.js-delete').bind('click', function(e) {
			e.preventDefault();
			//if(confirm('ȷ��ɾ��?')) {
			var _this = $(this), draftId = _this.data('draft-id'), resourceType = $('#resource_type');
			// window.location.href = 'delete_draft.html?draftId=' + draftId;
			//}
			$.post(D.domain + '/page/box/delete_draft.html', {
				"draftId" : draftId
			}, function(text) {
				var json = $.parseJSON(text);
				if (json && json.status && json.status === 'success') {
					alert('�ɹ�ɾ��');
					window.location.href = "draft_list.html?resource_type=" + (resourceType.val() || 'page');
				} else {
					alert('ɾ��ʧ��');
				}
			});

		});
		$('.js-unlock').bind('click', function(event) {
			var $self = $(this), ids = $self.data('id'), url = D.domain + '/page/box/unlock_resource.htm';
			var awakeEl = $('#dcms-message-awake');
			$.ajax({
				url : url,
				data : ids,
				dataType : 'jsonp',
				success : function(o) {
					if (o.success === true) {

						D.Msg.awake(awakeEl, {
							msg : '�����ɹ���'
						});
						//return;
					} else {
						var msg = '', result = o.result, end = '<br />';
						for (var i = 0, l = result.length; i < l; i++) {
							if (i === l - 1) {
								end = '';
							}
							msg += 'ҳ��' + result[i].code + '����ʧ�ܣ��������£�' + result[i].error + end;
						}
						//alert(msg);
						D.Msg.awake(awakeEl, {
							msg : msg
						});
						return;
					}

				},
				error : function() {
					//alert('����ʧ�ܣ����Ժ����ԣ�');
					D.Msg.awake(awakeEl, {
						msg : '����ʧ�ܣ����Ժ����ԣ�'
					});
				}
			});
		});
		$('#js_delete_batch').bind('click', function(event) {
			event.preventDefault();
			$input = $('input[type="checkbox"]').filter(':checked'), resourceType = $('#resource_type');
			var draftIdList = [];
			$input.each(function(index, obj) {
				var $obj = $(obj);
				if ($obj.data('id')) {
					draftIdList.push($obj.data('id'));
				}

			});
			if (!draftIdList || draftIdList.length <= 0) {
				alert('��ѡ����Ҫɾ���Ĳݸ壡');
				return;
			}
			var draftId = (draftIdList.toString());

			$.post(D.domain + '/page/box/delete_draft.html', {
				"draftId" : draftId
			}, function(text) {
				var json = $.parseJSON(text);
				if (json && json.status && json.status === 'success') {
					alert('�ɹ�ɾ��');
					window.location.href = "draft_list.html?resource_type=" + (resourceType.val() || 'page');
				} else {
					alert('ɾ��ʧ��');
				}
			});

		});
	},
	function() {
		$('#all_check').bind('click', function(event) {
			var that = this, self = $(this), $input = $('input[type="checkbox"]');
			if (that.checked) {
				$input.attr('checked', 'checked');
			} else {
				$input.removeAttr('checked');
			}
		});
	},
	function() {
		/**
		 * ����
		 */

		$('.list-filter .item').click(function(e) {
			e.preventDefault();
			$("#orderKey").val($(this).data('sortkey'));
			searchForm.submit();
		});

	}];

	$(function() {
		$.each(readyFun, function(i, fn) {
			try {
				fn();
			} catch (e) {
				if ($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			}
		})
	});

})(dcms, FE.dcms);
