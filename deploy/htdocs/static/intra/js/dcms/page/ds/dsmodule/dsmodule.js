/**
 * @package FD.app.cms.search.page
 * @author: quxiao
 * @Date: 2012-03-19
 */

 ;(function($, D){
 	
    D.bottomAttr.initDsModule = function(dsModuleId) {
		//��ʼ��
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
 * ����ҳ��
 */
function storeDsModule(){
    var form1 = document.getElementById("form1");

	var dsFlag         = document.getElementById('dsIframe').contentWindow.checkForm();
	if(!dsFlag){
		alert("����Դ��������");
		return;
	}
	var dsParamFlag    = document.getElementById('dsParamIframe').contentWindow.checkForm();
	if(!dsParamFlag){
		alert("����Դ������������");
		return;
	}
	
	var dsModuleId = document.getElementById("dsModuleId").value;
	var datasourceId =  document.getElementById('dsIframe').contentWindow.getDataSourceId();
	var dsParamValue = encodeURIComponent(document.getElementById('dsParamIframe').contentWindow.getValue());
	var _url =  FE.dcms + "/page/ds/dsModuleSetParam.html?action=ds_module_action&event_submit_do_store_ds=true";
	var _param ="&dsModuleId="+dsModuleId + "&datasourceId="+datasourceId+"&dsParamValue="+dsParamValue;
	_sendToStore(_url+_param,dsModuleId);
}

//ajax���󱣴�
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
			// 0��ʾûѡ������Դ�������������޸���Ҳ�����
			if (_dsModuleId == 0 || _datasourceChanges =="true" ){
				//���ԭ����ǩ�󶨵�����
				if (oldDsModuleId != undefined) {
					FE.dcms.bottomAttr.removeDsModuleClass(oldDsModuleId);
				}
			}

			// ��module��ǩ����ֵ����data-dsmoduleid="8"�������0
			FE.dcms.bottomAttr.setDsModuleId(_dsModuleId);
			// ���µ�ǰҳ�������shema
			FE.dcms.storage().setItem('dssJson' ,o);
			
			var _strModuleData = "";
			if ("" != data.dsModuleData || undefined == data.dsModuleData){
				_strModuleData = JSON.stringify(data.dsModuleData);
			}
			// ���µ�ǰҳ�������Դ������������
			document.getElementById('dcms_box_main').contentWindow.document.getElementById("dcms-ds-module-data").value = _strModuleData;
			closeDsModule();
	    }
	})
	.fail(function() {
		alert('ϵͳ��������ϵ����Ա');
	});
			

}
// �رնԻ���
function closeDsModule(){
	FE.dcms.bottomAttr.closeDialog();	
}
