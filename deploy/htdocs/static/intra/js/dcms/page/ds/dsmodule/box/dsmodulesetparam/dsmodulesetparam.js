
;(function($, D){
    var readyFun = [
		/*缩放样式控制*/
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
				// 重设ifame窗口的大小
				resizeFrame();
			});
		},
		// 保存按钮
		function (){
			$('#btnStoreDs').click(function(e){
				e.preventDefault();
				var _parentFrame = parent.document;
			
				var dsFlag         = _parentFrame.getElementById('dsIframe').contentWindow.checkForm();
				if(!dsFlag){
					alert("数据源设置有误");
					return;
				}
				var dsParamFlag    = checkForm();
				if(!dsParamFlag){
					alert("数据源参数设置有误");
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
		// 初始化
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

	//ajax请求保存
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
				// 数据源入参
				var _dsModuleParam = data.dsModuleParam;
				// 0表示没选择数据源，做清除，如果修改了也做清除
				if (_dsModuleId == 0 || _datasourceChanges =="true" ){
					//清空原来标签绑定的数据
					_topWindow.FE.dcms.bottomAttr.removeDsModuleClass();
				}
	
				if (_dsModuleParam){
					_dsModuleParam = JSON.stringify(_dsModuleParam);
				}
				// 给module标签设置值
				_topWindow.FE.dcms.bottomAttr.setDsModuleParam( _dsModuleParam);
				// 更新当前页面的所有shema
				_topWindow.FE.dcms.storage().setItem('dssJson' ,o);
			 
				_topWindow.jQuery('.js-dialog footer').css('display','block');
                _topWindow.FE.dcms.Msg.alert({
                    'title': '提示',
                    'body': '<div class="header-dialog-content">设置数据源成功</div>',
                    success: function(evt){
                        // 刷新
                       var $refresh =  _topWindow.dcms('.bar-a-refresh'),oClicks = $refresh.data('click'),isClick= true;
                       if(oClicks){
                       		for(var k=0;k<oClicks.length;k++){
                       			var oClick = oClicks[k];
                       			//数据源设置成功后，模版和布局不渲染页面
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
			alert('系统错误，请联系管理员');
		});
				
	
	}
	// 重设数据源ifrmame窗口的大小
	resizeFrame = function(){
		var _parentFrame = parent.document;
		// 参数ifame的高度根据内容的高度自动设置
		_parentFrame.getElementById('dsParamIframe').height = document.documentElement.offsetHeight;
		
		var _topFrame = parent.parent.document;
		
		// 当数据源模块的高度过高则需要顶级frame出现滚动条，否则则不出现滚动条。
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

}


)(dcms, FE.dcms);

// 关闭自定义窗口
function closeDiv(){
	var bg_node = document.getElementById('bg');
	var id = bg_node.relative;
	bg_node.relative = null;
	bg_node.style.display='none';
	document.getElementById(id).style.display='none';

}
// 增加自定义参数到界面
function addTableRow(){
    var _customDsParamList = document.getElementById("customDsParamList");
    if (_customDsParamList.value == 0) {
        alert("请选择参数");
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
    var autoTableRowData = new Array(fieldText, fieldName, '<input name="' + fieldName + '" type="text" id="' + fieldName + '" size="16" dataType="LimitB" min="0" max="4000" msg="最多不超过4000字节"/><a href="#" onclick="delTableRow(this.parentNode.parentNode.rowIndex,\'subTable\');return false;" class="btnS"><span class="inner">删除</span></a>');
    
    for (var i = 0; i < autoTableRowData.length; i++) {
        tdobj = trobj.insertCell(-1);
        tdobj.id = "god";
        tdobj.innerHTML = autoTableRowData[i];
    }
}

//删除1行   
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
// 有效性检查
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

