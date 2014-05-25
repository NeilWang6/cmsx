/**
 * 资源位公用js
 * @author : pingchun.yupc
 * @createTime : 2014-01-4
 */
;(function($, D, win) {
	var Res = {
		//推荐方式
		recWay : function() {
			var that = this, $self = $(that), config = $self.data('config');
			$('#' + config.show).removeClass('fd-hide');
			$('#' + config.hidden).addClass('fd-hide');
		},
		/**
		 *增加 排序选项
		 */
		addSortOperation : function() {
			var $self = $(this), $tr = $self.closest('.js-row');
			if ($self.hasClass('add')) {
				var _$tr = $tr.clone(), _$sortField = $('.js-sort-operation', _$tr);
				_$sortField.removeClass('add');
				_$sortField.addClass('delete');
				$tr.after(_$tr);
			}
			if ($self.hasClass('delete')) {
				$tr.remove();
			}
		},
		/**
		 *标签筛选字段
		 */
		filterTag : function($target) {
			var $self = $(this), that = this, config = $self.data('config'), tagId = config.id,
			//
			fieldRows = $('.js-field-row', $target);
			$('.js-filter-tag', $target).removeClass('current');
			$self.addClass('current');
			filterField.call(that, fieldRows, tagId);
		},
		/**
		 * 获取KV字符串
		 */
		getQueryString : function() {
			var that = this, $target = $(this), $dsParam = $('.js-ds-param', $target), params = '1=1';
			$dsParam.each(function(index, obj) {
				var _$self = $(obj), _value = '', name = _$self.attr('name'), split = _$self.attr('data-split');
				if (_$self.attr('type') === 'hidden' && split) {
					_value = handleBetweenField(_$self, split);
					if (_value) {
						_$self.val(_value);
					}
				}
				if (_$self.val()) {
					params += '&' + name + '=' + encodeURIComponent(_$self.val());
				}
			});

			var sortField = handleSortField($target);
			if (sortField) {
				params += sortField;
			}
			var mlr = processMlr($target);
			if (mlr) {
				params += '&mlr_session_ranker=' + encodeURIComponent(mlr);
			}

			return params;
		},
		/**
		 * 检测是否以推荐 true 已推荐  false 没有
		 */
		checkIsRec : function(key, $keys) {
			for (var i = 0; i < $keys.length; i++) {
				var $key = $($keys[i]);
				if ($.trim(key) === $.trim($key.data('key'))) {
					return true;
				}
			}
			return false;
		},
		/**
		 * 按钮状态发生变化
		 */
		changeStatus : function() {
			var $self = $(this), text = $self.html(), config = $self.data('config');
			$self.html(config['name']);
			if (!$self.hasClass('selected')) {
				$self.addClass('selected');
			} else {
				$self.removeClass('selected');
			}
			config['name'] = text;
			$self.removeData('config');
			$self.removeAttr('data-config');
			$self.attr('data-config', JSON.stringify(config));
		},
	};
	/**
	 * 处理（多）区间值
	 */
	var handleBetweenField = function($target, split) {
		var value = '', name = $target.attr('name'), $parent = $target.parent();
		if (split) {
			if ( typeof split === 'string' && split.indexOf('[') !== -1) {
				value = mutiBetweenField($target, split, name);
			} else {
				value = oneBetweenField($parent, split, name);
			}
		}
		return value;
	};
	/**
	 * 处理指定ID，商加品
	 */
	var mutiBetweenField = function($target, split, name) {
		var value = '', arr = '', first = '', second = '', config = $target.data('config'), elem = config['elem'];
		arr = JSON.parse(split);
		if (arr && arr instanceof Array && elem) {
			first = arr[0];
			second = arr[1];
			$(elem, $target.parent()).each(function(index, obj) {
				var _$self = $(obj);
				value += oneBetweenField(_$self, first, name) + second;
			});
		}
		return value;
	};

	/**
	 * 一个区间值
	 */
	var oneBetweenField = function($parent, split, name) {
		var start = $('#start_' + name, $parent).val(),
		//
		end = $('#end_' + name, $parent).val(), value = '';
		if (start && end) {
			value = (start + split + end);
		} else if (start && !end) {
			value = (start + split);
		} else if (!start && end) {
			value = (split + end);
		}
		return value;
	};
	//处理多个集全的排序
	var handleSortField = function($target) {
		var sortField = '', field = {}, $jsSortField = $('.js-sort-field', $target);
		for (var i = 0; i < $jsSortField.length; i++) {
			var _$self = $($jsSortField[i]), name = _$self.attr('name'), current = field[name];
			if (!(current && current instanceof Array)) {
				field[name] = [];
			}
			if (_$self.val()) {
				field[name].push(_$self.val());
			}
		}
		for (var sort in field) {
			var temp = field[sort];
			if (sort && temp && temp.length) {
				sortField += '&' + sort + '=' + encodeURIComponent(temp.join(';'));
			}
		}
		return sortField;
	};
	Res.CONSTANTS = {
		idcFields : ',cs.viewName,os.price,os.offerId,os.offerPicUrl100,os.subject,os.url,',
		idcMemberOfferFields : ',os.price,os.offerId,os.offerPicUrl100,os.subject,os.url,',
		idcMemberFields : ',cs.viewName,cs.memberId,cs.productionService,cs.tpServiceYear,cs.establishedYear,'
	};
	D.Res = Res;
	/**
	 * 对外提供接口
	 */
	win.getResData = function() {
		//event.preventDefault();
		var args = Array.prototype.slice.call(arguments, 0), that = this, $resBlock = $('.res-block', that.document);
		//
		$way = $('input[name="way"]:checked', $resBlock), way = $way.val(), offerIds = [], data = {},
		//
		$combineId = $('#combine_id', $resBlock), $sourceType = $('#source_type', $resBlock),
		//
		$dataRec = $('.js-data-rec', '#hand_way'), $tab = $('.js-res-table', $dataRec),$dataSet = $('.js-data-set',$resBlock),
		//
		scheduleId = '', viewParamJson = {}, $autoWay = '', $fTag = '', $curTag = '',
		//
		config = $tab.data('config');

		if ($sourceType.val() === 'idc') {
			data['sourceType'] = 'idc';
			data['combineId'] = $combineId.val();

			if (way === 'hand') {
				scheduleId = $tab.data('schedule');
				$('.js-tr-row', $tab).each(function(index, obj) {
					var $self = $(this), that = this, offerId = $self.data(config['row']);
					offerIds.push(offerId);
				});
				if (config['row'] === 'member') {
					data['queryFields'] = encodeURIComponent(Res.CONSTANTS.idcMemberFields);
					if(offerIds&&offerIds.length){
						data['query'] = config['id'] + '=' + encodeURIComponent(offerIds.join(';'));
					}
					
				}
				if (config['row'] === 'offer') {
					data['queryFields'] = encodeURIComponent(Res.CONSTANTS.idcFields);
					if(offerIds&&offerIds.length){
						data['query'] = config['id'] + '=' + encodeURIComponent(offerIds.join(','));
					}
					
				}
				if($dataSet && $dataSet.length){
					var $sortType = $('.js-sort-type',$dataSet),$showNum = $('.js-show-num',$dataSet),display={};
					//":{"sortType":"sales","showNum":20}}
					if($sortType && $sortType.length){
						display[$sortType.attr('name')]=$sortType.val();
					}
					if($showNum && $showNum.length){
						display[$showNum.attr('name')]=$showNum.val();
					}
					data['display'] = display;
				}

			} else {
				$autoWay = $('#auto_way'), $fTag = $('.js-f-tag', $autoWay), $curTag = $('a.current', $fTag);
				viewParamJson['tagId'] = $curTag.data('config') && $curTag.data('config')['id'];
				var queryStr = Res.getQueryString.call($autoWay[0]);
				if(queryStr){
					data['query'] = queryStr;
				}
				
				scheduleId = $('ul[data-schedule]', $autoWay).attr('data-schedule');
			}
			viewParamJson['way'] = way;
		}
		
		return {
			'viewParamJson' : viewParamJson,
			'dataParamJson' : data,
			'id' : scheduleId,
			'mergeJson':D.getIntervention.call($('.js-data-intervention',$resBlock)[0])
		};
	};

	/**
	 *标签筛选字段
	 */
	var filterField = function(fieldRows, tagId) {
		fieldRows.each(function(index, obj) {
			var _that = this, _$self = $(this), _config = _$self.data('config'), _tags = _config.tag;
			if (tagId == -1) {
				_$self.removeClass('fd-hide');
			} else {
				if (_tags.indexOf(',' + tagId + ',') !== -1) {
					_$self.removeClass('fd-hide');
				} else {
					_$self.addClass('fd-hide');
				}
			}
		});
	};
	var processMlr = function($target) {
		var mlrFieldRow = $('#mlr_field_row', $target), $oTd = mlrFieldRow.parent(), params = '';
		var $lbOrderField = $('select.lbOrderField', $oTd), $sjOrderField = $('select.sjOrderField', $oTd),
		//
		$wdOrderField = $('select.wdOrderField', $oTd);
		if ($wdOrderField.val() && $sjOrderField.val() && $lbOrderField.val()) {
			params = $lbOrderField.val() + '-' + $wdOrderField.val() + '-' + $sjOrderField.val();
			return params;
		}
		return '';
	};

})(dcms, FE.dcms, window);
