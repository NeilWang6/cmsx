	/**
	 * @package FE.app.elf.tag.addoffer
	 * @author: wangxiaojun
	 * @Date: 2012-12-10
	 */
	  /**
	 * @package FE.app.elf.tag.addoffer
	 * @update: zhuliqi
	 * @Date: 2013-4-7
	 */

;(function($, T){
     var domain = location.protocol + '//' + location.host, dialogSetMessageInfo,dialogSetMessageInfoSave,dialogSetMessageInfoClose,
	        readyFun = [
	        	//默认内容
		        function(){
		        	//默认选择项目
		        	$('#day_box').attr('checked','checked');
		        	//CHECK点击产生默认事件
		        	$('input:checkbox').click(function(){
		        		validCheck($(this).parents('div.need-valid'),'2');
		        	})
		        	//未启用菜单删除状态信息

		        	$('#day_box,#week_box,#month_box').click(function(e){
		        		var id = this.id;
		        		
		        		if(id != 'day_box'){
		        			errorNoneR($('#week_box')[0]);
		        			errorNoneR($('#month_box')[0]);	
		        		}
		        		if(id != 'week_box'){
		        			errorNoneR($('#day_box')[0]);	
		        			errorNoneR($('#month_box')[0]);
		        		}
		        		if(id != 'month_box'){
		        			errorNoneR($('#week_box')[0]);	
		        			errorNoneR($('#day_box')[0]);
		        		}


		        	})



		        },
		        //系列专场绑定
		        function(){
		        	var topicSeriesJsonUrl=T.domain + '/enroll/v2012/topic_series.json';		            
		            //查找专场
		            var jsSelectTopic = new FE.tools.Suggestion('#js-select-topic', {
		                url : topicSeriesJsonUrl,
		                data : {
		                    'type' : '2'
		                },
		                paramName : 'topicName',
		                valInput : '#js-select-topic-id',
		                isDefaultItem : false
		            });
		            $('#js-select-topic').live('change', function() {
		                var e = $(this);
		                if($.trim(e.val()) === '') {
		                    $('#js-select-topic-id').val('');
		                    $('#js-select-topic-name').val('');
		                };
		            });	
		        },
		        
	        //复选框操作事件
	        function(){
	         var typeV = $('#type').val();
	        	 caseType(typeV);
	        	  
	        	 $('.radio-date').bind('click',function(){
	        	 	 var radtype = $(this).val();
	        	 	 caseType(radtype);
	        	});
				
				//消息浮层设置绑定
				$('#messageEdit').click(function(){
					$('#message-top-info').html("");
					var messageId = $('#messageId').val(),
					urlPost2 = $('#ajax-get-message-url').val(),
					needvalidajax = $('.need-validajax');
					var sendWay = $('input[name="sendWay"]').filter(':checked').val();

								        //生成新模板时候取消所有的验证信息
					needvalidajax.each(function(){
						errorper(this,'success')
					});	
					if(sendWay == "membercenter"){
						$('.dialog-set-message-info .js-message-messageId-bak').val(messageId);
					}else if(sendWay == "alitalk"){	
						$('.dialog-set-alitalk-message-info .js-message-messageId-bak').val(messageId);
					}					
					
					$.ajax({
						url : urlPost2,
						type: "GET",
						data : {'messageId':messageId},
						error: function(jqXHR, textStatus, errorThrown) {
							return;
						},
						success: function(_data){		
							if(sendWay == "membercenter"){
								$('.dialog-set-message-info .js-message-msgtitle').val(_data['msgtitle']);
								$('.dialog-set-message-info .js-message-description').val(_data['description']);
								$('.dialog-set-message-info .js-message-title').val(_data['title']);
								$('.dialog-set-message-info .js-message-titleName').val(_data['titleName']);
								$('.dialog-set-message-info .js-message-contentWEB').val(_data['contentWEB']);
								$('.dialog-set-message-info .js-message-contentWW').val(_data['contentWW']);		
								$('.dialog-set-message-info .js-message-url').val(_data['url']);	
								$('.dialog-set-message-info .js-message-urlWW').val(_data['urlWW']);	
								$('.dialog-set-message-info .js-message-urlTips').val(_data['urlTips']);
							}else if(sendWay == "alitalk"){	
								if(_data['sendAccountFlag'] && _data['sendAccountFlag'] != "" && _data['sendAccountFlag'] == "memberAcct"){
									$('#memberAccountRadio').trigger('click');
								}else{
									$('#systemAccountRadio').trigger('click');
								}
								
								$('.dialog-set-alitalk-message-info .js-message-sendAccount').val(_data['sendAccount']);
								$('.dialog-set-alitalk-message-info .js-message-content').val(_data['contentWW']);		
							}														
						}
					});
					if(sendWay == "membercenter"){
						$('.dialog-set-message-info .js-message-msgtitle-show').html("消息标题：");
						$('.dialog-set-message-info .js-message-description-show').html("消息描述：");
						$('.dialog-set-message-info .js-message-title-show').html("消息中心列表名称：");
						$('.dialog-set-message-info .js-message-titleName-show').html("消息内容标题：");
						$('.dialog-set-message-info .js-message-url-show').html("消息中心跳转URL：");	
						$('.dialog-set-message-info .js-message-urlWW-show').html("旺旺跳转URL：");	
						$('.dialog-set-message-info .js-message-urlTips-show').html("跳转描述：");
						$('.dialog-set-message-info .js-message-contentWEB-show').html("消息中心内容：");
						$('.dialog-set-message-info .js-message-contentWW-show').html("旺旺浮出消息内容：");						
						$.use('ui-core,ui-draggable,ui-dialog', function(){							
							dialogSetMessageInfo = $('.dialog-set-message-info').dialog({
								center: true,
								draggable: true
							});						
						});						
					}else if(sendWay == "alitalk"){					
						$('.dialog-set-alitalk-message-info .js-message-sendAccount-show').html("发送账号：");
						$('.dialog-set-alitalk-message-info .js-message-content-show').html("消息内容：");						
						$.use('ui-core,ui-draggable,ui-dialog', function(){							
							dialogSetMessageInfo = $('.dialog-set-alitalk-message-info').dialog({
								center: true,
								draggable: true
							});					
						});
					}																
					
				});	
				//设置浮层的确定事件
				$('.dialog-set-message-info .js-save, .dialog-set-alitalk-message-info .js-save').click(function(){
													
					//验证内容
					//先完成所有验证
					var needvalidajax = "",n = 0;
					if( $('input[name="sendWay"]').filter(':checked').val() == "membercenter"){
						needvalidajax = $('.dialog-set-message-info .need-validajax');
					}else if($('input[name="sendWay"]').filter(':checked').val() == "alitalk"){	
						needvalidajax = $('.dialog-set-alitalk-message-info .need-validajax');
					}
					needvalidajax.trigger('blur');
					
					//判断是否通过验证通过
					needvalidajax.each(function(){
			
						if($(this).attr('success-valid') == "success") {
							n++

						}

					})

					if(n < needvalidajax.size()){
						//没通过
						n = 0
						return
					}

					var data = "";
					if(  $('input[name="sendWay"]').filter(':checked').val() == "membercenter"){
						data = 'messageId='+$('#messageId').val()
						+'&sendWay=membercenter'
						+'&msgtitle='+$('.dialog-set-message-info .js-message-msgtitle').val()
						+'&title='+$('.dialog-set-message-info .js-message-title').val()
						+'&description='+$('.dialog-set-message-info .js-message-description').val()
						+'&titleName='+$('.dialog-set-message-info .js-message-titleName').val()
						+'&contentWEB='+$('.dialog-set-message-info .js-message-contentWEB').val()
						+'&url='+$('.dialog-set-message-info .js-message-url').val()
						+'&urlWW='+$('.dialog-set-message-info .js-message-urlWW').val()
						+'&urlTips='+$('.dialog-set-message-info .js-message-urlTips').val()
						+'&contentWW='+$('.dialog-set-message-info .js-message-contentWW').val();
					}else if( $('input[name="sendWay"]').filter(':checked').val() == "alitalk"){	
						data = 'messageId='+$('#messageId').val()
						+'&sendWay=alitalk'		
						+'&sendAccountFlag='+$('input[name="sendAccountFlag"]').filter(':checked').val()
						+'&sendAccount='+$('.dialog-set-alitalk-message-info .js-message-sendAccount').val()						
						+'&contentWW='+$('.dialog-set-alitalk-message-info .js-message-content').val();
					}
					 
					var urlPost = $('#ajax-add-message-url').val();

					addOrEditMessage(urlPost,data);
				});
				//设置标签的浮层的关闭事件
				$('.dialog-set-message-info .btn-cancel, .dialog-set-message-info .close, .dialog-set-alitalk-message-info .btn-cancel, .dialog-set-alitalk-message-info .close').click(function(){
					dialogSetMessageInfo.dialog('close');
				});
				
				//数据源选择radio选择绑定事件
				$('.form-container .rp-b .info-item .datasource :radio').live('change', function(){
					 if($(this).data('datasource') == "dw"){
						 $('.topicCondition').addClass("hide");
						 $('.topicCondition input').removeClass("need-valid");
						 $('.dwCondition').removeClass("hide");
					 }else if($(this).data('datasource') == "topic"){
						 $('.dwCondition').addClass("hide");
						 $('.dwCondition input').removeClass("need-valid");
						 $('.topicCondition').removeClass("hide");
					 }
				});
				
				//发送账号radio选择绑定事件
				$('.dialog-set-alitalk-message-info .show-account-input .sendAccountFlag :radio').live('change', function(){
					if($('input[name="sendAccountFlag"]').filter(':checked').val() && $('input[name="sendAccountFlag"]').filter(':checked').val() == "memberAcct"){
						$('.show-account-input .js-message-sendAccount').addClass("need-validajax");
						 $('.show-account-input .js-message-sendAccount, .show-account-input .show-tip').removeClass("hide");
					 }else {
						 $('.show-account-input .js-message-sendAccount').removeClass("need-validajax");
						 $('.show-account-input .js-message-sendAccount, .show-account-input .show-tip').addClass("hide");
					 }
				});
			
	        },
	        function(){
		        	$("#audit-save").bind("click", function() {
						//执行所有表单验证
						var data_valid,data_validcontent,
						needValid = $('.need-valid'),
						n = 0;
						needValid.each(function(){
							data_valid = $.parseJSON($(this).attr('data-valid')).required;
							data_validcontent = $.parseJSON($(this).attr('data-valid'));
							
							switch(data_valid)
							{
								case 'true':
									$(this).trigger('blur');
								break;
								case '1':
									if(!$(this).attr('disabled')) {

										$(this).trigger('blur');

									}
								break;
								case '2':
									
									if(!$('#'+data_validcontent.for).attr('disabled')) {
										validCheck(this,'2');

									}
								break;

							}

						})
						//计算是否全部通过验证

						needValid.each(function(){
							if($(this).attr('success-valid') == "success") {
								n++

							}

						})

						if(n == needValid.size() ){
			
							document.form1.submit();

						}else{
							n == 0

						}
	
					}); 
		        	
		        },	
			function(){	
				
				$('.need-valid').each(function(){

					var validJson = $(this).data("valid"),
						_this = this,
						valid;	
					for (valid in validJson){
						
						if(valid == "required")	{
							validNoNone(_this);
						}
						if(valid == "size") {
							validSumSize(_this,validJson[valid]);

						}

						if(valid == "judge") {

							validjudgeNum(_this,validJson[valid])


						}

						if(valid == "canNone") {
							validcanNone(_this,validJson[valid]);

						}
					}

				})	
			},
			function(){			
				$('.need-validajax').each(function(){
					var validJson  = $.parseJSON($(this).attr('data-valid'));
					for(valid in validJson) {
						if(valid == "required"){

							validNoNone(this);
						}
						if(valid == "size") {
							validSumSize(this,validJson[valid]);
						}

					}

				})

			}
	        		        
   	];
		      //验证是否是可选项
	      function validcanNone(_this) {
	      	$(_this).blur(function(){

		      	var val = $(_this).val().split(""),
		      	len = 0;
	      		for(var i = 0 ;i < val.length; i++) {
		      		if (val[i].match(/[^\x00-\xff]/ig) != null) //全角
					len += 2;
					else
					len += 1;
				} 

	      		var n = $(_this).val();
	      		if(n == "") {
	      			errorper(this,'success')
	      		}else if(!isNaN(n) && len < 4) {

					errorper(this,'success')

	      		}

	      	})

	      }
	      //检查check是否选择
	      function validCheck(_this,domModule) {

	      	var n = 'false';
	
	      	$(_this).find('input').each(function(){
	      		if($(this).attr('checked') == 'checked'){

	      			n = true;
	      			
	      			return;
	      		}

	      	})
	      	if(n == 'false') {
	      		errorper(_this,'此为必选项',domModule);
	      	}else{
	      		errorper(_this,'success',2)
	      	}
	

	      }
	      //判断是否是数字
	      function validjudgeNum(_this,num) {
	      	var $this = $(_this);
	      	$this.blur(function(){
	      		var val = $(this).val();

	      		if(isNaN(val)) {

	      			errorper(this,'输入的文本必须是数字')

	      		}

	      		if(_this.id == "messageId") {
	      			$this.change(function(){
	      				$('#message-top-info').text('')

	      			})


	      		}


	      	})

	      }
	      //判断字符数
	      function validSumSize(_this,size){
		      	$(_this).blur(function(){
			      	var val = $(_this).val().split(""),
			      	len = 0;
		      		for(var i = 0 ;i < val.length; i++) {
			      		if (val[i].match(/[^\x00-\xff]/ig) != null) //全角
						len += 2;
						else
						len += 1;
					} 
					if(len > size){
						errorper(this,'输入不能超过'+ size +'个字符')
					}
		      	})

				
	    	}
	      //判断空
	      	function validNoNone(_this){
	      		
	      		$(_this).blur(function(){

	      		
	      			if($(this).val() == ''){
	      				errorper(this,'内容不能为空')
	      			}else{
	      				errorper(this,'success')

	      			}

	      		})

	      	}
	      	//错误无责任清楚方法
	      	function errorNoneR(_this){
	
	      		
	      		$(_this).siblings('span').find('input').val('').attr('success-valid','success').siblings('span.validator-tip').removeClass('validator-error').text('');

	      		$(_this).parent('.rp-radio').next('.need-valid').attr('success-valid','success').find('span.validator-tip').removeClass('validator-error').text('');

	      	}
	      	//错误表现层
	      	function errorper(_this,errorText,domModule){
	     
	      		var errorperDom = (domModule == '2' ? $(_this).find('span.validator-tip'):$(_this).siblings('span.validator-tip'));
	     
	      		if(errorText == "success") {
	      			errorperDom.removeClass('validator-error').text("");
	      			$(_this).attr('success-valid','success');
	      			return;
	      		}

	      		if(errorperDom.text() != errorText){
	      			errorperDom.addClass('validator-error').text(errorText);
	      			$(_this).attr('success-valid','error');
	      		}


	      	}  
	function addOrEditMessage(urlPost, data) {
		$.ajax({
			url : urlPost,
			type: "GET",
			data : data,
			error: function(jqXHR, textStatus, errorThrown) {
				return;
			},
			success: function(_data){	
				dialogSetMessageInfo.dialog('close');
				$('#messageId').val(_data['insertId']);
				
				if(_data['insertId']){
					$('#message-top-info').html("消息添加成功！");
				}else{
					if($('input[name="sendWay"]').filter(':checked').val() == "membercenter"){
						$('#messageId').val($('.dialog-set-message-info .js-message-messageId-bak').val());
					}else if($('input[name="sendWay"]').filter(':checked').val() == "alitalk"){	
						$('#messageId').val($('.dialog-set-alitalk-message-info .js-message-messageId-bak').val());
					}								
					$('#message-top-info').html("消息编辑成功！");
				}
				
			}
		});	
	};
    
  function lockDay(str) {
			$('.check-day').each(function(){
				 $(this).prop('disabled',str===1 ? true:false);
			});
			$('#day_box').prop('checked',str===1 ? false:true);
	}
	function lockWeek(str) {
		$('.check-week').each(function(){
			 $(this).prop('disabled',str===1 ? true:false);
			 $('#week_box').prop('checked',str===1 ? false:true);
		});
	}
	function lockMonth(str) {
		$('.check-month').each(function(){
			 $(this).prop('disabled',str===1 ? true:false);
			 $('#month_box').prop('checked',str===1 ? false:true);
		});
	}
	function caseType(radtype){
		 if(radtype==='day'){
	 	 	  lockDay(0);
	 	 	  lockWeek(1);
			  lockMonth(1);
	 	 }else if(radtype==='week'){
	 	 
	 	 	  lockWeek(0);
	 	 	  lockDay(1);
			  lockMonth(1);		
	 	 }else if(radtype==='month'){
	 	 	  lockMonth(0);		
	 	 		lockDay(1);
				lockWeek(1);		
	 	 }else{
	 	 		lockWeek(1);
				lockMonth(1);
	 	 }	
	}
      
    $(function(){
        for (var i=0, l=readyFun.length; i<l; i++) {
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
})(jQuery, FE.tools);