/*
 * 公用的数据源参数设置，获取form中所有数据源参数，支持复杂的mlr排序、过滤等。
 * @author: quxiao
 * @Date: 2012-12-27
 */
;(function($, D){

	var splitChar ='-' , betweenChar="`C126`", mlrItemHtml = $("#mlr_rows .item").html();
	function formatValue(elm, format){
		var reg = /\#\{([^\}]+)\}/mg;
		var value = format.replace(reg, function(s,v){
			return $("#"+v, elm).val() || '';
		}) || ''; 
		return format.replace(reg, '') == value ? "" : value;		
	};
	
	// 把数据源的动态事件封装成函数，供外面调用。
	initDsEvent = function (){
		mlrItemHtml = $("#mlr_rows .item").html();
		// 增加行
		$("#mlr_rows .add").click(function(){
			$("#mlr_rows").append('<div class="item dynamic-row" setvalue-event="setMLR">' + mlrItemHtml + '</div>');
			return false;
		});
		// 删除行
		$("#mlr_rows").delegate(".delete", "click", function(){
			$(this).parent('.item').remove();
			return false;
		});
		// 换单位
		$("#mlr_rows").delegate(".zbField", "change", function(){
			var unit = $("option:selected", this).data('unit') || '';
			$(this).siblings(".unit").html(unit);
			console.log(unit);
		});
		// 增加动态事件
		$(FE.dcms).bind("setBetween",function(evt, elm){
			$(".dynamic-field", elm).each(function(){
				var format = $(this).data('format'), value='';
				if (format){
					value = formatValue(elm, format);			
				} else {
					value =  ($('#qBegin', elm).val() || '') + betweenChar + ($('#qEnd', elm).val() || '');
				}
				(value == betweenChar) && (value='');
				$(this).val(value);
			});
		});
	
		$(FE.dcms).bind("setMLR",function(evt, elm){
			var zbElm = $('.zbField', elm), wdElm =  $('.wdField', elm),
			sjElm = $('.sjField', elm), valElm =  $('.valField', elm), 
			fieldValue = [], value = (valElm.val() || '').replace(/\s+/, '');
			// 设置MLR单行件值
			var zbValue = zbElm[0] ? zbElm.val() : '';
			if(value){
				var option = $(".zbField option:selected", elm), unit = option.data('unit') || '', cate = option.data('cate');
				wdElm[0] && fieldValue.push(wdElm.val());
				sjElm[0] && fieldValue.push(sjElm.val());
				cate != undefined && fieldValue.push(option.data('cate'));
				fieldValue.push(value);
				$("#mlr_field_row", elm).attr('name', zbValue);
				$("#mlr_field_row", elm).val(fieldValue.join(splitChar));
			}
		});
		$(FE.dcms).bind("setMLRRank",function(evt, elm){
			var wdElm =  $('.wdOrderField', elm), sjElm = $('.sjOrderField', elm), lbElm =  $('.lbOrderField', elm), fieldValue = [];
			var lbValue = lbElm[0] ? (lbElm.val() || '') : '';
			if(lbValue){
				fieldValue.push(lbValue);
				wdElm[0] && fieldValue.push(wdElm.val());
				sjElm[0] && fieldValue.push(sjElm.val());
				$("#mlr_field_row", elm).val(fieldValue.join(splitChar));
			}
		});		
		$(FE.dcms).bind("getMLR",function(evt, elm){
			var fields = $("input[name='mlr_filter_field']"), str='', queryField = [];	
			//dynamic field
			$(".mlr-field").each(function(){			
				var node=$(this), name = node.attr('name'), value = (node.val() || '').replace(/\s+/g, '');
				console && console.log("name=" + name + " value="+value);
				if (name && value) {
					var queryValue = name + splitChar + value;
					queryField.push(queryValue);
				}
			});
			if(queryField.length) {
				$("input.dynamic-field", elm).val(queryField.join("|"));
			}

		});	
	}
	// 初始化动态绑定事件
	initDsEvent();

}


)(dcms, FE.dcms);

//有效性检查
function checkForm(){
	  var  form1 = document.getElementById('checkForm');
	  var  flag  = Validator.validate(form1, 3, "checkForm", "checkForm");	
      return flag;	  
}



// 获取参数值
function getValue(){
	  // 计算动态参数
	  var $ = dcms, dynamicRows = $(".dynamic-row");
	  dynamicRows.each(function(){
		  var target=this, evt = $(target).attr('setvalue-event');
		  evt && $(FE.dcms).trigger(evt, target);
	  });
	  dynamicRows.each(function(){
		  var target=this, evt = $(target).attr('getvalue-event');
		  evt && $(FE.dcms).trigger(evt, target);
	  });	  
	  return FromTools.toNewStr('checkForm', 'exclude-field');
}

