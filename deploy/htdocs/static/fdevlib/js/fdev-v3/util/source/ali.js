/**
 * FD.Ali
 *
 * 阿里巴巴相关操作集合
 * 限制：必须包含core/fdev.js文件
 *
 * @author  leijun<leijun.wulj@alibaba-inc.com>
 * @update Denis checkLogin checkUser使用框架提供的API; 
 * 2010-06-24
 */

FD.Ali = function() {
	var epl = FDEV.env.ua.ie;
	return{
		/**
		 * 判断是否安装了阿里旺旺，只在IE中有效
		 * @method checkAliTalk
		 * @return {boolean} 安装返回 true；未安装返回 false
		 */		
		checkAliTalk: function(){
			if (!epl) return false;		//无法判断的情况下默认没有安装
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
		 * 判断是否安装了阿里工具条，只在IE中有效
		 * @method checkAliTool
		 * @return {boolean} 安装返回 true；未安装返回 false
		 */	
		checkAliTool: function(){
			if (!epl) return false;		//无法判断的情况下默认没有安装
			try {
				var tool = new ActiveXObject("YAliALive.Live");
			} catch (e) { return false;}
			return true;
		},
		
		/**
		 * 判断是否登录
		 * @method checkLogin
		 * @return 登录返回 id；未登录返回 false
		 */
		checkLogin: function(){
			return FD.common.isLogin;
		},
		
		/**
		 * 判断是否是老用户（是否曾经登录过）
		 * @method checkUser
		 * @return 老用户返回 id；新用户返回 false
		 */
		checkUser: function(){
			return FD.common.lastLoginId || false;
		}
	}
}();