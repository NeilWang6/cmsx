/**
 * @author springyu
 * @userfor  ����ҳ�������������JS
 * @date  2013-2-19
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */
;(function($, D) {
	D.batchCopy = function() {
		//��������
		$('.js-dialog').delegate('.js-select', 'change', function(event) {
			event.preventDefault();
			var that = this, $self = $(that), textValue = that.options[that.selectedIndex].text, $selfParent = $self.parent().parent();
			$('.url', $selfParent).html('http://' + textValue);

		});
		$('.js-dialog').delegate('.js-change', 'change', function(event) {
			var that = this, $self = $(that), $parent = $self.closest('.item-operate');
			$parent.data('changed', true);
		});
		//��������ҳ��
		$('.dcms-box-list').delegate('.js-batch-copy', 'click', function(event) {
			event.preventDefault();
			var that = this, $self = $(that), pageId = $self.data('page-id'), copyForm = $('#copyForm');
			$.get(D.domain + '/page/box/batchCopyBoxPage.htm', {
				pageId : pageId
			}, function(text) {
				$('.js-dialog').addClass('copy-dialog-basic');
				$('footer', '.js-dialog').show();
				D.Msg['confirm']({
					'title' : '����ҳ��',
					'body' : '<div class="copy-body">' + text + '</div>',
					'noclose' : true,
					'complete' : function(evt) {

					},
					'close' : function() {
						$('.js-dialog').removeClass('copy-dialog-basic');
					},
					'success' : function(evt) {
						if(checkValid()) {
							var formEl = $('#copyForm');
							$.post(D.domain + '/page/box/batch_copy_page.html?_input_charset=UTF-8', formEl.serialize(), function(text) {
								var json = {};
								if(text) {
									json = $.parseJSON(text);
									if(json.status === 'success') {
										D.Msg.tip({
											timeout : 5000,
											message : '����ɹ�'
										});
										evt.data.dialog.dialog('close');
										//window.location.reload();
										$('#js-search-page').submit();
									} else {
										D.Msg.error({
											timeout : 5000,
											message : '����ʧ��'
										});
									}

								}
							});
						}
					}
				});

			}, 'text');

		});
		//����Ԥ��
		$('.js-dialog').delegate('.js-copy-preview', 'click', function(event) {
			var that = this, $self = $(that), pageId = $('#page_id').val(), $table = $self.closest('.table-sub')
			//
			strHref = D.domain + '/page/box/copyPreview.html?', grids = $table.find('textarea[name=grids]').val();
			strHref += "pageId=" + pageId;
			strHref += "&grids=" + encodeURIComponent(grids);
			$self.attr('href', strHref);

		});
		//��������ҳ������ɾ����
		new FE.tools.AddDelMove({
			container : '.js-dialog',
			operateEl : '.item-operate',
			afterAdd : function(cloneEl, el) {
				var textValue = $('#page-name-hide').val(), $pageName = cloneEl.find('input[name=pageName]'), num = 0;
				cloneEl.removeData('changed');
				$('em', cloneEl.parent()).each(function(index, obj) {
					var $self = $(obj);
					$self.html(index + 1);
					num++;
				});
				//�Զ�����ҳ������
				$pageName.val(textValue + '_' + num);
				$('.copy-body').scrollTop(9999);
			},
			afterDel : function(cloneEl, el, siblingEls) {
				if(siblingEls && siblingEls.length) {
					var textValue = $('#page-name-hide').val();
					$('em', siblingEls).each(function(index, obj) {
						var $self = $(obj), $parent = $self.closest('.item-operate'),
						//
						$pageName = $parent.find('input[name=pageName]');
						$(obj).html(index + 1);
						//�Զ�����ҳ������
						if(!$parent.data('changed')) {
							$pageName.val(textValue + '_' + (index + 1) + '');
						}

					});
					if(siblingEls.length === 1) {
						$('.icon-delete').hide();
					}
				}
			}
		});
	};
	var checkValid = function() {
		var formEl = $('#copyForm'), els = formEl.find('[data-valid]');
		var formValid = new FE.ui.Valid(els, {
			onValid : function(res, o) {
				var tip = $(this).nextAll('.dcms-validator-tip'), preTip = $(this).prevAll('.dcms-validator-tip'), msg;
				tip = $.merge(tip, preTip);
				if(tip.length > 1) {
					for(var i = 1, l = tip.length; i < l; i++) {
						tip.eq(i).remove();
					}
				}
				if(res === 'pass') {
					tip.hide();
					tip.removeClass('dcms-validator-error');
				} else {
					switch (res) {
						case 'required':
							//dialog��ʾ
							msg = '����д' + o.key;
							break;
						case 'sel-val':
							break;
						case 'float':
							msg = '��ȱ��������֣�������ʾ���أ�С����ʾ�ٷֱ�';
							break;
						default:
							msg = '����д��ȷ������';
							break;
					}
					tip.show();
					tip.text(msg);
					tip.addClass('dcms-validator-error');

				}
			}
		});
		return formValid.valid();
	};

})(dcms, FE.dcms);
