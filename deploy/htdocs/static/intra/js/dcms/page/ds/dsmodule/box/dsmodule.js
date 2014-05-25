/**
 * @package FD.app.cms.search.page
 * @author: quxiao
 * @Date: 2012-10-26
 */

 ;(function($, D){
 	/*
 	 * 点接入数据源时，初始化
 	 * */
    D.bottomAttr.initDsModule = function(dsModuleParam) {
		//初始化,如果dsModuleParam有值说明层实例化过则设置-1，否则没实例化过则初始为0意味无数据源。
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
 	 * 在绑定字段前初始化数据源schema
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
					// 更新当前页面的所有shema
					FE.dcms.storage().setItem('dssJson' ,o);
			    }
			})
			.fail(function() {
				alert('系统错误，请联系管理员');
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



// 关闭对话框
function closeDsModule(){
	FE.dcms.bottomAttr.closeDialog();	
}
