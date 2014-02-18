package com.apachecms.cmsx.auth.context.model;


import com.apachecms.cmsx.auth.context.UserContext;
import com.apachecms.cmsx.auth.context.UserContextModel;

/**
 * 类SubUserContext.java的实现描述：子帐号session信息对应的threadLocal
 *  
 */
public class SubUserContextModel extends UserContextModel implements UserContext {

    /**
     * 帐号id
     */
    private String accountId;

    @Override
    public String getAccountId() {
        return accountId;
    }

    @Override
    public void setAccountId(String accountId) {
        this.accountId = accountId;

    }

    @Override
    public boolean isSubAccount() {
        return true;
    }

    @Override
    public boolean isTP() {
        return false;

    }

}
