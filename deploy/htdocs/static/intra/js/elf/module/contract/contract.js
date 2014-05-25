/**
 * @author wb-zhangchunyi
 * @usefor ������ͬ
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
	    	
	    	//�ύ"�˻�SKU�����offer"��
	    	$("#reject-offer-btn").bind("click",function(e){
	    		//submitRejectOfferForm();
	    		document.rejectModifiedSkuOfferForm.submit();
	    	});
	    },
        
        function(){
	        $.use('ui-flash-clipboard', function(){
	            var styleObj = 'clipboard{\
	            	text:���ƺ�ͬ����;\
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
	            	alert("���Ƴɹ�");
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
							default: //������
								el.html('');
								break;
							case 1: //����
								el.html('');
								break;
							case 4:
							case 5: //�ֻ�����
								el.html('');
								break;
						}
						
					} 
				});
			});   
		},
		
	    //ȫ��Ӧ��
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
	
	//�����
	function submitForm(){
	 	var contractItem = "";
		var offerId = $("#offerId").val();
		var period = $("#period").val();
		var enInsId = $("#enInsId").val();
		var quantityBegin =$("#quantityBegin").val();
		var category = $("#category").val();
		var ump = $("#ump").val();
		
		if( isNumFeifa(quantityBegin) ) {
			alert("������д�����зǷ�������ϸ��飡");
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
					alert("������д�����зǷ�������ϸ��飡");
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
				alert("���������ܴ��ڹ�������");
				return ;
			}
		} else {
			price = $("#price").val();
			quanity = $("#quanity").val();
			if( isPriceFeifa(price) || isNumFeifa(quanity) ) {
				alert("������д�����зǷ�������ϸ��飡");
				return ;
			}
			if( parseInt(quantityBegin) > parseInt(quanity) ) {
				alert("���������ܴ��ڹ�������");
				return ;
			}
		}
		
		if(offerId==""||price==""||quanity==""||quantityBegin==""){
			alert('�뽫��������д������');
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

	
	//����
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
	
	//�ύ���˻�SKU�����offer����
	function submitRejectOfferForm(){
	 	document.rejectModifiedSkuOfferForm.submit();
	}
	
})(jQuery, FE.tools);