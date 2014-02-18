package com.apachecms.cmsx.auth.access;

/**
 * 
 * @author zhengqinming
 *
 */
public interface AccessService {

    public String getUrlEscaped();

    public String getRole();

    public String getDenyRedirectUrl();

    public String getLoginUrl();

    public boolean isLogin();

}
