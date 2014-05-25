/**
 * @author: lusheng.linls
 * @Date: 2012-11-30
 */

;(function($, T) {
	String.prototype.replaceAll  = function(s1,s2){
		return this.replace(new RegExp(s1,"gm"),s2);
	}
T.createControl = function(pageId,control,table) {
	var ctrlType = control.attr('ctrlType');
	var ctrlName = control.attr('name');
	var ctrlId = control.attr('id');
	var itemId =  pageId + '-' +  ctrlId;
	var itemType = control.attr('itemType');
	var attribute = control.attr('attribute');
	var ctrlSourceType = control.attr('ctrlSourceType');
	var isHidden = control.attr('isHidden');
	var defaultValue = '';
	if(control.attr('defaultValue')) {
		defaultValue = control.attr('defaultValue');
	}
	var ctrlType = control.attr('ctrlType');
	var format = control.attr('format');
	var isNeed = control.attr('isNeed');
	var tips = control.attr('tips');
	var value = control.attr('value');
	var showDevice = control.attr('showDevice');


	var needHidden = ('Y' == isHidden) ? ' hiddenDiv ' : '';
	var row=jQuery('<tr class="'+needHidden+'"></tr>');
	row.appendTo(table);
    var needClass = ('Y' == isNeed) ? ' must-fill' : '';
	var td1=jQuery('<td align="right" class="backcolor'+needClass+'"></td>');
	td1.append(ctrlName);
	if(showDevice!=0){//0只支持PC,1只支持无线,2支持无线和PC;1和2两种情况显示图标
		var mobileIcon = jQuery('<span class="wireless-icon">：</span>');
		td1.append(mobileIcon);
	}else{//不支持无线的条件加上样式以控制readonly和提示信息的展示
		td1.addClass('un-support-wireless');
		td1.append('：');
	}
	var td2=jQuery('<td class="backcolor1"></td>');
	row.append(td1);
	row.append(td2);
	if('text' == ctrlType) {
		
		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 228px" type="text" value="'+defaultValue+'"/>');
		input.appendTo(td2);
		
	} else if('shorttext' == ctrlType) {

		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH:60px" type="text" value="'+defaultValue+'"/>');
		input.appendTo(td2);

	} else if('longtext' == ctrlType) {
		var alink = "";
		if((String(ctrlId) == "551") && $('#insId').val() != '') {
			alink = "<a id='setSurvey' href='javascript:void(0);' data-url='" + $("#custCollectUrl").val() + "' style='padding-right:5px;'>设置</a><a href='" + $("#tbpTopicUrl").val() + "' target='_blank' style='padding-right:5px;'>淘爆款设置</a>";
		}
		
		var input = jQuery(alink+'<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH:400px" type="text" value="'+defaultValue+'"/><br/>');
		input.appendTo(td2);
		if((String(ctrlId) == "551")) {
			jQuery('#setSurvey').click(function(){
				$.use('ui-dialog', function(){
					var dialogEl=$('#js-surveyframe');
					dialogEl.find('section').html('<iframe width="800" height="450" name="setSurveyFrame" id="setSurveyFrame" src="'+$("#surveyConfigUrl").val()+'&t='+new Date().getTime()+'" scrolling="no" frameborder="0" ></iframe>');
                    var dialog = dialogEl.dialog({
                        center: true,
                        fixed:true
                    });
                    dialogEl.find('.close').click(function(){
	                	//防止再次点击时发送两次iframe请求
	                    dialogEl.find('section').html('');
                        dialog.dialog('close');
                    });
                });
			});
		}

	} else if ('textarea' == ctrlType) {

		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="hidden" value="'+ HTMLEnCode(defaultValue) + '"/>');
		input.appendTo(td2);
		jQuery('<textarea class="font14" wrap="VIRTUAL" id="textarea-'+ itemId +'">' + HTMLEnCode(value) + '</textarea><br/>').appendTo(td2);
		//将值填充进去
		jQuery('#textarea-' + itemId).blur(function() {
			jQuery('#item-' + itemId).val(jQuery('#textarea-' + itemId).val());
		});

	} else if ('select' == ctrlType) {

		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="hidden" value="' + defaultValue +'"/>');
		input.appendTo(td2);
		var select = jQuery('<select id="select-'+ itemId +'" value="' + defaultValue + '"></select>')
		select.appendTo(td2);
		jQuery('<option value=""></option>').appendTo(select)
		//遍历每个下拉属性
		control.find('item').each(function(){
			var option = null;
			if(defaultValue == jQuery(this).find('value:first').text()) {
				option = jQuery('<option value="'+  jQuery(this).find('value:first').text() + '" selected>' + jQuery(this).find('text:first').text() + '</option>');
			} else if('true' == jQuery(this).attr('selected') && defaultValue == "") {
				option = jQuery('<option value="'+  jQuery(this).find('value:first').text() + '" selected>' + jQuery(this).find('text:first').text() + '</option>');
			} else {
				option = jQuery('<option value="'+  jQuery(this).find('value:first').text() + '">' + jQuery(this).find('text:first').text() + '</option>');
			}
			option.appendTo(select);
		});
		jQuery('#select-'+ itemId).change(function () {
			var itemIdEl = jQuery('#item-'+ itemId);
		   jQuery('#select-'+ itemId +' option:selected').each(function () {
			   itemIdEl.val(jQuery(this).val())
		   });
			
			if(itemIdEl.attr('item')==="531"){
				//当显示设备不为“PC”(0)，且是否用户报名选择的不是“是”的时候，显示提示信息
				var value = itemIdEl.val();
				var isNeedUserTd=itemIdEl.parent();
				if($('input[item=2701]').val() && $('input[item=2701]').val()!=0 && value =='n'){//用户报名选择“否”，需要提示不支持
					isNeedUserTd.find('.tips').addClass('fd-hide');
					isNeedUserTd.find('.un-sup-msg').remove();
					isNeedUserTd.append('<p class="un-sup-msg" style="color:red;">该条件暂不支持在无线端展示报名</p>');
				}else{
					isNeedUserTd.find('.tips').removeClass('fd-hide');
					isNeedUserTd.find('.un-sup-msg').remove();
				}
				itemIdEl.trigger('changeValue',{
					"type":"hide",
					"itemId":"2800,509",
					"curValue":itemIdEl.val()
				});
			}else if(itemIdEl.attr('item')==="713"){
				itemIdEl.trigger('changeValue',{
					"type":"hide",
					"itemId":"717,721,725,726,10101,556,10094",
					"curValue":itemIdEl.val()
				});
			}else if(itemIdEl.attr('item')==="2701"){
				itemIdEl.trigger('changeStyleForWireless');
			}
		});

    } else if ('selectAndText' == ctrlType) {

        var selectValue=defaultValue.split(":")[0];
        var textValue=defaultValue.split(":")[1];
        if(textValue==undefined){
            textValue="";
        }
        var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="hidden" value="' + defaultValue +'"/>');
        input.appendTo(td2);
        var select = jQuery('<select id="select-'+ itemId +'" value="' + selectValue + '"></select>');
        select.appendTo(td2);
        jQuery('<option value=""></option>').appendTo(select)
        //遍历每个下拉属性
        control.find('item').each(function(){
            var option = null;
            if(selectValue == jQuery(this).find('value:first').text()) {
                option = jQuery('<option value="'+  jQuery(this).find('value:first').text() + '" selected>' + jQuery(this).find('text:first').text() + '</option>');
            } else if('true' == jQuery(this).attr('selected') && selectValue == "") {
                option = jQuery('<option value="'+  jQuery(this).find('value:first').text() + '" selected>' + jQuery(this).find('text:first').text() + '</option>');
            } else {
                option = jQuery('<option value="'+  jQuery(this).find('value:first').text() + '">' + jQuery(this).find('text:first').text() + '</option>');
            }
            option.appendTo(select);
        }); 
                            
        var input = jQuery('<input id="input-'+ itemId +'" name="input-'+ itemId +'"style="WIDTH: 80px" type="text" //value="'+textValue+'"/>');
        input.appendTo(td2);
        
        jQuery('#select-'+ itemId).change(function () {
           jQuery('#select-'+ itemId +' option:selected').each(function () {
               if(jQuery(this).val()=="" && jQuery('#input-'+ itemId).val()==""){
                    jQuery('#item-'+ itemId).val("");
               }
               if(jQuery(this).val()!="" && jQuery('#input-'+ itemId).val()!=""){
                    jQuery('#item-'+ itemId).val(jQuery(this).val()+":"+jQuery('#input-'+ itemId).val());
               }
           });
        });
        
        jQuery('#input-' + itemId).blur(function () {
                if(jQuery('#select-'+ itemId).val()=="" && jQuery(this).val()==""){
                    jQuery('#item-'+ itemId).val("");
                }
                if(jQuery('#select-'+ itemId).val()!="" && jQuery(this).val()!=""){
                    jQuery('#item-'+ itemId).val(jQuery('#select-'+ itemId).val()+":"+jQuery(this).val());
                }
        });

	} else if ('textrange' == ctrlType) {

		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + '  type="hidden" value="' + defaultValue +'"/>');
		input.appendTo(td2);
		var minValue = '';
		var maxValue = '';
		if(defaultValue != '')  {
			var rangValue = defaultValue.split(":");
			if(rangValue.length >= 2) {
				if(rangValue[0] != '-1') {
					minValue = rangValue[0];
				}
				if(rangValue[1] != '-1') {
					maxValue = rangValue[1];
				}
			}
		}
		jQuery('<input id="from-item-'+ itemId +'" name="item-'+ itemId +'" item=' + itemId + ' style="width:60px" type="text" value="' + minValue +'"/>').appendTo(td2);
		jQuery('<span> - </span>').appendTo(td2);  
		jQuery('<input id="to-item-'+ itemId +'" name="item-'+ itemId +'" item=' + itemId + ' style="width:60px" type="text" value="'+ maxValue + '"/>').appendTo(td2);
		
		jQuery('#from-item-' + itemId).blur(function() {
			var start = jQuery('#from-item-' + itemId).val();
			var end = jQuery('#to-item-' + itemId).val();
			if('' == start) {
				start = -1;
			}
			if('' == end) {
				end = -1;
			}
			jQuery('#item-' + itemId).val(start + ':' + end);
		});
		jQuery('#to-item-' + itemId).blur(function() {
			var start = jQuery('#from-item-' + itemId).val();
			var end = jQuery('#to-item-' + itemId).val();
			if('' == start) {
				start = -1;
			}
			if('' == end) {
				end = -1;
			}
			jQuery('#item-' + itemId).val(start + ':' + end);
		});
		
	} else if ('radio' == ctrlType) {

		var td2Radio=jQuery('<span class="radio-area"></span>');
		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + '  type="hidden" value="' + defaultValue +'"/>');
		input.appendTo(td2Radio);
		
		control.find('item').each(function(index,element){
			var thisItemEl=jQuery(this);
			var flag = false;
			if(defaultValue != '')  {
				var checkedValue = defaultValue.split(",");
				for(var i=0; i<checkedValue.length;i++){
					if(checkedValue[i]==thisItemEl.find('value:first').text()){
						flag = true;
						break;
					}
				}
			}
			if(index!==0){
				jQuery('<span class="radio-blank"></span>').appendTo(td2Radio)
			}
			var labelInputTmp='<label for="check-'+ itemId+'-'+thisItemEl.find('value:first').text()+'"><input class="check check-'+ itemId +'" id="check-'+ itemId+'-'+thisItemEl.find('value:first').text()+'" name="check-'+ itemId +'" value="'+thisItemEl.find('value:first').text()+'" type="radio"';
			if(flag){
				labelInputTmp=labelInputTmp+' checked />';
			}else{
				labelInputTmp=labelInputTmp+' />';
			}
			labelInputTmp=labelInputTmp + thisItemEl.find('text:first').text() +'</label>';
			jQuery(labelInputTmp).appendTo(td2Radio);
		});
		td2.append(td2Radio);
		var checkItem = jQuery('.check-'+ itemId)
		checkItem.click(function() {
			var el = $(this);
			var itemIdEl = jQuery('#item-' + itemId);
			var value = el.val();
			if(this.checked) {
				itemIdEl.val(value);
			}
			if(itemIdEl.attr('item')==="533"){
				//当显示设备不为“PC”(0)，且是否offer报名选择的不是“否”的时候，显示提示信息
				var isNeedOfferTd=itemIdEl.parent().parent();
				if($('input[item=2701]').val() && $('input[item=2701]').val()!=0 && value!='n'){//询价单和offer报名都需要提示不支持
					isNeedOfferTd.find('.tips').addClass('fd-hide');
					isNeedOfferTd.find('.un-sup-msg').remove();
        			isNeedOfferTd.append('<p class="un-sup-msg" style="color:red;">该条件暂不支持在无线端展示报名</p>');
				}else{
					isNeedOfferTd.find('.tips').removeClass('fd-hide');
					isNeedOfferTd.find('.un-sup-msg').remove();
				}
				itemIdEl.trigger('changeOfferValue',{
					"type":"hide",
					"userItemId":"542",
					"offerItemId":"619,620,621,700,718,701,702,703,710,711,713,628,720,652,657,717,721,725,726,910,10101,10100,556,10102,10091,10092,10094,10084",
					"inquiryItemId":"800",
					"curValue":itemIdEl.val()
				});
			}
		});
	} else if ('checkbox' == ctrlType) {

		var td2Checkbox=jQuery('<span class="checkbox-area"></span>');
		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + '  type="hidden" value="' + defaultValue +'"/>');
		input.appendTo(td2Checkbox);
		
		control.find('item').each(function(index,element){
			var thisCheckboxItemEl=jQuery(this);
			var flag = false;
			if(defaultValue != '')  {
				var checkedValue = defaultValue.split(",");
				for(var i=0; i<checkedValue.length;i++){
					if(checkedValue[i]==thisCheckboxItemEl.find('value:first').text()){
						flag = true;
						break;
					}
				}
			}
			if(index!==0){
				jQuery('<span class="check-blank"></span>').appendTo(td2Checkbox)
			}
			var labelCheckInputTmp='<label for="check-'+ itemId+'-'+thisCheckboxItemEl.find('value:first').text()+'"><input class="check check-'+ itemId +'" id="check-'+ itemId+'-'+thisCheckboxItemEl.find('value:first').text()+'" name="check-'+ itemId +'" value="'+thisCheckboxItemEl.find('value:first').text()+'" type="checkbox"';
			if(flag){
				labelCheckInputTmp=labelCheckInputTmp+' checked />';
			}else{
				labelCheckInputTmp=labelCheckInputTmp+' />';
			}
			labelCheckInputTmp=labelCheckInputTmp + thisCheckboxItemEl.find('text:first').text() +'</label>';
			jQuery(labelCheckInputTmp).appendTo(td2Checkbox);
		
		});
		td2.append(td2Checkbox);
		var checkItem = jQuery('.check-'+ itemId)
		checkItem.click(function() {
			var el = $(this);
			var itemIdEl = jQuery('#item-' + itemId);
			var oldValue = itemIdEl.val();
			var value = el.val();
			if(this.checked) {
				itemIdEl.val(oldValue+value+',');
			}else{
				itemIdEl.val(oldValue.replace(value+',',''));
			}
			if(itemIdEl.attr('item')==="704"){
				itemIdEl.trigger('changeValue',{
					"type":"hide",
					"itemId":"705",
					"curValue":(itemIdEl.val()?'y':'n')
				});
			}else if(itemIdEl.attr('item')==="601"){
				itemIdEl.trigger('changeValue',{
					"type":"hide",
					"itemId":"629",
					"curValue":((itemIdEl.val()&&-1!=itemIdEl.val().indexOf('redListRequired'))?'y':'n')
				});
			}else if(itemIdEl.attr('item')==="10088"){
				itemIdEl.trigger('changeValue',{
					"type":"hide",
					"itemId":"10089",
					"curValue":(itemIdEl.val()?'y':'')
				});
			}
			
		});
		
	} else if ('saleRateLevel' == ctrlType) {

		
        var compareValue=defaultValue.split(":")[0];
        var levelValue=defaultValue.split(":")[1];
        if(compareValue==undefined){
            compareValue="";
        }
        if(levelValue==undefined){
            levelValue="";
        }
        var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' type="hidden" value="' + defaultValue +'"/>');
        input.appendTo(td2);
        var compareSelect = jQuery('#sale-rate-level .compare').attr('value',compareValue);
        var levelSelect = jQuery('#sale-rate-level .level').attr('value',levelValue);
        //var select = jQuery('<select id="select-'+ itemId +'" value="' + compareValue + '"></select>');
        jQuery('#sale-rate-level').appendTo(td2).show();
        //遍历每个下拉属性

        compareSelect.change(function () {
        	var compareSelectOp=compareSelect.find('option:selected');
        	var levelSelectOp=levelSelect.find('option:selected');
           if(compareSelectOp.val()==""){
                jQuery('#item-'+ itemId).val("");
           }else if(compareSelectOp.val()!="" && levelSelectOp.val()!=""){
                jQuery('#item-'+ itemId).val(compareSelectOp.val()+":"+levelSelectOp.val());
           }
        });
        levelSelect.change(function () {
        	var compareSelectOp=compareSelect.find('option:selected');
        	var levelSelectOp=levelSelect.find('option:selected');
           if(levelSelectOp.val()==""){
                jQuery('#item-'+ itemId).val("");
           }else if(compareSelectOp.val()!="" && levelSelectOp.val()!=""){
                jQuery('#item-'+ itemId).val(compareSelectOp.val()+":"+levelSelectOp.val());
           }
        });

	} else if ('caiGouCategory' == ctrlType) {
		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="hidden" value="' + defaultValue +'"/>');
		input.appendTo(td2);
		jQuery('#caiGouCategorySample').clone(true).attr('id','caiGouCategory-'+ itemId).removeClass("hiddenDiv").addClass("showDiv").appendTo(td2);

		jQuery('#caiGouCategory-'+ itemId).find('#remove-caigou-category-bt:first').attr('id','remove-market-bu-pinlei-bt-'+ itemId).click(function() {
            removeSelected(pageId,ctrlId,itemId,"caiGouCategorySelected");
		});
		jQuery('#caiGouCategory-'+ itemId).find('#add-caigou-category-bt:first').attr('id','add-market-bu-pinlei-bt1-'+ itemId).click(function() {
			addCategory(pageId,ctrlId,itemId,'caiGouCategorySelect','caiGouCategorySelected');
		});
	} else if ('marketBuPinlei' == ctrlType) {

		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="hidden" value="' + defaultValue +'"/>');
		input.appendTo(td2);
		jQuery('#marketBuPinleiSample').clone(true).attr('id','marketBuPinlei-'+ itemId).removeClass("hiddenDiv").addClass("showDiv").appendTo(td2);

		jQuery('#marketBuPinlei-'+ itemId).find('#remove-market-bu-pinlei-bt:first').attr('id','remove-market-bu-pinlei-bt-'+ itemId).click(function() {
            removeSelected(pageId,ctrlId,itemId,"selectedMarketBuPinlei");
		});
		jQuery('#marketBuPinlei-'+ itemId).find('#add-market-bu-pinlei-bt1:first').attr('id','add-market-bu-pinlei-bt1-'+ itemId).click(function() {
			addMarketBuPinlei(pageId,ctrlId,itemId,'marketBuPinleiCatSelect1','selectedMarketBuPinlei','market');
		});
		
		jQuery('#marketBuPinlei-'+ itemId).find('#add-market-bu-pinlei-bt3:first').attr('id','add-market-bu-pinlei-bt3-'+ itemId).click(function() {
			addMarketBuPinlei(pageId,ctrlId,itemId,'marketBuPinleiCatSelect3','selectedMarketBuPinlei','pinlei');
		});

	}else if ('inquiryCategory' == ctrlType) {

        var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="hidden" value="' + defaultValue +'"/>');
        input.appendTo(td2);
        jQuery('#inquiryCategorySample').clone(true).attr('id','inquiryCategory-'+ itemId).removeClass("hiddenDiv").addClass("showDiv").appendTo(td2);

        jQuery('#inquiryCategory-'+ itemId).find('#inquiry-category-remove-bt:first').attr('id','inquiry-category-remove-bt-'+ itemId).click(function() {
            removeInquirySelected(pageId,ctrlId,itemId,"inquirySelectedCategory");
        });

        jQuery('#inquiryCategory-'+ itemId).find('#inquiry-category-add-category-bt1:first').attr('id','inquiry-category-add-category-bt1-'+ itemId).click(function() {
        	addInquiryCategory(pageId,ctrlId,itemId,'inquiryCategorySelect1','inquirySelectedCategory',1);
        });
        
        jQuery('#inquiryCategory-'+ itemId).find('#inquiry-category-add-category-bt2:first').attr('id','inquiry-category-add-category-bt2-'+ itemId).click(function() {
        	addInquiryCategory(pageId,ctrlId,itemId,'inquiryCategorySelect2','inquirySelectedCategory',2);
        });
        
        jQuery('#inquiryCategory-'+ itemId).find('#inquiry-category-add-category-bt3:first').attr('id','inquiry-category-add-category-bt3-'+ itemId).click(function() {
        	addInquiryCategory(pageId,ctrlId,itemId,'inquiryCategorySelect3','inquirySelectedCategory',3);
        });
        
    }  else if ('productcategory' == ctrlType) {

        var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="hidden" value="' + defaultValue +'"/>');
        input.appendTo(td2);
        jQuery('#productCategorySample').clone(true).attr('id','productCategory-'+ itemId).removeClass("hiddenDiv").addClass("showDiv").appendTo(td2);
        jQuery('#productCategory-'+ itemId).find('#product-category-set-price-bt:first').attr('id','product-category-set-price-bt-'+ itemId).click(function() {
            setPrice(itemId);
        });
        
        jQuery('#productCategory-'+ itemId).find('#product-category-remove-bt:first').attr('id','product-category-remove-bt-'+ itemId).click(function() {
            removeSelected(pageId,ctrlId,itemId,"selectedCategory");
        });
        
        
        jQuery('#productCategory-'+ itemId).find('#product-category-add-category-bt1:first').attr('id','product-category-add-category-bt1-'+ itemId).click(function() {
            addCategory(pageId,ctrlId,itemId,'categorySelect1','selectedCategory');
        });
        
        jQuery('#productCategory-'+ itemId).find('#product-category-add-category-bt2:first').attr('id','product-category-add-category-bt2-'+ itemId).click(function() {
            addCategory(pageId,ctrlId,itemId,'categorySelect2','selectedCategory');
        });
        
        jQuery('#productCategory-'+ itemId).find('#product-category-add-category-bt3:first').attr('id','product-category-add-category-bt3-'+ itemId).click(function() {
            addCategory(pageId,ctrlId,itemId,'categorySelect3','selectedCategory');
        });
        
    }  else if ('postcategory' == ctrlType) {

        var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="hidden" value="' + defaultValue +'"/>');
        input.appendTo(td2);
        jQuery('#postCategorySample').clone(true).attr('id','postCategory-'+ itemId).removeClass("hiddenDiv").addClass("showDiv").appendTo(td2);
        jQuery('#postCategory-'+ itemId).find('#post-category-remove-bt:first').attr('id','post-category-remove-bt-'+ itemId).click(function() {
            removeSelectedForVipAuto(pageId,ctrlId,itemId,"postSelectedCategory");
        });
        
        jQuery('#postCategory-'+ itemId).find('#post-category-add-category-bt1:first').attr('id','post-category-add-category-bt1-'+ itemId).click(function() {
            addCategoryForVipAuto(pageId,ctrlId,itemId,'postCategorySelect1','postSelectedCategory');
        });
        
        jQuery('#postCategory-'+ itemId).find('#post-category-add-category-bt2:first').attr('id','post-category-add-category-bt2-'+ itemId).click(function() {
            addCategoryForVipAuto(pageId,ctrlId,itemId,'postCategorySelect2','postSelectedCategory');
        });
        
        jQuery('#postCategory-'+ itemId).find('#post-category-add-category-bt3:first').attr('id','post-category-add-category-bt3-'+ itemId).click(function() {
            addCategoryForVipAuto(pageId,ctrlId,itemId,'postCategorySelect3','postSelectedCategory');
        });
        
    } else if ('buProductcategory' == ctrlType) {

        var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="hidden" value="' + defaultValue +'"/>');
        input.appendTo(td2);
        jQuery('#buProductCategorySample').clone(true).attr('id','buProductCategory-'+ itemId).removeClass("hiddenDiv").addClass("showDiv").appendTo(td2);
        jQuery('#buProductCategory-'+ itemId).find('#product-category-bu-remove-bt:first').attr('id','product-category-bu-remove-bt-'+ itemId).click(function() {
            removeSelected(pageId,ctrlId,itemId,"buSelectedCategory");
        });
        
        
        jQuery('#buProductCategory-'+ itemId).find('#product-category-add-bu-category-bt1:first').attr('id','product-category-add-bu-category-bt1-'+ itemId).click(function() {
            addCategory(pageId,ctrlId,itemId,'buCategorySelect1','buSelectedCategory');
        });
        
        jQuery('#buProductCategory-'+ itemId).find('#product-category-add-bu-category-bt2:first').attr('id','product-category-add-bu-category-bt2-'+ itemId).click(function() {
            addCategory(pageId,ctrlId,itemId,'buCategorySelect2','buSelectedCategory');
        });
        
    } else if ('offerNoteInfo' == ctrlType){
    	var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + '  type="hidden" value="' + defaultValue +'"/>');
		input.appendTo(td2);
		jQuery('#offerNoteInfoSample').removeClass("hiddenDiv").addClass("showDiv").appendTo(td2);

		//回填数据
		//需要备注信息，显示是否必填和自定义的备注提示信息
		if ('Y' == defaultValue.split(':')[0]){
			jQuery('#offerNoteRequired').show();
			jQuery('#check-offer-note-need').val('Y');
			jQuery('#check-offer-note-need').attr('checked','true');
		}else{
			jQuery('#offerNoteRequired').hide();
			jQuery('#check-offer-note-need').val('');
			jQuery('#check-offer-note-need').removeAttr('checked');
		}
		//备注信息是否必填 
		if ('Y' == defaultValue.split(':')[1]){ 
			jQuery('#check-offer-note-required').val('Y');
			jQuery('#check-offer-note-required').attr('checked','true');
		}else{
			jQuery('#check-offer-note-required').val('');
			jQuery('#check-offer-note-required').removeAttr('checked');
		}
		//自定义备注提示信息
		if ( undefined != defaultValue.split(':')[2]){
			jQuery('#offer-note-error').val(defaultValue.split(':')[2]);
		}else{
			jQuery('#offer-note-error').val('');
		}
		
		jQuery('#check-offer-note-need').click(function(){
			if ( jQuery('#check-offer-note-need').attr('checked')){
				jQuery('#offerNoteRequired').show();
				jQuery('#check-offer-note-need').val('Y');
			}else{
				jQuery('#offerNoteRequired').hide();
				jQuery('#check-offer-note-need').val('');
	    	}
			setOfferNoteInfo(itemId);
		});

		jQuery('#check-offer-note-required').click(function(){
			if ( jQuery('#check-offer-note-required').attr('checked')){
				jQuery('#check-offer-note-required').val('Y');
			}else{
				jQuery('#check-offer-note-required').val('');
	    	}
			setOfferNoteInfo(itemId);
		});
	
        jQuery('#offer-note-error').blur(function() {
        	setOfferNoteInfo(itemId);
	    });
     
    }else if ('certificateSelect' == ctrlType) {

        var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="hidden" value="' + defaultValue +'"/>');
        input.appendTo(td2);
        jQuery('#certificateSelectSample').clone(true).attr('id','certificateSelect-'+ itemId).removeClass("hiddenDiv").addClass("showDiv").appendTo(td2);
        jQuery('#certificateSelect-'+ itemId).find('#certificate-remove-bt:first').attr('id','certificate-remove-bt-'+ itemId).click(function() {
            removeSelected(pageId,ctrlId,itemId,"certificateSelected");
        });
        
        
        jQuery('#certificateSelect-'+ itemId).find('#certificate-add-bt1:first').attr('id','certificate-add-bt1-'+ itemId).click(function() {
            addCategory(pageId,ctrlId,itemId,'certificateSelect1','certificateSelected');
        });
        
        jQuery('#certificateSelect-'+ itemId).find('#certificate-add-bt2:first').attr('id','certificate-add-bt2-'+ itemId).click(function() {
            addCategory(pageId,ctrlId,itemId,'certificateSelect2','certificateSelected');
        });
        
    }else if ('photo' == ctrlType) {

		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="hidden" value="' + defaultValue +'"/>');
		input.appendTo(td2);
		
	} else if ('maxOffer' == ctrlType) {

		var input = jQuery('<span>小于等于 </span><input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 50px" type="text" value="' + defaultValue +'"/><span>个</span>');
		input.appendTo(td2);
		
	} else if ('selectAndHref' == ctrlType) {

		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="hidden" value="' + defaultValue +'"/>');
		input.appendTo(td2);
		var select = jQuery('<select id="select-'+ itemId +'" value="' + defaultValue + '"></select>');
		select.appendTo(td2);
		
		var atag = jQuery('<span>&nbsp;&nbsp;<a id="a-'  +  itemId  +  '" href="#" target="_blank">查看模版</a></span>');
		atag.appendTo(td2);
		
		//遍历每个下拉属性
		control.find('item').each(function(){
			var option = null;
			
			var text = jQuery(this).find('text:first').text();
			var textArray = text.split("|||");
			var textShow = null;
			var imgHref = null;
			
			if(textArray.length >= 2 ) {
				textShow = textArray[0];
				imgHref = textArray[1];
			}
			
			if(defaultValue == jQuery(this).find('value:first').text()) {
				option = jQuery('<option value="'+  jQuery(this).find('value:first').text() + '" imgurl="' + imgHref +'" selected>' + textShow + '</option>');
			} else if('true' == jQuery(this).attr('selected') && defaultValue == "") {
				option = jQuery('<option value="'+  jQuery(this).find('value:first').text() + '" imgurl="' + imgHref +'" selected>' + textShow + '</option>');
			} else {
				option = jQuery('<option value="'+  jQuery(this).find('value:first').text() + '" imgurl="' + imgHref + '">' + textShow + '</option>');
			}
			option.appendTo(select);
		});
		select.change(function () {
		   jQuery('#select-'+ itemId +' option:selected').each(function () {
			   jQuery('#item-'+ itemId).val(jQuery(this).val());
			   jQuery('#a-'+ itemId).attr("href", jQuery(this).attr("imgurl"));
		   });
		});
		select.change();
		
	} else if ('fileSubmit' == ctrlType) {

		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="hidden" value="'+ defaultValue + '"/>');
		input.appendTo(td2);
		jQuery('<input type="file" id="file-'  +  itemId  +  '" name="file-'  +  itemId  +  '" style="WIDTH:260px" />').appendTo(td2);
		jQuery('<input id="button-'  +  itemId  +  '" name="button-'  +  itemId  +  '" type="button" value="解析" class="btn-basic btn-gray"/>').appendTo(td2);
		jQuery('<br />').appendTo(td2);
		jQuery('<input type="text" id="input-'+ itemId +'" style="WIDTH:240px" value="' + defaultValue + '" readOnly />').appendTo(td2);
		var fileId = 'file-' + itemId;
		var screenName = ctrlSourceType.split('|')[1];
		var urlPost = T.domain + '/enroll/' + screenName + '.htm?key=' + fileId;
		
		jQuery('#button-' + itemId).click(function(){
		
			var filePath = jQuery('#file-' + itemId).val();
			//判断是不是选择了上传文件，并且文件必须要以“.xls”结尾
			if(filePath && filePath.match(/.+\.xls$/ig)) {
				jQuery.ajaxFileUpload(
					{
						url:urlPost,
						async: false,
						timeout: 10000,
						secureuri:false,
						fileElementId:fileId,
						cache: false,
						dataType: 'text',
						success: function (data, status){
					 
							if(data && data != "") {
								if(data.split("error_").length>1){
									openErrDiv(data.split("error_")[1]);
								} else {
									jQuery('#item-' + itemId).val(data);
									jQuery('#input-' + itemId).val(data);
								}
								
							} else {
								alert('解析失败，请检查excel文件的格式是否正确，或者联系开发同学！');
							}
						},
						error: function (data, status, e){
							alert('好像有点慢啊，难道是服务器挂了？联系一下开发同学吧！');
						}
					}
				)
			} else {
				alert('请上传office 2003 excel文件！');
			}
			
		});
		
	} else if ('alirte' == ctrlType) {

		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="hidden" value="'+ HTMLEnCode(defaultValue) + '"/>');
		input.appendTo(td2);
		jQuery('<textarea name="description" class="font14" wrap="VIRTUAL" id="mce_editor_0">' + value + '</textarea>').appendTo(td2);
		//将值填充进去
		jQuery('#mce_editor_0').blur(function() {
			jQuery('#item-' + itemId).val(jQuery('#mce_editor_0').val());
		});

	} else if ('topicsingledate' == ctrlType) {
		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="hidden" value="'+ defaultValue + '"/>');
		input.appendTo(td2);
		var startDate = '';
		if(defaultValue != '')  {
			var rangValue = defaultValue.split("|");
			if(rangValue.length >= 1) {
				if(rangValue[0] != '-1') {
					startDate = rangValue[0];
				}
			}
		}
		
		jQuery('<input id="single-date-item-' + itemId + '" class="single-date-item" name="item-'+ itemId +'" item=' + itemId + ' style="width:128px" type="text" value="' + startDate +'" readonly="true" />').appendTo(td2);	
		jQuery('<input id="clean-date-item-' + itemId + '" class="clean-date-item btn-basic btn-gray" value="清空" + type="button" />').appendTo(td2);	
		$("#clean-date-item-" + itemId).bind("click", function() {
			jQuery("#item-" + itemId).val('');
			jQuery("#single-date-item-" + itemId).val('');
		});
	} else if ('topicdate' == ctrlType) {
		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="hidden" value="'+ defaultValue + '"/>');
		input.appendTo(td2);
		var startDate = '';
		var endDate = '';
		if(defaultValue != '')  {
			var rangValue = defaultValue.split("|");
			if(rangValue.length >= 2) {
				if(rangValue[0] != '-1') {
					startDate = rangValue[0];
				}
				if(rangValue[1] != '-1') {
					endDate = rangValue[1];
				}
			}
		}
		jQuery('<input id="from-date-item-' + itemId + '" class="from-date-item" name="item-'+ itemId +'" item=' + itemId + ' style="width:128px" type="text" value="' + startDate +'" readonly="true" />').appendTo(td2);
		jQuery('<span> - </span>').appendTo(td2);  
		jQuery('<input id="to-date-item-' + itemId + '" class="to-date-item" name="item-'+ itemId +'" item=' + itemId + ' style="width:128px" type="text" value="'+ endDate + '" readonly="true" />').appendTo(td2);		
		if(itemId != 'topic-1-506'){	
			jQuery('<input id="clean-date-item-' + itemId + '" class="clean-date-item btn-basic btn-gray" value="清空" + type="button" />').appendTo(td2);	
			$("#clean-date-item-" + itemId).bind("click", function() {
				jQuery("#item-" + itemId).val('');
				jQuery("#from-date-item-" + itemId).val('');
				jQuery("#to-date-item-" + itemId).val('');
			});
		}
	}else if ('offerDiscount' == ctrlType) {
		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + '  type="hidden" value="' + defaultValue +'"/>');
		input.appendTo(td2);
		jQuery('#offerDiscountSample').removeClass("hiddenDiv").addClass("showDiv").appendTo(td2);

		var discountCheck =jQuery('#check-offer-discount');
		var dateInput =jQuery('#offer-discount');
		
		if ('' != defaultValue){
			//offer折扣要求
			if (defaultValue.indexOf('yes') != -1){
				discountCheck.attr('checked','true');
			}
			var discount = defaultValue.split(':')[1];
			var reg=/^\d+[\.]?\d{0,2}$/g;
			if (reg.test(discount)) {
				dateInput.val(discount);
			}
		}
		
		discountCheck.click(function() {
			if (discountCheck.attr('checked') == 'checked'){
				var reg=/^\d+[\.]?\d{0,2}$/g;
				jQuery('#item-' + itemId).val('yes:'+dateInput.val());
				if (reg.test(dateInput.val())) {
					if (dateInput.val() >= 10 ){
						alert('折扣要求应小于10.00折');
					}
				}else{
					alert('折扣要求0-10之间的值，保留两位小数');
				}
			}else{
				jQuery('#item-' + itemId).val('');
			}
		});

		dateInput.blur(function() {
			if (discountCheck.attr('checked') == 'checked'){
				var reg=/^\d+\.?\d{0,2}$/;
				jQuery('#item-' + itemId).val('yes:'+dateInput.val());
				if (reg.test(dateInput.val())) {
					if (dateInput.val() >= 10 ){
						alert('折扣要求应小于10.00 折');
					}
				}else{
					alert('折扣要求0-10之间的值，保留两位小数');
				}
			}
		});
		
	}else if ('offerMutipleEnroll' == ctrlType) {
		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + '  type="hidden" value="' + defaultValue +'"/>');
		input.appendTo(td2);
		jQuery('#offerMutipleEnrollSample').removeClass("hiddenDiv").addClass("showDiv").appendTo(td2);
		var allowCheck =jQuery('#check-offer-muti-allow');
		var notAllowCheck =jQuery('#check-offer-muti-not-allow');
		var dateInput =jQuery('#offer-muti-date');
		if ('' != defaultValue){
			//允许重复报名
			if (defaultValue.indexOf('yes') != -1){
				allowCheck.attr('checked','true');
			}
			var enrollDate = defaultValue.split(':')[1];
			if(!isNotNumber(enrollDate)){
				//全部都是数字
				dateInput.val(enrollDate);
			}
		}
		
		notAllowCheck.click(function() {
			if (allowCheck.attr('checked') == 'checked'){
				allowCheck.removeAttr('checked');
			}
			jQuery('#item-' + itemId).val('');
		});
		
		allowCheck.click(function() {
			//允许选中的时候去掉，不允许的check
			if (notAllowCheck.attr('checked') == 'checked'){
				notAllowCheck.removeAttr('checked');
			}
			if (allowCheck.attr('checked') == 'checked'){
				if ( !isNotNumber(dateInput.val()) ){
					jQuery('#item-' + itemId).val('yes:'+dateInput.val());
				}
			}else{
				jQuery('#item-' + itemId).val('');
			}
		});
		
		dateInput.blur(function() {
			if (allowCheck.attr('checked') == 'checked'){
				if (isNotNumber(dateInput.val())){
					alert('[是否允许offer重复报名]允许的天数，请填写整数(前后不能有空格)！');
				}else{
					jQuery('#item-' + itemId).val('yes:'+dateInput.val());
				}
			}
		});
		
	}else if ('signContract' == ctrlType) {
		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + '  type="hidden" value="' + defaultValue +'"/>');
		input.appendTo(td2);
		jQuery('#signContractSample').removeClass("hiddenDiv").addClass("showDiv").appendTo(td2);
		
		if ('' != defaultValue){
			defaultValue = defaultValue.replaceAll("‘", "'");
			defaultValue = defaultValue.replaceAll("“", "\"");
			var jsonValue = JSON.parse(defaultValue);
			if (jsonValue.isNeedContract == 'Y'){
				jQuery('#contract-template-url').val(jsonValue.contractTemplateUrl);
				jQuery('#extra-content-url').val(jsonValue.extraContentUrl);
				jQuery('#delivery-time-note').val(jsonValue.deliveryTimeNote);
				jQuery('#check-sign-contract-need').attr('checked','true');
				jQuery('#signContracRequired').show();
			}else{
				jQuery('#check-sign-contract-need').removeAttr('checked');
				jQuery('#signContracRequired').hide();
			}
		}else{
			jQuery('#check-sign-contract-need').removeAttr('checked');
			jQuery('#signContracRequired').hide();
		}

		jQuery('#check-sign-contract-need').click(function() {
			if (jQuery('#check-sign-contract-need').attr('checked')){
				jQuery('#signContracRequired').show();
			}else{
				jQuery('#signContracRequired').hide();
			}
			setSignContract(itemId);
		});
		
		jQuery('#contract-template-url').blur(function() {
			var reg = /.*[“”‘’'"]+.*/;
			var url = jQuery('#contract-template-url').val();
			if (url.length > 500){
				alert('合同模板url的长度大于500！');
				return;
			}
			if (reg.test(url)){
				alert('合同模板url中含有非法字符【“ ” ‘ ’ \'  \"】！');
				return;
			}
			setSignContract(itemId);
		});

		jQuery('#extra-content-url').blur(function() {
			var reg = /.*[“”‘’'"]+.*/;
			var url = jQuery('#extra-content-url').val();
			if (url.length > 500){
				alert('附加内容url的长度大于500！');
				return;
			}
			if (reg.test(url)){
				alert('附加内容url中含有非法字符【“ ” ‘ ’ \'  \"】！');
				return;
			}
			setSignContract(itemId);
		});
		
		jQuery('#delivery-time-note').blur(function() {
			setSignContract(itemId);
		});
		
	}else if ('winport' == ctrlType) {

		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + '  type="hidden" value="' + defaultValue +'"/>');
		input.appendTo(td2);
		control.find('item').each(function(){
			if(defaultValue != ''){
				jQuery('<input class="check-'+ itemId +'" id="check-'+ itemId+'-'+jQuery(this).find('value:first').text()+'" name="check-'+ itemId +'" value="'+jQuery(this).find('value:first').text()+'"  style="WIDTH:20px" type="checkbox" checked />').appendTo(td2);
				jQuery('#winport-' + itemId).removeClass("hiddenDiv").addClass("showDiv");
			}else{
				jQuery('<input class="check-'+ itemId +'" id="check-'+ itemId +'-'+jQuery(this).find('value:first').text()+'" name="check-'+ itemId +'" value="'+jQuery(this).find('value:first').text()+'" style="WIDTH:20px" type="checkbox" />').appendTo(td2);
			}
			jQuery('<label for="check-'+ itemId +'-'+jQuery(this).find('value:first').text()+'">' + jQuery(this).find('text:first').text() +'</label>').appendTo(td2);
		});
		if(value != ''){
			value = value.replaceAll("‘", "'");
			value = value.replaceAll("“", "\"");
			var jsonValue = eval('(' + value + ')');
			var div = jQuery('<div id="winport-'+ itemId +'" class="showDiv winport-item"></div').appendTo(td2);
			jQuery('<label>活动url：</label>').appendTo(div);
			jQuery('<input id="item-url'+ itemId +'" name="item-url'+ itemId +'" style="WIDTH:457px;" type="text" value="'+jsonValue.winportShow.url+'"/>').appendTo(div);
			jQuery('<br/>').appendTo(div);
			jQuery('<label>活动logo图片地址：</label>').appendTo(div);
			jQuery('<input id="item-logo'+ itemId +'" name="item-logo'+ itemId +'" style="WIDTH:400px;" type="text" value="'+jsonValue.winportShow.logo+'"/>').appendTo(div);
		}else{
			var div = jQuery('<div id="winport-'+ itemId +'" class="hiddenDiv winport-item"></div').appendTo(td2);
			jQuery('<label>活动url：</label>').appendTo(div);
			jQuery('<input id="item-url'+ itemId +'" name="item-url'+ itemId +'" style="WIDTH:457px;" type="text" value=""/>').appendTo(div);
			jQuery('<br/>').appendTo(div);
			jQuery('<label>活动logo图片地址：</label>').appendTo(div);
			jQuery('<input id="item-logo'+ itemId +'" name="item-logo'+ itemId +'" style="WIDTH:400px;" type="text" value=""/>').appendTo(div);
		}
		jQuery('.check-'+ itemId).click(function() {
			if(this.checked) {
			//{"winportShow":{"url":http://view.1688.com/cms/abc.html,"logo":http://img.china.alibaba.com/abc.jpg}}
				var currentValue = "{'winportShow':{'url':'','logo':''}}";
				jQuery('#item-' + itemId).val(currentValue);
				jQuery('#winport-' + itemId).removeClass("hiddenDiv").addClass("showDiv");
			}else{
				jQuery('#item-' + itemId).val('');
				jQuery('#winport-' + itemId).removeClass("showDiv").addClass("hiddenDiv");
			}
		});
		jQuery('#item-url' + itemId).blur(function() {
			var oldValue = jQuery('#item-' + itemId).val();
			oldValue = oldValue.replaceAll("‘", "'");
			oldValue = oldValue.replaceAll("“", "\"");
			var urlValue = jQuery.trim(jQuery(this).val());
			var json = eval('(' + oldValue + ')');
			var winportShow = json.winportShow;
			var url = winportShow.url;
			url = urlValue;
			winportShow.url = url;		
			var urlstr = JSON.stringify(json);
			jQuery('#item-' + itemId).val(urlstr);
		});
		jQuery('#item-logo' + itemId).blur(function() {
			var oldValue = jQuery('#item-' + itemId).val();
			oldValue = oldValue.replaceAll("‘", "'");
			oldValue = oldValue.replaceAll("“", "\"");
			var logoValue = jQuery.trim(jQuery(this).val());
			var json = eval('(' + oldValue + ')');
			var winportShow = json.winportShow;
			var logo = winportShow.logo;
			logo = logoValue;
			winportShow.logo = logo;
			var logostr = JSON.stringify(json);
			jQuery('#item-' + itemId).val(logostr);
		});

	} else if('itemRange' == ctrlType) {

        var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="hidden" value="' + defaultValue +'"/>');
        input.appendTo(td2);
        jQuery('#itemRangeSample').clone(true).attr('id','itemRange-'+ itemId).removeClass("hiddenDiv").addClass("showDiv").appendTo(td2);
		//修改时回填
		if( defaultValue && defaultValue.trim() != '' ) {
			var items = defaultValue.split(';');
			
			if( items.length == 3 ) {
				var item1 = items[0].split(':');
				var item2 = items[1].split(':');
				var item3 = items[2].split(':');
				
				//第一行
				if( item1[0] != -1 ) {
					jQuery('#itemRange-'+ itemId).find('#item1b').val(item1[0])
				}
				if( item1[1] != -1 ) {
					jQuery('#itemRange-'+ itemId).find('#item1e').val(item1[1])
				}
				if( item1[2] != -1 ) {
					jQuery('#itemRange-'+ itemId).find('#item1f').val(item1[2])
				}
				
				//第二行
				if( item2[0] != -1 ) {
					jQuery('#itemRange-'+ itemId).find('#item2b').val(item2[0])
				}
				if( item2[1] != -1 ) {
					jQuery('#itemRange-'+ itemId).find('#item2e').val(item2[1])
				}
				if( item2[2] != -1 ) {
					jQuery('#itemRange-'+ itemId).find('#item2f').val(item2[2])
				}
				
				//第三行
				if( item3[0] != -1 ) {
					jQuery('#itemRange-'+ itemId).find('#item3b').val(item3[0])
				}
				if( item3[1] != -1 ) {
					jQuery('#itemRange-'+ itemId).find('#item3e').val(item3[1])
				}
				if( item3[2] != -1 ) {
					jQuery('#itemRange-'+ itemId).find('#item3f').val(item3[2])
				}
			}
		}
		
		jQuery("#itemRange-"+ itemId + " input[type='text']").blur(function() {
            var item1b = jQuery('#itemRange-'+ itemId).find('#item1b').val();
			var item1e = jQuery('#itemRange-'+ itemId).find('#item1e').val();
			var item1f = jQuery('#itemRange-'+ itemId).find('#item1f').val();
			
			var item2b = jQuery('#itemRange-'+ itemId).find('#item2b').val();
			var item2e = jQuery('#itemRange-'+ itemId).find('#item2e').val();
			var item2f = jQuery('#itemRange-'+ itemId).find('#item2f').val();
			
			var item3b = jQuery('#itemRange-'+ itemId).find('#item3b').val();
			var item3e = jQuery('#itemRange-'+ itemId).find('#item3e').val();
			var item3f = jQuery('#itemRange-'+ itemId).find('#item3f').val();
			
			var superStr = '';
			
			//1:2:20;3:5:60;6:-1:70
			if( item1b && item1f && item1b.trim() != '' && item1f.trim() != '' ) {
				if( item1e ) {} else {
					item1e = -1;
				}
				if( item2b ) {} else {
					item2b = -1;
				}
				if( item2e ) {} else {
					item2e = -1;
				}
				if( item2f ) {} else {
					item2f = -1;
				}
				if( item3b ) {} else {
					item3b = -1;
				}
				if( item3e ) {} else {
					item3e = -1;
				}
				if( item3f ) {} else {
					item3f = -1;
				}
				
				superStr =  item1b + ':' + item1e + ':' + item1f + ';' +
							item2b + ':' + item2e + ':' + item2f + ';' +
							item3b + ':' + item3e + ':' + item3f;
			}
			
			jQuery('#item-' + itemId).val(superStr);
        });
		
	}else if('preTopic' == ctrlType){//前置专场
        var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + '  type="hidden" value="' + defaultValue +'"/>');
		input.appendTo(td2);
		jQuery('#preTopicSample').removeClass("hiddenDiv").addClass("showDiv").appendTo(td2);
		
		$('#preTopicSample').click(function(){
			jQuery('#item-'+ itemId).val(jQuery('#js-select-topic-id-2').val());
		});
		
		$('#js-select-topic-2').live('change', function() {
		    var e = $(this);
		    if($.trim(e.val()) === '') {
		        $('#js-select-topic-id-2').val('');
		    };
		    $('#item-'+ itemId).val($('#js-select-topic-id-2').val());
		});
		
	} else {
		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="hidden" value="' + defaultValue +'"/>');
		input.appendTo(td2);
	}

	jQuery('<span class="tips">'+tips+'</span>').appendTo(td2);
}

function setSignContract(itemId){
	if (jQuery('#check-sign-contract-need').attr('checked')){
		var value = {};
		value['isNeedContract'] = 'Y';
		value['contractTemplateUrl'] = jQuery.trim(jQuery('#contract-template-url').val());
		value['extraContentUrl'] = jQuery.trim(jQuery('#extra-content-url').val());
		value['deliveryTimeNote'] = jQuery.trim(jQuery('#delivery-time-note').val());
		jQuery('#item-' + itemId).val(JSON.stringify(value));
	}else{
		jQuery('#item-' + itemId).val('');
	}
}

function HTMLEnCode(str){       
	var s = "";     
	if(str.length == 0) return "";      
	s = str.replace(/&/g, "&amp;");      
	s = s.replace(/</g, "&lt;");      
	s = s.replace(/>/g, "&gt;");       
	s = s.replace(/  /g, "&nbsp; ");       
	return s; 
}  

function addInquiryCategory(pageId,ctrlId,itemId,id,selectedCategory,depth){
	var sltctl = document.getElementById(selectedCategory);
	var from = document.getElementById(id);
	if(from.selectedIndex == -1)return;
	var opt = from.options[from.selectedIndex];

	//校验是否有重复
	if(isOptionExist(opt.value,itemId)) {
		alert("所选的已经存在");
		return;
	}
	
	if(sltctl.length >= 3){
		alert("一级、二级、三级类目，每个类目最多只能选择一个！");
		return;
	}
	
	var newopt = document.createElement('option');
	newopt.text = opt.text;
	newopt.value = opt.value+':'+depth;
	newopt.id = opt.id;
	sltctl.options[sltctl.options.length] = newopt; 
	
	setInquiryCategoryValue(itemId,selectedCategory);
}

function addCategory(pageId,ctrlId,itemId,id,selectedCategory){
	var sltctl = document.getElementById(selectedCategory);
	var from = document.getElementById(id);
	if(from.selectedIndex == -1)return;
	var opt = from.options[from.selectedIndex];

	//校验是否有重复
	if(isOptionExist(opt.value,itemId)) {
		alert("所选的已经存在");
		return;
	}
	
	if(sltctl.length >= 199){
		alert("数量不能超过199");
		return;
	}
	
	var newopt = document.createElement('option');
	newopt.text = opt.text;
	newopt.value = opt.value;
	newopt.id = opt.id;
	sltctl.options[sltctl.options.length] = newopt; 
	//设置值
	setProductValue(itemId,selectedCategory);
	
}

function isOptionExist(optionValue,itemId) {
	var oldPriceInfo = jQuery('#item-'+ itemId).val();
	var oldPrices = oldPriceInfo.split(";");
	var priceArray = new Array(oldPrices.length);
	for (i = 0; i < oldPrices.length; ++ i) {
				var catPrice = oldPrices[i].split(":");
				priceArray[catPrice[0]] = catPrice[1];
	}
	if(priceArray[optionValue]) {
		return true;
	}
	return false;
}

function isOptionExistForVipAuto(optionValue,itemId) {
	var info = jQuery('#item-'+ itemId).val().split(";");
	
	for (i = 0; i < info.length; ++i) {
		if( info[i] == optionValue) {
			return true;
		}
	}
	
	return false;
}


function addCategoryForVipAuto(pageId,ctrlId,itemId,id,selectedCategory){
	var sltctl = document.getElementById(selectedCategory);
	var from = document.getElementById(id);
	if(from.selectedIndex == -1)return;
	var opt = from.options[from.selectedIndex];
	
	//拼装超级值---hxt
	var superValue = '';
	
	if(id == 'postCategorySelect1') {
		var c1 = document.getElementById('postCategorySelect1');
		superValue = c1.options[c1.selectedIndex].value;
	} else if(id == 'postCategorySelect2') {
		var c1 = document.getElementById('postCategorySelect1');
		var c2 = document.getElementById('postCategorySelect2');
		superValue = c1.options[c1.selectedIndex].value + ':' + c2.options[c2.selectedIndex].value;
	} else if(id == 'postCategorySelect3') {
		var c1 = document.getElementById('postCategorySelect1');
		var c2 = document.getElementById('postCategorySelect2');
		var c3 = document.getElementById('postCategorySelect3');
		superValue = c1.options[c1.selectedIndex].value 
					+ ':' + c2.options[c2.selectedIndex].value 
					+ ':' + c3.options[c3.selectedIndex].value;
	}
	
	//校验是否有重复
	if(isOptionExistForVipAuto(superValue, itemId)) {
		alert("所选的已经存在");
		return;
	}
	
	if(sltctl.length >= 10){
		alert("数量不能超过10");
		return;
	}
	
	var newopt = document.createElement('option');
	newopt.text = opt.text;
	newopt.value = superValue;
	newopt.id = opt.id;
	sltctl.options[sltctl.options.length] = newopt;
	
	//设置值
	setProductValueForVipAuto(itemId,selectedCategory);
}


function addMarketBuPinlei(pageId,ctrlId,itemId,id,selected,type){
    var sltctl = document.getElementById(selected);
    var from = document.getElementById(id);
    if(from.selectedIndex == -1)return;
    var opt = from.options[from.selectedIndex];

    //校验是否有重复
    if(isOptionExist(opt.value,itemId)) {
        alert("所选的已经存在");
        return;
    }
    
    if(sltctl.length >= 40){
        alert("数量不能超过40");
        return;
    }
    
    var newopt = document.createElement('option');
    if(type == 'market'){
        newopt.style.color="red";
    }
    if(type == 'pinlei'){
        newopt.style.color="blue";
    }
    newopt.text = opt.text;
    newopt.value = opt.value;
    newopt.id = opt.id;
    newopt.selected=true;
    sltctl.options[sltctl.options.length] = newopt; 
    //设置值
    setMarketBuPinleiValue(itemId,selected,type);
    
}


function removeSelected(pageId,ctrlId,itemId,selectedCategory){

	var sltctl = document.getElementById(selectedCategory);
	if(sltctl.selectedIndex == -1) {
		return;
	}
	sltctl.options[sltctl.selectedIndex] = null;
	setProductValue(itemId,selectedCategory);
}

function removeInquirySelected(pageId,ctrlId,itemId,selectedCategory){

	var sltctl = document.getElementById(selectedCategory);
	if(sltctl.selectedIndex == -1) {
		return;
	}
	sltctl.options[sltctl.selectedIndex] = null;
	setInquiryCategoryValue(itemId,selectedCategory);
}

function removeSelectedForVipAuto(pageId,ctrlId,itemId,selectedCategory){

	var sltctl = document.getElementById(selectedCategory);
	if(sltctl.selectedIndex == -1) {
		return;
	}
	sltctl.options[sltctl.selectedIndex] = null;
	setProductValueForVipAuto(itemId,selectedCategory);
}

function setOfferNoteInfo(itemId){
	var offerNoteInfo = "";
	if (jQuery('#check-offer-note-need').val() != ""){
		offerNoteInfo += jQuery('#check-offer-note-need').val();
	}
	offerNoteInfo +=":";
	if (jQuery('#check-offer-note-required').val() != ""){
		offerNoteInfo += jQuery('#check-offer-note-required').val();
	}
	offerNoteInfo +=":";
	if (jQuery('#offer-note-error').val() != ""){
		if (jQuery('#offer-note-error').val().indexOf(':') > -1){
			alert('[offer备注提示消息]不能包含“:”！');
		}
		offerNoteInfo += jQuery('#offer-note-error').val();
	}
	jQuery('#item-'+ itemId).val(offerNoteInfo);
}

function setProductValueForVipAuto(itemId,selectedCategory) {
	var sltctl = document.getElementById(selectedCategory);
	if(sltctl.length == 0) {
		jQuery('#item-'+ itemId).val("");
		return;
	}
	
	var catInfo = '';
	for (i = 0; i < sltctl.length; ++i) {
		if( catInfo == '' ) {
			catInfo = sltctl.options[i].value;
		} else {
			catInfo = catInfo + ";" + sltctl.options[i].value;
		}
	}
	jQuery('#item-'+ itemId).val(catInfo);
}


//设置价格
function setProductValue(itemId,selectedCategory) {
	var selectCate=jQuery('#item-'+ itemId);
	//取出原来设置的价格
	var sltctl = document.getElementById(selectedCategory);
	if(sltctl.length == 0) {
		selectCate.val("");
		selectCate.trigger('changePriceValue');
		return;
	}
	
	var oldPriceInfo = selectCate.val();
	var oldPrices = oldPriceInfo.split(";");
	var priceArray = new Array(oldPrices.length);
	for (i = 0; i < oldPrices.length; ++ i) {
				var catPrice = oldPrices[i].split(":");
				priceArray[catPrice[0]] = catPrice[1];
	}
	var catPricInfo = '';
	for (i = 0; i < sltctl.length - 1; ++ i) {
			if(priceArray[sltctl.options[i].value]) {
				catPricInfo += sltctl.options[i].value + ':' + priceArray[sltctl.options[i].value] + ';';
			} else {
				catPricInfo += sltctl.options[i].value + ':-1;'
			}		
	}
	if(priceArray[sltctl.options[sltctl.length - 1].value]) {
		catPricInfo += sltctl.options[sltctl.length - 1].value + ':' + priceArray[ sltctl.options[sltctl.length - 1].value];
	} else {
		catPricInfo += sltctl.options[sltctl.length - 1].value + ':-1';
	}
	
	selectCate.val(catPricInfo);
	selectCate.trigger('changePriceValue');

}

function setInquiryCategoryValue(itemId,selectedCategory){
	var sltctl = document.getElementById(selectedCategory);
	if(sltctl.length == 0) {
		jQuery('#item-'+ itemId).val("");
		return;
	}
	var catInfo = '';
	for (i = 0; i < sltctl.length; ++i) {
		if( catInfo == '' ) {
			catInfo = sltctl.options[i].value;
		} else {
			catInfo = catInfo + ";" + sltctl.options[i].value;
		}
	}
	jQuery('#item-'+ itemId).val(catInfo);
}

//设置价格
function setPrice(itemId) { 
	var sltctl = document.getElementById("selectedCategory");
	var categorieIds = "";
	if(sltctl.length <= 0) {
		messageBox('类目设置错误','请先选择类目');
		return;
	}
	for (i = 0; i < sltctl.length - 1; ++ i) {
		categorieIds += sltctl.options[i].value + ',';
	}
	categorieIds += sltctl.options[sltctl.length - 1].value;
	
	var url = T.domain + "/enroll/filter_category.htm?_input_charset=utf-8&categories="+ categorieIds + "&timed="+new Date();
	jQuery.getJSON(url,function(data) {
		if(data.success == 'true') {
			jQuery('#selectedCategory').empty();
			jQuery(data.data).each(function(index,content) {
				//IE不兼容
				jQuery('<option value="'+  content[0] + '">' + content[1] + '</option>').appendTo(jQuery('#selectedCategory'));
			});
			
			//显示设置价格对话框
			jQuery('#setPriceDialog').empty();
			jQuery('<div class="header">设置价格</div>').appendTo(jQuery('#setPriceDialog'));
			var table = jQuery('<table width="100%" border="0"  cellspacing="1"></table>');
			table.appendTo(jQuery('#setPriceDialog'));
			var tr =jQuery('<tr></tr>');
			jQuery('<td width="98" height="19" class="backcolor"><div align=center><strong>序号</strong></div></td>').appendTo(tr);
			jQuery('<td width="200" class="backcolor"><div align=center><strong>类目名称</strong></div></td>').appendTo(tr);
			if($('#insId').val()==='105'){
				jQuery('<td width="200" class="backcolor"><div align="center"><strong>最小价格(单位为分)</strong> </div></td>').appendTo(tr);
			}else{
				jQuery('<td width="200" class="backcolor"><div align="center"><strong>价格(单位为分)</strong> </div></td>').appendTo(tr);
			}
			tr.appendTo(table);
			
			sltctl = document.getElementById("selectedCategory");
			
			//取出原来设置的价格
			var oldPriceInfo = jQuery('#item-'+ itemId).val();
			var oldPrices = oldPriceInfo.split(";");
			var priceArray = new Array(oldPrices.length);
			for (i = 0; i < oldPrices.length; ++ i) {
				var catPrice = oldPrices[i].split(":");
				if( '-1' == catPrice[1]) {
					priceArray[catPrice[0]] = '';
				} else {
					priceArray[catPrice[0]] = catPrice[1];
				}
			}
			
			for (i = 0; i < sltctl.length; ++ i) {
				categorieIds += sltctl.options[i].value + ',';
				var tr2 =jQuery('<tr align="left" bgcolor="#FFFFFF" class="font11"></tr>');
				jQuery('<td bgcolor="#FFFFFF" class="font12" >' + (i + 1) + '</td>').appendTo(tr2);
				var td2 = jQuery('<td bgcolor="#FFFFFF" class="font12" ><span> ' + sltctl.options[i].text + ' </span></td>');
				jQuery('<input id="'+ sltctl.options[i].value +'" name="'+ sltctl.options[i].value + '" type="hidden"/>').appendTo(td2);
				var td3 = jQuery('<td bgcolor="#FFFFFF" class="font12"></td>');
				if(priceArray[sltctl.options[i].value]) {
					jQuery('<input id="price-'+ sltctl.options[i].value +'" name="price-'+ sltctl.options[i].value + '" type="text" value="' + priceArray[sltctl.options[i].value] + '" />').appendTo(td3);
				} else {
					jQuery('<input id="price-'+ sltctl.options[i].value +'" name="price-'+ sltctl.options[i].value + '" type="text"/>').appendTo(td3);
				}
				td2.appendTo(tr2);
				td3.appendTo(tr2);
				tr2.appendTo(table);
			}
			//创建提交按钮
			var opTable = jQuery('<table width="100%" border="0" cellspacing="1" style="text-align:center;"></table>');
 			opTable.appendTo(jQuery('#setPriceDialog'));
 
 			var opRow=jQuery('<tr></tr>');
 			opRow.appendTo(opTable);
 			jQuery('<td height="24" align="right"></td>').appendTo(opRow);
 			var opTd=jQuery('<td></td>');
 			jQuery('<input class="btn-basic btn-blue" style="margin-right:5px;" type="button" id="bt-save-price" value="保存">').appendTo(opTd);
 			jQuery('<input class="btn-basic btn-gray" type="button" id="bt-close-price" value="取消">').appendTo(opTd);
 			opTd.appendTo(opRow);
			
			jQuery('<div><span style="margin-left:20px;margin-top:15px;">注意：样品专场请填写最小价格，其他普通专场请填写最大价格</span></div>').appendTo(jQuery('#setPriceDialog'));
			
			jQuery.use('ui-dialog', function(){
				jQuery('#setPriceDialog').dialog( {
					modalCss: {
						backgroundColor: '#FFF'
					},
					draggable: {
						handle: 'div.header'
					},
					shim : true,
					center : true,
					fadeIn: 500,
					fadeOut: 500,
					fixed:	true

				});
			});
				
			jQuery('#bt-save-price').click(function() {
				sltctl = document.getElementById("selectedCategory");
				var catPricInfo = '';
				for (i = 0; i < sltctl.length - 1; ++ i) {
					catPricInfo += sltctl.options[i].value + ':';
					if(jQuery('#price-' + sltctl.options[i].value).val() == '') {
						catPricInfo += '-1;'
					} else {
						if(isNotNumber(jQuery('#price-' + sltctl.options[i].value).val())) {
							alert(sltctl.options[i].text + '不是正整数');
							return;
						} else {
							catPricInfo += jQuery('#price-' + sltctl.options[i].value).val() + ';';
						}
					}
				}
				
				catPricInfo += sltctl.options[sltctl.length - 1].value + ':';
				if(jQuery('#price-' + sltctl.options[sltctl.length - 1].value).val() == '') {
						catPricInfo += '-1'
				} else {
					if(isNotNumber(jQuery('#price-' + sltctl.options[sltctl.length - 1].value).val())) {
						alert(sltctl.options[sltctl.length - 1].text + '不是正整数');
						return;
					} else {
						catPricInfo += jQuery('#price-' + sltctl.options[sltctl.length - 1].value).val();
					}
				}
				
				jQuery('#item-'+ itemId).val(catPricInfo);
				jQuery(this).closest('#setPriceDialog').dialog('close');
			});
			
			jQuery('#bt-close-price').click(function() {
					jQuery(this).closest('#setPriceDialog').dialog('close');
			});
		}
	});
}

function setMarketBuPinleiValue(itemId,selectedCategory,type) {
    //取出原来设置的
    var sltctl = document.getElementById(selectedCategory);
    if(sltctl.length == 0) {
        jQuery('#item-'+ itemId).val("");
        return;
    }
    
    var oldInfo = jQuery('#item-'+ itemId).val();
    var oldInfos = oldInfo.split(";");
    var valueArray = new Array(oldInfos.length);
    for (i = 0; i < oldInfos.length; ++ i) {
        var idType = oldInfos[i].split(":");
        valueArray[idType[0]] = idType[1];
    }
    var newInfo = '';
    for (i = 0; i < sltctl.length - 1; ++ i) {
            if(valueArray[sltctl.options[i].value]) {
                newInfo += sltctl.options[i].value + ':' + valueArray[sltctl.options[i].value] + ';';
            } else {
                newInfo += sltctl.options[i].value + ':'+type+';'
            }       
    }
    if(valueArray[sltctl.options[sltctl.length - 1].value]) {
        newInfo += sltctl.options[sltctl.length - 1].value + ':' + valueArray[ sltctl.options[sltctl.length - 1].value];
    } else {
        newInfo += sltctl.options[sltctl.length - 1].value + ':'+type+'';
    }
    jQuery('#item-'+ itemId).val(newInfo);

}
function isNotNumber(value) {
	var reg =eval('/^(0|[1-9][0-9]*)$/');
	if (reg.test(value)) {
		return false;
	}
	return true;
}
function messageBox(headerMsg, msg) {
	jQuery('#alert-dialog-header-msg').html(headerMsg,msg);
	jQuery('#alert-dialog-msg').html(msg);
	jQuery.use('ui-dialog', function(){
		jQuery('#alert-dialog').dialog( {
			modalCss: {
				backgroundColor: '#FFF'
			},
			draggable: {
				handle: 'div.header'
			},
			shim : true,
			center : true,
			fadeIn: 200,
			fadeOut: 200,
			fixed:	true
		});
					
	});	
	jQuery('#alert-dialog-close').click(function() {
		jQuery(this).closest('#alert-dialog').dialog('close');
	 });
}
function openErrDiv(str){
	var table = jQuery('<table ></table>');
	jQuery('#errTxt').html('');
	table.appendTo(jQuery('#errTxt'));
	if(str.split("|").length>0){
	for(var i=0;i<str.split("|").length;i++){
		var row = jQuery('<tr><td>'+str.split("|")[i]+'</td></tr>');
		row.appendTo(table);
	}
	}
	jQuery.use('ui-core,ui-draggable,ui-dialog', function(){
		var  dialog2 = jQuery('div.uidialog', '#dialogDiv');
		dialog2.dialog({
			center: true,
			modal: true,
			shim: true
		});
		jQuery('#btnclose').click(function(){
			jQuery(this).closest('div.uidialog').dialog('close');
		});
	});
}
//开放给报名表单iframe调用
T.closeSurveyFrame=function(){
	jQuery('#js-surveyframe .close').click();
	//location.reload(true);
}
})(jQuery, FE.tools);


