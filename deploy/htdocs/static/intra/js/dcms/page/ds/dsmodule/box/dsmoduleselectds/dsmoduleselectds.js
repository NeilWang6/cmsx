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
		document.getElementById("dsModuleId").value =  parent.document.getElementById("dsModuleId").value ;
        searchPageForm.submit();
    }
 })(dcms, FE.dcms);

// ѡ������Դ
function selectDs(datasourceId){
	var _action = "ds_module_action";
	// Ϊ�˸���̬ģ��ʹ�ã����������������
	if( undefined != parent.document.getElementById("dsAction") && null != parent.document.getElementById("dsAction")){
		_action = parent.document.getElementById("dsAction").value;
	}
	var _url = FE.dcms.domain +  "/page/ds/box/dsModuleSetParam.html?action="+_action+"&event_submit_do_show_ds_param=true";
	_url +="&dsModuleId=" + parent.document.getElementById("dsModuleId").value ;
	_url +="&datasourceId=" + datasourceId ;
	window.parent.document.getElementById("dsParamIframe").src =_url;

   
}

// У��
function checkForm(){
	  var  form1 = document.getElementById('checkForm');
	  var  flag  = Validator.validate(form1, 3, "checkForm", "checkForm");	
      return flag;
	  
}
//��ȡ�û�ѡ�������Դ
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
//��ʼ��
function init(){
	selectDs(getDataSourceId());
}
init();

