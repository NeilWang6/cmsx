String.prototype.replaceAll  = function(s1,s2){
	return this.replace(new RegExp(s1,"gm"),s2);
}

var enrollConfig;
/**创建表单*/
function createForm(page) {
    //遍历每个页面
	jQuery(enrollConfig).find(page).each(function(){
	     var pageId = jQuery(this).attr('id');
	  	 var divId = '#' + jQuery(this).attr('id');
		 var isConfigBlank = true;
	 	//遍历块
	 	jQuery(this).find('fieldset').each(function(){
    	    var fieldsetLabel = jQuery(this).attr('label');
    		var fieldsetLayout = jQuery(this).attr('layout');
    		var table = jQuery('<table width="100%" border="0"  cellspacing="1"></table>');
    		table.appendTo(jQuery(divId));
			var tr =jQuery('<tr></tr>');
			jQuery('<td class="f10" colspan="6"><strong>'+fieldsetLabel +'</strong></td>').appendTo(tr);
			tr.appendTo(table);
    		//遍历控件
    		jQuery(this).find('control').each(function(){
				isConfigBlank = false;
    			createControl(pageId,jQuery(this),table);
			});
		});
		
	//创建提交按钮
	var opTable = jQuery('<table width="100%" border="0" cellspacing="1"></table>');
		opTable.appendTo(jQuery(divId));

		var opRow=jQuery('<tr></tr>');
		opRow.appendTo(opTable);
		jQuery('<td height="24" align="right"></td>').appendTo(opRow);
		var opTd=jQuery('<td></td>');
		opTd.appendTo(opRow);

		if(isConfigBlank) {
			jQuery('<span>未配置相关信息</span>').appendTo(opTd);
		} else {
			jQuery('<input style="width:100px;height:50px;font-weight:bold;" type="button" id="bt-save-' + pageId +'" value="保&nbsp;存">').appendTo(opTd);
			jQuery('#bt-save-' + pageId).live("click",
			function() {
				if(validForm(pageId)) {
					submitForm(pageId);
				}
			});
		}
	});
}


/**创建控件*/
function createControl(pageId,control,table) {
	var ctrlType = control.attr('ctrlType');
	var ctrlName = control.attr('name');
	var ctrlId = control.attr('id');
	var itemId =  pageId + '-' +  ctrlId;
	var itemType = control.attr('itemType');
	var attribute = control.attr('attribute');
	var ctrlSourceType = control.attr('ctrlSourceType');
	var defaultValue = '';
	if(control.attr('defaultValue')) {
		defaultValue = control.attr('defaultValue');
	}
	var ctrlType = control.attr('ctrlType');
	var format = control.attr('format');
	var isNeed = control.attr('isNeed');
	var tips = control.attr('tips');
	var value = control.attr('value');
	if('text' == ctrlType) {
		var row=jQuery('<tr></tr>');
		row.appendTo(table);
		var td1=jQuery('<td width="15%" height="24" align="right" class="backcolor"></td>');
		td1.append(ctrlName);
		var td2=jQuery('<td class="backcolor1"></td>');
		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="text" value="'+defaultValue+'"/>');
		input.appendTo(td2);
		if('Y' == isNeed) {
			jQuery('<strong class="high"><font color="#FF0000">*</font></strong>').appendTo(td2);
		}
		jQuery('<font>'+tips+'</font>').appendTo(td2);
		row.append(td1);
		row.append(td2);
	} else if('shorttext' == ctrlType) {
		var row=jQuery('<tr></tr>');
		row.appendTo(table);
		var td1=jQuery('<td width="15%" height="24" align="right" class="backcolor"></td>');
		td1.append(ctrlName);
		var td2=jQuery('<td class="backcolor1"></td>');
		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH:60px" type="text" value="'+defaultValue+'"/>');
		input.appendTo(td2);
		if('Y' == isNeed) {
			jQuery('<strong class="high"><font color="#FF0000">*</font></strong>').appendTo(td2);
		}
		jQuery('<font>'+tips+'</font>').appendTo(td2);
		row.append(td1);
		row.append(td2);
	} else if('longtext' == ctrlType) {
		var row=jQuery('<tr></tr>');
		row.appendTo(table);
		var td1=jQuery('<td width="15%" height="24" align="right" class="backcolor"></td>');
		td1.append(ctrlName);
		var td2=jQuery('<td class="backcolor1"></td>');
		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH:670px" type="text" value="'+defaultValue+'"/>');
		input.appendTo(td2);
		if('Y' == isNeed) {
			jQuery('<strong class="high"><font color="#FF0000">*</font></strong>').appendTo(td2);
		}
		jQuery('<font>'+tips+'</font>').appendTo(td2);
		row.append(td1);
		row.append(td2);
	} else if ('select' == ctrlType) {
		var row=jQuery('<tr></tr>');
		row.appendTo(table);
		var td1=jQuery('<td width="15%" height="24" align="right" class="backcolor"></td>');
		td1.append(ctrlName);
		var td2=jQuery('<td class="backcolor1"></td>');
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
		if('Y' == isNeed) {
			jQuery('<strong class="high"><font color="#FF0000">*</font></strong>').appendTo(td2);
		}
		jQuery('<font>'+tips+'</font>').appendTo(td2);
		row.append(td1);
		row.append(td2);
		jQuery('#select-'+ itemId).change(function () {
		   jQuery('#select-'+ itemId +' option:selected').each(function () {
			   jQuery('#item-'+ itemId).val(jQuery(this).val())
		   });
		});
    } else if ('postcategory' == ctrlType) {
        var row=jQuery('<tr></tr>');
        row.appendTo(table);
        var td1=jQuery('<td width="15%" height="24" align="right" class="backcolor"></td>');
        td1.append(ctrlName);
        var td2=jQuery('<td class="backcolor1"></td>');
        var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="hidden" value="' + defaultValue +'"/>');
        input.appendTo(td2);
        jQuery('#productCategorySample').clone(true).attr('id','productCategory-'+ itemId).removeClass("hiddenDiv").addClass("showDiv").appendTo(td2);
        jQuery('<font>'+tips+'</font>').appendTo(td2);
        row.append(td1);
        row.append(td2);
        
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
    } else if('itemRange' == ctrlType) {
		var row=jQuery('<tr></tr>');
        row.appendTo(table);
        var td1=jQuery('<td width="15%" height="24" align="right" class="backcolor"></td>');
        td1.append(ctrlName);
        var td2=jQuery('<td class="backcolor1"></td>');
        var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="hidden" value="' + defaultValue +'"/>');
        input.appendTo(td2);
		
        jQuery('#itemRangeSample').clone(true).attr('id','itemRange-'+ itemId).removeClass("hiddenDiv").addClass("showDiv").appendTo(td2);
        
		jQuery('<font>'+tips+'</font>').appendTo(td2);
        row.append(td1);
        row.append(td2);
		
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
		
	} else {
		var row=jQuery('<tr></tr>');
		row.appendTo(table);
		var td1=jQuery('<td width="15%" height="24" align="right" class="backcolor"></td>');
		td1.append(ctrlName);
		var td2=jQuery('<td></td>');
		var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' style="WIDTH: 350px" type="hidden" value="' + defaultValue +'"/>');
		input.appendTo(td2);
		jQuery('<font>'+tips+'</font>').appendTo(td2);
		row.append(td1);
		row.append(td2);
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

/**校验表单*/
function validForm(pageId) {
	var isSucced =  true;
	var errorMsg = '';
	jQuery('#' + pageId  + ' * input[item]').each(function(){
		var controlId = jQuery(this).attr('item');
		var value = jQuery(this).val();
		var isNeed = getControlAttrValue(pageId,controlId,'isNeed');
		var ctrlName = getControlAttrValue(pageId,controlId,'name');
		var format = getControlAttrValue(pageId,controlId,'format');
		var maxLen = getControlAttrValue(pageId,controlId,'maxLen');
		
		//校验
		if('' == value && 'Y' == isNeed ) {
			errorMsg += '请填写[' + ctrlName  + ']\n';
			isSucced = false;
		} 
		//检查正则表达式
		if(format && format != "" && '' != value) {
			var regStr = format.split("|||");
			if(regStr.length >= 2 ) {
    			var reg =eval(regStr[0]);
    			if (!reg.test(value)) {
					errorMsg += '[' +ctrlName + ']' + regStr[1] + '\n';
    				isSucced = false;
    			}
			}
		}
		
		//检查长度
		if(maxLen && maxLen != "") {
			var len = Number(maxLen);
			if(value.length > len) {
				errorMsg += '[' + ctrlName  + ']长度不能超过' + len +  '\n';
				isSucced = false;
			}
		}
		
		//特殊控件特殊处理
		if(controlId == 903) {
		    if( jQuery('#itemRange-topic-8-2609') ) {
				var dayede = parseInt(value) * 10;
				
				var item1f = parseInt( jQuery('#itemRange-topic-8-2609').find('#item1f').val() );
				var item2f = parseInt( jQuery('#itemRange-topic-8-2609').find('#item2f').val() );
				var item3f = parseInt( jQuery('#itemRange-topic-8-2609').find('#item3f').val() );
				
				if( item1f && (dayede < (item1f * 4)) ) {
					errorMsg += '[' + ctrlName  + ']返利模板的数字*4 <= 行业扣点比例。\n';
					isSucced = false;
				} else if( item2f && (dayede < (item2f * 4)) ) {
					errorMsg += '[' + ctrlName  + ']返利模板的数字*4 <= 行业扣点比例。\n';
					isSucced = false;
				} else if( item3f && (dayede < (item3f * 4)) ) {
					errorMsg += '[' + ctrlName  + ']返利模板的数字*4 <= 行业扣点比例。\n';
					isSucced = false;
				}
			}
		} else if(controlId == 2609) {
			if( jQuery('#itemRange-topic-8-2609') ) {
				var item1b1 = jQuery('#itemRange-topic-8-2609').find('#item1b').val();
				var item1e1 = jQuery('#itemRange-topic-8-2609').find('#item1e').val();
				var item1f1 = jQuery('#itemRange-topic-8-2609').find('#item1f').val();
				
				var item2b1 = jQuery('#itemRange-topic-8-2609').find('#item2b').val();
				var item2e1 = jQuery('#itemRange-topic-8-2609').find('#item2e').val();
				var item2f1 = jQuery('#itemRange-topic-8-2609').find('#item2f').val();
				
				var item3b1 = jQuery('#itemRange-topic-8-2609').find('#item3b').val();
				var item3e1 = jQuery('#itemRange-topic-8-2609').find('#item3e').val();
				var item3f1 = jQuery('#itemRange-topic-8-2609').find('#item3f').val();
				
				var isInt = /^\d{1,5}$/;
				if ( item1b1 && !isInt.test(item1b1) ){
					errorMsg += '[' + ctrlName  + ']必须是正整数。\n';
					isSucced = false;
				} else if( item1e1 && !isInt.test(item1e1) ) {
					errorMsg += '[' + ctrlName  + ']必须是正整数。\n';
					isSucced = false;
				} else if( item1f1 && !isInt.test(item1f1) ) {
					errorMsg += '[' + ctrlName  + ']必须是正整数。\n';
					isSucced = false;
				} else if( item2b1 && !isInt.test(item2b1) ) {
					errorMsg += '[' + ctrlName  + ']必须是正整数。\n';
					isSucced = false;
				} else if( item2e1 && !isInt.test(item2e1) ) {
					errorMsg += '[' + ctrlName  + ']必须是正整数。\n';
					isSucced = false;
				} else if( item2f1 && !isInt.test(item2f1) ) {
					errorMsg += '[' + ctrlName  + ']必须是正整数。\n';
					isSucced = false;
				} else if( item3b1 && !isInt.test(item3b1) ) {
					errorMsg += '[' + ctrlName  + ']必须是正整数。\n';
					isSucced = false;
				} else if( item3e1 && !isInt.test(item3e1) ) {
					errorMsg += '[' + ctrlName  + ']必须是正整数。\n';
					isSucced = false;
				} else if( item3f1 && !isInt.test(item3f1) ) {
					errorMsg += '[' + ctrlName  + ']必须是正整数。\n';
					isSucced = false;
				}
				
				var item1b = parseInt( jQuery('#itemRange-topic-8-2609').find('#item1b').val() );
				var item1e = parseInt( jQuery('#itemRange-topic-8-2609').find('#item1e').val() );
				var item1f = parseInt( jQuery('#itemRange-topic-8-2609').find('#item1f').val() );
				
				var item2b = parseInt( jQuery('#itemRange-topic-8-2609').find('#item2b').val() );
				var item2e = parseInt( jQuery('#itemRange-topic-8-2609').find('#item2e').val() );
				var item2f = parseInt( jQuery('#itemRange-topic-8-2609').find('#item2f').val() );
				
				var item3b = parseInt( jQuery('#itemRange-topic-8-2609').find('#item3b').val() );
				var item3e = parseInt( jQuery('#itemRange-topic-8-2609').find('#item3e').val() );
				var item3f = parseInt( jQuery('#itemRange-topic-8-2609').find('#item3f').val() );
			
				if( item1e && item2b && (item1e != item2b - 1) ) {
					errorMsg += '[' + ctrlName  + ']区间必须连续。\n';
					isSucced = false;
				} else if( item2e && item3b && (item2e != item3b - 1) ) {
					errorMsg += '[' + ctrlName  + ']区间必须连续。\n';
					isSucced = false;
				} else if( item2b && !item1e ) {
					errorMsg += '[' + ctrlName  + ']区间必须连续!\n';
					isSucced = false;
				} else if( item3b && !item2e ) {
					errorMsg += '[' + ctrlName  + ']区间必须连续!\n';
					isSucced = false;
				}
				
				if( item2b && !item2f ) {
					errorMsg += '[' + ctrlName  + ']填写不合法。\n';
					isSucced = false;
				} else if( item3b && !item3f ) {
					errorMsg += '[' + ctrlName  + ']填写不合法。\n';
					isSucced = false;
				}
				
				if( !item2b && item1e ) {
					errorMsg += '[' + ctrlName  + ']最后一级区间不应当设置上限!\n';
					isSucced = false;
				} else if( !item3b && item2e ) {
					errorMsg += '[' + ctrlName  + ']最后一级区间不应当设置上限!\n';
					isSucced = false;
				} else if( item3e ) {
					errorMsg += '[' + ctrlName  + ']最后一级区间不应当设置上限!\n';
					isSucced = false;
				}
				
				//行业报名的最小库存 > 返利模板最后一个区间的最小值
				var minQuantity = parseInt( jQuery('#item-topic-8-2608').val() );
				var lastLeft = 1;
				
				if( !item1e ) {
					lastLeft = item1b;
				} else if( !item2e ) {
					lastLeft = item2b;
				} else if( !item3e ) {
					lastLeft = item3b;
				}
				
				if( lastLeft >= minQuantity ) {
					errorMsg += '[行业报名最小库存]行业最小库存必须 > 返利模板最后一个区间的最小值!\n';
					isSucced = false;
				}
			}
		}
		
    	//设置值
		if(isSucced) {
    		setControlValue(pageId,controlId,value);
		}
 	});
	
	if(!isSucced) {
		alert(errorMsg);
		return isSucced;
	}
	
	//设置选中的专场值
	var value = jQuery('#selectSeriesId').val();
	if('' == value) {
		alert('请先选择专场!');
		return false;
	}
	var seriesTopic = value.split('|');
	jQuery(enrollConfig).find('page[id=' + pageId +']:first').attr('seriesId',seriesTopic[1]);
	jQuery(enrollConfig).find('page[id=' + pageId +']:first').attr('selected','true');
	return true;
}

function getXml() {
	//处理浏览器兼容问题
	if(jQuery.browser.msie) {
		return enrollConfig.xml;
	} else {
		return (new XMLSerializer()).serializeToString(enrollConfig);
	}
}

function setControlValue(pageId,controlId,value) {
	jQuery(enrollConfig).find('page[id=' + pageId +']:first * control[id='+controlId+']:first').attr('value',value);
}
function getControlValue(pageId,controlId) {
	return jQuery(enrollConfig).find('page[id=' + pageId +']:first * control[id='+ controlId +']:first').attr('value');
}
function getControlAttrValue(pageId,controlId,attr) {
	return jQuery(enrollConfig).find('page[id=' + pageId +']:first * control[id='+ controlId +']:first').attr(attr);
}
function setControlAttrValue(pageId,controlId,attr,value) {
	jQuery(enrollConfig).find('page[id=' + pageId +']:first * control[id='+controlId+']:first').attr(attr,value);
}

function loadSeries(configUrl) {
        var jqXHR = jQuery.ajax(configUrl, {
        type: "GET",
        async: true,
        contentType: 'application/x-www-form-urlencoded',
        cache: false,
        data: {},
        dataType: 'xml',
        success: function(data, textStatus, jqXHR){
            enrollConfig = data;
            var value = jQuery('#selectSeriesId').val();
            var seriesTopic = value.split('|');
             if(seriesTopic.length==2){
                 seriesTopic='#'+seriesTopic[0];
             }else{
                 return;
             }
            createForm(seriesTopic);
            
            var initPageId = jQuery(enrollConfig).find('page[selected=true]:first').attr('id');
            if(initPageId) {
                jQuery('#' + initPageId).removeClass("hiddenDiv").addClass("showDiv");
            }
             jQuery(seriesTopic).removeClass("hiddenDiv").addClass("showDiv");
        }
    });
	
}

function addCategory(pageId,ctrlId,itemId,id,selectedCategory){
	var sltctl = document.getElementById(selectedCategory);
	var from = document.getElementById(id);
	if(from.selectedIndex == -1)return;
	var opt = from.options[from.selectedIndex];
	
	//拼装超级值---hxt
	var superValue = '';
	
	if(id == 'categorySelect1') {
		var c1 = document.getElementById('categorySelect1');
		superValue = c1.options[c1.selectedIndex].value;
	} else if(id == 'categorySelect2') {
		var c1 = document.getElementById('categorySelect1');
		var c2 = document.getElementById('categorySelect2');
		superValue = c1.options[c1.selectedIndex].value + ':' + c2.options[c2.selectedIndex].value;
	} else if(id == 'categorySelect3') {
		var c1 = document.getElementById('categorySelect1');
		var c2 = document.getElementById('categorySelect2');
		var c3 = document.getElementById('categorySelect3');
		superValue = c1.options[c1.selectedIndex].value 
					+ ':' + c2.options[c2.selectedIndex].value 
					+ ':' + c3.options[c3.selectedIndex].value;
	}
	
	//校验是否有重复
	if(isOptionExist(superValue, itemId)) {
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
	setProductValue(itemId,selectedCategory);
}

function removeSelected(pageId,ctrlId,itemId,selectedCategory){
	var sltctl = document.getElementById(selectedCategory);
	if(sltctl.selectedIndex == -1) {
		return;
	}
	sltctl.options[sltctl.selectedIndex] = null;
	setProductValue(itemId,selectedCategory);
}

function isOptionExist(optionValue,itemId) {
	var info = jQuery('#item-'+ itemId).val().split(";");
	
	for (i = 0; i < info.length; ++i) {
		if( info[i] == optionValue) {
			return true;
		}
	}
	
	return false;
}

function setProductValue(itemId,selectedCategory) {
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
