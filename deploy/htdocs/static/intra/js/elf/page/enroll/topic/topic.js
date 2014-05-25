/**
 * @author: lianzhengkun
 * @Date: 2012-10-08
 */

;(function($, T) {
	var enrollConfig;
	var domain=$('#domain_cmsModule').val();
	var topic_series_json = $('#topic_series_json').val();
	var topic_config_url = $('#topic_config_url').val();
	var topic_sort_url = $('#topic_sort_url').val();
	var topicSeriesJsonUrl=T.domain + '/enroll/v2012/topic_series.json';
	
	$('#domainName').change(function(e){
		$('#domainUrl').text($('#domainName').val());
	});
	
	T.confirmNext = function (success,toUrl,errorCode,next){
		if(success && toUrl){
			if(next=='s'){
				jQuery.use('ui-dialog',function(){
					//如有多个浮出层，请另加ID或class
					var dialog = jQuery('#dialog-demo-1st').dialog({
						center:true,
						timeout:2000,
						fixed:true,
						close: function(){
							window.location.href=toUrl;
						}
					});
					jQuery('#dialog-demo-1st .btn-cancel, #dialog-demo-1st .close').click(function(){
						dialog.dialog('close');
						window.location.href=toUrl;
					});
				});
			}else{
				jQuery.use('ui-dialog',function(){
					//如有多个浮出层，请另加ID或class
					var dialog = jQuery('#dialog-demo-2nd').dialog({
						center:true,
						fixed:true
					});
					jQuery('#dialog-demo-2nd .close').click(function(){
						dialog.dialog('close');
						window.location.href=toUrl;
					});
					jQuery('#dialog-demo-2nd .btn-cancel').click(function(){
						window.location.href=topic_sort_url;
					});
					jQuery('#dialog-demo-2nd .btn-yes').click(function(){
						window.location.href=topic_config_url;
					});
				});
			}
		}else{
			if(errorCode == 'checkURL'){
				alert("该url已被使用，请重新更换url再保存!");
			}else{
				alert("创建页面失败");
			}
		}
	}
	
	//除了题图文案以外的东西全部disable或able
	function changeStateAllExceptTituWenan(isDisable) {
		if(isDisable) {
			$(".js-can-disable").each(function(i, el){
				$(el).prop('disabled', true);
			});
			
			$(".js-can-hidden").each(function(i, el){
				$(el).css('display', 'none');
			});
		} else {
			$(".js-can-disable").each(function(i, el){
				$(el).prop('disabled', false);
			});
			
			$(".js-can-hidden").each(function(i, el){
				$(el).css('display', '');
			});
		}
	}
	
	var readyFun = [
		function() {
			new FE.tools.AddDelMove({
				container:'.form-vertical'
			});
			new FE.tools.AddDelMove({
				container:'.form-vertical',
				operateEl:'.block-operate',
				afterAdd: function(addEl){
					addEl.find('.blockId').val(0);
				}
			});
		},
		
		function() {
			//页面初始化时，默认选择的是“不新建页面”，除了题图文案以外都不能修改
			if( $("#isUp").val() == 'y' ) {
				changeStateAllExceptTituWenan(true);
			}
			
			//添加radio的点击监听逻辑
			$(".radioItem").change(function(){
				var newTopicByType = $("input[name='newTopicByType']:checked").val();
				if(newTopicByType){
					switch (newTopicByType){
						case 'new':
							$('.use-other-item').hide();
							$('.new-item').show('fast');
							break;
						case 'useOther':
							$('.new-item').hide();
							$('.use-other-item').show('fast');
							break;
					}
				}
			});
		},
		
		function(){
			if($('#pageId').val()){
				jQuery.post(domain + '/page/query_page_attr.html?_input_charset=utf-8', {pageId: $('#pageId').val()},
				function(json) {
					if(json.status == 'success') {
						var pageUrl='http://'+json.data.domain+json.data.specialUrl;
						$('.page-url').not(':hidden').val(pageUrl);
						$('#page-url').val(pageUrl).siblings('#page-url-txt').text(pageUrl);
						$('#upsiteId').val(json.data.siteId);
						$('#upcatalogId').val(json.data.catalogId);
						$('#updomainId').val(json.data.domainId);
						$('#uppageHeadId').val(json.data.pageHeadId);
					}
				}, 'jsonp');
			}
		},

		function(){
			//查找专场
	        new FE.tools.Suggestion('#js-select-topic-2', {
	            url : topicSeriesJsonUrl,
	            data : {
	                'type' : '2'
	            },
	            paramName : 'movePageFromTopicName',
	            valInput : '#js-select-topic-id-2',
	            isDefaultItem : false
	        });
		},

		function(){
			new FE.tools.Suggestion('#seriesName', {
				url: topicSeriesJsonUrl,
				data: {'type':'1','seriesType':'1'},
				paramName: 'seriesName',
				isDefaultItem : false,
				valInput: '#seriesIdHide'
			});
		}
	];
	
	$(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });	
	
	$.use("web-valid",function() {
		var validEls = $('.form-vertical [data-valid]').not(':hidden');
		var validDemo1 = new FE.ui.Valid(validEls, {
			onValid : function(res, o) {
				var tip = $(this).closest('.item-form').find('.validator-tip'), msg = '';
				if (res==='pass'){
					tip.removeClass('validator-error');
				} else {
					switch(res){
						case 'required':
							msg = o.key+' 不能为空';
							break;
						case 'reg':
							msg = '请填写以字母开头，只包含字母和数字的4-20位长度的值';
							break;
						case 'fun':
							msg = o.msg;
							break;
					}
					
					tip.text(msg);
					tip.addClass('validator-error');
				}
				
			}
		});
		/*$('#fromInfo').submit(function(){
			var isValid = validDemo1.valid();
			return isValid;
		});*/
	});
	
	function saveMsg(isNext){
		var validEls = $('.form-vertical [data-valid]').not(':hidden');
		var validDemo1 = new FE.ui.Valid(validEls, {
			onValid : function(res, o) {
				var tip = $(this).closest('.item-form').find('.validator-tip'), msg = '';
				if (res==='pass'){
					tip.removeClass('validator-error');
				} else {
					switch(res){
						case 'required':
							msg = o.key+' 不能为空';
							break;
						case 'reg':
							msg = '请填写以字母开头，只包含字母和数字的4-20位长度的值';
							break;
						case 'fun':
							msg = o.msg;
							break;
					}
					
					tip.text(msg);
					tip.addClass('validator-error');
				}
				
			}
		});
		var isValid = validDemo1.valid();
		var arrValues = [],bannerValues=[],objValue = {};
		$('.block-operate').each(function(i, el){
			el = $(el);
			var value = {};
			value['id'] = $('.blockId', el).val();
			value['name'] = $('.blockName', el).val();
			value['type'] = $('.blockType', el).val();
			if(value['name']!=""){
				arrValues.push(value);
			}
		});
		
		objValue['value'] = arrValues;
		$('#area_value').val(JSON.stringify(objValue));
		$('.item-operate').each(function(i, el){
			el = $(el);
			var value = {};
			value['size'] = $('.size', el).val();
			value['location'] = $('.location', el).val();
			if(value['location']!=""){
				bannerValues.push(value);
			}
		});
		objValue['value'] = bannerValues;
		$('#banner_value').val(JSON.stringify(objValue));
			$('.layout').each(function(index,obj){
				var jobj = $(obj);
				if(jobj.attr('checked') == 'checked'){
					$('#templateId').val(jobj.attr('value'));
				}
			});

		//add by huangxt --- 提交之前把disabled去掉，提交表单
		if( $("#isUp").val() == 'y' ) {
			changeStateAllExceptTituWenan(false);
		}
		//end
		if(isValid){
			if(arrValues == ''){
				alert("你还没有进行区块设置，请先进行区块设置再保存！");
			}else{
				$('#next').val(isNext);
				$('#fromInfo').submit();
			}
		}else{
		    if( $("#isUp").val() == 'y' ) {
                changeStateAllExceptTituWenan(true);
            }
		}
	}
	
	$('#bt-save').click(function(e){
		saveMsg('s');
	});
	
	$('#bt-save-update').click(function(e){
		$('#isUpdateSendMessage').val("true");
		saveMsg('s');
	});
	
	$('#bt-set').click(function(e){
		saveMsg('sn');
	});
		
	//日期控件
	$.use('ui-datepicker-time, util-date', function() {
		$('.js-select-date').datepicker({
			showTime : true,
			closable : true,
			select : function(e, ui) {
				var date = ui.date.format('yyyy-MM-dd');
				$(this).val(date);
			}
		});
	});
	
})(jQuery, FE.tools);
