/**
 *  申请权限 外部调用接口
 */

;(function($, D) {
    var readyFun = [
    function() {
        var applyPermission = $('#apply_permission');
        applyPermission.attr('title','提示：编辑此页面或模版请先申请编辑人员或审核人员权限');
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
                alert('提交申请成功,审核能过后，会有旺旺提示！');
                window.location.reload();
            } else {
                alert('提交申请失败！');
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
