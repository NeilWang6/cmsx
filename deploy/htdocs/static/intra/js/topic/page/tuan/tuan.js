/**
 * @author wangxiaojun
 * @usefor 普通专场活动详情页面
 * @date   2013.2.20
 */
 

jQuery.namespace('FE.topic');
;(function($, T){
	var readyFun = [
						//日期事件
/*						function(){
							     $('#form-content').delegate('.beginDate','click',function(){
					            var self = $(this);
					            $.use('ui-datepicker, util-date', function(){
					                self.datepicker({
					                    closable:true,
					                    triggerType: 'focus',
					                    pages: 1,
					                    shim: true,
					                    beforeShow: function(){
					                        $(this).datepicker('setOption', 'selected', Date.parseDate(this.value));
					                        $(this).datepicker({maxDate: Date.parseDate(self.closest('.ul-content').find('.endDate').val())});
					                    },
					                    select: function(e, ui){
					                        $(this).val(ui.date.format('yyyy-MM-dd'));
					                    }
					                }).triggerHandler('focus');
				              }, {css: ["http://style.c.aliimg.com/sys/css/dpl/dpl-calendar.css"]});   
				                           
				           });
				        
				           $('#form-content').delegate('.endDate','click',function(){
					            var self = $(this);
					            $.use('ui-datepicker, util-date', function(){
					                self.datepicker({
					                    closable:true,
					                    triggerType: 'focus',
					                    pages: 1,
					                    shim: true,
					                    beforeShow: function(){
					                        $(this).datepicker('setOption', 'selected', Date.parseDate(this.value));
					                        $(this).datepicker({minDate: Date.parseDate(self.closest('.ul-content').find('.beginDate').val())});
					                    },
					                    select: function(e, ui){
					                        $(this).val(ui.date.format('yyyy-MM-dd'));
					                    }
					                }).triggerHandler('focus');
				              }, {css: ["http://style.c.aliimg.com/sys/css/dpl/dpl-calendar.css"]});   
				            });
				    },
				    */
				    //添加，删除操作
				    function(){
				    		 $('#form-content').delegate('.add','click',function(e){
				    		 	   e.preventDefault();
										 var el = $(this),
										 hasSize = parseInt($('#hidHasSize').val()),
										 maxSize = parseInt($('#hidMaxSize').val()),
										 operateEl,
										 cloneEl;										 
										 
										 if($('.content').length + hasSize >= maxSize){
										 			var message = $(this).siblings('.error');
										 			 message.html('您的团订商品信息条数已经达到最大设置数值了');
				    	 	           message.addClass('message-error');
				    	 	           return;
										 }
										 operateEl = el.closest('.content');
										 cloneEl = operateEl.clone();
 										 operateEl.after(cloneEl);
										 cloneEl.find('.remove').show();
										 cloneEl.find('.line').show();
				    		 });
				    		 
				    		 $('#form-content').delegate('.remove','click',function(e){
				    		 	   e.preventDefault();
										 var el = $(this),
												operateEl = el.closest('.content'),
												siblingEls = $('.content');
											
												if (siblingEls.length>0){
														operateEl.remove();
												}
												$.each($('#form-content').find('.size-error'),function(e){
 													$(this).html('');
				    	 	          $(this).removeClass('message-error');
												});
												
				    		 });
				    },
				    //商品ID验证
				    function(){
				    	var ids = $('#hidIds').val();
				    	 $('#form-content').delegate('.offerid','blur',function(e){
				    	 	var message = $(this).siblings('.error'),
				    	 	    regnum = /^[0-9]*$/,
				    	 	    values = $(this).val();
				    	 	    
				    	 	    if(values.length===0){
				    	 	    	 message.html('商品ID不能为空');
				    	 	       message.addClass('message-error');
				    	 	    	 return;
				    	 	    }else{
				    	 	    	if(!(regnum.test(values))){
				    	 	    		 message.html('商品ID格式不正确,必须由数字组成');
				    	 	       	 message.addClass('message-error');
				    	 	    	 	 return;
				    	 	    	}
				    	 	    }
				    	 	    values = ','+values+',';
				    	 	    if(ids.indexOf(values)>=0){
				    	 	    	 message.html('商品ID已经报过名');
				    	 	       message.addClass('message-error');
				    	 	    }else{
				    	 	    	 message.html('');
				    	 	       message.removeClass('message-error');
				    	 	    }
				    	 	});
				    	 	$('#form-content').delegate('.offerid','focus',function(e){
				    	 		var message = $(this).siblings('.error');
				    	 	    	 message.html('');
				    	 	       message.removeClass('message-error');
				    	 	    
				    	 	});
				    	 	
				    	  $('#form-content').delegate('.valid','blur',function(e){
				    	  		var message = $(this).closest('li').find('.error'),
				    	  		    values = $(this).val(),
				    	  		    deposit = $(this).closest('.ul-content').find('.deposit');
				    	  		    
				    	  		     if(values.length===0){
							    	 	    	 message.html($(this).data('title')+'不能为空');
							    	 	       message.addClass('message-error');
							    	 	   }else{
							    	 	   		 if($(this).hasClass('piece')){
 							    	 	   		 	  var  regInt  =  /^[1-9]+[0-9]*]*$/ ;
 							    	 	   		 		if (!(regInt.test($(this).val()))){
																				 message.html($(this).data('title')+'不是正整数');
							    	 	       						 message.addClass('message-error');
							    	 	       						 return;
																} 
							    	 	   		 }
							    	 	   		 if($(this).hasClass('price')){
 							    	 	   		 	  var regMoney = /^(([1-9]{1}[0-9]{0,8})|[0]{1})([.]{1}[0-9]{1,3})?$/;
  							    	 	   		 	if (!(regMoney.test(values))){
																			 message.html($(this).data('title')+'不是数字');
							    	 	       					 message.addClass('message-error');
							    	 	       					 return;
																}else{
																	  if($(this).hasClass('onePrice')){
																	  		deposit.val((parseFloat(values)* 0.2).toFixed(2));
																	  }
																}
							    	 	   		 }
							    	 	   	   message.html('');
				    	 	             message.removeClass('message-error');
							    	 	   }
				    	  });
				    	  
				    },
				    //按钮提交事件
				    function(){
				    	$('.button-submit').bind('click', function(){
				    		var vurl = $('#jsonUrl').val(),
										ref = $('#ref').val(),
										dataList,
										topicId = $('#topicId').val();
										
										$(this).prop('disabled',true);
										  
						    		if(!validData()){
						    			$(this).prop('disabled',false);
						    			return false;
						    		}
						    		 
				    		    dataList = collectData();
				    		   
										$.ajax({
												type: 'POST',
												url: vurl,
												dataType:'json',
												data: 'ref='+ref+'&tid='+topicId+'&tuanjson='+dataList,
												success: function(o) {
													var jumpUrl = $('#jumpUrl').val();
													
													if (o.success) {
														  FE.util.goTo(jumpUrl, '_self');
													}else{
															if(o.msg === 'offer_fail'){
																	$.each($('.offerid'),function(){
																			var  vals = ','+$(this).val(),
																			     message = $(this).siblings('.error');
																			    
																					 if((','+o.offersNotSelf).indexOf(vals)>=0){
																						 			message.html('请输入您旺铺里的商品ID');
																    	 	          message.addClass('message-error');
																					 }
																					 if((','+o.offersIdsHas).indexOf(vals)>=0){
																						 			message.html('商品ID不能重复');
																    	 	          message.addClass('message-error');
																					 }
																					 if((','+o.offersPrivate).indexOf(vals)>=0){
																						 			message.html('该商品ID是私密商品,不能参加报名');
																    	 	          message.addClass('message-error');
																					 }
																					 if((','+o.offersVip).indexOf(vals)>=0){
																						 			message.html('该商品ID是vip批发商品,不能参加报名');
																    	 	          message.addClass('message-error');
																					 }
																					 if((','+o.offersSample).indexOf(vals)>=0){
																						 			message.html('该商品ID是样品offer,不能参加报名');
																    	 	          message.addClass('message-error');
																					 }
																					 if((','+o.offersFreight).indexOf(vals)>=0){
																						 			message.html('该商品没有包邮,不能参加报名');
																    	 	          message.addClass('message-error');
																					 }
																					 if((','+o.offersAmount).indexOf(vals)>=0){
																					 	      var amountMessage = $(this).closest('.content').find('.amount');
																						 			amountMessage.html('第3阶段件数不能大于商品可售数量');
																    	 	          amountMessage.addClass('message-error');
																					 }
																					  
																					 
																	});
															}
															
													}
												},
												error: function () {
													alert("页面超时，请重试");
												}
										});
										$(this).prop('disabled',false);
										return false;
							});
						}
    ];
    
    
    //输入框验证
		function validData(){
			var isboolean = true,
			    saveIds =',';
			     
			$.each($('.offerid'),function(){
				 	saveIds += $(this).val()+',000,';
			});
			  
			$.each($("input:not(:hidden)"),function(e){
			 	 var vals = $(this).val(),
			 	 		 regnum =  /^[0-9]*$/,
			 	 		 regInt  =  /^[1-9]+[0-9]*]*$/,
             regMoney = /^(([1-9]{1}[0-9]{0,8})|[0]{1})([.]{1}[0-9]{1,3})?$/,
			 	     error = $(this).closest('li').find('.error'),
			 	     message = $(this).siblings('.error');
				 	   if(vals.length===0 || error.hasClass('.message-error')){
					 	    if($(this).hasClass('offerid')){
		 									message.html('商品ID不能为空');
						    	 	  message.addClass('message-error');
						    	 	  isboolean =  false;
						   	}else{
						   				if(!$(this).hasClass('deposit')){
							 	  	     error.html($(this).data('title')+'不能为空');
										     error.addClass('message-error');
							 	  	     isboolean =  false;
						 	  	    }
					 	    }
				 	   }
				 	  
				 	   if(vals.length>0){
				 	   	   var  values =  $('#hidIds').val(),
				 	   	        curVal = ','+ $(this).val()+',';
					 	  	 if($(this).hasClass('offerid') && !(regnum.test(vals))){
		    	 	    		 message.html('商品ID格式不正确,必须由数字组成');
		    	 	       	 message.addClass('message-error');
		    	 	    	 	 isboolean =  false;
						   	 }else if($(this).hasClass('offerid') && saveIds.split(curVal).length>2){
						   	 	   message.html('商品ID不能重复');
		    	 	       	 message.addClass('message-error');
		    	 	    	 	 isboolean =  false;
						   	 }else if($(this).hasClass('offerid') && values.indexOf(curVal)>=0){
						   	 	   message.html('该商品ID已经报过名');
		    	 	       	 message.addClass('message-error');
		    	 	    	 	 isboolean =  false;
						   	 }else if($(this).hasClass('piece') && !(regInt.test(vals))){
										 error.html($(this).data('title')+'不是正整数');
									   error.addClass('message-error');
									   isboolean =  false;
					 	     }else if($(this).hasClass('price') && !(regMoney.test(vals))){
										 error.html($(this).data('title')+'不是数字');
									   error.addClass('message-error');
									   isboolean =  false;
					 	     }
				 	   }
			 });
		
			 if(isboolean){
			 	$.each($('.content'),function(i){
			 			var onepiece = $(this).find('.onePiece'),
			 			    twopiece = $(this).find('.twoPiece'),
			 			    threepiece = $(this).find('.threePiece'),
			 			    oneprice = $(this).find('.onePrice'),
			 			    twoprice = $(this).find('.twoPrice'),
			 			    threeprice = $(this).find('.threePrice');
			 			    retailPrice =  $(this).find('.retailPrice');
			 			    			 
			 			    if(parseInt(twopiece.val()) <= parseInt(onepiece.val())){
			 			    		var error = twopiece.closest('li').find('.error');
			 			    		error.html('第2阶段-成团件数要大于第1阶段');
			 			    		error.addClass('message-error');
			 			    		isboolean = false;
			 			    		 
			 			    }
			 			    if(parseInt(threepiece.val()) <= parseInt(twopiece.val())){
			 			    		var error = threepiece.closest('li').find('.error');
			 			    		error.html('第3阶段-成团件数要大于第2阶段');
			 			    		error.addClass('message-error');
			 			    		isboolean = false;
			 			    	 
			 			    }
			 			    if(parseFloat(twoprice.val()) >=  parseFloat(oneprice.val())){
			 			    		var error = twoprice.closest('li').find('.error');
			 			    		error.html('第2阶段-成团价格要小于第1阶段');
			 			    		error.addClass('message-error');
			 			    		isboolean = false;
			 			    		 
			 			    }
			 			    if(parseFloat(threeprice.val()) >= parseFloat(twoprice.val())){
			 			    		var error = threeprice.closest('li').find('.error');
			 			    		error.html('第3阶段-成团价格要小于第2阶段');
			 			    		error.addClass('message-error');
			 			    		isboolean = false;
			 			    	 
			 			    }
			 			    if(parseFloat(retailPrice.val()) <= parseFloat(oneprice.val())){
			 			    	var error = retailPrice.closest('li').find('.error');
			 			    		  error.html('参考零售价必须大于您填的第1阶段成团价格:'+oneprice.val()+'元/件');
			 			    		  error.addClass('message-error');
			 			    		  isboolean = false;
			 			    }
			 	});
			 }
			 
			 return isboolean;
		}
		
		//拼凑json数据
		function collectData(){
			 var  dataList = '{"data":[',
				    collectData = $("input:not(:hidden)").serializeArray(),
						dataObj = '';			
							
			      $.each(collectData,function(i){
 				     	 if(collectData[i].name === 'offerid'){
				     	 	  dataObj = '{' ;											     	 	  
				    	 }
				    	  
				    	 dataObj +=  '"'+collectData[i].name+'":'+'"'+collectData[i].value+'"';
				    	 
				    	 if(collectData[i].name === 'sendDays'){
				     	 	   dataObj += '},' ;		
				     	 	   dataList += dataObj;											     	 	  
				    	 }else{
				    	 	   dataObj += ',';
				    	 }
			      });
			     
						dataList = dataList.substring(0,dataList.length-1)+ ']}';
	
						return dataList;
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
})(jQuery, FE.topic);
