/**
 * @package
 * 资源位推商, 搜索
 * @author: qinming.zhengqm
 * @Date: 2014-01-13
 */

;(function($, D) {

	var readyFun = [
	/**
	 *事件绑定
	 */
	function() {
		$('#hand_way').delegate('.js-search-btn', 'click', function(event) {
			event.preventDefault();
			var searchCombineId = ""+$('#searchCombineId').val();
			if(searchCombineId==""){
				searchCombineId = $('#combine_id').val();
			}
			var data = {
				action : 'PreviewResDataAction',
				event_submit_do_fetch_idc_data : true,
				idcCombineId : searchCombineId,
				idcFields : D.Res.CONSTANTS.idcFields
			}, that = this, $self = $(this), $target = $self.closest('.js-data');
			data['queryString'] = ResMember.getQueryString.call($target[0]);
			if (!data['queryString']) {
				alert('请至少选择一个查询条件！');
				return;
			}
			data['queryString'] = data['queryString'];
			var $tab = $('.table-sub', '.js-data-search-result');
			ResMember.queryData.call(that, data, $tab);
		});

		$('#hand_way').delegate('.js-rec-member', 'click', function(event) {
			event.preventDefault();
			var that = this, $self = $(that), data = $self.closest('tr').data('member');
			if (!$self.hasClass('selected')) {
				$(document).trigger("append_member", [[data],
				function() {
					$self.addClass('selected');
					$self.html('已推荐');
					$(document).trigger('has_res');
				}]);
			}
		});

	},
	/**
	 *初始化页面数据
	 */
	function() {
		$('.js-select', '.js-data-param').each(function(index, obj) {
			var that = this, $self = $(this), config = $self.data('config'),
			//
			dataList = $self.data('inputConfig');
			ResMember.appendOption.call(that, dataList, config);
		});
		$('.js-ds-param[type=hidden]', '.js-data-param').each(function(index, obj) {
			console.log(this);
		});
	},
	function() {
		if (!supportsTemplate()) {
			$('template').hide();
		}
	}];
	/**
	 *检测是否支持template标签
	 */
	var supportsTemplate = function() {
		return 'content' in document.createElement('template');
	};
	var sweetData = function($tab, data, template) {
		template.attr('data-member', JSON.stringify(data));
		$('.chk-memberId', template).data('id', data['cs.memberId']);
		$('.viewName', template).html(data['cs.viewName']);
		$('.memberId', template).html(data['cs.memberId']);
		$('.productionServiceExtend', template).html(data['cs.productionServiceExtend']);
		$('.tradeTypeName', template).html(data['cs.tradeTypeName']);
		$('img', template).attr('src', data['medalSmallIconUrl']);
		$tab.append(template);
	};
	var ResMember = {
		queryData : function(data, $tab) {
			var $template = $('#search_result'), template = '';
			$.post(D.domain + '/page/box/json.html?_input_charset=UTF-8', data, function(text) {
				if (text) {
					var dataList = JSON.parse(text), data = '';
					$tab.empty();
					for (var i = 0; i < dataList.length; i++) {
						data = dataList[i];
						template = $($template.html());
						sweetData($tab, data, template);
					}
					$tab.closest('.js-data-search-result').removeClass('fd-hide');
				} else {
					alert('查询结果为空！');
					return;
				}
			});
		},
		getQueryString : function() {
			var dynamicRows = $(".dynamic-row");
			dynamicRows.each(function(){
				var target=this, evt = $(target).attr('setvalue-event');
				if(evt && evt=="setMLRRank"){
					D.setMLRRank($(target));
				}else if(evt && evt=="setPostCategoryValue"){
					D.setPostCategoryValue($(target));
				}
			});
			var that = this, $target = $(this), $dsParam = $('.js-ds-param', $target), params = '';
			$dsParam.each(function(index, obj) {
				var _$self = $(obj), name = _$self.attr('name');
				if (_$self.attr('type') === 'hidden') {
					var _$parent = _$self.parent(), start = $('#start_' + name, _$parent).val(), end = $('#end_' + name, _$parent).val();
					if (start && end) {
						_$self.val(start + '~' + end);
					} else if (start && !end) {
						_$self.val(start + '~');
					} else if (!start && end) {
						_$self.val('~' + end);
					}
				}
				if (_$self.val()) {
					params += '&' + name + '=' + encodeURIComponent(_$self.val());
				}
			});
			return params;
		},
		/**
		 *填充select
		 */
		appendOption : function(dataList, config) {
			var $target = $(this), strOption = '', options = '', selected = config.selected;
			if (dataList.label) {
				strOption += '<option value="">' + dataList.label + '</option>';
			} else {
				strOption += '<option value="">' + config.defLabel + '</option>';
			}
			if (dataList && dataList.options) {
				options = dataList.options;
				for (var i = 0; i < options.length; i++) {
					if (selected == options[i].value) {
						strOption += '<option selected="selected" value="' + options[i].value + '">' + options[i].label + '</option>';
					} else {
						strOption += '<option value="' + options[i].value + '">' + options[i].label + '</option>';
					}

				}
				$target.append(strOption);
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
})(dcms, FE.dcms);
