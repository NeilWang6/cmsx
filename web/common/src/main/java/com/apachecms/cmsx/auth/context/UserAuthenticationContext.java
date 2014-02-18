package com.apachecms.cmsx.auth.context;

import java.util.HashMap;
import java.util.Map;

import com.apachecms.cmsx.auth.context.enums.ContextModelEnum;
import com.apachecms.cmsx.auth.context.model.AdminUserContextModel;
public class UserAuthenticationContext {

    private static final long             serialVersionUID = 8451462952035453973L;

    /**
     * 存放各种模型的map
     */
    private Map<ContextModelEnum, Object> modelMap         = new HashMap<ContextModelEnum, Object>();

    /**
     * 用户session中对应信息
     */
    private UserContext                   userContext;

    /**
     * 是否需要重写session
     */
    private boolean                       touch;

    public boolean isTouch() {
        return touch;
    }

    public void setTouch(boolean touch) {
        this.touch = touch;
    }

    public Object getModel(ContextModelEnum contextModelEnum) {
        return modelMap.get(contextModelEnum);
    }

    public void setModel(ContextModelEnum contextModelEnum, Object model) {

        modelMap.put(contextModelEnum, model);
    }

    public UserContext getUserContext() {
        if (userContext == null) {
            return new AdminUserContextModel();
        }
        return userContext;
    }

    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    public String getLoginId() {
        return getUserContext().getLoginId();
    }

    public String getMemberId() {
        return getUserContext().getMemberId();
    }

    public boolean isAuthenticated() {
        return getUserContext().isAuthenticated();
    }

    public boolean isSubAccount() {

        return getUserContext().isSubAccount();
    }

    public boolean isTP() {
        return getUserContext().isTP();

    }

    public String getAccountId() {
        return getUserContext().getAccountId();
    }

    public String getPassword() {
        return getUserContext().getPassword();
    }

    public String getTimeStamp() {
        return getUserContext().getTimeStamp();
    }

    public String getVaccountId() {
        if (isSubAccount()) {
            return getUserContext().getMemberId();
        } else {
            return ((AdminUserContextModel) getUserContext()).getVaccountId();
        }
    }
    
    public long getUserId() {
        return getUserContext().getUserId();
    }

    public void clearModels() {
        modelMap.clear();
    }

    /** 设置认证状态，并且根据notifyTouch通知对象修改过 */
    public void setAuthenticated(boolean authenticated, boolean notifyTouch) {
        this.getUserContext().setAuthenticated(authenticated);
        if (notifyTouch) {
            touch = notifyTouch;
        }
    }

}
