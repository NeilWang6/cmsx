package com.apachecms.cmsx.auth.constants;

/**
 * 类HttpSessionConstants.java的实现描述：网站session相关常量定义类
 * 
 * @author minhui.dengmh 2011-12-5 下午02:46:09
 */
public interface HttpSessionConstants {

	/************************ session name *************************/

	// session认证信息，全站共用
	String COOKIE_TEMP_CLIENT_DATA = "cn_tmp";

	// 子账号session认证信息，子账号登录时使用
	String COOKIE_USER_CLIENT_DATA = "cn_user";

	// 一旦登录就保存登录过的用户ID
	String LAST_LOGIN_ID = "__last_loginid__";

	// 一旦登录就保存登录过的用户memberId
	String LAST_MID = "last_mid";

	// last_loginId加密sessionId
	String SEC_LAST_LOGIN_ID = "_cn_slid_";

	// Member Special Sign
	String MEMBER_SPECIAL_SIGN = "__member_special_sign__";

	// 绿色通道
	String USER_SESSION_GCHANNEL = "__gco__";
	// 渠道服务包
	String CS_GREEN_CHANNEL = "__cgc__";

	// 淘宝的sessionid，打通项目新增的
	String TB_SESSION_ID = "tbsid";

	// 记录淘宝登录的用户uid，打通项目新增的,为了兼容udb逻辑
	String TB_ORIGIN_USERID = "ouid";

	// 中文站局部登录标志
	String CBU_LOCAL_LOGIN_FLAG = "local_l";

	// 最后一次访问淘宝session的时间
	String LAST_ACCESS_TBSESSION_TIME = "la_tbt";

}
