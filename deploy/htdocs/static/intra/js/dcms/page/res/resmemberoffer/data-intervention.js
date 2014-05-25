/**
 * offer数据干预
 * @author pingchun.yupc
 * @Date: 2014-02-11
 */
;(function($, D, win) {
	var readyFun = [
	function() {
		$('.js-data-intervention').delegate('.js-intervention', 'input', function(event) {
			var that = this, $self = $(that), value = $self.val();
			if (value && value.trim()) {
				$self.addClass('js-update');
			} else {
				$self.removeClass('js-update');
			}
			if ($self.hasClass('js-img-url')) {
				$('img', $self.closest('.element')).attr('src', value);
			}

		});
	},
	function() {
		/**
		 * 修改offer
		 */
		$(document).bind("modify_offer", function(event) {
			event.preventDefault();
			var args = Array.prototype.slice.call(arguments, 1), memberId = args[0], data = args[1];
			data['action'] = 'PreviewResDataAction';
			data['event_submit_do_fetch_idc_data'] = true;
			$.post(D.domain + '/page/box/json.html?_input_charset=UTF-8', data, function(text) {
				if (text) {
					var dataList = JSON.parse(text);
					if (dataList && dataList.length) {
						var _data = dataList[0], offerList = _data.offerList,
						//
						$target=$('.list[data-key="'+memberId+'"]','.js-intervention-list'),
						//
						$offerList = $('.element',$target),$offer=$($offerList[0]),$temp = $offer.clone(),$offerParent = $('.js-member-offer',$target);
						if(offerList){
							$offerParent.empty();
							sweetOfferData($offerParent,offerList,$temp);
						}
						
					}
				}
			});

		});

		//添加数据到推荐列表后，添加到数据干预列表
		$(document).bind("append_intervention", function(event) {
			event.preventDefault();
			var args = Array.prototype.slice.call(arguments, 1), dataList = args[0],
			//
			$interventionList = $('.js-intervention-list', '.js-data-intervention'),
			//
			$template = $('#template_data_intervention'), $temp = $($template.html()),
			//
			$key = '', data = '';

			if (dataList && dataList.length) {
				for (var i = 0; i < dataList.length; i++) {
					data = dataList[i];
					$key = $('.list[data-key=' + data['cs.memberId'] + ']', $interventionList);
					if (!($key && $key.length)) {
						sweetData($interventionList, data, $temp.clone());
					}
				}
			}
			initUpload();
		});
		//取消推荐后，删除干预列表数据
		$(document).bind("delete_intervention", function(event) {
			event.preventDefault();
			var args = Array.prototype.slice.call(arguments, 1), dataList = args[0],
			//
			$interventionList = $('.js-intervention-list', '.js-data-intervention');
			if (dataList && dataList.length) {
				for (var i = 0; i < dataList.length; i++) {
					$('.list[data-key=' + dataList[i] + ']', $interventionList).remove();
				}
			}
		});
		//移动干预数据
		$(document).bind("move_intervention", function(event) {
			event.preventDefault();
			var args = Array.prototype.slice.call(arguments, 1), key = args[0], direction = args[1],
			//
			$interventionList = $('.js-intervention-list', '.js-data-intervention'),
			//
			$key = $('.list[data-key=' + key + ']', $interventionList), $target = '';
			switch(direction) {
				case 'top':
					$('.list', $key.parent()).first().before($key);
					break;
				case 'prev':
					$target = $key.prev();
					$target.before($key);
					break;
				case 'next':
					$target = $key.next();
					$target.after($key);
					break;
				default:
					break;
			}
		});
	}];
	//
	var sweetOfferData = function($parent, offerList, $temp) {
		if (offerList) {
			for (var i = 0; i < offerList.length; i++) {
				offer = offerList[i];
				var offerImg = offer['os.offerPicUrl100'] && offer['os.offerPicUrl100'].replace('.summ.', '.search.');
				$offer = $temp.clone();
				$('.element', $offer).attr('data-key', offer['os.offerId']);
				$('.js-subject', $offer).attr("placeholder", offer['os.subject']);
				$('.js-img-url', $offer).attr("placeholder", '输入新的图片地址');
				$('.js-price', $offer).attr("placeholder", offer['os.price']);
				$('.js-url', $offer).attr("placeholder", offer['os.url']);
				$('img', $offer).attr('src', offerImg);
				$('.js-offer-id', $offer).attr("value", offer['os.offerId']);
				$('.js-key-offer-id', $offer).html(offer['os.offerId']);
				$parent.append($offer);
			}
		}
	};
	var sweetData = function($tab, data, template) {
		var offerList = data['offerList'], offer = '', $elem = $('.element', template),
		//
		$parent = $elem.parent(), $temp = $($parent.html()), $offer = '';
		$('.js-viewName', template).attr("placeholder", data['cs.viewName']);
		$('.js-key-id', template).html(data['cs.memberId']);
		$('.js-member-id', template).attr("value", data['cs.memberId']);
		template.attr('data-key', data['cs.memberId']);
		$elem.remove();
		if (offerList) {
			sweetOfferData.call(this, $parent, offerList, $temp);
		}
		$tab.append(template);
	};
	var initUpload = function() {
		var errorMessage = {
			'img_too_big' : '文件太大',
			'invalid_img_type' : '文件类型不合法',
			'img_optimization_required' : '大小超标',
			'unauthorized' : '安全校验不通过',
			'unknown' : '未知错误'
		},
		// 表单提交地址
		url = $('#dcms_upload_url').val(), self = this,
		// 按钮皮肤
		buttonSkin = 'http://img.china.alibaba.com/cms/upload/2012/654/092/290456_417709751.png';
		$.use('ui-flash-uploader', function() {
			//console.log($('span.local-upload'));
			$('span.local-upload').flash({
				module : 'uploader',
				width : 67,
				height : 25,
				flash : true,
				inputName : 'Filedata',
				flashvars : {
					buttonSkin : buttonSkin
				}
			}).bind('fileSelect.flash', function(e, o) {
				$(this).flash('uploadAll', url, {
					// _csrf_token: 'dcms-box'
				}, 'image', 'fname');
			}).bind('uploadCompleteData.flash', function(e, o) {
				var data = $.unparam(o.data);
				var $oFlash = $(this);
				if (data.success === '1') {// 上传成功
					var $selfParent = $oFlash.closest('.element');
					var offerUrl = $('.js-img-url', $selfParent);

					offerUrl.val(data.url);
					offerUrl.addClass('js-update');
					//$('#thumbnail').val(data.url);
					$('img', $selfParent).attr("src", data.url);
					//$('#thumbimg').attr("src", data.url);
					//alert('上传成功');

				} else {// 上传失败
					alert(errorMessage[data.msg]);
				}
			});
		});
	};
	//获得干预数据
	//获得干预数据
	D.getIntervention = function() {
		var that = this, $self = $(that), $dataList = $('.list', $self), dataList = [], aliasMap = {
			'_type_' : "member",
			'_subModels_' : ["offerList"]
		};
		if ($dataList && $dataList.length) {
			for (var i = 0; i < $dataList.length; i++) {
				var _$self = $('.js-member-member', $dataList[i]), elem = {}, alias = {}, offerList = '';
				$('.js-update', _$self).each(function(index, obj) {
					var $obj = $(obj), _value = $obj.val();
					if (_value && _value.trim()) {
						elem[$obj.attr('name')] = _value.trim();
					}
					var $memberId = $('.js-member-id', $obj.closest('.main'));
					elem[$memberId.attr('name')] = $memberId.val();
				});
				offerList = offerData.call($('.js-member-offer', $dataList[i])[0]);
				//console.log(offerList);
				if (offerList) {
					elem['offerList'] = offerList;
				}

				if (!$.isEmptyObject(elem)) {
					dataList.push(elem);
				}
			}

			$('.js-intervention', $('.js-member-member', $dataList[0])).each(function(index, obj) {
				var $obj = $(obj);
				if ($obj.data('alias')) {
					aliasMap[$obj.attr('name')] = $obj.data('alias');
				}
			});

		}
		return {
			dataList : dataList,
			aliasMap : aliasMap
		};
	};
	/**
	 * offer数据
	 */
	var offerData = function() {
		var that = this, $dataList = $('.element', that), dataList = [], aliasMap = {
			'_type_' : "offer"
		};
		if ($dataList && $dataList.length) {
			for (var i = 0; i < $dataList.length; i++) {
				var _$self = $($dataList[i]), elem = {};
				$('.js-update', _$self).each(function(index, obj) {
					var $obj = $(obj), _value = $obj.val();
					if (_value && _value.trim()) {
						elem[$obj.attr('name')] = _value.trim();
					}
					var $offerId = $('.js-offer-id', $obj.closest('.element'));
					elem[$offerId.attr('name')] = $offerId.val();
				});
				if (!$.isEmptyObject(elem)) {
					dataList.push(elem);
				}

			}
			$('.js-intervention', $($dataList[0])).each(function(index, obj) {
				var $obj = $(obj);
				if ($obj.data('alias')) {
					aliasMap[$obj.attr('name')] = $obj.data('alias');
				}
			});
		}
		if (dataList && dataList.length) {
			return {
				dataList : dataList,
				aliasMap : aliasMap
			};
		} else {
			return null;
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
