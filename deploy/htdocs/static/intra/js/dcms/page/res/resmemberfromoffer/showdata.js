/**
 * @package
 * 资源位推商，已推荐tab页面相关操作
 * @author:qinming.zhengqm
 * @Date: 2014-01-9
 */

;(function($, D) {
	var readyFun = [
	function() {
		//添加一或多少条member
		$(document).bind("append_member", function(event) {
			event.preventDefault();
			var args = Array.prototype.slice.call(arguments, 1), $dataRec = $('.js-data-rec', '#hand_way'),
			//
			$tab = $('.table-sub', $dataRec), $template = $('#rec_result'), template = $($template.html()),
			//
			data = args[0], memberId = '', $tr = '', selected = [];

			if ($.type(data) !== 'array') {
				data = [data];
			}
			for (var i = 0; i < data.length; i++) {
				memberId = data[i]['cs.memberId'];
				$tr = $('tr[data-memberId=' + memberId + ']', $tab);
				if ($tr && $tr.length > 0) {
					selected.push(memberId);
				} else {
					sweetData($tab, data[i], template);
				}
			}
			if (args && args[1]) {
				typeof args[1] === 'function' ? args[1]() : '';
			}
			if (selected && selected.length > 0) {
				alert(selected + '已添加到推荐列表,请勿重复添加！');
				return;
			}
		});
		/**
		 *删除一条或多条member
		 */
		$(document).bind("remove_member", function(event) {
			event.preventDefault();
			var args = Array.prototype.slice.call(arguments, 1);
		});
	},
	function() {
		$('#hand_way').delegate('.js-rec-operation', 'click', function(event) {
			event.preventDefault();
			var that = this, $self = $(that), direction = $self.data('val'), $src = $self.closest('tr');
			memberMoveUpOrDown($src, direction);
		});
		/**
		 *全选
		 */
		$('#hand_way').delegate('.js-all-chk', 'click', function(event) {
			//event.preventDefault();
			var that = this, $self = $(that);
			if ($self.attr('checked') === 'checked') {
				$('.chk-memberId', '.js-data-rec').attr('checked', 'checked');
			} else {
				$('.chk-memberId', '.js-data-rec').removeAttr('checked');
			}
		});
		$('.js-data-rec').delegate('.chk-memberId', 'click', function(event) {
			var that = this, $self = $(that);
			if ($self.attr('checked') !== 'checked') {
				$('.js-rec-cancel', '#hand_way').removeAttr('checked');
			}
		});
		//取消推荐
		$('#hand_way').delegate('.js-rec-cancel', 'click', function(event) {
			event.preventDefault();
			var $chkMemberIds = $('.chk-memberId:checked', '.js-data-rec');
			removeRecMember($chkMemberIds);
		});
	}];
	/**
	 *取消推荐
	 */
	var removeRecMember = function($chkMemberIds) {
		$chkMemberIds.each(function(index, obj) {
			var $self = $(this);
			$self.closest('tr').remove();
		});
		$(document).trigger('has_res');
	};

	var sweetData = function($tab, data, template) {
		template.attr('data-member', data['cs.memberId']);
		$('.chk-memberId', template).data('id', data['cs.memberId']);
		$('.viewName', template).html(data['cs.viewName']);
		$('.memberId', template).html(data['cs.memberId']);
		$('.productionServiceExtend', template).html(data['cs.productionServiceExtend']);
		$('.productionServiceExtend', template).attr("title",data['cs.productionServiceExtend']);
		$('.tradeTypeName', template).html(data['cs.tradeTypeName']);
		$('img', template).attr('src', data['medalSmallIconUrl']);
		$tab.append(template);
	};
	/**
	 *member移动相关操作
	 * @param {Object} $src
	 * @param {Object} direction
	 */
	var memberMoveUpOrDown = function($src, direction) {
		var $target = '', $tab = $src.parent();
		switch(direction) {
			case 'top':
				$('tr', $tab).first().before($src);
				break;
			case 'prev':
				$target = $src.prev();
				$target.before($src);
				break;
			case 'next':
				$target = $src.next();
				$target.after($src);
				break;
			case 'cancel':
				removeRecMember($('.chk-memberId', $src));
				break;
			default:
				break;
		}
	};

	$(function() {
		for (var i = 0, l = readyFun.length; i < l; i++) {
			try {
				readyFun[i]();
			} catch(e) {
				if ($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			} finally {
				continue;
			}
		}
	});
})(dcms, FE.dcms);
