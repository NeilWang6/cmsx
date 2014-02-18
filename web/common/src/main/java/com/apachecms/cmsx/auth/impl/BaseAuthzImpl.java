package com.apachecms.cmsx.auth.impl;

import com.apachecms.cmsx.auth.BaseAuthz;
import com.apachecms.cmsx.auth.context.AuthSecureContextHolder;

/**
 * 类BaseAuthzImpl.java的实现描述：baseAuthz接口实现
 *  
 */
public class BaseAuthzImpl implements BaseAuthz {

    @Override
    public String getLoginId() {
        return AuthSecureContextHolder.getContext().getLoginId();
    }

    @Override
    public String getMemberId() {
        return AuthSecureContextHolder.getContext().getMemberId();
    }

    @Override
    public boolean isLogin() {
        return AuthSecureContextHolder.getContext().isAuthenticated();
    }

    @Override
    public boolean isSubAccount() {
        return AuthSecureContextHolder.getContext().isSubAccount();
    }

    @Override
    public String getAccountId() {
        return AuthSecureContextHolder.getContext().getAccountId();
    }
    
    @Override
    public long getUserId() {
        return AuthSecureContextHolder.getContext().getUserId();
    }

}
