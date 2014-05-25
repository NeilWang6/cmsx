/**
 * @package FD.app.cms.search.page
 * @author: hongss
 * @Date: 2011-09-27
 */

 ;(function($, D){
    var confirmEl = $('#dcms-message-confirm');
    readyFun = [
         function() {
            var btSync = $('.bt-sync');
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
                            title: 'ģ��ͬ��'
                        });
                    }
                })
                .fail(function() {
                    D.Message.confirm(confirmEl, {
                        msg: 'ͬ��ʧ��',
                        title: 'ģ��ͬ��'
                    });
                });
            });
        },
	function() {
            var btSync = $('#dcms-update-version');
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
                            content = "���³ɹ����Ժ�ˢ�¿ɿ������°汾��Ϣ";
                        } else if ( data.success == false ) {
                            content = "ϵͳ��������ϵ����Ա";
                        }
                        D.Message.confirm(confirmEl, {
                            msg: content,
                            title: '���°汾��Ϣ'
                        });
                    }
                })
                .fail(function() {
                    D.Message.confirm(confirmEl, {
                        msg: '����ʧ��',
                        title: '���°汾��Ϣ'
                    });
                });
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
    
   
 })(dcms, FE.dcms);
