/**
 * @author wangxiaojun
 * @usefor ��ͨר�������ҳ��
 * @date   2013.2.20
 */
 

jQuery.namespace('FE.topic');
;(function($, T){
	var readyFun = [
						//�����¼�
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
				    //��ӣ�ɾ������
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
										 			 message.html('�����Ŷ���Ʒ��Ϣ�����Ѿ��ﵽ���������ֵ��');
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
				    //��ƷID��֤
				    function(){
				    	var ids = $('#hidIds').val();
				    	 $('#form-content').delegate('.offerid','blur',function(e){
				    	 	var message = $(this).siblings('.error'),
				    	 	    regnum = /^[0-9]*$/,
				    	 	    values = $(this).val();
				    	 	    
				    	 	    if(values.length===0){
				    	 	    	 message.html('��ƷID����Ϊ��');
				    	 	       message.addClass('message-error');
				    	 	    	 return;
				    	 	    }else{
				    	 	    	if(!(regnum.test(values))){
				    	 	    		 message.html('��ƷID��ʽ����ȷ,�������������');
				    	 	       	 message.addClass('message-error');
				    	 	    	 	 return;
				    	 	    	}
				    	 	    }
				    	 	    values = ','+values+',';
				    	 	    if(ids.indexOf(values)>=0){
				    	 	    	 message.html('��ƷID�Ѿ�������');
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
							    	 	    	 message.html($(this).data('title')+'����Ϊ��');
							    	 	       message.addClass('message-error');
							    	 	   }else{
							    	 	   		 if($(this).hasClass('piece')){
 							    	 	   		 	  var  regInt  =  /^[1-9]+[0-9]*]*$/ ;
 							    	 	   		 		if (!(regInt.test($(this).val()))){
																				 message.html($(this).data('title')+'����������');
							    	 	       						 message.addClass('message-error');
							    	 	       						 return;
																} 
							    	 	   		 }
							    	 	   		 if($(this).hasClass('price')){
 							    	 	   		 	  var regMoney = /^(([1-9]{1}[0-9]{0,8})|[0]{1})([.]{1}[0-9]{1,3})?$/;
  							    	 	   		 	if (!(regMoney.test(values))){
																			 message.html($(this).data('title')+'��������');
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
				    //��ť�ύ�¼�
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
																						 			message.html('�����������������ƷID');
																    	 	          message.addClass('message-error');
																					 }
																					 if((','+o.offersIdsHas).indexOf(vals)>=0){
																						 			message.html('��ƷID�����ظ�');
																    	 	          message.addClass('message-error');
																					 }
																					 if((','+o.offersPrivate).indexOf(vals)>=0){
																						 			message.html('����ƷID��˽����Ʒ,���ܲμӱ���');
																    	 	          message.addClass('message-error');
																					 }
																					 if((','+o.offersVip).indexOf(vals)>=0){
																						 			message.html('����ƷID��vip������Ʒ,���ܲμӱ���');
																    	 	          message.addClass('message-error');
																					 }
																					 if((','+o.offersSample).indexOf(vals)>=0){
																						 			message.html('����ƷID����Ʒoffer,���ܲμӱ���');
																    	 	          message.addClass('message-error');
																					 }
																					 if((','+o.offersFreight).indexOf(vals)>=0){
																						 			message.html('����Ʒû�а���,���ܲμӱ���');
																    	 	          message.addClass('message-error');
																					 }
																					 if((','+o.offersAmount).indexOf(vals)>=0){
																					 	      var amountMessage = $(this).closest('.content').find('.amount');
																						 			amountMessage.html('��3�׶μ������ܴ�����Ʒ��������');
																    	 	          amountMessage.addClass('message-error');
																					 }
																					  
																					 
																	});
															}
															
													}
												},
												error: function () {
													alert("ҳ�泬ʱ��������");
												}
										});
										$(this).prop('disabled',false);
										return false;
							});
						}
    ];
    
    
    //�������֤
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
		 									message.html('��ƷID����Ϊ��');
						    	 	  message.addClass('message-error');
						    	 	  isboolean =  false;
						   	}else{
						   				if(!$(this).hasClass('deposit')){
							 	  	     error.html($(this).data('title')+'����Ϊ��');
										     error.addClass('message-error');
							 	  	     isboolean =  false;
						 	  	    }
					 	    }
				 	   }
				 	  
				 	   if(vals.length>0){
				 	   	   var  values =  $('#hidIds').val(),
				 	   	        curVal = ','+ $(this).val()+',';
					 	  	 if($(this).hasClass('offerid') && !(regnum.test(vals))){
		    	 	    		 message.html('��ƷID��ʽ����ȷ,�������������');
		    	 	       	 message.addClass('message-error');
		    	 	    	 	 isboolean =  false;
						   	 }else if($(this).hasClass('offerid') && saveIds.split(curVal).length>2){
						   	 	   message.html('��ƷID�����ظ�');
		    	 	       	 message.addClass('message-error');
		    	 	    	 	 isboolean =  false;
						   	 }else if($(this).hasClass('offerid') && values.indexOf(curVal)>=0){
						   	 	   message.html('����ƷID�Ѿ�������');
		    	 	       	 message.addClass('message-error');
		    	 	    	 	 isboolean =  false;
						   	 }else if($(this).hasClass('piece') && !(regInt.test(vals))){
										 error.html($(this).data('title')+'����������');
									   error.addClass('message-error');
									   isboolean =  false;
					 	     }else if($(this).hasClass('price') && !(regMoney.test(vals))){
										 error.html($(this).data('title')+'��������');
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
			 			    		error.html('��2�׶�-���ż���Ҫ���ڵ�1�׶�');
			 			    		error.addClass('message-error');
			 			    		isboolean = false;
			 			    		 
			 			    }
			 			    if(parseInt(threepiece.val()) <= parseInt(twopiece.val())){
			 			    		var error = threepiece.closest('li').find('.error');
			 			    		error.html('��3�׶�-���ż���Ҫ���ڵ�2�׶�');
			 			    		error.addClass('message-error');
			 			    		isboolean = false;
			 			    	 
			 			    }
			 			    if(parseFloat(twoprice.val()) >=  parseFloat(oneprice.val())){
			 			    		var error = twoprice.closest('li').find('.error');
			 			    		error.html('��2�׶�-���ż۸�ҪС�ڵ�1�׶�');
			 			    		error.addClass('message-error');
			 			    		isboolean = false;
			 			    		 
			 			    }
			 			    if(parseFloat(threeprice.val()) >= parseFloat(twoprice.val())){
			 			    		var error = threeprice.closest('li').find('.error');
			 			    		error.html('��3�׶�-���ż۸�ҪС�ڵ�2�׶�');
			 			    		error.addClass('message-error');
			 			    		isboolean = false;
			 			    	 
			 			    }
			 			    if(parseFloat(retailPrice.val()) <= parseFloat(oneprice.val())){
			 			    	var error = retailPrice.closest('li').find('.error');
			 			    		  error.html('�ο����ۼ۱����������ĵ�1�׶γ��ż۸�:'+oneprice.val()+'Ԫ/��');
			 			    		  error.addClass('message-error');
			 			    		  isboolean = false;
			 			    }
			 	});
			 }
			 
			 return isboolean;
		}
		
		//ƴ��json����
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
