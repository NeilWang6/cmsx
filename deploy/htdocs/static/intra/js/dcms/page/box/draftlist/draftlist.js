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
	 * É¾³ý
	 */
	function() {
		$('.js-delete').bind('click', function(e) {
			e.preventDefault();
			//if(confirm('È·ÈÏÉ¾³ý?')) {
			var _this = $(this), draftId = _this.data('draft-id'), resourceType = $('#resource_type');
			// window.location.href = 'delete_draft.html?draftId=' + draftId;
			//}
			$.post(D.domain + '/page/box/delete_draft.html', {
				"draftId" : draftId
			}, function(text) {
				var json = $.parseJSON(text);
				if (json && json.status && json.status === 'success') {
					alert('³É¹¦É¾³ý');
					window.location.href = "draft_list.html?resource_type=" + (resourceType.val() || 'page');
				} else {
					alert('É¾³ýÊ§°Ü');
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
							msg : '½âËø³É¹¦£¡'
						});
						//return;
					} else {
						var msg = '', result = o.result, end = '<br />';
						for (var i = 0, l = result.length; i < l; i++) {
							if (i === l - 1) {
								end = '';
							}
							msg += 'Ò³Ãæ' + result[i].code + '½âËøÊ§°Ü£¬´íÎóÈçÏÂ£º' + result[i].error + end;
						}
						//alert(msg);
						D.Msg.awake(awakeEl, {
							msg : msg
						});
						return;
					}

				},
				error : function() {
					//alert('½âËøÊ§°Ü£¬ÇëÉÔºóÔÙÊÔ£¡');
					D.Msg.awake(awakeEl, {
						msg : '½âËøÊ§°Ü£¬ÇëÉÔºóÔÙÊÔ£¡'
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
				alert('ÇëÑ¡ÔñÐèÒªÉ¾³ýµÄ²Ý¸å£¡');
				return;
			}
			var draftId = (draftIdList.toString());

			$.post(D.domain + '/page/box/delete_draft.html', {
				"draftId" : draftId
			}, function(text) {
				var json = $.parseJSON(text);
				if (json && json.status && json.status === 'success') {
					alert('³É¹¦É¾³ý');
					window.location.href = "draft_list.html?resource_type=" + (resourceType.val() || 'page');
				} else {
					alert('É¾³ýÊ§°Ü');
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
		 * ÅÅÐò
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
