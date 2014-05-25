/**
 * author lusheng.linls
 * date 2012-7.17
 */
(function($, pitaya) {
$(document).ready(function(){
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
            $('#submit-join').live("click", function(e) {
                e.preventDefault();
                var arrFlash = [], strFlash;
                $('.form-content').find('.del').each(function(i, elc) {
                    arrFlash.push($(elc).data('imgurl'));
                });
                strFlash = arrFlash.join('|');
                if(!strFlash){
                    //alert("请选择文件，并上传");
                    //return;
                }
                var certCommentNew = $.trim($("#certCommentNew").val());
                if(certCommentNew === '' || certCommentNew.length > 500) {
                    alert("请填写小于等于500字的备注");
                    return;
                }
                $('input[name=filePaths]').val(strFlash);
                $('input[name=certComment]').val(certCommentNew);
                
                $('#submit-join-pre').click();
                window.open("http://athena.1688.com/athena/list_certificate.htm?tracelog=work_4_m_mycertificateTp");
            });
            $('#submit-join-confirm').live("click", function(e) {
                var formInput = [];
                $('.form-content').find('.form-param').each(function(i, elc) {
                    formInput.push($(elc).attr('name')+'='+$(elc).val());
                });
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
                             alert("很抱歉，系统出现异常。请稍候报名");
                         }
                      },
                      error:function(){
                          alert("页面超时，请重试");
                      }
                    });
            });
        }
    };

    define('flash', flash);
    register('flash');
    define('submitForm', submitForm);
    register('submitForm');
    
    /* dialog 详细参考 fdev4 浮层组件 */
    $.use('ui-core,ui-draggable,ui-dialog', function(){
        $('#submit-join-pre').click(function(){
            $('#dialog-submit-join-pre').bind('dialogbefore', function(){
                //$.log('custom before');
            }).dialog({
                modalCss: {
                    backgroundColor: '#fff'
                },
                draggable: {
                    handle: 'div.dpl-t'
                },
                fadeOut: 200,
                shim: true,
                center: true
            });
        });
        $('a.dpl-close,#submit-join-close').click(function(){
            $(this).closest('div.dpl-dialog').dialog('close');
        });                     
    });            
});
})(jQuery, FE.operation.pitaya);
