/**
 * @package FD.app.cms.search.page
 * @author: quxiao
 * @Date: 2012-03-19
 */

 ;(function($, D){
 	
    D.bottomAttr.initDsModule = function(dsModuleId) {
		//初始化
		document.getElementById("dsModuleId").value = dsModuleId ;
		var _url = D.domain + '/page/ds/dsModuleSelectDs.html?action=ds_module_action&event_submit_do_show_ds=true&needHidden=need';
		_url +="&dsModuleId=" + document.getElementById("dsModuleId").value ;
		document.getElementById("dsIframe").src =_url;
    };
    readyFun = [
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
    

 })(dcms, FE.dcms);


/**
 * 保存页面
 */
function storeDsModule(){
    var form1 = document.getElementById("form1");

	var dsFlag         = document.getElementById('dsIframe').contentWindow.checkForm();
	if(!dsFlag){
		alert("数据源设置有误");
		return;
	}
	var dsParamFlag    = document.getElementById('dsParamIframe').contentWindow.checkForm();
	if(!dsParamFlag){
		alert("数据源参数设置有误");
		return;
	}
	
	var dsModuleId = document.getElementById("dsModuleId").value;
	var datasourceId =  document.getElementById('dsIframe').contentWindow.getDataSourceId();
	var dsParamValue = encodeURIComponent(document.getElementById('dsParamIframe').contentWindow.getValue());
	var _url =  FE.dcms + "/page/ds/dsModuleSetParam.html?action=ds_module_action&event_submit_do_store_ds=true";
	var _param ="&dsModuleId="+dsModuleId + "&datasourceId="+datasourceId+"&dsParamValue="+dsParamValue;
	_sendToStore(_url+_param,dsModuleId);
}

//ajax请求保存
function _sendToStore(_vUrl,oldDsModuleId){
	dcms.ajax({
	    url: _vUrl,
	    type: "POST"
	})
	.done(function(o) {
	    if (o) {
	        var data = dcms.parseJSON(o);
			var _dsModuleId = data.dsModuleId;
			var _datasourceChanges = data.datasourceChanges;
			// 0表示没选择数据源，做清除，如果修改了也做清除
			if (_dsModuleId == 0 || _datasourceChanges =="true" ){
				//清空原来标签绑定的数据
				if (oldDsModuleId != undefined) {
					FE.dcms.bottomAttr.removeDsModuleClass(oldDsModuleId);
				}
			}

			// 给module标签设置值，如data-dsmoduleid="8"，清除则传0
			FE.dcms.bottomAttr.setDsModuleId(_dsModuleId);
			// 更新当前页面的所有shema
			FE.dcms.storage().setItem('dssJson' ,o);
			
			var _strModuleData = "";
			if ("" != data.dsModuleData || undefined == data.dsModuleData){
				_strModuleData = JSON.stringify(data.dsModuleData);
			}
			// 更新当前页面的数据源参数所有数据
			document.getElementById('dcms_box_main').contentWindow.document.getElementById("dcms-ds-module-data").value = _strModuleData;
			closeDsModule();
	    }
	})
	.fail(function() {
		alert('系统错误，请联系管理员');
	});
			

}
// 关闭对话框
function closeDsModule(){
	FE.dcms.bottomAttr.closeDialog();	
}
