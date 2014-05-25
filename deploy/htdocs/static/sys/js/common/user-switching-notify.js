/**
 * User Switched Notify
 * ����¼�û������仯ʱ��֪ͨ�ⲿ
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
     * ԭ���� subcookie �ж���洢һ���ֶ�
     * lastlogonid������������һ�ε�¼���û�
     * ������loginId��lastlogonid�Աȣ������һ��
     * ��˵���û��ʺű仯��
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

                //TODO: ������ȥ������������ж�
                if('getLoginInfoFromTaobao' in FE.util) {
                    FE.util.getLoginInfoFromTaobao().done(function(data){
                        if( isTaobaoUser( data ) && 
                            /**
                             * @date 2012-09-20
                             * ����һ���ж��Ա���B2B��¼�û��Ƿ�һ�µ��߼�
                             * ԭ����ĳЩ�����£����ڹ��ⲻ��ͨ�����󣬼���
                             * ����B2B�ĵ�ǰ�û�����ͬ����Щ��������������
                             * ���ڣ�
                             *   1. B2B���ʺŵ�¼
                             *   2. ��ɫͨ��
                             *   3. ����ƽ̨��¼
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
