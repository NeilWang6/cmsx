/**
 * @author:zhaoyang.maozy
 * @Date: 2013-08-07
 */
;(function($, E,T){
	var splitChar ='-', 
		splitChar2 ='|', 
		betweenChar="~", 
		dsEvent = {};
	
	function formatValue(elm, format){
		var reg = /\#\{([^\}]+)\}/mg;
		var value = format.replace(reg, function(s,v){
			return $("#"+v, elm).val() || '';
		}) || ''; 
		return format.replace(reg, '') == value ? "" : value;		
	}
	
	// ��ȡ����ֵ
	function getValue(parent){
		  var empty = true;
		  // ���㶯̬����
		  var dynamicRows = $(".dynamic-row", parent);
		  dynamicRows.each(function(){
			  var target=this, evt = $(target).attr('setvalue-event');
			  evt && $(dsEvent).trigger(evt, target);
		  });
		  dynamicRows.each(function(){
			  var target=this, evt = $(target).attr('getvalue-event');
			  evt && $(dsEvent).trigger(evt, target);
		  });
		  // ��ȡ����ֵ
		  var data = {};
          $(".filter-area input, .filter-area textarea, .filter-area select, .setting-area input", parent).each(function() {
              var elm = $(this), name = elm.attr('name');
              if(name && !elm.hasClass('exclude-field') && name != 'action' && !name.match(/^event_.*/g)) {
                  if(elm.val()) {
                	  data[name] = elm.val();
                	  empty = false;
                  }
              }
          });
          // ��ȡ��������
          var sortFields = [];
          $(".sort-area .js-all-sort", parent).each(function() {
              var elm = $(this), name = elm.attr('name');
              if(name && !elm.hasClass('exclude-field') && elm.val()) {
            	  sortFields.push(elm.val());
              }
          });
          sortFields.length && (data.idcSort = sortFields.join(';'));
          
          //�������
          var map = {};
          $(".sort-area-result select", parent).each(function() {
        	  var elm = $(this), 
        	  	  name = elm.attr('name');
        	  
        	  if (name && !map[name]) {
        		  map[name] = [];
        	  }
        	  if(name && elm.val() && !elm.hasClass('exclude-field')) {
        		  map[name].push(elm.val());
        	  }
          });
          
          for(var key in map) {
        	  map[key].length && (data[key] = map[key].join(';'));
  		  }
          
          //��׼�������췽��������mlr����
          $(".sort-area-common", parent).each(function() {
	          $(".dynamic-hidden-field", this).each(function() {
	              var elm = $(this), name = elm.attr('name');
	              if(name && !elm.hasClass('exclude-field') && name != 'action' && !name.match(/^event_.*/g)) {
	                  if(elm.val()) {
	                	  data[name] = elm.val();
	                  }
	              }
	          });
          });
          
          console && console.log('�����query��Ϊ��' + $.param(data));
          return empty ? null: data;
	}	
	
	/**
	 * ��ȡֵ
	 */
	function getQueryValue(tab) {
		var queryParams = getValue($(tab)), combineId = $('select[name="dataSource"]', tab).val();
		if (queryParams && combineId) queryParams.idcCombineId = combineId;
		return queryParams;
	}
	
	/**
	 * ��ȡĳ��tab��query
	 */
	function buildQuery(tab) {
		var queryParams = getQueryValue(tab);
		return queryParams ? $.param(queryParams) : '';
	}
	
	/**
	 * ��֤ĳ��tab��query
	 */
	function validateQuery(tab) {
		var queryParams = getQueryValue(tab);
		if (queryParams) {
			if (queryParams.mlr_session_filter || queryParams.mlr_session_ranker && queryParams.idcSort) {
				var sortFields = queryParams.idcSort.split(';'), validateObj = {};
				for (var i = 0; i < sortFields.length; i++) {
             		 if(sortFields[i].indexOf('price') > -1) {
             		 	validateObj.idcSort='mlrѡ��͡��۸�����ѡ��ֻ�ܶ�ѡһ���볢����ա��۸�����ѡ��!';
             		 	return validateObj;
             		 }
              	}; 
			}
		}
		return null;
	}
	
	/**
	 * ��չ�ӿ�
	 */
	T.idatacenter.buildQuery = buildQuery;
	T.idatacenter.getQueryValue = getQueryValue;
	T.idatacenter.getValue = getValue;
	T.idatacenter.validateQuery = validateQuery;
	
	var readyFun = [
		function() {
			// ���Ӷ�̬�¼�
			$(dsEvent).bind("setBetween",function(evt, elm){
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
			
			//����mlr���������ֵ
			$(dsEvent).bind("setMlr",function(evt, elm){
				$(".dynamic-field", elm).each(function(){
					var kingString = [];
					
					$(".item", elm).each(function(){
						var _ele = $(this),
							zbValue = $('.zbField', _ele)[0] ? $('.zbField', _ele).val() : '', 
							wdElm =  $('.wdField', _ele),
							sjElm = $('.sjField', _ele), 
							value = ($('.valField', _ele).val() || '').replace(/\s+/, ''), 
							fieldValue = [];
						
						if(value){
							var cate = $(".zbField option:selected", _ele).data('cate');
							fieldValue.push(zbValue);
							wdElm[0] && fieldValue.push(wdElm.val());
							sjElm[0] && fieldValue.push(sjElm.val());
							cate != undefined && fieldValue.push(cate);
							fieldValue.push(value);
							kingString.push(fieldValue.join(splitChar));
						}
					});
					
					if(kingString.length) {
						$(this).val(kingString.join(splitChar2));
					} else {
						$(this).val('');
					}
				});
			});
			
			//����mlr���������ֵ
			$(dsEvent).bind("setMlrSort",function(evt, elm){
		          var wdElm =  $('.wdOrderField', elm), 
		          	  sjElm = $('.sjOrderField', elm), 
		          	  lbElm =  $('.lbOrderField', elm), 
		          	  fieldValue = [];
		          var lbValue = lbElm[0] ? (lbElm.val() || '') : '';
		          if(lbValue){
					  fieldValue.push(lbValue);
					  wdElm[0] && fieldValue.push(wdElm.val());
					  sjElm[0] && fieldValue.push(sjElm.val());
					  $('.dynamic-hidden-field', elm).val(fieldValue.join(splitChar));
		          }
			});
		}
	];
	
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
})(jQuery, FE.elf, FE.dcms);