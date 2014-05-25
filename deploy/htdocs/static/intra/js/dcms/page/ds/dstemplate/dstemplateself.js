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
         * �л�����Nҳ
         */
        function(){
            $('.pages').live('click', function(e){
                e.preventDefault();
                var n = $(this).text();
                setPageNum(n);
            });
        },
        /**
         * ��һҳ����һҳ
         */
        function(){
            $('.dcms-page-btn').live('click', function(e){
                e.preventDefault();
                var n = $(this).data('pagenum');
                setPageNum(n);
            });
        },
        /**
         * �����ڼ�ҳ
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
 * ��������Դ
 */
function storeDsForDsTemplate(){
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
				// ��������ʾ
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
			alert('ϵͳ��������ϵ����Ա');
		});

}



/**
 * ����ģ��
 */
function storeTemplateForDsTemplate(){
	var dsTemplateId = getDsTemplate();
	if (dsTemplateId<=0){
		alert("��ѡ��ģ�壡");
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
			alert('ϵͳ��������ϵ����Ա');
		});

}

//��ȡ�û�ѡ�������Դ
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
