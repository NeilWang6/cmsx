/**
 *  ����Ȩ�� �ⲿ���ýӿ�
 */

;(function($, D) {
    var readyFun = [
    function() {
        var applyPermission = $('#apply_permission');
        applyPermission.attr('title','��ʾ���༭��ҳ���ģ����������༭��Ա�������ԱȨ��');
        applyPermission.bind('click', function(event) {
            event.preventDefault();
            var $self = $(this), value = $self.data('value');
            $.post(D.domain + '/admin/add_apply_permission.html?_input_charset=UTF8', value, function(json) {
                // console.log(json);
                jAlert(json);
            }, 'json');

        });
    }];
    var jAlert = function(json) {
        if(json) {
            if(json.status === 'success') {
                alert('�ύ����ɹ�,����ܹ��󣬻���������ʾ��');
                window.location.reload();
            } else {
                alert('�ύ����ʧ�ܣ�');
            }

        }
    };
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

})(dcms, FE.dcms);
