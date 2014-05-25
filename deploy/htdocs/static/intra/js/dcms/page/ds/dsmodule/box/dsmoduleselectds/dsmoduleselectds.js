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
		document.getElementById("dsModuleId").value =  parent.document.getElementById("dsModuleId").value ;
        searchPageForm.submit();
    }
 })(dcms, FE.dcms);

// 选择数据源
function selectDs(datasourceId){
	var _action = "ds_module_action";
	// 为了给动态模块使用，所以这里做切入点
	if( undefined != parent.document.getElementById("dsAction") && null != parent.document.getElementById("dsAction")){
		_action = parent.document.getElementById("dsAction").value;
	}
	var _url = FE.dcms.domain +  "/page/ds/box/dsModuleSetParam.html?action="+_action+"&event_submit_do_show_ds_param=true";
	_url +="&dsModuleId=" + parent.document.getElementById("dsModuleId").value ;
	_url +="&datasourceId=" + datasourceId ;
	window.parent.document.getElementById("dsParamIframe").src =_url;

   
}

// 校验
function checkForm(){
	  var  form1 = document.getElementById('checkForm');
	  var  flag  = Validator.validate(form1, 3, "checkForm", "checkForm");	
      return flag;
	  
}
//获取用户选择的数据源
function getDataSourceId(){
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
//初始化
function init(){
	selectDs(getDataSourceId());
}
init();

