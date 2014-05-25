/**
 * ���ģ�����
 * @author: qingguo.yanqg
 * @createTime: 2011-10-10
 * @lastModified: 2011-10-10
 */
(function ($, D) {
    var cmsdomain = D.domain;
    var confirmEl = $('#dcms-message-confirm');
    var readyFun = [
        function() {
            $('.dcms-page-btn').click(function(e) {
                e.preventDefault();
                var page = $(this).data('page');
                $('#page-index').val(page);
		$('#listApp').submit();
            });
        },
        function() {
            var btSync = $('.bt-sync-all');
            btSync.live('click', function(e) {
                e.preventDefault();
                var _this = $(this);
                var param = _this.data('param');
                $.ajax({
                    url: D.domain + "/page/appCommand.html?" + param,
                    type: "GET"
                })
                .done(function(o) {
                    if (!!o) {
                        var data = $.parseJSON(o);
                        var content = '';
                        if ( data.success == true ) {
                            content = "ͬ���ɹ�";
                        } else if ( data.success == false ) {
                            content = "ϵͳ��������ϵ����Ա";
                        }
                        D.Message.confirm(confirmEl, {
                            msg: content,
                            title: '����ͬ��ģ��'
                        });
                    }
                })
                .fail(function() {
                    D.Message.confirm(confirmEl, {
                        msg: 'ͬ��ʧ��',
                        title: '����ͬ��ģ��'
                    });
                });
            });
        }
    ];
    
    $(function(){
        for (var i = 0, l = readyFun.length; i<l; i++) {
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


     $('#dcms-add-app').click(function(e) {
                e.preventDefault();
                window.location.href = D.domain + '/page/add_app.html';
    });


})(dcms, FE.dcms);
