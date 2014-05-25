 ;(function($, D){
    readyFun = [
        /**
         * 表单验证
         */
        function(){
            $('#btnMergeData').click(function(){
					var datasourceId =  document.getElementById('dsIframe').contentWindow.getDataSourceId();
					var dsParamValue = encodeURIComponent(document.getElementById('dsParamIframe').contentWindow.getValue());
					var _url =  FE.dcms.domain + "/page/ds/mergeData.htm?action=ds_tdp_tool_action&event_submit_do_search_data_for_merge=true";
					var _param ="&datasourceId="+datasourceId+"&dsParamValue="+dsParamValue;
					openDialog(_url + _param,1000,450);
			});
        },
        /**
         * 选择模板
         */
        function(){
            $('#btnChooseTemplate').click(function(){
					var datasourceId =  document.getElementById('dsIframe').contentWindow.getDataSourceId();
					var dsParamValue = encodeURIComponent(document.getElementById('dsParamIframe').contentWindow.getValue());
					var _url =  FE.dcms.domain + "/page/ds/chooseTemplate.htm?action=ds_tdp_tool_action&event_submit_do_choose_template=true";
					var _param ="&datasourceId="+datasourceId+"&dsParamValue="+dsParamValue;
					openDialog(_url + _param,982);
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

 })(dcms, FE.dcms);



function generateTdpDemo(){
	var datasourceId =  document.getElementById('dsIframe').contentWindow.getDataSourceId();
	var dsParamValue = encodeURIComponent(document.getElementById('dsParamIframe').contentWindow.getValue());
	var _url =  FE.dcms.domain + "/page/ds/generateTdpDemo.htm?action=ds_tdp_tool_action&event_submit_do_generate_tdp_demo=true";
	var _param ="&datasourceId="+datasourceId+"&dsParamValue="+dsParamValue;
	openDialog(_url + _param);
}

function searchData(){
	var datasourceId =  document.getElementById('dsIframe').contentWindow.getDataSourceId();
	var dsParamValue = encodeURIComponent(document.getElementById('dsParamIframe').contentWindow.getValue());
	var _url =  FE.dcms.domain + "/page/ds/searchData.htm?action=ds_tdp_tool_action&event_submit_do_search_data=true";
	var _param ="&datasourceId="+datasourceId+"&dsParamValue="+dsParamValue;
	openDialog(_url + _param);
} 

