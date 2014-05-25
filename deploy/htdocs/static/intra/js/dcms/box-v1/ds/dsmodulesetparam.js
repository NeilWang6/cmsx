/*
 * 公用的数据源参数设置，获取form中所有数据源参数，支持复杂的mlr排序、过滤等。
 * @author: quxiao
 * @Date: 2012-12-27
 */
;(function($, D) {

	var splitChar = '-', betweenChar = "`C126`", mlrItemHtml = $("#mlr_rows .item").html();
	function formatValue(elm, format) {
		var reg = /\#\{([^\}]+)\}/mg;
		var value = format.replace(reg, function(s, v) {
			return $("#" + v, elm).val() || '';
		}) || '';
		return format.replace(reg, '') == value ? "" : value;
	};

	// 把数据源的动态事件封装成函数，供外面调用。
	D.box.datasource.initDsEvent = initDsEvent = function($parent) {
		mlrItemHtml = $("#mlr_rows .item", $parent).html();
		// 增加行
		$("#mlr_rows .add", $parent).click(function() {
			$("#mlr_rows", $parent).append('<div class="item dynamic-row" setvalue-event="setMLR">' + mlrItemHtml + '</div>');
			return false;
		});
		// 删除行
		$("#mlr_rows", $parent).delegate(".delete", "click", function() {
			$(this).parent('.item').remove();
			return false;
		});
		// 换单位
		$("#mlr_rows", $parent).delegate(".zbField", "change", function() {
			var unit = $("option:selected", this).data('unit') || '';
			$(this).siblings(".unit").html(unit);
			console.log(unit);
		});
		// 增加动态事件
		$(FE.dcms).bind("setBetween", function(evt, elm) {
			$(".dynamic-field", elm).each(function() {
				var format = $(this).data('format'), value = '';
				if (format) {
					value = formatValue(elm, format);
				} else {
					value = ($('#qBegin', elm).val() || '') + betweenChar + ($('#qEnd', elm).val() || '');
				}
				(value == betweenChar) && ( value = '');
				$(this).val(value);
			});
		});

		$(FE.dcms).bind("setMLR", function(evt, elm) {
			var zbElm = $('.zbField', elm), wdElm = $('.wdField', elm), sjElm = $('.sjField', elm), valElm = $('.valField', elm), fieldValue = [], value = (valElm.val() || '').replace(/\s+/, '');
			// 设置MLR单行件值
			var zbValue = zbElm[0] ? zbElm.val() : '';
			if (value) {
				var option = $(".zbField option:selected", elm), unit = option.data('unit') || '', cate = option.data('cate');
				wdElm[0] && fieldValue.push(wdElm.val());
				sjElm[0] && fieldValue.push(sjElm.val());
				cate != undefined && fieldValue.push(option.data('cate'));
				fieldValue.push(value);
				$("#mlr_field_row", elm).attr('name', zbValue);
				$("#mlr_field_row", elm).val(fieldValue.join(splitChar));
			}
		});
		$(FE.dcms).bind("setMLRRank", function(evt, elm) {
			var wdElm = $('.wdOrderField', elm), sjElm = $('.sjOrderField', elm), lbElm = $('.lbOrderField', elm), fieldValue = [];
			var lbValue = lbElm[0] ? (lbElm.val() || '') : '';
			if (lbValue) {
				fieldValue.push(lbValue);
				wdElm[0] && fieldValue.push(wdElm.val());
				sjElm[0] && fieldValue.push(sjElm.val());
				$("#mlr_field_row", elm).val(fieldValue.join(splitChar));
			}
		});
		$(FE.dcms).bind("getMLR", function(evt, elm) {
			var fields = $("input[name='mlr_filter_field']"), str = '', queryField = [];
			//dynamic field
			$(".mlr-field").each(function() {
				var node = $(this), name = node.attr('name'), value = (node.val() || '').replace(/\s+/g, '');
				//console && console.log("name=" + name + " value="+value);
				if (name && value) {
					var queryValue = name + splitChar + value;
					queryField.push(queryValue);
				}
			});
			if (queryField.length) {
				$("input.dynamic-field", elm).val(queryField.join("|"));
			}

		});
	};
	//有效性检查
	function checkForm() {
		var form1 = document.getElementById('checkForm');
		var flag = Validator.validate(form1, 3, "checkForm", "checkForm");
		return flag;
	}

	// 获取参数值
	D.box.datasource.getValue = function(target) {
		// 计算动态参数
		var $ = dcms, dynamicRows = $(".dynamic-row");
		dynamicRows.each(function() {
			var target = this, evt = $(target).attr('setvalue-event');
			evt && $(FE.dcms).trigger(evt, target);
		});
		dynamicRows.each(function() {
			var target = this, evt = $(target).attr('getvalue-event');
			evt && $(FE.dcms).trigger(evt, target);
		});
		return FromTools.toNewStr(target, 'exclude-field');
	};
	var getCurTabDatasource = function(curTabEl) {
		var single = {};
		single['dataSource'] = $('select[name=dataSource]', curTabEl).val();
		if (single['dataSource'] != '0') {
			single['alias'] = $('input[name=alias]', curTabEl).val();
			single['note'] = $('input[name=note]', curTabEl).val();
			single['dsParamValue'] = D.box.datasource.getValue($('#checkForm', curTabEl));
		}
		return single;
	};
	D.box.datasource.getCurTabDatasource = getCurTabDatasource;

	var resolveParamValue = function(param) {
		var arrParamValue = [];
		param = param.split('%5E');
		for (var i = 0, l = param.length; i < l; i++) {
			var item = param[i].split('~'), itemParam = {};
			itemParam['name'] = item[0];
			itemParam['value'] = item[1];
			arrParamValue.push(itemParam);
		}
		return arrParamValue;
	};
	D.box.datasource.resolveParamValue = resolveParamValue;
	//弹出设置数据源对话框
	D.box.datasource.showDsDialog = function(callback,siteId) {
		var strHtml = '<div class="ds-body js-ds-body cms-body">';
		strHtml += '<div class="ds-nav fd-clr">';
		strHtml += '<ul class="list-tab-ds">';
		strHtml += '</ul><a class="add-btn"></a></div>';
		strHtml += '<div class="tab-b-con-ds"></div>';
		strHtml += '</div>', $dialog = $('.js-dialog');
		//strHtml += '<div class="ds-body js-quote-body"></div>';

		$('footer,button', $dialog).show();
		$dialog.addClass('ext-width');
		$('button.btn-submit', $dialog).html('保存');
		$('button.btn-cancel', $dialog).html('关闭');
		D.Msg['confirm']({
			'title' : '<a class="join-datasource current" href="#">接入数据源</a>',
			'body' : strHtml,
			'noclose' : true,
			'success' : function(evt) {
				//add by hongss on 2013.07.23 for 引用数据源 判断"确定"按钮保存哪部分数据
				var submitEl = $(evt.target), type = submitEl.data('type');
				if (type === 'quote') {
					D.box.datasource.quoteDs && D.box.datasource.quoteDs.setDsModuleParam(evt.data.dialog);
					evt.data.dialog.dialog('close');
					evt.data.dialog.removeClass('ext-width');
				} else if (type === 'idc') {
					D.box.datasource.idcDs && D.box.datasource.idcDs.setDsModuleParam(evt.data.dialog, callback);
					evt.data.dialog.dialog('close');
					evt.data.dialog.removeClass('ext-width');
				} else if (type === 'res') {
					 D.box.datasource.Panel&&D.box.datasource.Panel.setDsModuleParam(evt.data.dialog, callback,siteId);
				} else {
					var $tabDs = $('.tab-b-ds', '.js-ds-body'), multiDs = [];
					$tabDs.each(function(index, obj) {
						var single = getCurTabDatasource($(obj));
						if (single['dataSource'] != '0') {
							multiDs.push(single);
						}
					});

					var data = {
						action : 'DsModuleAction',
						event_submit_do_storeMultiDs : true,
						multiDs : JSON.stringify(multiDs)
					};
					$.post(D.domain + '/page/box/json.html?_input_charset=UTF-8', data, function(text) {
						var json = $.parseJSON(text), jsonArray = json.dsModuleList || [];
						callback && callback.call(D.box.datasource, jsonArray);
						evt.data.dialog.dialog('close');
						$dialog.removeClass('ext-width');
					});
				}

			},
			'close' : function(evt) {
				$('button.btn-submit', $dialog).html('确定');
				$('button.btn-cancel', $dialog).html('取消');
				$dialog.removeClass('ext-width');
				$('section',$dialog).empty();
			},
			'complete' : function(evt) {
				//$dialog.removeClass('ext-width');
			}
		});

	};

}
)(dcms, FE.dcms);

