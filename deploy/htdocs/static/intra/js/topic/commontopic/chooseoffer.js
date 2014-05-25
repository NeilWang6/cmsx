/**
 * @author hongss
 * @userfor ��ѡ�����˵�
 * @date  2012.08.27
 * 
 */
 
jQuery(function($){
    var formValid,
        locationHref = location.href,
        inputOffer = $('#offer-sale'),
        pageinputOffer = $('#page-offer-sale'),
        inputOfferNoteInfo = $('#offer-note-info'),
        pageinputOfferNoteInfo = $('#page-offer-note-info'),
        enrollInfoReq = $('#enroll-info-req'),
        oform = $('#offerform'),
        pform = $('#pageform'), oldOfferInfos = [],
        oldOfferNoteInfos = [],
        readyFun = [
        //����֤
        function(){
            var validEls = $('.need-valid');
            $.use('web-valid', function(){
                formValid = new FE.ui.Valid(validEls, {
                    onValid: function(res, o){
                        var tip = $(this).parent().find('.tips-c'), msg;
                        if (tip.length>1){
                            for (var i=0, l=tip.length-1; i<l; i++){
                                tip.eq(i).remove();
                            }
                        }
                        if (res==='pass') {
                            tip.removeClass('tips-error');
                            //���ۿۼ������⴦��
                            var thisEl=tip.parent().find('.sale-price-value');
                            if (typeof(thisEl.data('specid')) == "undefined"){
                            	//��sku offer
                            	var checkEl=thisEl.closest('tr').find('.offer-id');
                            }else{
                            	//sku offer
                            	var checkEl=thisEl.closest('tr').find('.td2 input[data-specid='+thisEl.data('specid')+']');
                            }
                            if (checkEl.attr('checked') && thisEl.attr("offer-price") !='' && $("#offer-discount").val() !=''){
                            	var reg=/^\d+[\.]?\d{0,2}$/g;
                            	if (thisEl.val() > thisEl.attr("offer-price")*$("#offer-discount").val()/10 ){
                            		tip.addClass('tips-error');
                            	}
                            }
                            //FIXME 
                            validCheckedOffer30daysLowestPrice(thisEl);
                            
                        } else {
                            switch (res){
                                case 'required':
                                    msg = '����д';
                                    break;
                                case 'float' :
                                    msg = '����д����';
                                    break;
                                case 'int' :
                                    msg = '����д����';
                                    break;
                                case 'min' :
                                    msg = o.key;
                                    break;
                                case 'max' :
                                    msg = '�������ֵ';
                                    break;
                                case 'fun' :
                                    msg = o.msg;
                                    break;
                                default:
                                    msg = '�������';
                                    break;
                            }
                            $('.info', tip).text(msg);
                            tip.addClass('tips-error');
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
                //��ǰ���ۿ�tip
                var trEl=$(this).closest('tr');
                //��֤��ѡ��offer���ۿ�Ҫ��
                if (trEl.find('.td2 .sku-checkbox').length > 0){
                	//sku offer
                	$.each(trEl.find('.td2 .sku-checkbox:checked'),function(){
                    	var skuCheckboxThis=$(this);
                    	validCheckedOfferDiscount(trEl.find('.td3 input[data-specid='+skuCheckboxThis.data('specid')+']'));
                    	validCheckedOffer30daysLowestPrice(trEl.find('.td3 input[data-specid='+skuCheckboxThis.data('specid')+']'));
                    });
                }else{
                	//��sku offer
                	var offerChecked = trEl.find('.offer-id');
                	offerChecked.attr('checked') && !validCheckedOfferDiscount(trEl.find('.td3 .sale-price-value'));
                	
                	validCheckedOffer30daysLowestPrice(trEl.find('.td3 .sale-price-value'))
                }
            });
        },
        //��ʼ������ѡ���
        function(){
        	new FE.tools.Select('.ump-select', {
        	                    dataText: 'text'
        	                });
        	
        },
        function(){
            if(enrollInfoReq.val()!=''){
                if(enrollInfoReq.val().indexOf('skus-one-price')!=-1){
                    $('.ct-table').delegate('input.sale-price-value','keyup',function(){
                        $(this).closest('ul').find('input.sale-price-value').val($.trim($(this).val()));
                    });
                }
            }
            $('.ct-table').delegate('input.sale-price-value','keyup',function(e){
                var thisEl=$(this);
                var priceValue=$.trim(thisEl.val());
                if(priceValue&&priceValue!=''&&priceValue.indexOf('.')!=-1&&priceValue.indexOf('.')+4<=priceValue.length){
                    thisEl.val(priceValue.substr(0,priceValue.length-1));
                }
                if (typeof(thisEl.data('specid')) == "undefined"){
                	//��sku offer
                	var checkEl=thisEl.closest('tr').find('.offer-id');
                }else{
                	//sku offer
                	var checkEl=thisEl.closest('tr').find('.td2 input[data-specid='+thisEl.data('specid')+']');
                }
            	if (checkEl.attr('checked')){
                	var reg=/^\d+[\.]?\d{0,2}$/g;
                    if (reg.test(thisEl.val()) && thisEl.attr("offer-price") !='' && $("#offer-discount").val() !=''){
                    	var tip = thisEl.parent().find('.tips-c');
                		var tipInfo = tip.find('.info');
                		var customOfferDiscountTip  = $('#customOfferDiscountTip').val();
                		if(customOfferDiscountTip=='' || customOfferDiscountTip==undefined){
                			customOfferDiscountTip='�ۿ۲������޸�';
                		}
                    	if (thisEl.val() <= thisEl.attr("offer-price")*$("#offer-discount").val()/10 ){
                    		
                    		tipInfo.html(customOfferDiscountTip);
                            tip.removeClass('tips-error');
                    	}else{
                    		tipInfo.html(customOfferDiscountTip);
                            tip.addClass('tips-error');
                    	}
                    }
                    //FIXME
                    validCheckedOffer30daysLowestPrice(thisEl);
                }
            });
            //�ж�offer�ۿ�Ҫ��
            $('.ct-table').delegate('input.sale-price-value','blur',function(e){
                var thisEl=$(this);
                if (typeof(thisEl.data('specid')) == "undefined"){
                	//��sku offer
                	var checkEl=thisEl.closest('tr').find('.offer-id');
                }else{
                	//sku offer
                	var checkEl=thisEl.closest('tr').find('.td2 input[data-specid='+thisEl.data('specid')+']');
                }
            	if (checkEl.attr('checked')){
                	var reg=/^\d+[\.]?\d{0,2}$/g;
                    if (reg.test(thisEl.val()) && thisEl.attr("offer-price") !='' && $("#offer-discount").val() !=''){
                    	if (thisEl.val() > thisEl.attr("offer-price")*$("#offer-discount").val()/10 ){
                    		var tip = thisEl.parent().find('.tips-c');
                    		var tipInfo = tip.find('.info');
                    		var customOfferDiscountTip  = $('#customOfferDiscountTip').val();
                    		if(customOfferDiscountTip=='' || customOfferDiscountTip==undefined){
                    			customOfferDiscountTip='�ۿ۲������޸�';
                    		}
                    		tipInfo.html(customOfferDiscountTip);
                            tip.addClass('tips-error');
                    	}
                    }
                    //FIXME
                    //validCheckedOffer30daysLowestPrice(thisEl);
                }
            });
        },
        //offer��ע��Ϣʧȥ������Ӧ
        function(){
        	$('.offer-note-info-2').on('blur',function(){
            	var reg = /^\s*$/;
            	if (!reg.test($(this).val())){
            		 var tip = $(this).parent().find('.tips-note');
                     tip.removeClass('tips-error');
            	}
            	var checkbox =  $(this).closest('tr').find('input.offer-id');
            	if (checkbox.attr('checked')==='checked'){
            		if ($('#is-offer-note-need').val() == 'Y' && $('#is-offer-note-required').val() == 'Y' ){
                		validOfferNodeInfoIsEmptyOrTooLong($(this));
                	}
            	}
        	});
        	$('.offer-note-info-2').on('mouseenter',function(){
        		var tip = $(this).parent().find('.tips-note');
        		tip.addClass('tips-error');
        	});
        	$('.offer-note-info-2').on('mouseleave',function(){
        		var tip = $(this).parent().find('.tips-note');

            	var checkbox =  $(this).closest('tr').find('input.offer-id');
            	if (checkbox.attr('checked')==='checked'
            			&& $('#is-offer-note-need').val() == 'Y' 
            			&& $('#is-offer-note-required').val() == 'Y'){
            		var reg = /^\s*$/;
                	if (!reg.test($(this).val())){
                		tip.removeClass('tips-error');
                	}
            	}else{
            		tip.removeClass('tips-error');
            	}
        	});
        },
        //����checkbox�����֤
        function(){
            var oldVal = inputOffer.val();
            var oldNoteInfoVal = inputOfferNoteInfo.val();
            if (oldVal){
                oldOfferInfos = $.parseJSON(oldVal)['offerinfo'];
            }
            if (oldNoteInfoVal){
            	oldOfferNoteInfos = $.parseJSON(oldNoteInfoVal)['offerNoteInfo'];
            }
            $('.ct-table').delegate('input.offer-id', 'click', function(e){
                var checkbox = $(this),
                    tr = checkbox.closest('tr'),
                    val = checkbox.val();
                if (checkbox.attr('checked')==='checked'){
                    tr.find('input.sku-checkbox').prop('checked','checked');
                    validCheckedOffer(checkbox);
                    //�����Ƿ���required����֤
                    if ($('#is-offer-note-need').val() == 'Y' && $('#is-offer-note-required').val() == 'Y' ){
                        var offerNoteInfo = tr.find('input.offer-note-info-2');
                        validOfferNodeInfoIsEmptyOrTooLong(offerNoteInfo);
                    }
                } else {
                    tr.find('input.sku-checkbox').prop('checked','');
                    tr.find('div.tips-error').removeClass('tips-error');
                    for (var i=0, l=oldOfferInfos.length; i<l; i++){
                        if (oldOfferInfos[i]['offerid']===val){
                            oldOfferInfos.splice(i, 1);
                            l--;
                        }
                    }
                    for (var i=0; i<oldOfferNoteInfos.length; i++){
                        if (oldOfferNoteInfos[i]['offerid']===val){
                        	oldOfferNoteInfos.splice(i, 1);
                            break;
                        }
                    }
                }
                checkOffer();
            });
            $('.ct-table').delegate('input.sku-checkbox', 'click', function(e){
                var skuCheckboxThis=$(this);
                var tr=skuCheckboxThis.closest('tr');
                var someSkuCheckboxChecked=false;
                skuCheckboxThis.closest('ul').find('input.sku-checkbox').each(function(){
                    if($(this).prop('checked')){
                        someSkuCheckboxChecked=true;
                    }
                });
                var offerIdCheckbox= tr.find('input.offer-id');
                if(someSkuCheckboxChecked){
                    offerIdCheckbox.prop('checked','checked');
                    //�����Ƿ���required����֤
                    if ($('#is-offer-note-need').val() == 'Y' && $('#is-offer-note-required').val() == 'Y' ){
                        var offerNoteInfo = tr.find('input.offer-note-info-2');
                        validOfferNodeInfoIsEmptyOrTooLong(offerNoteInfo);
                    }
                    checkOffer();
                }else{
                    offerIdCheckbox.prop('checked','');
                    offerIdCheckbox.click();
                    offerIdCheckbox.prop('checked','');
                }

                if(skuCheckboxThis.prop('checked')){
                    formValid.valid(tr.find('input[data-specid='+skuCheckboxThis.data('specid')+']'), {'required':true});
                    //��֤ѡ�е�offer�ۿ�Ҫ��,sku�򴥷�
                    validCheckedOfferDiscount(tr.find('.td3 input[data-specid='+skuCheckboxThis.data('specid')+']'));
                    //��֤�Ƿ�С��30����ͳɽ���
                    validCheckedOffer30daysLowestPrice(tr.find('.td3 input[data-specid='+skuCheckboxThis.data('specid')+']'));
                    validCheckedBase(tr);
                }else{
                   	tr.find('.td3 input[data-specid='+skuCheckboxThis.data('specid')+']').parent().find('.tips-c').removeClass('tips-error');
                }
            });
        },
        //��ҳ����
        function(){
            $('.mod-page-tag').delegate('[data-page]', 'click', function(e){
                
                e.preventDefault();
                var el = $(this),
                    pageNum = el.data('page'),
                    els = $('.ct-table .offer-id:checked').not(':disabled');
                if (validCheckedOffer(els)){
                    //
                    var pageReg = /(page=\d*)(&{0,1})/g,
                      offerInfos = getCheckedOfferInfo(els);
                      var beg=new Date().getTime();
                      inputOffer.val(JSON.stringify(offerInfos));
                      //alert(new Date().getTime()-beg);
                      var offerNoteInfos = getCheckedOfferNoteInfo(els);
                      inputOfferNoteInfo.val(JSON.stringify(offerNoteInfos));
                      //alert(new Date().getTime()-beg);
                      pform[0].elements['page'].value = pageNum;
                      pform.trigger('submit');
                      //alert(new Date().getTime()-beg);
                }
               
            });
        },
        //�ύѡ��offer
        function(){
            var oformSubmitting=false;
            oform.submit(function(e){
                if(oformSubmitting){
                    return false;
                }
                //var beg=new Date().getTime();
                var els = $('.ct-table .offer-id:checked').not(':disabled');
                var minEnrollOfferOnce=$("#minEnrollOfferOnce").val();
                if (validCheckedOffer(els)){
                    var offerNoteInfos = getCheckedOfferNoteInfo(els),
                        offerInfos = getCheckedOfferInfo(els);
                    
                    if (offerInfos['offerinfo'].length===0){
                        alert('����ѡ��Ҫ�����Ĳ�Ʒ��');
                        return false;
                    }
                    //ǰ̨У�鱨������offer��
                    if(minEnrollOfferOnce != ''){
                    	 if (offerInfos['offerinfo'].length < minEnrollOfferOnce){
                        	 alert('һ�����ٱ���'+minEnrollOfferOnce+'����Ʒ��Ϣ��');
                             return false;
                        }
                    }
                   
                    
                    //alert(new Date().getTime()-beg);
                    pageinputOffer.val(JSON.stringify(offerInfos));
                    pageinputOfferNoteInfo.val(JSON.stringify(offerNoteInfos));
                    if(oformSubmitting){
                        return false;
                    }
                    oformSubmitting=true;
                    return true;
                }
                return false;
            });
        },
        function(){
        	$('#offer-subject').placeholder({isUseSpan:true});
        },
		//�ר������checkbox��ֵ�趨

		function(){
			$("#activitysharingtemp").bind("click", function() {
				if(!$(this).prop('checked')){
					document.getElementById("jointopic").value = "n";		
				}else{
					document.getElementById("jointopic").value = "y";
				}
			});
		}
    ];
    
    //��֤offer��ע��Ϣ�ǿ�
    //ͳһ��֤��ѡoffer�Ĵ�����
    // els ����ѡ�е�checkbox��Ԫ�ؼ���
    function validCheckedOffer(els){
        //var beg=new Date().getTime();
        var isResult = true;
        els.each(function(i, el){
            var trEl=$(el).closest('tr');
            if(enrollInfoReq.val()!=''){
                if(enrollInfoReq.val().indexOf('skus-one-price')!=-1){
                    var isOnePrice=true;
                    var onePriceLastValue='';
                    trEl.find('input.sale-price-value').each(function(){
                    	//��Ҫ�жϵ�ǰ�Ĺ�������Ƿ�ѡ��
                        var checkEl=$(this).closest('tr').find('.td2 input[data-specid='+$(this).data('specid')+']');
                        if (checkEl.attr('checked')){
	                        if(onePriceLastValue==''){
	                            onePriceLastValue=$(this).val();
	                        }
	                        if(onePriceLastValue!=$(this).val()){
	                            isOnePrice=false;
	                        }
                        }
                    });
                    if(!isOnePrice){
                        isResult = false;
                        alert('����ר��Ҫ�󵥸���Ʒ��ͬ������Եļ۸���뱣��һ�£����޸ģ�');
                    }
                }
            }
            if (!formValid.valid(trEl.find('input.sale-price'), {'required':true})){
                    isResult = false;
                }
            //��֤��ѡ��offer���ۿ�Ҫ��
            if (trEl.find('.td2 .sku-checkbox').length > 0){
            	//sku offer
            	$.each(trEl.find('.td2 .sku-checkbox:checked'),function(){
                	var skuCheckboxThis=$(this);
                	if (!validCheckedOfferDiscount(trEl.find('.td3 input[data-specid='+skuCheckboxThis.data('specid')+']')) || !validCheckedOffer30daysLowestPrice(trEl.find('.td3 input[data-specid='+skuCheckboxThis.data('specid')+']')) ){
                		isResult = false;
                	}
                });
            }else{
            	//��sku offer
            	var offerChecked = trEl.find('.offer-id');
            	if (offerChecked.attr('checked') && (!validCheckedOfferDiscount(trEl.find('.td3 .sale-price-value'))  || !validCheckedOffer30daysLowestPrice(trEl.find('.td3 .sale-price-value')))){
                	isResult = false;
                }
            }
            if(!validCheckedBase(trEl)){
                isResult = false;
            }
            
        });
        //console.log(new Date().getTime()-beg);
        //alert(new Date().getTime()-beg);
        return isResult;
    }
    
    
	//��֤ѡ���offer�Ƿ��ۿ�Ҫ��
    function validCheckedOfferDiscount(thisEl){
    	var isResult = true;
    	var reg=/^\d+[\.]?\d{0,2}$/g;
    	if (reg.test(thisEl.val()) && thisEl.attr("offer-price") !='' && $("#offer-discount").val() !=''){
    		var tip = thisEl.parent().find('.tips-c');
			var tipInfo = tip.find('.info');
			var customOfferDiscountTip  = $('#customOfferDiscountTip').val();
    		if(customOfferDiscountTip=='' || customOfferDiscountTip==undefined){
    			customOfferDiscountTip='�ۿ۲������޸�';
    		}
			
    		if (thisEl.val() > thisEl.attr("offer-price")*$("#offer-discount").val()/10 ){
				tipInfo.html(customOfferDiscountTip);
				tip.addClass('tips-error');
				isResult = false;
			}else{
				tip.removeClass('tips-error');
			}
		}
 
    	return isResult;
    }
    //��֤ѡ���offer�۸��Ƿ�С�ڵ���30����ͳɽ���
    function validCheckedOffer30daysLowestPrice(thisEl){
    	var isResult = true;
    	var reg=/^\d+[\.]?\d{0,2}$/g;
    	if ((reg.test(thisEl.val()) && thisEl.attr("offer-lowest-price") !='' && $("#offer-lowest-price-setting").val() !='')){
    		var tip = thisEl.parent().find('.tips-c');
			var tipInfo = tip.find('.info');
			//alert("value:"+thisEl.val() +";offer-lowest-price:"+thisEl.attr("offer-lowest-price") +";�����"+(parseFloat(thisEl.val()) > parseFloat(thisEl.attr("offer-lowest-price"))));
			if (parseFloat(thisEl.val()) > parseFloat(thisEl.attr("offer-lowest-price")) && parseFloat(thisEl.attr("offer-lowest-price"))>0){
				tipInfo.html('���ܴ���:'+thisEl.attr("offer-lowest-price"));
				tip.addClass('tips-error');
				isResult = false;
			}else{
				tip.removeClass('tips-error');
			}	
    	}
    	return isResult;
    }
    
    function validCheckedBase(trEl){
        var isResult = true;
        if (!formValid.valid(trEl.find('input.sale-quantitybeg-value'), {'required':true})){
            isResult = false;
        }
        if ($('#is-offer-note-need').val() == 'Y' && $('#is-offer-note-required').val() == 'Y' ){
            if (!validOfferNodeInfoIsEmptyOrTooLong(trEl.find('input.offer-note-info-2'))){
                isResult = false;
            }
        }

        return isResult;
    }
    //��֤��ע��Ϣ�Ƿ�Ϊ��
    function validOfferNodeInfoIsEmptyOrTooLong(elm){
    	var reg = /^\s*$/;
    	if ($(elm).val().length > 500){
    		var tip = $(elm).parent().find('.tips-note');
    		var tipInfo = tip.find('.info');
    		tipInfo.html("���ܳ���500���ַ���");
            tip.addClass('tips-error');
    		return false;
    	}else if (reg.test($(elm).val())){
    		 var tip = $(elm).parent().find('.tips-note');
    		 var tipInfo = tip.find('.info');
             var customNote=$('.custom-offer-note-info');
             if(customNote.val()!=''){
                tipInfo.html(customNote.val());
             }else{
                tipInfo.html("����д");
            }
             tip.addClass('tips-error');
    		return false;
    	}
    	return true;
    }
    
    function getCheckedOfferNoteInfo(els){
    	var offerNoteInfos = oldOfferNoteInfos;
    	els.each(function(i, el){
            var el = $(el),
            offerNoteInfo = {},
            noteInfoInput = el.closest('tr').find('input.offer-note-info-2'),
            val = el.val(),isFirst = true,noteInfoVal = noteInfoInput.val();
            
            var umpSelect=el.closest('tr').find('select.ump-select'),ump=umpSelect.val();
            for (var i = 0; i < offerNoteInfos.length; i++){
                if (offerNoteInfos[i]['offerid']===val){
                	offerNoteInfos[i]['noteInfo'] = noteInfoVal;
                	//�жϿ�
                	if(umpSelect[0] && ump){
                		offerNoteInfos[i]['umpInfo'] = ump;
                	}
                	
                    isFirst = false;
                    break;
                }
            }
            if (isFirst===true){
            	offerNoteInfos.push({'offerid':val,'noteInfo':noteInfoVal,'umpInfo':ump});
            }
    	});
    	return {'offerNoteInfo':offerNoteInfos};
    }
    
    
    //��ȡ��ѡoffer����Ϣ
    // els ����ѡ�е�checkbox��Ԫ�ؼ���
    function getCheckedOfferInfo(els){
        //var beg=new Date().getTime();
        var offerInfos = oldOfferInfos;
        
        els.each(function(i, el){
            var el = $(el),
                trEl=el.closest('tr');
                offerInfo = {},
                skuCheckbox = trEl.find('input.sku-checkbox'),
                val = el.val(), isFirst = true, saleVal=el.closest('tr').find('input.sale-price').val(),
                priceValueMap={},quantityValueMap={};
                var quantity=trEl.find('input.sale-amount-value').val(),quantityBegin=trEl.find('input.sale-quantitybeg-value').val();
                if(quantity=='' || quantity==undefined){
                	quantity=0;
                }
                if(quantityBegin=='' || quantityBegin==undefined){
                	quantityBegin=0;
                }
                
                if(skuCheckbox.length==0){
                    //��ͨoffer,���ǵ��������͹������п������أ���Ҫ���ǿ��ж�           
                	if(trEl.find('input.sale-price-value').length>0){
	                    saleVal={
	                            'isSku':false,
	                            'price':String(trEl.find('input.sale-price-value').val()),
	                            'quantity':String(quantity),
	                            'quantityBegin':String(quantityBegin)
	                        };
                	}
                }else{
                  if(trEl.find('input.sale-price-value').length>0){
                        saleVal={
                            'isSku':true,
                            'skus':{},
                            'quantityBegin':String(quantityBegin)
                        };
                        trEl.find('input.sale-price-value').each(function(){
                            var priceValuesThis=$(this);
                            priceValueMap['specid-'+priceValuesThis.data('specid')]=priceValuesThis.val();
                        });
                        trEl.find('input.sale-amount-value').each(function(){
                            var quantityValuesThis=$(this);
                            quantityValueMap['specid-'+quantityValuesThis.data('specid')]=quantityValuesThis.val();
                        });
                        skuCheckbox.each(function(){
                            var skuCheckboxThis=$(this);
                            if(skuCheckboxThis.attr('checked')==='checked'){
                                var skuCheckboxSpecid= skuCheckboxThis.data('specid');
                                //���ǵ��������͹������п������أ���Ҫ���ǿ��ж�
                                var quantityValue=quantityValueMap['specid-'+skuCheckboxSpecid];
                                if(quantityValue=='' || quantityValue==undefined){
                                	quantityValue=0;
                                }
                                saleVal.skus[skuCheckboxSpecid]={
                                    'specId':String(skuCheckboxSpecid),
                                    'prpo1':String(skuCheckboxThis.data('p1v')),
                                    'prpo2':String(skuCheckboxThis.data('p2v')),
                                    'price':String(priceValueMap['specid-'+skuCheckboxSpecid]),
                                    'quantity':String(quantityValue)
                                };
                            }
                            
                        });  
                  }
                }
                
            for (var i=0, l=offerInfos.length; i<l; i++){
                if (offerInfos[i]['offerid']===val){
                    offerInfos[i]['salePrice'] = saleVal;
                    isFirst = false;
                }
            }
            if (isFirst===true){
                offerInfos.push({'offerid':val,'salePrice':saleVal});
            }
            
        });
        //alert(new Date().getTime()-beg);
        return {'offerinfo':offerInfos};
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
});