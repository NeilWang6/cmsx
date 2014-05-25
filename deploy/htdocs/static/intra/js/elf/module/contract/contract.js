/**
 * @author wb-zhangchunyi
 * @usefor 制作合同
 * @date   2013.07.22
 */
;(function($, T) {
	var enrollInfoReq = $('#enroll-info-req'),
	 	readyFun = [
	    function(){
	    	$("#save-btn").bind("click",function(e){	    		
	    		submitForm();
	    	});
	    	$("#resetVal-btn").bind("click",function(e){
	    		resetValue();
	    	});
	    	$("#back-btn").bind("click",function(e){
	    		window.location.href= $(this).data('value'); 
	    	});
	    	
	    	//提交"退回SKU变更的offer"表单
	    	$("#reject-offer-btn").bind("click",function(e){
	    		//submitRejectOfferForm();
	    		document.rejectModifiedSkuOfferForm.submit();
	    	});
	    },
        
        function(){
	        $.use('ui-flash-clipboard', function(){
	            var styleObj = 'clipboard{\
	            	text:复制合同链接;\
                    fontSize:12;\
                    color:#1E90FF;\
	            }';
	            $('#copyLink-btn').flash({
	                module: 'clipboard',
	                width:90,
	                height:22,
	                flashvars:{
	                    style:encodeURIComponent(styleObj)
	                }
	            }).on("swfReady.flash",function()
	            {
	                //debugStr("swfReady");
	            }).on("mouseDown.flash",function()
	            {
	                $(this).flash("setText",$("#contractConfirmUrl").text());
	            }).on("complete.flash",function(e,data){
	            	alert("复制成功");
	            });
	        });
        },
        
    	
	    //alitalk
		function(){
			$.use('web-alitalk', function() {
				FE.util.alitalk($('a[data-alitalk]'), {
					onRemote: function(data) {
						var el = $(this);
						el.html(data.id);
						switch (data.online) {
							case 0:
							case 2:
							case 6:
							default: //不在线
								el.html('');
								break;
							case 1: //在线
								el.html('');
								break;
							case 4:
							case 5: //手机在线
								el.html('');
								break;
						}
						
					} 
				});
			});   
		},
		
	    //全部应用
        function(){
            $('.ct-table').delegate('.sku-item-quantity,.sku-item-price','mouseenter',function(){
                $(this).find('.tips-applyall').show();
            });
            $('.ct-table').delegate('.sku-item-quantity,.sku-item-price','mouseleave',function(){
                $(this).find('.tips-applyall').hide();
            });
            $('.ct-table').delegate('.ct-applyall','click',function(){
                $(this).closest('ul').find('.sale-price-value,.sale-amount-value').val($(this).closest('li').find('.sale-price-value,.sale-amount-value').val());
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
	
	//保存表单
	function submitForm(){
	 	var contractItem = "";
		var offerId = $("#offerId").val();
		var period = $("#period").val();
		var enInsId = $("#enInsId").val();
		var quantityBegin =$("#quantityBegin").val();
		var category = $("#category").val();
		var ump = $("#ump").val();
		
		if( isNumFeifa(quantityBegin) ) {
			alert("你所填写的项有非法，请仔细检查！");
			return ;
		}
		
		var price = "";
		var quanity = "";
		
		var isSKUInput = $("#isSKU").val();

		if( isSKUInput == "yes" ) {
			var skuSizeInput = $("#skuSize").val();
			var allQuantity = 0;
			
			for(var j = 1, len = parseInt(skuSizeInput, 10)+1; j < len; j++){
				if( isPriceFeifa($("#price_"+j).val()) || isNumFeifa($("#quanity_"+j).val()) ) {
					alert("你所填写的项有非法，请仔细检查！");
					return ;
				}
				allQuantity += parseInt($("#quanity_"+j).val());
				
				if( price == "" ) {
					price = $("#specId_"+j).val() + ":" + $("#price_"+j).val();
					quanity = $("#specId_"+j).val() + ":" + $("#quanity_"+j).val();
				} else {
					price = price + "," + $("#specId_"+j).val() + ":" + $("#price_"+j).val();
					quanity = quanity + "," + $("#specId_"+j).val() + ":" + $("#quanity_"+j).val();
				}
			}
			
			if( parseInt(quantityBegin) > allQuantity ) {
				alert("起批量不能大于供货量！");
				return ;
			}
		} else {
			price = $("#price").val();
			quanity = $("#quanity").val();
			if( isPriceFeifa(price) || isNumFeifa(quanity) ) {
				alert("你所填写的项有非法，请仔细检查！");
				return ;
			}
			if( parseInt(quantityBegin) > parseInt(quanity) ) {
				alert("起批量不能大于供货量！");
				return ;
			}
		}
		
		if(offerId==""||price==""||quanity==""||quantityBegin==""){
			alert('请将必填项填写完整！');
			return ;
		}
		
		if(!enInsId){
			enInsId=" ";
		}
		
		if(!period){
			period=" ";
		}
		
		if(!category){
			category=" ";
		}
		
		var items = isSKUInput+'|'+price +'|'+quanity+'|'+quantityBegin+'|'+enInsId+'|'+period+'|'+category+'|'+ump;
		contractItem += offerId + "|" +items;
	 	document.contractForm.contract_item.value = contractItem;
	 	document.contractForm.submit();
	}

	
	//重置
	function resetValue(){
		var isSKUInput = $("#isSKU").val();
		if( isSKUInput == "yes" ) {
			var skuSizeInput = $("#skuSize").val();
			
			for(var j = 1, len = parseInt(skuSizeInput, 10)+1; j < len; j++){
				$("#price_"+j).val($("#oldPrice_"+j).val());
				$("#quanity_"+j).val($("#oldQuanity_"+j).val());
			}
			
		} else {
			price = $("#price").val($("#oldPrice").val());
			quanity = $("#quanity").val($("#oldQuanity").val());
		}
		$("#quantityBegin").val($("#oldQuantityBegin").val());

	}
	

	function isPriceFeifa(i) {
	  	var regMoney = /^(([1-9]{1}[0-9]{0,8})|[0]{1})([.]{1}[0-9]{1,2})?$/;
	 	if((i.trim() === '') || (!regMoney.test(i))) {
	        return true;
	     }
	     return false;
	}

	function isNumFeifa(i) {
	  	var regNum = /^[1-9]{1}[\d]{0,8}$/;
	 	if((i.trim() === '') || (!regNum.test(i))) {
	        return true;
	     }
	     return false;
	}
	
	//提交“退回SKU变更的offer”表单
	function submitRejectOfferForm(){
	 	document.rejectModifiedSkuOfferForm.submit();
	}
	
})(jQuery, FE.tools);