/**
 * @package
 * 资源位offer 已推荐tab页面相关操作
 * @author: pingchun.yupc
 * @Date: 2014-01-9
 */

;(function($, D) {
	var readyFun = [
	function() {
		//添加一或多少条id
		$(document).bind("append_offer", function(event) {
			event.preventDefault();
			var args = Array.prototype.slice.call(arguments, 1), $dataRec = $('.js-data-rec', '#hand_way'),
			//
			$tab = $('.js-res-table', $dataRec), $template = $('#rec_result'), template = $($template.html()),
			//
			data = args[0], memberId = '', $tr = '', selected = [];
			if ($.type(data) !== 'array') {
				data = [data];
			}
			for (var i = 0; i < data.length; i++) {
				memberId = data[i]['cs.memberId'];
				$tr = $('.js-tr-row[data-key=' + memberId + ']', $tab);
				if ($tr && $tr.length > 0) {
					selected.push(memberId);
				} else {
					sweetData($tab, data[i], template.clone());
				}

			}
			if (args && args[1]) {
				typeof args[1] === 'function' ? args[1]() : '';
			}
			$(document).trigger("append_intervention", [data]);
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
			dataOperation.call(that, $src, direction);
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
			var that = this, $chkOfferIds = $('.js-chk-key:checked', '.js-data-rec');
			removeRecOffer($chkOfferIds);
			$('input[type=checkbox]', $(that).closest('.js-data')).removeAttr('checked');
		});
	},
	function() {
		new FE.tools.AddDelMove({
			container : '.js-data-id-rec',
			operateEl : '.item-operate',
			afterAdd : function(cloneEl, el) {
				//console.log(cloneEl);
				//console.log(el);
			}
		});
	}];
	/**
	 *取消推荐
	 */
	var removeRecOffer = function($chkOfferIds) {
		var keys = [];
		$chkOfferIds.each(function(index, obj) {
			var $self = $(this), $trRow = $self.closest('.js-tr-row');
			keys.push($trRow.data('key'));
			$trRow.remove();
		});
		$(document).trigger('delete_intervention', [keys]);
		$(document).trigger('has_res');
	};

	var sweetData = function($tab, data, $template) {
		$template.attr('data-key', data['cs.memberId']), idcString = data['cs.memberId'];
		var offerList = data['offerList'], offerIds = [];
		if (offerList) {
			for (var i = 0; i < offerList.length; i++) {
				var offer = offerList[i];
				offerIds.push(offer['os.offerId']);
			}
			if (offerIds && offerIds.length) {
				idcString += ':' + offerIds.join(',');
			}
		}
		$template.attr('data-member', idcString);
		$template.attr('data-field', data['idcChildField']);

		$('.js-chk-key', $template).data('id', data['cs.memberId']);
		$('.js-memberId', $template).html(data['cs.memberId']);
		$('.js-productionService', $template).html(data['cs.productionService']);
		$('.js-viewName', $template).html(data['cs.viewName']);
		$('.js-tpServiceYear', $template).html(data['cs.tpServiceYear']);
		$('.js-establishedYear', $template).html(data['cs.establishedYear']);
		$tab.append($template);
	};
	/**
	 *对数据的操作：移动，取消等
	 * @param {Object} $src
	 * @param {Object} direction
	 */
	var dataOperation = function($src, direction) {
		var that = this, $self = $(that), $target = '', $tab = $src.parent();

		switch(direction) {
			case 'top':
				$(document).trigger("move_intervention", [$src.data('key'), direction]);
				$('.js-tr-row', $tab).first().before($src);
				break;
			case 'prev':
				$(document).trigger("move_intervention", [$src.data('key'), direction]);
				$target = $src.prev();
				$target.before($src);
				break;
			case 'next':
				$(document).trigger("move_intervention", [$src.data('key'), direction]);
				$target = $src.next();
				$target.after($src);
				break;
			case 'cancel':
				removeRecOffer($('.js-chk-key', $src));
				break;
			case 'modify':
				modifyOffer.call(that, $src, function() {
					var $self = $(this), $parent = $self.parent(), $showOffer = $('a[data-val="showOffer"]', $parent);
					if ($showOffer.hasClass('selected')) {
						$('.js-member-offer', $src).remove();
						showOffer.call($showOffer[0], $src);
					} else {
						showOffer.call($showOffer[0], $src);
						D.Res.changeStatus.call($showOffer[0]);
					}
				});
				break;
			case 'showOffer':
				if (!$self.hasClass('selected')) {
					showOffer.call(that, $src, D.Res.changeStatus);
				} else {
					$('.js-member-offer', $src).remove();
					//D.memberOffer.allOpenStatusChange.call($self[0]);
					D.Res.changeStatus.call(that);
				}

				break;
			default:
				break;
		}
	};
	var modifyOffer = function($src, callback) {
		var that = this, $dialog = $('.js-dialog'), member = $src.data('member'), temp = '',
		//
		template = $('#js_member_offer').html(), $template = $("<div>" + template + "</div>");
		if (member) {
			temp = member.split(":");
		}
		if (temp && temp.length === 2) {
			$('.textarea', $template).html(temp[1]);
		}
		D.Msg['confirm']({
			'title' : '更改商品',
			'body' : $template.html(),
			'noclose' : true,
			'success' : function(evt) {
				var $textarea = $('.textarea', $dialog), _value = $textarea.val(), _values = _value.split(','),
				//
				_val = '', count = 5;
				/**
				 *默认取前5条
				 */
				if (_values.length > count) {
					for (var i = 0; i < count; i++) {
						_val += _values[i] + ',';
					}
					$textarea.val(_val);
				}

				member = temp[0] + ":" + $textarea.val();
				$src.removeData('member');
				$src.attr('data-member', member);

				$(document).trigger("modify_offer", [temp[0], handleDataIntervention.call(that, $src, member)]);
				callback && typeof callback === 'function' && callback.call(that);
				evt.data.dialog.dialog('close');
			}
		}, {
			'modal' : false
		});
	};
	//处理数据干预
	var handleDataIntervention = function($src, member) {
		var data = {
			idcCombineId : $('#combine_id').val(),
			idcFields : encodeURIComponent(D.Res.CONSTANTS.idcMemberOfferFields)
		}, $tab = $src.parent(), tabConfig = $tab.data('config'), field = $src.data('field'), queryString = '';
		queryString = tabConfig['id'] + '=' + encodeURIComponent(member);
		if (field) {
			queryString += field;
		}
		data['queryString'] = queryString;
		return data;
	};
	/**
	 *推荐列表商加品 ：展示offer
	 */
	var showOffer = function($src, callback) {
		var that = this, $self = $(that), text = $self.html(), $tab = $src.parent(), tabConfig = $tab.data('config'), member = $src.data(tabConfig['row']), data = {
			action : 'PreviewResDataAction',
			event_submit_do_fetch_idc_data : true,
			idcCombineId : $('#combine_id').val(),
			idcFields : encodeURIComponent(D.Res.CONSTANTS.idcMemberOfferFields)
		}, field = $src.data('field');
		var queryString = tabConfig['id'] + '=' + encodeURIComponent(member);
		if (field) {
			queryString += field;
		}
		data['queryString'] = queryString;
		$.post(D.domain + '/page/box/json.html?_input_charset=UTF-8', data, function(text) {
			if (text) {
				var dataList = JSON.parse(text), config = $self.data('config');
				if (dataList && dataList.length) {
					var data = dataList[0];
					D.memberOffer.showOffer.call(that, data.offerList, $src);
					callback && typeof callback === 'function' && callback.call(that);
				}
			} else {
				alert('查询结果为空！');
				return;
			}
		});

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
