/**
 * @package
 * 资源位offer
 * @author: pingchun.yupc
 * @Date: 2014-01-4
 */

;(function($, D) {

	var readyFun = [
	/**
	 *事件绑定
	 */
	function() {
		/**
		 *标签筛选字段
		 */
		$('#hand_way').delegate('.js-filter-tag', 'click', function(event) {
			event.preventDefault();
			var that = this;
			D.Res.filterTag.call(that, $('#hand_way'));
		});
		//查询
		$('#hand_way').delegate('.js-search-btn', 'click', function(event) {
			event.preventDefault();
			var data = {
				action : 'PreviewResDataAction',
				event_submit_do_fetch_idc_data : true,
				idcCombineId : $('#combine_id').val(),
				idcFields : D.Res.CONSTANTS.idcFields
			}, that = this, $self = $(this), $target = $self.closest('.js-data');
			data['queryString'] = D.Res.getQueryString.call($target[0]);
			if (!data['queryString']) {
				alert('请至少选择一个查询条件！');
				return;
			}
			var $tab = $('.js-res-table', '.js-data-search-result');
			ResOffer.queryData.call(that, data, $tab, $self,$('.js-tr-row','.js-data-rec'));
		});
		/**
		 *添加到推荐列表
		 */
		$('.js-data-search-result').delegate('.js-rec-offer', 'click', function(event) {
			event.preventDefault();
			var that = this, $self = $(that), data = $self.closest('.js-tr-row').data('offer');
			if (!$self.hasClass('selected')) {
				$(document).trigger("append_offer", [[data],
				function() {
					$self.addClass('selected');
					$self.html('已推荐');
					$(document).trigger('has_res');
				}]);
			}
		});
		//批量添加
		$('.js-data-search-result').delegate('.js-batch-offer-rec', 'click', function(event) {
			event.preventDefault();
			var that=this, $chkOfferIds = $('.js-chk-key:checked', '.js-data-search-result'), offerList = [];
			$chkOfferIds.each(function(index, obj) {
				var _$self = $(obj), data = _$self.closest('.js-tr-row').data('offer');
				offerList.push(data);
			});
			if (offerList && offerList.length) {
				$(document).trigger("append_offer", [offerList,
				function() {
					//console.log($chkOfferIds.length);
					$chkOfferIds.each(function(index, obj) {
						$('.js-rec-offer', $(obj).closest('.js-tr-row')).addClass('selected').html('已推荐');
					});
					$('input[type=checkbox]',$(that).closest('.js-data')).removeAttr('checked');
					$(document).trigger('has_res');
				}]);
			}
		});
		/**
		 *增加排序选择
		 */
		$('#hand_way').delegate('.js-sort-operation', 'click', function(event) {
			event.preventDefault();
			var that = this;
			D.Res.addSortOperation.call(that);
		});

		/**
		 *全选
		 */
		$('.js-data-search-result').delegate('.js-all-chk', 'click', function(event) {
			//event.preventDefault();
			var that = this, $self = $(that);
			if ($self.attr('checked') === 'checked') {
				$('.js-chk-key', '.js-data-search-result').not(':disabled').attr('checked', 'checked');
			} else {
				$('.js-chk-key', '.js-data-search-result').removeAttr('checked');
			}
		});
		$('.js-data-search-result').delegate('.js-chk-key', 'click', function(event) {
			var that = this, $self = $(that);
			if ($self.attr('checked') !== 'checked') {
				$('.js-all-chk', '.js-data-search-result').removeAttr('checked');
			}
		});
	}];

	var sweetData = function($tab, data, template,isRec) {
		template.attr('data-offer', JSON.stringify(data));
		var $chkKey = $('.js-chk-key', template);
		$chkKey.data('id', data['os.offerId']);
		$('.js-title', template).html(data['os.subject']);
		$('.js-viewName', template).html(data['cs.viewName']);
		$('.js-offerId', template).html(data['os.offerId']);
		$('.js-price', template).html(data['os.price']);
		$('.js-url', template).html(data['os.url']);
		$('img', template).attr('src', data['os.offerPicUrl100']);
		if(isRec){
			$chkKey.attr('disabled','disabled');
			$('.js-rec-offer',template).each(function(index,obj){
				var $self = $(obj),config = $self.data('config');
				if(config&&config['type']==='add'){
					D.Res.changeStatus.call($self[0]);
				}
			});
		}
		$tab.append(template);
	};
	var ResOffer = {
		queryData : function(data, $tab, $btn,$keys) {
			var $template = $('#search_result'), template = '';
			$.post(D.domain + '/page/box/json.html?_input_charset=UTF-8', data, function(text) {
				if (text) {
					var dataList = JSON.parse(text), data = '';
					$tab.empty();
					for (var i = 0; i < dataList.length; i++) {
						data = dataList[i];
						template = $($template.html());
						sweetData($tab, data, template,D.Res.checkIsRec(data['os.offerId'],$keys));
					}
					$tab.closest('.js-data-search-result').removeClass('fd-hide');
					$btn.closest('.js-data').addClass('fd-hide');
				} else {
					alert('查询结果为空！');
					return;
				}
			});
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
