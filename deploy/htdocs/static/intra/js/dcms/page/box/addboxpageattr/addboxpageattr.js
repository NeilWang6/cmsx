/**
 * 属性模板demo
 */
;(function($, D) {

    var readyFun = [
    function() {
        $('#boxPageAttrBtn').bind('click', function() {
            var url = D.domain + '/page/box/insert_box_page_attr.html', data = {};
            $('input.attr-data').each(function(index, val) {
                data[$(this).attr('name')] = encodeURIComponent($(this).val());
            });
            $('textarea.attr-data').each(function(index, val) {
                data[$(this).attr('name')] = encodeURIComponent($(this).val());
            });
            $.post(url, data, function(o) {
                var retJson = $.parseJSON(o);
                if(retJson && retJson.status === 'success') {
                    if(window.confirm(retJson.msg + '清空表单请［确认］，否则［取消］')) {
                        $('input.attr-data').each(function(index, val) {
                            $(this).val('');
                        });
                        $('textarea.attr-data').each(function(index, val) {
                            $(this).val('');
                        });
                    }
                    return;
                } else {
                    alert(retJson.msg);
                    return;
                }
            });
        });
        $('#boxPageAttrBtnReset').bind('click', function() {
            $('input.attr-data').each(function(index, val) {
                $(this).val('');
            });
            $('textarea.attr-data').each(function(index, val) {
                $(this).val('');
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
