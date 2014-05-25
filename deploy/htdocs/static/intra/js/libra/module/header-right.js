/**
 * @author lusheng.linls
 * @usefor ��Ӫ����ƽ̨ ���� ����ͷ�� �Ҳ�����
 * @date   2012.10.18
 */

;(function($, T) {
    var TIME_GAP=10*1000;
    var readyFun = [
    /**
    *  ���ֽ�ɫδѡ�������������Զ�ѡ��һ��
    */
    function(){
        var roleunset=$('.libra-js-role-unset');
        if(roleunset.length!=0){
            var href=$(roleunset.closest('.libra-account-detail').find('.libra-backup')[0]).attr('href');
            if(href){
                window.location.href=href;
            }
        }
    },
    /**
    *  ��Ϣ
    */
    function(){
        //��Ϣ���
        $('#libra-msg').bind('click',function(e){
            $('#libra-unread-msg').css('display','none');
        });
        //��ʱ��ѯ��Ϣδ����
        msgAjax();
    },
    /**
    * ����
    */
    function(){
        $.use('web-alitalk', function() {
            FE.util.alitalk('.libra-js-alitalk', {
                onRemote : function(data) {
                    //var el = $(this);
                    //el.html(data.id);
                },
                onSuccess : function(){
                    //�����޸����������ʹҳ��ײ����һ���հ���
                    $('embed[type="application/ww-plugin"]').css('display','none');
                }
            });
        });
    }];
    //��ʱ��ѯ��Ϣ
    var msgAjax=function(){
        var unreadMsg=$('#libra-unread-msg'),
        unreadCountUrl = unreadMsg.data('unread-count-url');

        $.ajax(unreadCountUrl, {
            dataType: 'jsonp',
            error : function(jqXHR, textStatus, errorThrown) {
                //δ����Ϣ����������ʱ����
                setTimeout(msgAjax, TIME_GAP);
                return;
            },
            success: function(data){
                if(data.hasError == false){
                    var count = parseInt(data.content);
                    if(count>0){
                          if(count>99){
                            unreadMsg.html("99+");
                          }else{
                            unreadMsg.html(data.content);
                          }
                          unreadMsg.css('display','inline-block');
                     }else{
                        unreadMsg.css('display','none');
                     }
              }
              setTimeout(msgAjax, TIME_GAP);
            }
          });
     }

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
})(jQuery, FE.tools);