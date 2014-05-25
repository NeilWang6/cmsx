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
					$key = $('.list[data-key=' + data['os.offerId'] + ']', $interventionList);
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
	var sweetData = function($tab, data, template) {
		var offerImg = data['os.offerPicUrl100']&&data['os.offerPicUrl100'].replace('.summ.', '.search.');
		template.attr('data-key', data['os.offerId']);
		$('.js-key-id', template).html(data['os.offerId']);
		$('.js-offer-id', template).attr("value", data['os.offerId']);
		$('.js-subject', template).attr("placeholder", data['os.subject']);
		$('.js-viewName', template).attr("placeholder", data['cs.viewName']);
		$('.js-img-url', template).attr("placeholder", '输入新的图片地址');
		$('.js-price', template).attr("placeholder", data['os.price']);
		$('.js-url', template).attr("placeholder", data['os.url']);
		$('img', template).attr('src', offerImg);

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
	D.getIntervention = function() {
		var that = this, $self = $(that), $dataList = $('.element', $self), dataList = [], aliasMap = {
						'_type_' : "offer"
		};
		if ($dataList && $dataList.length) {
			for (var i = 0; i < $dataList.length; i++) {
				var _$self = $($dataList[i]), elem = {}, alias = {};
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
			$('.js-intervention', $dataList[0]).each(function(index, obj) {
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
