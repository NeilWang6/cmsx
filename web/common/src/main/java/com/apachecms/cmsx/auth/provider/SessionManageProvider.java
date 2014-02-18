package com.apachecms.cmsx.auth.provider;


import javax.servlet.http.HttpSession;

import com.apachecms.cmsx.auth.context.UserAuthenticationContext;

/**
 * 类SessionManageProvider.java的实现描述：session管理接口
 *  
 */
public interface SessionManageProvider {

    /**
     * 将session中对应内容读入到context中
     * 
     * @param session
     * @return
     */
    public UserAuthenticationContext parseSession(HttpSession session);

    /**
     * 将context中对应内容写入session
     * 
     * @param usr
     * @param session
     */
    public void writeSession(UserAuthenticationContext usr, HttpSession session);

}

