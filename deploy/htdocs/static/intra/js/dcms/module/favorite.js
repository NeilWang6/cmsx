/**
 * @package FD.app.cms.favorite
 * @date: 2011-10-08
 */
(function($, D){
    var confirmEl = $('#dcms-message-confirm');

    var readyFun = [
        function() {
            var delCustomMade = $('.on-made'),
                addCustomMade = $('.off-made');
            
            delCustomMade.live('click', function(e) {
                e.preventDefault();
                
                var _this = $(this),
                    customId = _this.data('custom-id'),
                    type = _this.data('type') || 'P',
                    text = "ҳ��";
                
                if (type === "T") {
                    text = "ģ��";
                }
                
                $.ajax({
                    url: D.domain + "/page/favorite/favorite_del_page_screen.html",
                    data: {
                        "numId" : customId,
                        "type" : type
                    },
                    type: "POST"
                })
                .done(function(o) {
                    if (!!o) {
                        var data = $.parseJSON(o),
                            content = '';
                        
                        if ( data.requestStatus === "sucess" ) {
                            content = text + "ȡ���ղسɹ�";
                            _this.text('�ղ�').addClass('off-made').removeClass('on-made');
                        } else if ( data.requestStatus === "error" ) {
                            content = "ϵͳ��������ϵ����Ա";
                        }
                        
                        D.Message.confirm(confirmEl, {
                            msg: content,
                            title: '�ҵ��ղؼ�'
                        });
                    }
                })
                .fail(function() {
                    D.Message.confirm(confirmEl, {
                        msg: text + 'ȡ���ղ�ʧ��',
                        title: '�ҵ��ղؼ�'
                    });
                });
            });
            
            addCustomMade.live('click', function(e) {
                e.preventDefault();
                
                var _this = $(this),
                    customId = _this.data('custom-id'),
                    type = _this.data('type') || 'P',
                    text = "ҳ��";
                
                if (type === "T") {
                    text = "ģ��";
                }
                
                $.ajax({
                    url: D.domain + "/page/favorite/favorite_add_page_screen.html",
                    data: {
                        "numId" : customId,
                        "type" : type
                    },
                    type: "POST"
                })
                .done(function(o) {
                    if (!!o) {
                        var data = $.parseJSON(o),
                            content = '';
                        
                        if ( data.requestStatus === "pageExist" ) {
                            content = "�Բ���,���"+ text +"���Ѿ��ղ���";
                        } else if ( data.requestStatus === "sucess" ) {
                            content = text + "�ղسɹ�";
                            _this.text('ȡ���ղ�').addClass('on-made').removeClass('off-made');
                        } else if ( data.requestStatus === "error" ) {
                            content = "ϵͳ��������ϵ����Ա";
                        }
                        
                        D.Message.confirm(confirmEl, {
                            msg: content,
                            title: '�ҵ��ղؼ�'
                        });
                    }
                })
                .fail(function() {
                    D.Message.confirm(confirmEl, {
                        msg: text + '�ղ�ʧ��',
                        title: '�ҵ��ղؼ�'
                    });
                });
            });
        }
    ];
    
    $(function(){
         for (var i = 0, l = readyFun.length; i < l; i++) {
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