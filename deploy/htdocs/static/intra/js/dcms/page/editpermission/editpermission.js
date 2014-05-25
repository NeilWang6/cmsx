/**
 * @package FD.app.cms.rule.create
 * @author: hongss
 * @Date: 2011-09-19
 */

;(function($, D) {
    var readyFun = [
    function() {
        $('#button').bind('click',function(e){
           e.preventDefault();
            var url = D.domain + '/admin/edit_perm.html?_input_charset=UTF8';
                   // console.log($.param({'permCode':$('#permCode').val(),'desc':$('#description').val()}));
           $.ajax({
                url : url,
                type : "POST",
                data : $.param({'permCode':$('#permCode').val(),'permId':$('#permId').val(),'desc':$('#description').val()}),
                async : false,
                success : function(_data) {
                    var self = this, json;
                    json = $.parseJSON(_data);
                     if (json.status==='success'){
                            alert('保存成功！');
                         return;
                     }
                     if (json.status==='repeat'){
                         alert('重复代码');
                         return;
                     }
                     if (json.status==='fail'){
                            alert('保存失败');
                         return;
                     }
                     
                },
                error : function(jqXHR, textStatus, errorThrown) {
                    alert("连接超时请重试！");
                }
            });
        });
    }];

    $(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });

})(dcms, FE.dcms);
