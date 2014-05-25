/**
 * @author springyu
 * @userfor  面板初始化
 * @date  2014-1-2
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
 */
;(function($, D, DS) {
	DS.Panel = {
		/**
		 *初始化面板，先打开对话框，再对其初始化
		 */
		init : function($target, isYunYing, siteId) {
			var that = this;
			that.siteId = siteId;
			that._openDialog($target);
			that._initDialog($target, isYunYing);
		},
		//初始化对话框数据
		_initDialog : function($target, isYunYing) {
			var that = this;
			//初始化数据源tab页面
			try {
				$(document).trigger('box.datasource.MultiDs.init_datasource_event', [$target, isYunYing]);
			} catch(e) {
				//alert('出错：' + e);
			}

			if (isYunYing) {
				$('.join-datasource').removeClass('current');
				//D.box.datasource.idcDs && D.box.datasource.idcDs.init($target, null);
			}//else {
			D.box.datasource.idcDs && D.box.datasource.idcDs.init($target, null);
			//资源位
			that._resSite($target, isYunYing);
			//add by hongss on 2013.07.19 for 引用数据源
			D.box.datasource.quoteDs && D.box.datasource.quoteDs.init($target, isYunYing);
			//}

		},
		/**
		 *打开对话框
		 */
		_openDialog : function($target) {
			var that = this, targetParent = $target.parent();
			D.box.datasource.showDsDialog(function(jsonArray) {
				$target.removeData('dsmoduleparam');
				if (jsonArray && jsonArray.length) {
					$target.attr('data-dsmoduleparam', JSON.stringify(jsonArray));
				} else {
					$target.removeAttr('data-dsmoduleparam');
				}
				$(document).trigger('refreshContent', [targetParent]);
			}, that.siteId);
		},
		_resSite : function($target, isYunYing) {
			var that = this, siteId = that.siteId, data = {
				action : 'DsModuleAction',
				event_submit_do_getSiteSwitch : true,
				siteid : siteId
			};
			if (D.box.datasource.Res) {
				$.ajax({
					url : D.domain + '/page/box/json.html?_input_charset=UTF-8',
					type : "POST",
					data : data,
					async : false,
					success : function(text) {
						var json = $.parseJSON(text);
						if (json && json.switchobj && json.switchobj.showResDs === true) {
							$('.join-datasource').removeClass('current');
							D.box.datasource.Res && D.box.datasource.Res.init($target, isYunYing, siteId);
						}

					},
					error : function(jqXHR, textStatus, errorThrown) {
						alert("连接超时请重试！");
					}
				});
			}

		},
		setDsModuleParam : function(dialog, callback, siteId) {
			var $resBody = $('.js-res-body', dialog), $tabs = $('.ds-nav li', $resBody), data = {
				action : 'ResPosAction',
				event_submit_do_saveResPosJson : true,
				siteId : siteId
			}, params = [],errors=[];
			//
			;
			for(var i=0;i<$tabs.length;i++){
			//$tabs.each(function(index, obj) {
				var obj =$tabs[i],value = getResData($resBody, $(obj));
				if(value&&value['errors']&&value['errors'].length){
					errors=value['errors'];
					break;
				}
				params.push(value);
			}//);

			if(errors&&errors.length){
				alert(errors);
				return ;
			}
			data['resPosJson'] = JSON.stringify(params);

			$.post(D.domain + '/page/box/json.html?_input_charset=UTF-8', data, function(text) {
				//console.log(text);
				if (text) {
					var json = JSON.parse(text);
					if (json && (json.success === 'true' || json.success === true)) {
						var jsonArray = json.params;
						callback && callback.call(D.box.datasource, jsonArray);
						dialog.dialog('close');
						dialog.removeClass('ext-width');
					}

				}

			});
		}
	};
	//获得当前tab页面数据源相关信息
	var getResData = function($resBody, $current) {
		var data = {}, $currTab = $('.' + $current.attr('id'), $resBody), $dsInfo = $('.js-ds-desc', $currTab),
		//
		$alias = $('input[name=alias]', $dsInfo), $note = $('input[name=note]', $dsInfo),
		//
		dataSourceParam = $note.data('dataSourceParam'), $resScheduleCon = $('.js-res-schedule-con', $currTab),
		//
		schedules = [],errors=[],num=0;

		if ($alias && $alias.val()) {
			data['alias'] = $alias.val();
		}
		if ($note && $note.val()) {
			data['note'] = $note.val();
		}
		if (dataSourceParam && dataSourceParam['resId']) {
			data['id'] = dataSourceParam['resId'];
		}
		if (dataSourceParam && dataSourceParam['isInit']) {
			data['isInit'] = dataSourceParam['isInit'];
		}
		var scheduleSize = $resScheduleCon.children().length;
		$resScheduleCon.children().each(function(index, obj) {
			var _$self = $(obj), $iframe = $('iframe', _$self), $startTime = $('input[name=startDate]', _$self),
			//
			$select = $('select[name=dataSource]', _$self), $option = $('option:selected', $select), param = $option.data('param'),
			//
			dataParamJson = $iframe[0]&&$iframe[0].contentWindow&&$iframe[0].contentWindow.getResData&&$iframe[0].contentWindow.getResData.call($iframe[0].contentWindow);
			 num=index+1;
				
			if ($select.val()==0){
				if(scheduleSize===1){
					errors.push(data['note']+":请选择数据源！");
				} else {
				 errors.push(data['note']+":请选择排期"+num+"的数据源！");
				}
				
			}
			if (!dataParamJson) {
				dataParamJson = {};
			}
			if(!(dataParamJson&&dataParamJson['dataParamJson']&&dataParamJson['dataParamJson']['query'])){
				if(scheduleSize===1){
					errors.push(data['note']+":请设置推荐数据！");
				} else {
				errors.push(data['note']+":排期"+num+"没有设置推荐数据！");
				}
			}
			if ($select.val()) {
				dataParamJson['datasourceId'] = $select.val();
			}  
			if ($startTime.val()) {
				dataParamJson['startDate'] = $startTime.val();
			}
			
			if (param && param.type) {
				dataParamJson['type'] = param.type;
				data['type'] = param.type;
			}
			schedules.push(dataParamJson);
		});
		data['schedules'] = schedules;
		data['errors']=errors;
		return data;
	};

})(dcms, FE.dcms, FE.dcms.box.datasource);
