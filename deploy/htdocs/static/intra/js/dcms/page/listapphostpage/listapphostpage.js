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
                            content = "同步成功";
                        } else if ( data.success == false ) {
                            content = "系统错误，请联系管理员";
                        }
                        D.Message.confirm(confirmEl, {
                            msg: content,
                            title: '模板同步'
                        });
                    }
                })
                .fail(function() {
                    D.Message.confirm(confirmEl, {
                        msg: '同步失败',
                        title: '模板同步'
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
                            content = "更新成功，稍后刷新可看到最新版本信息";
                        } else if ( data.success == false ) {
                            content = "系统错误，请联系管理员";
                        }
                        D.Message.confirm(confirmEl, {
                            msg: content,
                            title: '更新版本信息'
                        });
                    }
                })
                .fail(function() {
                    D.Message.confirm(confirmEl, {
                        msg: '更新失败',
                        title: '更新版本信息'
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
