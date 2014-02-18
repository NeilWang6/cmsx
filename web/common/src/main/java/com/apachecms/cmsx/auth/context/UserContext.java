package com.apachecms.cmsx.auth.context;

public interface UserContext {

    /**
     * 获取memberId
     */
    public String getMemberId();

    /**
     * 设置memberId
     */
    public void setMemberId(String memberId);

    /**
     * 获取accountId
     */
    public String getAccountId();

    /**
     * 设置accountId
     */
    public void setAccountId(String accountId);

    /**
     * 获取loginId
     */
    public String getLoginId();

    /**
     * 设置loginId
     */
    public void setLoginId(String loginId);

    /**
     * 获取md5Password
     */
    public String getPassword();

    /**
     * 设置md5Password
     */
    public void setPassword(String password);

    /**
     * 是否处于登录状态
     */
    public boolean isAuthenticated();

    /**
     * 设置登录状态
     */
    public void setAuthenticated(boolean authenticated);

    /**
     * 当前会员是否诚信通用户
     */
    public boolean isTP();

    /**
     * 是否子帐号
     */
    public boolean isSubAccount();

    /**
     * 获取登录时间
     */
    public String getTimeStamp();

    /**
     * 设置登录时间
     */
    public void setTimeStamp(String timeStamp);
    
    /**
     * 获取淘宝userId
     */
    public long getUserId();

    /**
     * 设置淘宝userId
     */
    public void setUserId(long userId);
}
