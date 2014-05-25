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
                    text = "页面";
                
                if (type === "T") {
                    text = "模板";
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
                            content = text + "取消收藏成功";
                            _this.text('收藏').addClass('off-made').removeClass('on-made');
                        } else if ( data.requestStatus === "error" ) {
                            content = "系统错误，请联系管理员";
                        }
                        
                        D.Message.confirm(confirmEl, {
                            msg: content,
                            title: '我的收藏夹'
                        });
                    }
                })
                .fail(function() {
                    D.Message.confirm(confirmEl, {
                        msg: text + '取消收藏失败',
                        title: '我的收藏夹'
                    });
                });
            });
            
            addCustomMade.live('click', function(e) {
                e.preventDefault();
                
                var _this = $(this),
                    customId = _this.data('custom-id'),
                    type = _this.data('type') || 'P',
                    text = "页面";
                
                if (type === "T") {
                    text = "模板";
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
                            content = "对不起,这个"+ text +"你已经收藏了";
                        } else if ( data.requestStatus === "sucess" ) {
                            content = text + "收藏成功";
                            _this.text('取消收藏').addClass('on-made').removeClass('off-made');
                        } else if ( data.requestStatus === "error" ) {
                            content = "系统错误，请联系管理员";
                        }
                        
                        D.Message.confirm(confirmEl, {
                            msg: content,
                            title: '我的收藏夹'
                        });
                    }
                })
                .fail(function() {
                    D.Message.confirm(confirmEl, {
                        msg: text + '收藏失败',
                        title: '我的收藏夹'
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