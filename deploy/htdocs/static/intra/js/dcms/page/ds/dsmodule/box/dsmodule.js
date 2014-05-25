/**
 * @package FD.app.cms.search.page
 * @author: quxiao
 * @Date: 2012-10-26
 */

 ;(function($, D){
 	/*
 	 * ���������Դʱ����ʼ��
 	 * */
    D.bottomAttr.initDsModule = function(dsModuleParam) {
		//��ʼ��,���dsModuleParam��ֵ˵����ʵ������������-1������ûʵ���������ʼΪ0��ζ������Դ��
		var _dsModuleId ;
		if (dsModuleParam){
			_dsModuleId = -1;
		}else{
			_dsModuleId = 0;
		}
		var _dsModuleFrm = document.getElementById("dsModuleIframe").contentWindow.document;
		_dsModuleFrm.getElementById("dsModuleId").value =  _dsModuleId;
		var _url = D.domain + '/page/ds/box/dsModuleSelectDs.html?action=ds_module_action&event_submit_do_show_ds_from_ds_param=true';
		if (dsModuleParam) {
			_url += "&dsModuleParam=" + encodeURIComponent(encodeURIComponent(dsModuleParam));
		}
		_dsModuleFrm.getElementById("dsIframe").src =_url;
    };
 	/*
 	 * �ڰ��ֶ�ǰ��ʼ������Դschema
 	 * */
    D.bottomAttr.fetchDsModule = function(dsModuleObject) {
		var dsModuleParam = dsModuleObject.data('dsmoduleparam');
		if  (dsModuleParam){
				if(dsModuleParam instanceof Array){
					dsModuleParam = dsModuleParam[0];
				}
			dsModuleParam = JSON.stringify(dsModuleParam);
			var _url = D.domain + '/page/appCommand.html?action=ds_module_action&event_submit_do_fetch_ds_module=true';
				_url += "&dsModuleParam=" + dsModuleParam;
			dcms.ajax({
			    url: _url,
			    type: "POST"
			})
			.done(function(o) {
			    if (o) {
			        var data = dcms.parseJSON(o);
					// ���µ�ǰҳ�������shema
					FE.dcms.storage().setItem('dssJson' ,o);
			    }
			})
			.fail(function() {
				alert('ϵͳ��������ϵ����Ա');
			});
		}
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



// �رնԻ���
function closeDsModule(){
	FE.dcms.bottomAttr.closeDialog();	
}
