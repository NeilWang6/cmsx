/**
 * @author lusheng.linls
 * @usefor 运营工具平台 —— 公共头部 右侧区块
 * @date   2012.10.18
 */

;(function($, T) {
    var TIME_GAP=10*1000;
    var readyFun = [
    /**
    *  出现角色未选择的情况，尝试自动选择一个
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
    *  消息
    */
    function(){
        //消息点击
        $('#libra-msg').bind('click',function(e){
            $('#libra-unread-msg').css('display','none');
        });
        //定时查询消息未读数
        msgAjax();
    },
    /**
    * 帮助
    */
    function(){
        $.use('web-alitalk', function() {
            FE.util.alitalk('.libra-js-alitalk', {
                onRemote : function(data) {
                    //var el = $(this);
                    //el.html(data.id);
                },
                onSuccess : function(){
                    //用于修复旺旺插件会使页面底部多出一个空白行
                    $('embed[type="application/ww-plugin"]').css('display','none');
                }
            });
        });
    }];
    //定时查询消息
    var msgAjax=function(){
        var unreadMsg=$('#libra-unread-msg'),
        unreadCountUrl = unreadMsg.data('unread-count-url');

        $.ajax(unreadCountUrl, {
            dataType: 'jsonp',
            error : function(jqXHR, textStatus, errorThrown) {
                //未读消息条数读不到时忽略
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