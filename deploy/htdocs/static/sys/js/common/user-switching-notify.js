/**
 * User Switched Notify
 * 当登录用户发生变化时，通知外部
 * @author hua.qiuh
 */
/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/
(function($){

    if('UserSwNotify' in FE.util){
        return;
    }

    $.namespace('FE.util.UserSwNotify');

    /**
     * 原理：在 subcookie 中额外存储一个字段
     * lastlogonid，用来记忆上一次登录的用户
     * 将本次loginId和lastlogonid对比，如果不一致
     * 则说明用户帐号变化了
     */
    var KEY_NAME = 'lastlogonid';

    var FUU = FE.util.UserSwNotify,
        self = FUU;

    $.extend( FUU, {

        init: function(){
            self.check();
        },

        check: function(){
            var lastUser = getLastUser(),
                curUser = getCurUser();

            if( hasUserChanged(lastUser, curUser) ) {

                //TODO: 发布后去掉这个向后兼容判断
                if('getLoginInfoFromTaobao' in FE.util) {
                    FE.util.getLoginInfoFromTaobao().done(function(data){
                        if( isTaobaoUser( data ) && 
                            /**
                             * @date 2012-09-20
                             * 增加一个判断淘宝和B2B登录用户是否一致的逻辑
                             * 原因是某些场景下，存在故意不打通的现象，即淘
                             * 宝和B2B的当前用户不相同。这些场景包含但不仅
                             * 限于：
                             *   1. B2B子帐号登录
                             *   2. 绿色通道
                             *   3. 开放平台登录
                             */
                            isTBUserSameAsB2BUser(data)) {

                            notify( data );
                        }
                    });
                }
            }

            if( curUser ) {
                flushLastUser( curUser );
            }
        }
    });

    function getLastUser() {
        return $.util.subCookie( KEY_NAME );
    }

    function getCurUser() {
        return FE.util.LoginId();
    }

    function hasUserChanged( last, cur ) {
        return last && last !== cur;
    }

    function isTaobaoUser( info ) {
        return !!info['nick'];
    }

    function isTBUserSameAsB2BUser( info ) {
        return info['__cn_logon_id__'] == getCurUser();
    }

    function notify( info ) {
        $(window).trigger('userSwitchedToTB', [info]);
    }

    function flushLastUser( user ) {
        $.use('util-cookie', function(){
            $.util.subCookie(KEY_NAME, user);
        });
    }

    $(function(){
        FE.util.UserSwNotify.init();
    });

})(jQuery);
