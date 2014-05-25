/**
 * @package
 * 资源位offer 顶部tab页切换
 * @author: pingchun.yupc
 * @Date: 2014-01-9
 */

;(function($, D, win) {
	var readyFun = [
	function() {
		/**
		 * tab页选择
		 */
		$('#hand_way').delegate('.js-tab', 'click', function(event) {
			event.preventDefault();
			var self = $(this), $handWay = $('#hand_way'), $data = $('.js-data', $handWay),
			//
			$tab = $('a.js-tab', $handWay);
			$tab.removeClass('current');
			self.addClass('current');
			$data.addClass('fd-hide');
			$('.' + self.data('panel'), $handWay).removeClass('fd-hide');

		});
		/**
		 * 推荐方式方法选择
		 */
		$('.js-rec-way').delegate('input[name="way"]', 'click', function(event) {
			var that = this, $self = $(that);
			if ($self.attr('checked') === 'checked') {
				D.Res.recWay.call(that);
			}

		});

	},
	function() {
		/**
		 * 已推荐数
		 */
		$(document).bind("has_res", function(event) {
			event.preventDefault();
			var args = Array.prototype.slice.call(arguments, 1), $dataRec = $('.js-data-rec', '#hand_way'),
			//
			$tab = $('.js-res-table',$dataRec)[0], recNum = 0;
			recNum += $('.js-tr-row',$tab).length;
			$('.js-has-res', '#hand_way').html(recNum + '');
			if (args && args[0]) {
				typeof args[0] === 'function' ? args[0]() : '';
			}
		});

		$(document).trigger('has_res');
		D.Res.recWay.call($('input[name="way"]:checked','.js-rec-way')[0]);
		D.Res.filterTag.call($('.js-f-tag .current','#auto_way')[0], $('#auto_way'));
	}];
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
})(dcms, FE.dcms, window);
