package com.apachecms.cmsx.auth.constants;

public class UserAuthenticationContextConstants {

    /************************ key name *************************/
    // 登录id
    public static String       LOGIN_ID            = "login_id";

    // 会员id
    public static String       MEMBER_ID           = "m_id";

    // 主帐号会员id
    public static final String VACCOUNT_ID         = "v_id";

    // 帐号id
    public static final String ACCOUNT_ID          = "a_id";

    // 会员md5密码
    public static String       MD5_PASSWORD        = "_PWD_";

    // 会员类型
    public static String       MEMBER_LEVEL        = "m_level";
  
    // 是否登录
    public static String       LOGINED             = "logined";

    // 时间戳
    public static String       TIMESTAMP           = "ts";

    // cookie 有效期,单位为秒 24 * 60 * 60
    public static final long   COOKIE_VALIDITY     = 86400;

    public static String       USER_ID             = "user_id";
}
