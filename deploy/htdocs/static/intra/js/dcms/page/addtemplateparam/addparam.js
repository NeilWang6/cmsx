/**
 * 添加模板参数
 * @author: qingguo.yanqg
 * @createTime: 2011-10-10
 * @lastModified: 2011-10-10
 */
(function ($, D) {
    var cmsdomain = D.domain;
    var listTemplateParamUrl = cmsdomain + '/page/getTemplateParam.html';
    var listCatalogTemplateUrl = cmsdomain + '/page/listCatalogTemplate.html';
    $('#token-line').hide();
    $('#param-panel').hide();

    $('#template-catalog-child').change(function(e){

	if(this.value == "") {
		var optionHtml = '<option value="">请选择头尾模板</option>';
 		$('#select-tamplate').html(optionHtml);
		$('#select-tamplate').trigger("change");
		return;
	}

	$('#select-tamplate').empty();
	$.ajax(listCatalogTemplateUrl, {
		dataType: 'json',
		data : {
                    id : this.value
                },
		success: function(data){
			if(data) {
				var optionHtml = '<option value="">请选择头尾模板</option>';
		                for (var i=0, l=data.length; i<l; i++) {
		                	optionHtml += '<option value="'+data[i].id+'">'+data[i].name+'</option>';
		                }
		                $('#select-tamplate').html(optionHtml);
				$('#select-tamplate').trigger("change");
				if($('#hidden-templateId') && $('#hidden-templateId').val()) {
					$('#select-tamplate').attr("value",$('#hidden-templateId').val());
					$('#select-tamplate').trigger('change');
				}
			}
		}
	});
    });
    
    
   $('#select-tamplate').change(function(e){
	if(this.value == "") {
		$('#token-line').hide();
		$('#param-panel').empty();
		$('#param-panel').hide();
		$('span.appkey-tip').html('模板类目_参数类目_');
		return;
	}
	$('#token-line').show();
	$('#param-panel').empty();
	$('#param-panel').show();
	$('span.appkey-tip').html($('#template-catalog-child').val() + '_' + $('#select-tamplate').val() + '_');

	$.ajax(listTemplateParamUrl, {
		dataType: 'json',
		data : {
                    id : this.value
                },
		success: function(rstData){
			if(rstData && rstData.success) {
				var data = rstData.data;
				for (var i=0, l=data.length; i<l; i++) {
					 var div = $('<div></div>');
					 var oldValue = "";
					 if($('#param-' + data[i].code) && $('#param-' + data[i].code).val()) {
							oldValue = $('#param-' + data[i].code).val();
					 }

					  $('<label for="'+ data[i].code +'">'+data[i].name+': </label>').appendTo(div);
					 if(data[i].type == "text") {
						 $('<input type="text" param="' + data[i].code + '" id="'+data[i].code+ '" vg="1" name="' + data[i].code + '"  placeholder="" size="40" value="' + oldValue + '"/>').appendTo(div);
						  
					 } else  if(data[i].type == "select") {
                              			 var select = $('<select id="'+ data[i].code +'" vg="1" param="' + data[i].code + '" name="' + data[i].code + '" ></select>');	
						 select.appendTo(div);
						 var optionContent = data[i].option;
						 optionContent = optionContent.replace('[','');
						 optionContent = optionContent.replace(']','');
						 if(optionContent.length > 0) {
							var options = optionContent.split("|");
							for (var k=0, index= options.length; k<index; k++) {
								if(options[k].length > 0) {
									var option = options[k].split(":");
									if(option.length >= 2) {
										var selectOption = $('<option value="' + option[0] + '">' + option[1] +'</option>');
										if(oldValue == option[0]) {
											selectOption.attr('selected', true);
										}
										selectOption.appendTo(select);
									}
								}
							}
						 }
					 }
					  div.appendTo($('#param-panel'));
				}
			} else {
				alert(rstData.data);
			}
		}
	});
    });
    
   $('#addTemplateParamForm').submit(function(){
		var paramContent = "{";
                $('#param-panel').find('input[param]').each(function(){
			paramContent += $(this).attr("name") + ':"' + this.value + '",';
		});
		 $('#param-panel').find('select[param]').each(function(){
			paramContent += $(this).attr("name") + ':"' + this.value + '",';
		});
		if( -1 != paramContent.indexOf(",")) {
			paramContent = paramContent.substr(0,paramContent.length -1);
		}
		paramContent += "}";
		$('#paramContentId').val(paramContent);
    });

    if($('#hidden-templateId') && $('#hidden-templateId').val()) {
    	$('#template-catalog-child').trigger('change');
    }

   $('#open-template').click(function(e) {
                var editUrl = cmsdomain + '/page/edit_template.html?template_id=' + $('#select-tamplate').val();
                $('#open-template').attr("href",editUrl);
   });

   var readyFun = [
        function(){
            //D.popTree('selcategoryName','selcategoryName','selCategoryId','dgPopTree','admin/catalog.html');
            var popTree = new D.PopTree(),
            categoryIdEl = $('#selCategoryId'),
            categoryEl = $('#selcategoryName');
            popTree.show(categoryEl, categoryEl, categoryIdEl, false);
            categoryEl.click(function(e){
                popTree.show(categoryEl, categoryEl, categoryIdEl);
            });
        }
    ];

   $(function(){
        for (var i = 0, l = readyFun.length; i<l; i++) {
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

})(dcms, FE.dcms);
