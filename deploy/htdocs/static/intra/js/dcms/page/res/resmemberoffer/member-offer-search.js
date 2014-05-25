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
				idcFields : encodeURIComponent(D.Res.CONSTANTS.idcMemberFields)
			}, that = this, $self = $(this), $target = $self.closest('.js-data'),
			//
			queryString = '', idcChildField = '';
			queryString = D.Res.getQueryString.call($target[0]);
			// + '&idcFields-143=' + encodeURIComponent(D.Res.CONSTANTS.idcMemberOfferFields);
			if (!queryString) {
				alert('请至少选择一个查询条件！');
				return;
			}
			$('.child', '#hand_way').each(function(index, obj) {
				var _$self = $(obj);
				idcChildField += '&' + _$self.data('config') + '=' + encodeURIComponent(D.Res.CONSTANTS.idcMemberOfferFields);
			});
			data['queryString'] = queryString + idcChildField;
			data['idcChildField'] = idcChildField;

			var $tab = $('.js-res-table', '.js-data-search-result');
			ResOffer.queryData.call(that, data, $tab, $self,$('.js-tr-row','.js-data-rec'));
		});
		/**
		 *添加到推荐列表
		 */
		$('.js-data-search-result').delegate('.js-rec-offer', 'click', function(event) {
			event.preventDefault();
			var that = this, $self = $(that), text = $self.html(), config = $self.data('config'),
			//
			$tr = $self.closest('.js-tr-row'), data = $tr.data('member');
			if (config) {
				if (config['type'] === 'add') {
					if (!$self.hasClass('selected')) {
						$(document).trigger("append_offer", [[data],
						function() {
							$(document).trigger('has_res');
							D.Res.changeStatus.call(that);
						}]);
					}
				}
				if (config['type'] === 'offer') {
					if (!$self.hasClass('selected')) {
						D.memberOffer.showOffer.call(that, data.offerList, $tr);
					} else {
						$('.js-member-offer', $tr).remove();
						//D.memberOffer.allOpenStatusChange.call($self[0]);
					}
					D.Res.changeStatus.call(that);
				}
				
			}
		});
		//批量添加
		$('.js-data-search-result').delegate('.js-batch-offer-rec', 'click', function(event) {
			event.preventDefault();
			var that = this, $chkKeys = $('.js-chk-key:checked', '.js-data-search-result'), keyList = [];
			$chkKeys.each(function(index, obj) {
				var _$self = $(obj), data = _$self.closest('.js-tr-row').data('member');
				keyList.push(data);
			});
			if (keyList && keyList.length) {
				$(document).trigger("append_offer", [keyList,
				function() {
					//console.log($chkOfferIds.length);
					$chkKeys.each(function(index, obj) {
						var $recOffer = $('.js-rec-offer', $(obj).closest('.js-tr-row'));
						$recOffer.each(function() {
							var _$self = $(this), config = _$self.data('config');
							if (config && config['type'] === 'add') {
								_$self.addClass('selected');
								_$self.html(config['name']);
							}
						});
						$('input[type=checkbox]', $(that).closest('.js-data')).removeAttr('checked');
					});
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

	var sweetData = function($tab, data, $template,isRec) {
		var $chkKey = $('.js-chk-key', $template);
		$template.attr('data-member', JSON.stringify(data));
		$chkKey.data('id', data['cs.memberId']);
		$('.js-memberId', $template).html(data['cs.memberId']);
		$('.js-productionService', $template).html(data['cs.productionService']);
		$('.js-viewName', $template).html(data['cs.viewName']);
		$('.js-tpServiceYear', $template).html(data['cs.tpServiceYear']);
		$('.js-establishedYear', $template).html(data['cs.establishedYear']);
		if(isRec){
			$chkKey.attr('disabled','disabled');
			$('.js-rec-offer',$template).each(function(index,obj){
				var $self = $(obj),config = $self.data('config');
				if(config&&config['type']==='add'){
					D.Res.changeStatus.call($self[0]);
				}
			});
		}
		$tab.append($template);
	};

	var ResOffer = {

		queryData : function(data, $tab, $btn,$keys) {
			var $template = $('#search_result'), template = '';
			$.post(D.domain + '/page/box/json.html?_input_charset=UTF-8', data, function(text) {
				if (text) {
					var dataList = JSON.parse(text), _data = '';
					$tab.empty();
					for (var i = 0; i < dataList.length; i++) {
						_data = dataList[i];
						template = $($template.html());
						_data['idcChildField'] = data['idcChildField'];
						sweetData($tab, _data, template,D.Res.checkIsRec(_data['cs.memberId'],$keys));
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
