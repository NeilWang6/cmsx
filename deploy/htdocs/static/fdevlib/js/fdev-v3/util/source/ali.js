/**
 * FD.Ali
 *
 * ����Ͱ���ز�������
 * ���ƣ��������core/fdev.js�ļ�
 *
 * @author  leijun<leijun.wulj@alibaba-inc.com>
 * @update Denis checkLogin checkUserʹ�ÿ���ṩ��API; 
 * 2010-06-24
 */

FD.Ali = function() {
	var epl = FDEV.env.ua.ie;
	return{
		/**
		 * �ж��Ƿ�װ�˰���������ֻ��IE����Ч
		 * @method checkAliTalk
		 * @return {boolean} ��װ���� true��δ��װ���� false
		 */		
		checkAliTalk: function(){
			if (!epl) return false;		//�޷��жϵ������Ĭ��û�а�װ
			try {
				var ww5 = new ActiveXObject("Ali_Check.InfoCheck");
				return true;
			} catch (e) {}
			try {
				var ww6 = new ActiveXObject("aliimx.wangwangx");
				return true;
			} catch (e) {}
			return false;
		},
		/**
		 * �ж��Ƿ�װ�˰��﹤������ֻ��IE����Ч
		 * @method checkAliTool
		 * @return {boolean} ��װ���� true��δ��װ���� false
		 */	
		checkAliTool: function(){
			if (!epl) return false;		//�޷��жϵ������Ĭ��û�а�װ
			try {
				var tool = new ActiveXObject("YAliALive.Live");
			} catch (e) { return false;}
			return true;
		},
		
		/**
		 * �ж��Ƿ��¼
		 * @method checkLogin
		 * @return ��¼���� id��δ��¼���� false
		 */
		checkLogin: function(){
			return FD.common.isLogin;
		},
		
		/**
		 * �ж��Ƿ������û����Ƿ�������¼����
		 * @method checkUser
		 * @return ���û����� id�����û����� false
		 */
		checkUser: function(){
			return FD.common.lastLoginId || false;
		}
	}
}();