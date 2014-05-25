/**
 * @author: huangxt
 * @Date: 2012-09-11
 */

;(function($, T) {

    var enrollConfig;
	
	var insId = jQuery('#seriesId').val();
	
	if(insId) {
		var configUrl = T.domain + '/enroll/enroll_config.htm?type=series&id=' + insId;
	} else {
		var configUrl = T.domain + '/enroll/enroll_config.htm?type=series';
		
	}
	
	var jqXHR = jQuery.ajax(configUrl, {
	    type: "GET",
	    async: true,
	    contentType: 'application/x-www-form-urlencoded',
		cache: false,
	    data: {},
	    dataType: 'xml',
		success: function(data, textStatus, jqXHR){
	    	enrollConfig = data;
			createForm();
			var initPageId = jQuery(enrollConfig).find('page[selected=true]:first').attr('id');
			if(initPageId) {
				jQuery('#' + initPageId).removeClass("hiddenDiv").addClass("showDiv");
			}
	    }
	});
	
	
	/** ����XML��̬��Ⱦ����ҳ�� */
	function createForm() {
	    //����ÿ��ҳ��
		jQuery(enrollConfig).find('page').each(function(){
		    
			var pageId = jQuery(this).attr('id');		   
		  	var divId = '#' + jQuery(this).attr('id');
	
			var isConfigBlank = true;
			
			//������table����Ⱦ���м
			var table = jQuery('<table class="data-table"></table>');
			table.appendTo(jQuery(divId));
			
			var tr =jQuery('<tr></tr>');
			jQuery('<td class="data-table-title-width"></td>').appendTo(tr);
			jQuery('<td class="data-table-bread"><div class="crumbs-unorder-div">' + jQuery('#hide-crumbs-unorder-div').html() + '</div></td>').appendTo(tr);
			tr.appendTo(table);
			
			
		 	//����ÿ��fieldset��ÿ�����
		 	jQuery(this).find('fieldset').each(function(){
		 		
		 		//��Ⱦϵ������
				var row=jQuery('<tr></tr>');
				row.appendTo(table);
				var td1=jQuery('<td class="data-table-title"></td>');
				td1.append('ϵ������'+"��");
				row.append(td1);	
				var name = jQuery('#' + pageId).data('name');
				var td2=jQuery('<td class="data-table-input">'+name+'</td>');
				row.append(td2);
				//����fieldset��ÿ��control
	    		jQuery(this).find('control').each(function(){
					isConfigBlank = false;
	    			createControl(pageId,jQuery(this),table);
				});
			});
			
		 	var defaultSeriesValue = $('#item-series-1-410').val();
		 	
			//�����ύ��ť
			var opRow=jQuery('<tr></tr>');
	        opRow.appendTo(table);
			jQuery('<td></td>').appendTo(opRow);
			
			var opTd=jQuery('<td></td>');
			opTd.appendTo(opRow);
		
			if(isConfigBlank) {
			 	jQuery('<span>δ���������Ϣ</span>').appendTo(opTd);
			} else {
				 jQuery('<button type="button" id="bt-back"  class="btn-basic btn-blue bt-add">��&nbsp;��</button>').appendTo(opTd);
				 if("series-1"==pageId){
					if(insId) {
						jQuery('<button type="button" id="bt-save-' + pageId +'" class="btn-basic btn-blue ">��&nbsp;��</button>').appendTo(opTd);
					}else{
						jQuery('<button type="button" id="bt-save-' + pageId +'" class="btn-basic btn-blue common-topic">��һ��</button>').appendTo(opTd);
					}
				 }else{
					jQuery('<button type="button" id="bt-save-' + pageId +'" class="btn-basic btn-blue ">��&nbsp;��</button>').appendTo(opTd);
				 }
    	    	 jQuery('#bt-save-' + pageId).live("click",
	                function() {
	    				if(validForm(pageId,defaultSeriesValue)) {
	    					submitForm(pageId);
	    				}
	              });
			}			
			/**���ز���*/
         	jQuery('#bt-back').live("click",function(){
         		location.href = T.domain + "/enroll/v2012/series.htm";
			});
		});
	}
			       
	
	/**�����ؼ�*/
	function createControl(pageId,control,table) {
	 	var ctrlType = control.attr('ctrlType');
		var ctrlName = control.attr('name');
		var ctrlId = control.attr('id');
		var itemId =  pageId + '-' +  ctrlId;
		var itemType = control.attr('itemType');
		var attribute = control.attr('attribute');
		var ctrlSourceType = control.attr('ctrlSourceType');
		var ctrlType = control.attr('ctrlType');
		var format = control.attr('format');
		var isNeed = control.attr('isNeed');
		var defaultValue = '';
		if(control.attr('defaultValue')) {
			defaultValue = control.attr('defaultValue');
		}		
				
		//��Ⱦר������
		if('text' == ctrlType) {
	        var row=jQuery('<tr></tr>');
			row.appendTo(table);
			
	        var td1=jQuery('<td class="data-table-title"></td>');
	         
			if('Y' == isNeed) {
				td1.append('<strong><font color="red">*</font></strong>' + ctrlName + "��");
			} else {
				td1.append(ctrlName + "��");
			}
			row.append(td1);
			
	        var td2=jQuery('<td class="data-table-input"></td>');
			jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' placeholder="������' + ctrlName + '" type="text" value="'+defaultValue+'"/>').appendTo(td2);
			jQuery('<div id="errmsg-' + itemId + '" class="errmsg"></div>').appendTo(td2);
	        row.append(td2);
		} else if ('richtextarea' == ctrlType) {
			var row=jQuery('<tr></tr>');
	        row.appendTo(table);
	       
			//��Ⱦ��һ��
	        var td1=jQuery('<td class="data-table-title"></td>');	        
	        if('Y' == isNeed) {	        
				td1.append('<strong><font color="red">*</font></strong>' + ctrlName + "��");
			} else {
				td1.append(ctrlName + "��");
			}
			row.append(td1);
			
	        var td2=jQuery('<td class="data-table-input"></td>');
			jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + ' type="hidden" value="'+ defaultValue + '"/>').appendTo(td2);
			
			//��Ⱦ�ڶ���---�Ӽ��Ÿ��ı���
			var begin = '<div class="form-vertical" id="area-' + itemId + '">';
			var end = '</div>';
			if(defaultValue) {
				var content = '';
				
				var lines = defaultValue.split(' ');
				for( var i=0; i<lines.length; i++ ) {
					var j = i + 1;
					
					if(lines[i].trim() != "") {
						content += '<dl class="item-form item-operate"><dd>' +
									'<input type="text" value="' + lines[i] + '" class="blockName" name="blockName' + j + '-' + itemId + '">' +
									'<a href="#" class="icon-admm icon-add" itemId="' + itemId + '">����</a>' +
									'<a href="#" class="icon-admm icon-delete" itemId="' + itemId + '">ɾ��</a></dd></dl>';
					}
				}
			} else {
				var content = 	'<dl class="item-form item-operate"><dd>' +
								'<input type="text" value="" placeholder="������' + ctrlName + '" class="blockName" name="blockName1-' + itemId + '">' +
								'<a href="#" class="icon-admm icon-add" itemId="' + itemId + '">����</a>' +
								'<a href="#" class="icon-admm icon-delete" itemId="' + itemId + '">ɾ��</a></dd></dl>';
			}
			
			jQuery(begin + content + end).appendTo(td2);
			jQuery('<div id="errmsg-' + itemId + '" class="errmsg"></div>').appendTo(td2);
	        row.append(td2);
			
			//��ֵ����ȥ
			jQuery('#area-' + itemId).on("blur", "input.blockName", function() {
				var arrValues = new Array('');
	        	
		        jQuery('#area-' + itemId + ' dl').each(function(i, el){
		            el = jQuery(el);
		            var name = jQuery('input.blockName', el).val();
					if(name != ""){
		            	arrValues.push(name);
					}
		        });
		        
		        jQuery('#item-' + itemId).val( arrValues.join(' ') );
	      	});
	      	
	      	//�����鰴ť
			jQuery('#area-' + itemId).on("click", "a.icon-add", function(){
				var itemId = jQuery(this).attr("itemId");
				var radio_id = jQuery(this).parents('dl').siblings().length + 1 + 1;
				var add_li_html = '<dl class="item-form item-operate"><dd>' +
									'<input type="text" value="" placeholder="������' + ctrlName + '" class="blockName" name="blockName1-' + itemId + '">' +
									'<a href="#" class="icon-admm icon-add" itemId="' + itemId + '">����</a>' +
									'<a href="#" class="icon-admm icon-delete" itemId="' + itemId + '">ɾ��</a></dd></dl>';
				var cur_li = jQuery(this).parents('dl');
				cur_li.after(add_li_html)
			});
		
			//ɾ���鰴ť
			jQuery('#area-' + itemId).on("click", "a.icon-delete", function(){
				var radio_id = jQuery(this).parents('dl').siblings().length + 1;
				if(radio_id > 1) {
					if( confirm('ȷ��Ҫɾ����') == true ) {
					  var cur_li = jQuery(this).parents('dl');
					  cur_li.remove()
					}
				} else {
					alert('���һ���޷�ɾ����');
					return;
				}
				
				//����hidden���ֵ
				var arrValues = new Array('');
	        	
		        jQuery('#area-' + itemId + ' dl').each(function(i, el){
		            el = jQuery(el);
		            var name = jQuery('input.blockName', el).val();
					if(name != ""){
		            	arrValues.push(name);
					}
		        });
		        
		        jQuery('#item-' + itemId).val( arrValues.join(' ') );
			});
		}else if('mutipleTextOne' == ctrlType){//��Ʒƣ�Ͷȿ���
			var row=jQuery('<tr></tr>');
			row.appendTo(table);
			
	        var td1=jQuery('<td class="data-table-title"></td>');
	         
			if('Y' == isNeed) {
				td1.append('<strong><font color="red">*</font></strong>' + ctrlName + "��");
			} else {
				td1.append(ctrlName + "��");
			}
			row.append(td1);
			
	        var td2=jQuery('<td class="data-table-input"></td>');
	        var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + '  type="hidden" value="' + defaultValue +'"/>');
			input.appendTo(td2);
			fillText($('#offerFatigueSample'),$('#ofTextOne'),'��ϵ���£�ͬһ����Ʒ��',$('#ofTextTwo'),'���ڲ����ظ�����');
			jQuery('#offerFatigueSample').removeClass("hiddenDiv").addClass("showDiv").appendTo(td2);
			jQuery('<div id="errmsg-' + itemId + '" class="errmsg"></div>').appendTo(td2);
			row.append(td2);
			 
			var dateInput = jQuery('#offerFatigueControl');
			if (defaultValue && '' != defaultValue){
				if(!isNotNumber(defaultValue)){
					dateInput.val(defaultValue);
				}
			}
			
			dateInput.blur(function() {
				jQuery('#item-' + itemId).val(dateInput.val());
			});
			
		}else if('mutipleTextTwo' == ctrlType){//�û�ƣ�Ͷȿ���
			var row=jQuery('<tr></tr>');
			row.appendTo(table);
			
	        var td1=jQuery('<td class="data-table-title"></td>');
	         
			if('Y' == isNeed) {
				td1.append('<strong><font color="red">*</font></strong>' + ctrlName + "��");
			} else {
				td1.append(ctrlName + "��");
			}
			row.append(td1);
			
	        var td2=jQuery('<td class="data-table-input"></td>');
			var input = jQuery('<input id="item-'+ itemId +'" name="item-'+ itemId +'" item=' + ctrlId + '  type="hidden" value="' + defaultValue +'"/>');
			input.appendTo(td2);
			fillText($('#memberFatigueSample'),$('#mfTextOne'),'��ϵ���£�ÿ���û���',$('#mfTextTwo'),'����ֻ������',$('#mfTextThree'),'��offer');
			jQuery('#memberFatigueSample').removeClass("hiddenDiv").addClass("showDiv").appendTo(td2);
			jQuery('<div id="errmsg-' + itemId + '" class="errmsg"></div>').appendTo(td2);
			row.append(td2);
			
			var itemVal = jQuery('#item-' + itemId);
			var dateInput = jQuery('#memberFatigueControl-day');
			var numInput = jQuery('#memberFatigueControl-num');
			var enrollDate='', enrollNum='';
			
			if (defaultValue && '' != defaultValue){
				enrollDate = defaultValue.split(',')[0];
				enrollNum = defaultValue.split(',')[1];
				if(!isNotNumber(enrollDate)){
					dateInput.val(enrollDate);
					numInput.val(enrollNum);
				}
			}
			
			dateInput.blur(function() {
				enrollDate = dateInput.val();
				if(enrollDate == '' && enrollNum == ''){
					itemVal.val('');
				}else{
					itemVal.val(enrollDate + "," + enrollNum);
				}
			});
			
			numInput.blur(function() {
				enrollNum = numInput.val();
				if(enrollDate == '' && enrollNum == ''){
					itemVal.val('');
				}else{
					itemVal.val(enrollDate + "," + enrollNum);
				}
			});
			
			
		}
	}
	
	
	/**У���*/
	function validForm(pageId, oldName) {
		var isSucced =  true;
		
		jQuery('#' + pageId  + ' * input[item]').each(function() {
			var controlId = jQuery(this).attr('item');
			var value = jQuery(this).val();
			var isNeed = getControlAttrValue(pageId,controlId,'isNeed');
			var ctrlName = getControlAttrValue(pageId,controlId,'name');
			var format = getControlAttrValue(pageId,controlId,'format');
			var maxLen = getControlAttrValue(pageId,controlId,'maxLen');
			
			var itemId = 'item-' + pageId + '-' + controlId;
			var errorMsg = '';
			
			//����մ�����Ϣ
			jQuery('#errmsg-' + pageId + '-' + controlId).html(errorMsg);
			
			//����У��
			if('' == value && 'Y' == isNeed ) {
				errorMsg += '�����Բ���Ϊ�� ';
				isSucced = false;
			} 
			
			//������ʽУ��
			if(format && format != "" && '' != value) {
				var regStr = format.split("|||");
				if(regStr.length >= 2 ) {
	    			var reg =eval(regStr[0]);
	    			if (!reg.test(value)) {
						errorMsg += regStr[1] + ' ';
	    				isSucced = false;
	    			}
				}
			}
			
			//����У��
			if(maxLen && maxLen != "") {
				var len = Number(maxLen);
				if(value.length > len) {
					errorMsg += '���Ȳ��ܳ���' + len +  ' ';
					isSucced = false;
				}
			}
			
			//ϵ�������Ƿ��ظ�У�飨�½�ʱ�����У�飬�޸�ʱ���������б仯��У�飩
			if(controlId == 410){
				var newName=$('#item-series-1-410').val();
				if(newName!='' && (oldName=='' || oldName!=newName)){
					//isExistSeriesName(newName,errorMsg,isSucced)
					$.ajax({
						url : T.domain + '/enroll/v2012/topic_series.json' + '?_input_charset=UTF-8',
						type: "POST",
						data : {'type' : '1', 'seriesName': newName},
						async: false,
						success: function(data){
							if(data.isSuccess == true && jQuery.isPlainObject(data.data)) {//����ж�data.dataû�����ݣ���һ���յ�Object{}
								//��ֻ����ͨר��,ѭ����̨���صĴ�map-ϵ������ΪKey
								for(var key=1; key<=10; key++){
								//for(var key in data.data){
									if(data.data[key]!=undefined){
										var seriesList=data.data[key].list;//data.data��һ��map��1Ϊkey����ʾ��ͨר������, list��ŵ�Ҳ��map(key-ϵ��id��v-ϵ������)
										if(seriesList && seriesList.length>0){
											for(var k=0;k<seriesList.length;k++){
											//for(var k in seriesList){ 
												var seriesMap=seriesList[k];
												if(newName==seriesMap['name']){//list�е�map��������K-V(id��name)
													errorMsg += ctrlName+'����ͬ��';
													isSucced = false;
													return;
												}
											}
										}
									}
								}
							}
						}
					});	
				}
			}
			
			//�û�ƣ�Ͷȿ���
			if(controlId==355){
				if (value && value!='' && value.split(',').length == 2){
					var enrollDate = value.split(',')[0];
					var enrollNum = value.split(',')[1];
					if(enrollDate == '' && enrollNum == ''){
						value = '';
					}else if ((enrollDate && enrollDate != '' && enrollNum == '') || (enrollDate == '' && enrollNum && enrollNum != '')){
						errorMsg += '������offer����ֻҪ��дһ���һ��Ҳ����';
						isSucced = false;
					}else if(isNotNumber(enrollDate) || isNotNumber(enrollNum)){
						errorMsg += '������offer����������д>0������';
						isSucced = false;
					}
				}
			}
			
	    	//����ֵ
			if(isSucced) {
	    		setControlValue(pageId,controlId,value);
			} else {
				jQuery('#errmsg-' + pageId + '-' + controlId).html(errorMsg);
			}
	 	});
	 	
		if(!isSucced) {
			return false;
		} else {
			return true;
		}
	}
	
	var dialogSelectNext;
	var readyFun = [
		function() {
			$('.js-goto-topic').live('click', function() {
				location.href = T.domain + "/enroll/v2012/topic.htm?seriesId=" + $(this).data('id');
			});
			
			$('.js-goto-topic-conf').live('click', function() {
				location.href = T.domain + "/enroll/v2012/topic_config.htm?selectSeriesId=" + $(this).data('id');
			});
			
			$('.dialog-select-next .close').click(function(){
				dialogSelectNext.dialog('close');
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
	
	/** �ύ�� */
	function submitForm(pageId) {
		var xmlValue = getXml();
		jQuery.ajax(T.domain + '/enroll/save_series.htm?isnew=true&_input_charset=utf-8', {
	        type: "POST",
	        processData: true,
			contentType: 'application/x-www-form-urlencoded',
	        data:  {xmlkey:xmlValue},
	        dataType: 'text',
	    	success: function(data, textStatus, jqXHR){
				if('ok' == data.split('_')[0]) {
					if(insId) {		//�޸ĵ�ʱ�򣬲�������ת
						alert('�޸ĳɹ���');
					} else {		//�½���ʱ��Ҳֻ��typeΪ1��ʱ����ת
						if("series-1"==pageId) {
							$.use('ui-dialog', function(){
								var dialogSelectNext = $('.dialog-select-next').dialog({
									center: true,
									fixed:true
								});
							});
							
							$(".js-goto-topic").data('id', data.split('_')[1]);
							$(".js-goto-topic-conf").data('id', data.split('_')[1]);
						}else{
							alert('����ɹ���');
						}
					}
	    		} else {
					alert('������޸�ʧ�ܣ�');
				}
	        }
		});
	}

 	
	
	
	//����ѡ�еİ�ťչʾ��ͬ��������
	jQuery('#selectTable').on("click", "button.select-type", function() {
		var value = jQuery(this).attr('stype');
		
		jQuery(enrollConfig).find('page').each(function(){
			jQuery(this).attr('selected','false');
			if(jQuery(this).attr('id') ==  value) {
				jQuery(this).attr('selected','true');
			}
		 });
		 jQuery('#' + value).removeClass("hiddenDiv").addClass("showDiv");
		 jQuery("#selectTable").removeClass("showDiv").addClass("hiddenDiv");		 
	});
	
	
	function getXml() {
		//�����������������
		if(jQuery.browser.msie) {
			return enrollConfig.xml;
		} else {
			return (new XMLSerializer()).serializeToString(enrollConfig);
		}
	}
	function isNotNumber(value) {
		var reg =eval('/^[1-9][0-9]*$/');
		if (reg.test(value)) {
			return false;
		}
		return true;
	}
	function fillText(id, text1Elm,text1,text2Elm,text2,text3Elm,text3){
		if(id && id!=''){
			if(text1Elm && text1Elm!='' && text1 && text1!=''){
				$(id).find(text1Elm).text(text1);
			}
			if(text2Elm && text2Elm!='' && text2 && text2!=''){
				$(id).find(text2Elm).text(text2);
			}
			if(text3Elm && text3Elm!='' && text3 && text3!=''){
				$(id).find(text3Elm).text(text3);
			}
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
	
})(jQuery, FE.tools);
