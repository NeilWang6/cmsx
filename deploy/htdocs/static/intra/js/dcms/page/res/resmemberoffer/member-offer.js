/**
 * @package
 * ��Դλoffer ����tabҳ�л�
 * @author: pingchun.yupc
 * @Date: 2014-01-9
 */

;(function($, D, win) {
	var readyFun = [
	function() {
		/**
		 * tabҳѡ��
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
		 * �Ƽ���ʽ����ѡ��
		 */
		$('.js-rec-way').delegate('input[name="way"]', 'click', function(event) {
			var that = this, $self = $(that);
			if ($self.attr('checked') === 'checked') {
				D.Res.recWay.call(that);
			}

		});
		//ȫ��չ��������Ʒ
		$('#hand_way').delegate('.js-all-open', 'click', function(event) {
			event.preventDefault();
			var that = this, $self = $(that), $data = $self.closest('.js-data'),
			//
			isOpen = $self.hasClass('selected');
			//ɸѡ�б�
			$('.js-rec-offer', $data).each(function(index, obj) {
				var _that = this, _$self = $(_that), config = _$self.data('config');
				if (config && config['type'] === 'offer') {
					if (!(!isOpen && _$self.hasClass('selected'))) {
						_$self.trigger('click');
					}

				}
			});
			//�Ƽ��б�
			$('.js-rec-operation', $data).each(function(index, obj) {
				var _that = this, _$self = $(_that), config = _$self.data('config');
				if (config && config['type'] === 'offer') {
					if (!(!isOpen && _$self.hasClass('selected'))) {
						_$self.trigger('click');
					}
				}
			});
			D.Res.changeStatus.call(that);
		});

	},
	function() {

		/**
		 * ���Ƽ���
		 */
		$(document).bind("has_res", function(event) {
			event.preventDefault();
			var args = Array.prototype.slice.call(arguments, 1), $dataRec = $('.js-data-rec', '#hand_way'),
			//
			$tab = $('.js-res-table',$dataRec)[0], recNum = 0;
			recNum += $('.js-tr-row', $tab).length;
			$('.js-has-res', '#hand_way').html(recNum + '');
			if (args && args[0]) {
				typeof args[0] === 'function' ? args[0]() : '';
			}
		});
		$(document).trigger('has_res');
		D.Res.recWay.call($('input[name="way"]:checked','.js-rec-way')[0]);
		D.Res.filterTag.call($('.js-f-tag .current','#auto_way')[0], $('#auto_way'));
	}];
	D.memberOffer = {
		sweetOfferData : function($target, data, $template) {
			//http://i03.c.aliimg.com/img/ibank/2013/007/856/933658700_843197440.100x100.jpg
			$('.js-offer-img', $template).attr('src', data['os.offerPicUrl100']);
			//$('.js-offer-img', $template).attr('src', 'http://i03.c.aliimg.com/img/ibank/2013/007/856/933658700_843197440.100x100.jpg');
			$('.js-offer-id', $template).html(data['os.offerId']);
			$('.js-offer-id', $template).attr('title', data['os.offerId']);
			$('.js-offer-title', $template).html(data['os.subject']);
			$('.js-offer-title', $template).attr('title', data['os.subject']);
			$('.js-offer-price', $template).html('&yen;' + data['os.price']);
			$target.append($template);
		},
		/**
		 * չʾ�̼�Ʒ�е�offer
		 * @param {Object} dataList offerList
		 * @param {Object} $target ��ǰ������
		 */
		showOffer : function(dataList, $target) {
			var $template = $($('#rec_offer').html()), $temp = $('ul', $template),
			//
			repeatStr = $temp.html(), $copyRepeat = '';
			$temp.empty();
			if (dataList) {
				for (var i = 0; i < dataList.length; i++) {
					var data = dataList[i];
					D.memberOffer.sweetOfferData($temp, data, $(repeatStr));
				}
			} else {
				$('.js-offer-tip', $template).remove();
				$temp.replaceWith('<span class="key offer-label no-result">û�в鵽�˻�Ա�����Ʒ��Ϣ!</span>');
			}
			$target.append($template);
		},
		/**
		 * ȫ��չ��or����״̬�仯
		 */
		allOpenStatusChange : function() {
			var $self = $(this), $allOpen = $('.js-all-open', $self.closest('.js-data'));
			if ($allOpen.hasClass('selected')) {
				D.Res.changeStatus.call($allOpen[0]);
			}

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
})(dcms, FE.dcms, window);
