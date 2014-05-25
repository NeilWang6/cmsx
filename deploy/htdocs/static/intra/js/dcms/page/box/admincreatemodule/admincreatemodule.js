/**
 * @author springyu
 */
;(function($, D) {

    var readyFun = [// �ָ�ҳ������
    function() {
        if($('#moduleId').val()) {
            var txtArea = $('#module-content');

            if(txtArea.val()) {

                var html = txtArea.val().replace(/data-boxoptions\s*=\s*([\"])([^"]*)\"/gi, function(s, g1, g2) {
                    return "data-boxoptions='" + g2.replace(/&quot;/g, "\"") + "'";
                });
                txtArea.val(html);
            }
        }
    },
    function() {
        $('#moduleBtn').bind('click', function(event) {
            event.preventDefault();
            // event.stopPropagation();
            $.post(D.domain + '/page/box/update_module.html?_input_charset=UTF8', $('#modifyModuleForm').serialize(), function(json) {
                console.log(json);
                console.log(99);
                if(json) {
                    if(json.status === 'success') {
                        alert('����ɹ���');
                    }
                    if(json.status === 'fail') {
                        alert('ϵͳ������������Ч��id!');
                    }
                    return;
                }
            },'json');
            return;
        });
    }];

    $(function() {
        $.each(readyFun, function(i, fn) {
            try {
                fn();
            } catch (e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            }
        });
    });

})(dcms, FE.dcms);
