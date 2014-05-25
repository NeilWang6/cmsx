/**
 * @package
 * 资源位推商（走member）
 * @author: qinming.zhengqm
 * @Date: 2014-01-4
 */

;(function($, D, win) {
	var splitChar ='-';
	function getSubCategories(elementid, depth){
		var element = elementid.substring(0,elementid.length-1);
		var value = jQuery('#' + elementid + ' option:selected').val();
		var url = D.domain + "/page/res/s_t_get_category.htm?_input_charset=utf-8&id="+value+"&depth="+depth + "&timed="+new Date();
		if(depth == 2){
			jQuery('#'+element+'2').empty();
			jQuery('#'+element+'3').empty();
		}
		if(depth == 3){
			jQuery('#'+element+'3').empty();
		}
		jQuery.getJSON(url,function(data) {
			if(data.success == 'true') {
				var sel = jQuery('#' + element + depth)[0];
				var empopt = document.createElement('option');
				empopt.text="请选择";
				empopt.value="";
				empopt.id="";
				 sel.options[sel.options.length]  = empopt;
				jQuery(data.data).each(function(index,content) {
					 var newopt = document.createElement('option');
					 newopt.text=content[1];
					 newopt.value=content[0];
					 newopt.id=content[0];
					 sel.options[sel.options.length] = newopt;
				});
			}
		});
	}
	D.setPostCategoryValue = function(elm){
		var categorySelect1Elm =  $('#categorySelect1', elm), categorySelect2Elm = $('#categorySelect2', elm), categorySelect3Elm =  $('#categorySelect3', elm);
		var fieldValue = categorySelect3Elm.val();
		if(!fieldValue || fieldValue==""){
			fieldValue = categorySelect2Elm.val();
		}
		if(!fieldValue || fieldValue==""){
			fieldValue = categorySelect1Elm.val();
		}
		$("#postcategory", elm).val(fieldValue);
		$("#mlr_category", elm).val(fieldValue);
	};
	D.setMLRRank = function(elm){
		var wdElm =  $('.wdOrderField', elm), sjElm = $('.sjOrderField', elm), lbElm =  $('.lbOrderField', elm), fieldValue = [];
		var lbValue = lbElm[0] ? (lbElm.val() || '') : '';
		if(lbValue){
			fieldValue.push(lbValue);
			wdElm[0] && fieldValue.push(wdElm.val());
			sjElm[0] && fieldValue.push(sjElm.val());
			$("#mlr_session_ranker", elm).val(fieldValue.join(splitChar));
		}
	};
	var readyFun = [
	function() {
		//类目选择
		$('#categorySelect1').change(function(){getSubCategories("categorySelect1", 2)});
	    $('#categorySelect2').change(function(){getSubCategories("categorySelect2", 3)});

	    $('#hand_way').delegate('.js-tab', 'click', function(event) {
			event.preventDefault();
			var self = $(this), $handWay = $('#hand_way'), $data = $('.js-data', $handWay),
			//
			$tab = $('a.js-tab', $handWay);
			$tab.removeClass('current');
			self.addClass('current');
			$data.addClass('fd-hide');
			$('.' + self.data('panel'), $handWay).removeClass('fd-hide');
		});
		D.bind("setMLRRank",function(evt, elm){
			D.setMLRRank(elm);
		});
		D.bind("setPostCategoryValue",function(evt, elm){
			D.setPostCategoryValue(elm);
		});

	},
	function() {
		/**
		 * 已推荐数
		 */
		//$('.js-has-res','#hand_way').
		$(document).bind("has_res", function(event) {
			event.preventDefault();
			var args = Array.prototype.slice.call(arguments, 1), $dataRec = $('.js-data-rec', '#hand_way'),
			//
			tab = $('.table-sub',$dataRec)[0], recNum = 0;
			recNum += tab.rows.length;
			$('.js-has-res', '#hand_way').html(recNum + '');
			if (args && args[0]) {
				typeof args[0] === 'function' ? args[0]() : '';
			}
		});

		$(document).trigger('has_res');
	}];
	var Res = {};
	Res.CONSTANTS = {
		idcFields : ',cs.viewName,cs.productionServiceExtend,cs.tradeTypeName,cs.memberId,medalSmallIconUrl,'
	};
	D.Res = Res;
	/**
	 * 对外提供接口
	 */
	win.getResData = function() {
		//event.preventDefault();
		var args = Array.prototype.slice.call(arguments, 0), that = this, $resBlock = $('.res-block', that.document);
		var dynamicRows = $(".dynamic-row");
		dynamicRows.each(function(){
			var target=this, evt = $(target).attr('setvalue-event');
			evt && $(FE.dcms).trigger(evt, target);
		});
		//
		$way = $('input[name="way"]:checked', $resBlock), way = 'hand', memberids = [], data = {},
		//
		$combineId = $('#combine_id', $resBlock), $sourceType = $('#source_type', $resBlock),
		//
		$dataRec = $('.js-data-rec', '#hand_way'), $tab = $('.table-sub', $dataRec);
		if ($sourceType.val() === 'idc') {
			if (way === 'hand') {
				$('tr', $tab).each(function(index, obj) {
					var $self = $(this), that = this, memberId = $self.data('member');
					memberids.push(memberId);
				});
			}
			data['sourceType']='idc';
			data['combineId']=$combineId.val();
			data['queryFields'] = Res.CONSTANTS.idcFields;
			data['query'] = 'memberids=' + (memberids + '');
		}
		return {'dataParamJson':data,'id':$tab.data('schedule')};
	};
	$(function() {
		for (var i = 0, l = readyFun.length; i < l; i++) {
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
})(dcms, FE.dcms, window);
