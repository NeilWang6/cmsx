/**
 * author lusheng.linls
 * date 2012-7.17
 */
(function($, pitaya) {
    var define = pitaya.define, register = pitaya.register;

    var flash = {
        init : function(require, exports) {
            $('#upload-files').uploader({
                numLimit : 10
            });
        }
    };
    var submitForm = {
        init : function(require, exports) {
            var submitJoin = $('#submit-join');
            submitJoin.live("click", function(e) {
                e.preventDefault();
                 
                if($('input[name=needUploadFile]').val().trim() !== 'n,'){
	                	var arrFlash = [], strFlash;
		                $('.form-content').find('.del').each(function(i, elc) {
		                    arrFlash.push($(elc).data('imgurl'));
		                });
		                strFlash = arrFlash.join('|');
		                if(!strFlash){
		                    alert("��ѡ���ļ������ϴ�");
		                    return;
		                }
		                $('input[name=filePaths]').val(strFlash);
                }
                var formInput = [];
                formInput.push('_csrf_token='+$('input[name=_csrf_token]').val());
                $('.form-content').find('.form-param').each(function(i, elc) {
                    formInput.push($(elc).attr('name')+'='+$(elc).val());
                });
				var radiovalue= $('input:radio[name=proAndGroupSale]:checked').val(); 
				if(radiovalue!=null){
					formInput.push("proAndGroupSale"+'='+$('input[name=proAndGroupSale]:checked').val());
				}
                $.ajax({
                       timeout: 15000,
                       cache:false,
                       url: $('#new-content').data('submiturl'),
                       type: 'POST',
                       data: formInput.join('&'),
                       success: function(data) {
                         if(!data.error){
                             window.location.href=$('#new-content').data('jumpurl');
                         }else{
                             alert("ҳ�泬ʱ��������");
                         }
                      },
                      error:function(){
                          alert("ҳ�泬ʱ��������");
                      }
                    });
            });
            //�Զ��ύ
            if($('input[name=needUploadFile]').val().trim() === 'n,' && $('input[name=hidWeiBo]').val().trim() === ''){
              submitJoin.click();
            }else{
              $('body').css('display','inline');
            }

        }
    };

    define('flash', flash);
    register('flash');
    define('submitForm', submitForm);
    register('submitForm');

})(jQuery, FE.operation.pitaya);

function shareActivity(){ 				
		if(document.getElementById("activitysharingtemp").checked){
			document.getElementById("jointopic").value = "y";
		}else{
			document.getElementById("jointopic").value = "n";
		}
}
