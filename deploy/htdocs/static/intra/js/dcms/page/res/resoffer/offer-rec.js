/**
 * @package
 * 资源位offer 已推荐tab页面相关操作
 * @author: pingchun.yupc
 * @Date: 2014-01-9
 */

;(function($, D) {
	var readyFun = [
	function() {
		//添加一或多少条offer
		$(document).bind("append_offer", function(event) {
			event.preventDefault();
			var args = Array.prototype.slice.call(arguments, 1), $dataRec = $('.js-data-rec', '#hand_way'),
			//
			$tab = $('.js-res-table', $dataRec), $template = $('#rec_result'), template = $($template.html()),
			//
			data = args[0], offerId = '', $tr = '', selected = [];
			if ($.type(data) !== 'array') {
				data = [data];
			}
			for (var i = 0; i < data.length; i++) {
				offerId = data[i]['os.offerId'];
				$tr = $('.js-tr-row[data-offer=' + offerId + ']', $tab);
				if ($tr && $tr.length > 0) {
					selected.push(offerId);
				} else {
					sweetData($tab, data[i], template.clone());
				}
			}
			if (args && args[1]) {
				typeof args[1] === 'function' ? args[1]() : '';
			}
			$(document).trigger("append_intervention",[data]);
			if (selected && selected.length > 0) {
				alert(selected + '已添加到推荐列表,请勿重复添加！');
				return;
			}
		});
		/**
		 *删除一条或多条offer
		 */
		$(document).bind("remove_offer", function(event) {
			//event.preventDefault();
			//var args = Array.prototype.slice.call(arguments, 1);
		});
	},
	function() {
		$('#hand_way').delegate('.js-rec-operation', 'click', function(event) {
			event.preventDefault();
			var that = this, $self = $(that), direction = $self.data('val'), $src = $self.closest('.js-tr-row');
			offerMoveUpOrDown($src, direction);
		});
		/**
		 *全选
		 */
		$('.js-data-rec').delegate('.js-all-chk', 'click', function(event) {
			//event.preventDefault();
			var that = this, $self = $(that);
			if ($self.attr('checked') === 'checked') {
				$('.js-chk-key', '.js-data-rec').attr('checked', 'checked');
			} else {
				$('.js-chk-key', '.js-data-rec').removeAttr('checked');
			}
		});
		$('.js-data-rec').delegate('.js-chk-key', 'click', function(event) {
			var that = this, $self = $(that);
			if ($self.attr('checked') !== 'checked') {
				$('.js-all-chk', '.js-data-rec').removeAttr('checked');
			} 
		});
		//取消推荐
		$('.js-data-rec').delegate('.js-rec-cancel', 'click', function(event) {
			event.preventDefault();
			var that=this, $chkOfferIds = $('.js-chk-key:checked', '.js-data-rec');
			removeRecOffer($chkOfferIds);
			$('input[type=checkbox]',$(that).closest('.js-data')).removeAttr('checked');
		});
	}];
	/**
	 *取消推荐
	 */
	var removeRecOffer = function($chkOfferIds) {
		var keys =[];
		$chkOfferIds.each(function(index, obj) {
			var $self = $(this),$trRow = $self.closest('.js-tr-row');
			keys.push($trRow.data('key'));
			$trRow.remove();
		});
		$(document).trigger('delete_intervention',[keys]);
		$(document).trigger('has_res');
	};

	var sweetData = function($tab, data, template) {
		template.attr('data-offer', data['os.offerId']);
		template.attr('data-key', data['os.offerId']);
		$('.js-chk-key', template).data('id', data['os.offerId']);
		$('.js-title', template).html(data['os.subject']);
		$('.js-viewName', template).html(data['cs.viewName']);
		$('.js-offerId', template).html(data['os.offerId']);
		$('.js-price', template).html(data['os.price']);
		$('.js-url', template).html(data['os.url']);
		//http://i03.c.aliimg.com/img/ibank/2013/007/856/933658700_843197440.100x100.jpg
		$('img', template).attr('src', data['os.offerPicUrl100']);
		//$('img', template).attr('src', 'http://i03.c.aliimg.com/img/ibank/2013/007/856/933658700_843197440.100x100.jpg');
		$tab.append(template);
	};
	/**
	 *offer移动相关操作
	 * @param {Object} $src
	 * @param {Object} direction
	 */
	var offerMoveUpOrDown = function($src, direction) {
		var $target = '', $tab = $src.parent();
		$(document).trigger("move_intervention",[$src.data('key'),direction]);
		switch(direction) {
			case 'top':
				$('.js-tr-row', $tab).first().before($src);
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
				removeRecOffer($('.js-chk-key', $src));
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
