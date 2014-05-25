/**
 * @package FD.app.cms.rule.create
 * @author: hongss
 * @Date: 2011-09-19
 */
;(function($, D) {
    var readyFun = [
    function() {
        $('a.delete-perm').bind('click',function(e){
           e.preventDefault();
            var url = D.domain + '/admin/delete_permission.html?_input_charset=UTF8',self = $(this);
            var id = self.data('id');
           $.ajax({
                url : url,
                type : "POST",
                data : $.param({'permId':id}),
                async : false,
                success : function(_data) {
                    var self = this, json;
                    json = $.parseJSON(_data);
                     if (json.status==='success'){
                            alert('ɾ���ɹ���');
                            window.location.reload();
                         return;
                     }
                     if (json.status==='repeat'){
                         alert('�ظ�����');
                         return;
                     }
                     if (json.status==='fail'){
                            alert('����ʧ��');
                         return;
                     }
                     
                },
                error : function(jqXHR, textStatus, errorThrown) {
                    alert("���ӳ�ʱ�����ԣ�");
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
