package com.apachecms.cmsx.auth;

public interface BaseAuthz {

    /**
     * 是否登录用户
     */
    public boolean isLogin();

    /**
     * 获取memberId<br/>
     */
    public String getMemberId();

    /**
     * 获取loginId
     */
    public String getLoginId();

    /**
     * 获取accountId
     */
    public String getAccountId();

    /**
     * 判断当前帐号是多帐号并且非admin帐号:<br/>
     * 注意：<br/>
     * true,是子帐号<br/>
     * false，非子帐号或未登录<br/>
     */
    public boolean isSubAccount();
    
    /**
     * 获取userId
     */
    public long getUserId();

}

