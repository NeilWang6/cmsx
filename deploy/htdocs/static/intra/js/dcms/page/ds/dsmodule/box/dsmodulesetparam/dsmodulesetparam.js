
;(function($, D){
    var readyFun = [
		/*������ʽ����*/
		function(){
			$('.description').click(function(e){
                e.preventDefault();
                var self = $(this), _sVal = self.data('boptions'), selfParent = self.parent();
                if(selfParent.hasClass('selected')) {
                    return;
                }
				
				$('.selected').removeClass('selected');
                selfParent.addClass('selected');
				$('.attr').hide();
                $('#' + _sVal).show();
				// ����ifame���ڵĴ�С
				resizeFrame();
			});
		},
		// ���水ť
		function (){
			$('#btnStoreDs').click(function(e){
				e.preventDefault();
				var _parentFrame = parent.document;
			
				var dsFlag         = _parentFrame.getElementById('dsIframe').contentWindow.checkForm();
				if(!dsFlag){
					alert("����Դ��������");
					return;
				}
				var dsParamFlag    = checkForm();
				if(!dsParamFlag){
					alert("����Դ������������");
					return;
				}
				
				var dsModuleId = _parentFrame.getElementById("dsModuleId").value;
				var datasourceId =  _parentFrame.getElementById('dsIframe').contentWindow.getDataSourceId();
				var dsParamValue = encodeURIComponent(getValue());
				var _url =  FE.dcms + "/page/ds/dsModuleSetParam.html?action=ds_module_action&event_submit_do_store_ds=true";
				var _param ="&dsModuleId="+dsModuleId + "&datasourceId="+datasourceId+"&dsParamValue="+dsParamValue;
				_sendToStore(_url+_param,dsModuleId);
			});
			
		},
		// ��ʼ��
		function (){
			resizeFrame();
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

	//ajax���󱣴�
	function _sendToStore(_vUrl,oldDsModuleId){
		var _topWindow = parent.parent;
		dcms.ajax({
		    url: _vUrl,
		    type: "POST"
		})
		.done(function(o) {
		    if (o) {
		        var data = dcms.parseJSON(o);
				var _dsModuleId = data.dsModuleId;
				var _datasourceChanges = data.datasourceChanges;
				// ����Դ���
				var _dsModuleParam = data.dsModuleParam;
				// 0��ʾûѡ������Դ�������������޸���Ҳ�����
				if (_dsModuleId == 0 || _datasourceChanges =="true" ){
					//���ԭ����ǩ�󶨵�����
					_topWindow.FE.dcms.bottomAttr.removeDsModuleClass();
				}
	
				if (_dsModuleParam){
					_dsModuleParam = JSON.stringify(_dsModuleParam);
				}
				// ��module��ǩ����ֵ
				_topWindow.FE.dcms.bottomAttr.setDsModuleParam( _dsModuleParam);
				// ���µ�ǰҳ�������shema
				_topWindow.FE.dcms.storage().setItem('dssJson' ,o);
			 
				_topWindow.jQuery('.js-dialog footer').css('display','block');
                _topWindow.FE.dcms.Msg.alert({
                    'title': '��ʾ',
                    'body': '<div class="header-dialog-content">��������Դ�ɹ�</div>',
                    success: function(evt){
                        // ˢ��
                       var $refresh =  _topWindow.dcms('.bar-a-refresh'),oClicks = $refresh.data('click'),isClick= true;
                       if(oClicks){
                       		for(var k=0;k<oClicks.length;k++){
                       			var oClick = oClicks[k];
                       			//����Դ���óɹ���ģ��Ͳ��ֲ���Ⱦҳ��
                       			if(oClick.name==='template'||oClick.name==='layout'){
                       				isClick = false;
                       			}
                       		}
                       }
                       if(isClick){
                       	$refresh.click();
                       }
                       
                    }
                });
		    }
		})
		.fail(function() {
			alert('ϵͳ��������ϵ����Ա');
		});
				
	
	}
	// ��������Դifrmame���ڵĴ�С
	resizeFrame = function(){
		var _parentFrame = parent.document;
		// ����ifame�ĸ߶ȸ������ݵĸ߶��Զ�����
		_parentFrame.getElementById('dsParamIframe').height = document.documentElement.offsetHeight;
		
		var _topFrame = parent.parent.document;
		
		// ������Դģ��ĸ߶ȹ�������Ҫ����frame���ֹ������������򲻳��ֹ�������
		if (_parentFrame.documentElement.offsetHeight > 440){
			_topFrame.getElementById('dsModuleIframe').style.overflowY="scroll";
		}else{
			_topFrame.getElementById('dsModuleIframe').style.overflowY="hidden";
		}
	};
	$(FE.dcms).bind("setMLR",function(evt, elm){
		var zbElm = $('.zbField', elm), wdElm =  $('.wdField', elm),
		sjElm = $('.sjField', elm), valElm =  $('.valField', elm), 
		fieldValue = [], value = (valElm.val() || '').replace(/\s+/, '');
		// ����MLR���м�ֵ
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

}


)(dcms, FE.dcms);

// �ر��Զ��崰��
function closeDiv(){
	var bg_node = document.getElementById('bg');
	var id = bg_node.relative;
	bg_node.relative = null;
	bg_node.style.display='none';
	document.getElementById(id).style.display='none';

}
// �����Զ������������
function addTableRow(){
    var _customDsParamList = document.getElementById("customDsParamList");
    if (_customDsParamList.value == 0) {
        alert("��ѡ�����");
        return false;
    }
    else {
        closeDiv();
    }
    var fieldName = _customDsParamList.value;
    var fieldText = _customDsParamList.options[_customDsParamList.selectedIndex].text;
    _customDsParamList.value = 0;
    var tbobj = document.getElementById("subTable");
    var trobj, tdobj;
    var rowIndex = tbobj.rows.length;
    if (rowIndex == -1) {
        trobj = tbobj.insertRow(-1);
    }
    else {
        trobj = tbobj.insertRow(rowIndex);
    }
    var autoTableRowData = new Array(fieldText, fieldName, '<input name="' + fieldName + '" type="text" id="' + fieldName + '" size="16" dataType="LimitB" min="0" max="4000" msg="��಻����4000�ֽ�"/><a href="#" onclick="delTableRow(this.parentNode.parentNode.rowIndex,\'subTable\');return false;" class="btnS"><span class="inner">ɾ��</span></a>');
    
    for (var i = 0; i < autoTableRowData.length; i++) {
        tdobj = trobj.insertCell(-1);
        tdobj.id = "god";
        tdobj.innerHTML = autoTableRowData[i];
    }
}

//ɾ��1��   
function delTableRow(rowIndex, formid){
    var tbobj = document.getElementById(formid);
    if (rowIndex == -1) {
        if (tbobj.rows.length > 1) {
            tbobj.deleteRow(tbobj.rows.length - 1);
        }
    }
    else {
        tbobj.deleteRow(rowIndex);
    }
}
// ��Ч�Լ��
function checkForm(){
	  var  form1 = document.getElementById('checkForm');
	  var  flag  = Validator.validate(form1, 3, "checkForm", "checkForm");	
      return flag;	  
}
// ��ȡ����ֵ
function getValue(){
	  // ���㶯̬����
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

