/**
 * User Switched Notify
 * ����¼�û������仯ʱ��֪ͨ�ⲿ
 * @author hua.qiuh
 */
/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/
define('sys/common/user-switching-notify-amd',['jquery','lofty/alicn/subcookie/1.0/subcookie','lofty/alicn/aliuser/1.0/aliuser'],function($,SC,AliUser){
	/**
     * ԭ���� subcookie �ж���洢һ���ֶ�
     * lastlogonid������������һ�ε�¼���û�
     * ������loginId��lastlogonid�Աȣ������һ��
     * ��˵���û��ʺű仯��
     */
	var KEY_NAME = 'lastlogonid';
	var self;
	var main = {
		init: function(){
            self.check();
        },

        check: function(){
            var lastUser = getLastUser(),
                curUser = getCurUser();

            if( hasUserChanged(lastUser, curUser) ) {
				AliUser.getLoginInfoFromTaobao().done(function(data){
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

            if( curUser ) {
                flushLastUser( curUser );
            }
        }
	}
	self = main;
	function getLastUser() {
        return SC.get( KEY_NAME );
    }

    function getCurUser() {
        return AliUser.getLoginId();
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
        SC.set(KEY_NAME, user);
      
    }

    $(function(){
       main.init();
    });
	return null;
})
