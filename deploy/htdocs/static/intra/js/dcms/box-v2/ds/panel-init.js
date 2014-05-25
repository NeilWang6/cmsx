/**
 * @author springyu
 * @userfor  ����ʼ��
 * @date  2014-1-2
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */
;(function($, D, DS) {
	DS.Panel = {
		/**
		 *��ʼ����壬�ȴ򿪶Ի����ٶ����ʼ��
		 */
		init : function($target, isYunYing, siteId) {
			var that = this;
			that.siteId = siteId;
			that._openDialog($target);
			that._initDialog($target, isYunYing);
		},
		//��ʼ���Ի�������
		_initDialog : function($target, isYunYing) {
			var that = this;
			//��ʼ������Դtabҳ��
			try {
				$(document).trigger('box.datasource.MultiDs.init_datasource_event', [$target, isYunYing]);
			} catch(e) {
				//alert('����' + e);
			}

			if (isYunYing) {
				$('.join-datasource').removeClass('current');
				//D.box.datasource.idcDs && D.box.datasource.idcDs.init($target, null);
			}//else {
			D.box.datasource.idcDs && D.box.datasource.idcDs.init($target, null);
			//��Դλ
			that._resSite($target, isYunYing);
			//add by hongss on 2013.07.19 for ��������Դ
			D.box.datasource.quoteDs && D.box.datasource.quoteDs.init($target, isYunYing);
			//}

		},
		/**
		 *�򿪶Ի���
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
						alert("���ӳ�ʱ�����ԣ�");
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
	//��õ�ǰtabҳ������Դ�����Ϣ
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
					errors.push(data['note']+":��ѡ������Դ��");
				} else {
				 errors.push(data['note']+":��ѡ������"+num+"������Դ��");
				}
				
			}
			if (!dataParamJson) {
				dataParamJson = {};
			}
			if(!(dataParamJson&&dataParamJson['dataParamJson']&&dataParamJson['dataParamJson']['query'])){
				if(scheduleSize===1){
					errors.push(data['note']+":�������Ƽ����ݣ�");
				} else {
				errors.push(data['note']+":����"+num+"û�������Ƽ����ݣ�");
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
