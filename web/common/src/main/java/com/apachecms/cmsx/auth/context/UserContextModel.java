package com.apachecms.cmsx.auth.context;

public abstract class UserContextModel implements UserContext {
    
    /**
     * 淘宝userid
     */
    private   long    userId;
    
    /**
     * 会员id
     */
    protected String  memberId;

    /**
     * 登录id
     */
    protected String  loginId;

    /**
     * 是否验证通过
     */
    protected boolean authenticated;

    /**
     * md5密码
     */
    protected String  password;

    /**
     * 登录时间
     */
    protected String  timeStamp;

    @Override
    public String getLoginId() {
        return loginId;
    }

    @Override
    public String getMemberId() {
        return memberId;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAuthenticated() {
        return authenticated;
    }

    @Override
    public void setAuthenticated(boolean authenticated) {
        this.authenticated = authenticated;

    }

    @Override
    public void setLoginId(String loginId) {
        this.loginId = loginId;
    }

    @Override
    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    @Override
    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String getTimeStamp() {
        return timeStamp;
    }

    @Override
    public void setTimeStamp(String timeStamp) {
        this.timeStamp = timeStamp;
    }

    @Override
    public long getUserId() {
        return userId;
    }

    @Override
    public void setUserId(long userId) {
        this.userId = userId;
    }

}
