package com.apachecms.cmsx.auth.access;
import static com.apachecms.cmsx.auth.access.permission.constants.PermissionConstant.DELIM;
import static com.apachecms.cmsx.auth.access.permission.constants.PermissionConstant.STR_DELIM;
import com.alibaba.citrus.util.StringUtil;
import com.apachecms.cmsx.auth.access.roles.AccessRole;
import com.apachecms.cmsx.auth.context.AuthSecureContextHolder;
import com.apachecms.cmsx.auth.context.UserAuthenticationContext;

public abstract class AbstractAccessService implements AccessService {

    protected static final String DEFAULT_ACTION_PARAM_NAME = "action";
    protected static final String IMAGE_BUTTON_SUFFIX_1     = ".x";
    protected static final String IMAGE_BUTTON_SUFFIX_2     = ".y";
    protected static final String IMAGE_BUTTON_SUFFIX_3     = ".X";
    protected static final String IMAGE_BUTTON_SUFFIX_4     = ".Y";
    // 没有权限访问url
    protected static final String DENY_ACCESS_LINK          = "denyAccessLink";
    // 登录url
    protected static final String LOGIN_LINK                = "loginLink";
    protected String              actionParam               = DEFAULT_ACTION_PARAM_NAME;

    /**
     * 根据用户登录情况，返回对应的角色
     */
    @Override
    public String getRole() {
        UserAuthenticationContext context = AuthSecureContextHolder.getContext();
        if (context.isAuthenticated()) {
            if (context.isTP()) {
                return AccessRole.TP.name();
            } else if (context.isSubAccount()) {
                return AccessRole.EMPLOYEE.name();
            } else {
                return AccessRole.FREE.name();
            }
        }
        return null;
    }

    @Override
    public boolean isLogin() {
        UserAuthenticationContext context = AuthSecureContextHolder.getContext();
        return context.isAuthenticated();
    }

    /**
     * 把a/b/c.htm 模式转成 a.b.c
     */
    protected String getContent(String target) {
        if (StringUtil.isEmpty(target)) {
            return null;
        }

        int dashIndex = target.lastIndexOf(DELIM);

        if (dashIndex != -1) {
            target = target.substring(0, dashIndex);
        }

        target = StringUtil.replace(target, "/", STR_DELIM);

        if (target != null && target.startsWith(STR_DELIM)) {
            target = StringUtil.substring(target, 1);
        }
        return StringUtil.toCamelCase(target);
    }

    public void setActionParam(String actionParam) {
        this.actionParam = actionParam;
    }

}