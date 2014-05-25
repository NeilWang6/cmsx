/**
 * ab测试页面相关JS
 * @author pingchun.yupc
 * @date 2014-02-27
 */
;(function($, D) {
	D.ab = {
		openDialog : function(pageId) {
			var that = this, data = {
				action : 'BoxAbtestAction',
				event_submit_do_get_page_abtest_plugin : true,
				pageId : pageId
			};
			$.post(D.domain + '/page/abtest/abtest.html?_input_charset=UTF-8', data, function(text) {
				var $Dialog = $('.js-dialog');
				$('footer', $Dialog).show();
				$('.btn-submit', $Dialog).html('保存');
				$('.btn-submit', $Dialog).show();
				D.Msg.confirm({
					'title' : "设置AB测试版本信息",
					'body' : text,
					'noclose' : true,
					'success' : function(evt) {
						var $version = $('.js-version', $Dialog);
						saveAbtest.call(that, pageId, $version,evt);
					}
				});
				addDel.call(that);
			});

		}
	};
	/**
	 * 保存AB信息
	 * @param {Object} pageId
	 * @param {Object} abs
	 */
	var saveAbtest = function(pageId, $version,evt) {
		var value = {
			action : 'BoxAbtestAction',
			event_submit_do_save_page_abtest_plugin : true,
			pageId : pageId
		}, abs = [];
		$version.each(function(index, obj) {
			var $self = $(obj), ab = {}, num = parseInt($('.version', $self).html());
			ab['version'] = num;
			$('.input-text', obj).each(function() {
				var _$self = $(this);
				ab[_$self.attr('name')] = _$self.val();
			});
			abs.push(ab);
		});
		value['abs'] = JSON.stringify(abs);
		$.post(D.domain + '/page/json.html', value, function(text) {
			if (text) {
				var json = $.parseJSON(text),$abtestError = $('#abtest_error');
				$abtestError.empty();
				if (json && json.status === 'success') {
					evt.data.dialog.dialog('close');
					alert('保存成功');
					return;
				} else {
					console.log(json);
					//console.log(json&&json.msg);
					if(json&&json.msg){
						$abtestError.html(json.msg);
					} else {
						alert('保存失败！');
					}
					return;
				}
			}

		});
	};
	var addDel = function() {
		new FE.tools.AddDelMove({
			container : '.js-abtest',
			operateEl : '.item-operate',
			afterAdd : function(cloneEl, el) {
				var num = parseInt($('.version', cloneEl.prev()).html()) + 1, $next = '';
				$('.version', cloneEl).html(num);
				$('input[type=text]', cloneEl).val('').attr('title', '');
				$('.js-edit-page', cloneEl).remove();
				$next = cloneEl.next();
				while ($next && $next.length) {
					num = num + 1;
					$('.version', $next).html(num);
					$('input[type=text]', $next).val('').attr('title', '');
					$('.js-edit-page', $next).remove();
					$next = $next.next();
				}
			},
			afterDel : function(cloneEl, el, siblingEls) {
				siblingEls.each(function(index, obj) {
					var $self = $(obj);
					$('.version', $self).html(index + 1);
				});
			}
		});
	};
})(dcms, FE.dcms);
