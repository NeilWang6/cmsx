/**
 * @package FD.app.cms.search.page
 * @author: quxiao
 * @Date: 2012-06-26
 */

 ;(function($, D){
    var searchPageForm = $('#checkForm'),
    pageNum = $('#js-page-num'),
    readyFun = [
        /**
         * 切换到第N页
         */
        function(){
            $('.pages').live('click', function(e){
                e.preventDefault();
                var n = $(this).text();
                setPageNum(n);
            });
        },
        /**
         * 上一页、下一页
         */
        function(){
            $('.dcms-page-btn').live('click', function(e){
                e.preventDefault();
                var n = $(this).data('pagenum');
                setPageNum(n);
            });
        },
        /**
         * 跳到第几页
         */
        function(){
            $('#js-jumpto-page').click(function(e){
                var n = $('#js-jump-page').val();
                setPageNum(n);
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
    
    function setPageNum(n){
        pageNum.val(n);
        searchPageForm.submit();
    }
 })(dcms, FE.dcms);

/**
 * 保存数据源
 */
function storeDsForDsTemplate(){
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
	
	var datasourceId =  document.getElementById('dsIframe').contentWindow.getDataSourceId();
	var dsParamValue = encodeURIComponent(document.getElementById('dsParamIframe').contentWindow.getValue());
	var _url =  FE.dcms + "/page/ds/dsModuleSetParam.html?action=ds_template_action&event_submit_do_store_ds=true";
	var _param = "&datasourceId="+datasourceId+"&dsParamValue="+dsParamValue;
	_url += _param;

	dcms.ajax({
		    url: _url,
		    type: "POST",
			async:false
		})
		.done(function(o) {
		    if (o) {
		        var _data = dcms.parseJSON(o);
				// 出错，则提示
				if ( _data.sucess == "false" ){
					alert(_data.message);
					return;
				}
				_rst = _data;
				window.returnValue = _rst;
				self.close();
		    }
		})
		.fail(function() {
			alert('系统错误，请联系管理员');
		});

}



/**
 * 保存模板
 */
function storeTemplateForDsTemplate(){
	var dsTemplateId = getDsTemplate();
	if (dsTemplateId<=0){
		alert("请选择模板！");
		return;
	}


	var _url =  FE.dcms + "/page/ds/dsModuleSetParam.html?action=ds_template_action&event_submit_do_store_template=true";
	var _param = "&dsTemplateId="+dsTemplateId;
	_url += _param;

	dcms.ajax({
		    url: _url,
		    type: "POST",
			async:false
		})
		.done(function(o) {
		    if (o) {
		        var _data = dcms.parseJSON(o);
				_rst = _data;
				window.returnValue = _rst;
				self.close();
		    }
		})
		.fail(function() {
			alert('系统错误，请联系管理员');
		});

}

//获取用户选择的数据源
function getDsTemplate(){
	var objs = document.getElementsByName("radioType");
	if (objs != null ){
		if 	(objs.length == null){
			if( objs.checked) {
				return objs.value;
			}
		}else{
               for(var   i=0;i<objs.length;i++){
                     if(objs[i].checked){
                           return objs[i].value;
                     }
               }
		}
	}
	return 0;
}
