package com.apachecms.cmsx.auth.provider;


import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.springframework.util.Assert;

import com.apachecms.cmsx.auth.constants.HttpSessionConstants;
import com.apachecms.cmsx.auth.constants.UserAuthenticationContextConstants;
import com.apachecms.cmsx.auth.context.UserAuthenticationContext;
import com.apachecms.cmsx.auth.context.model.SubUserContextModel;

/**
 * 类CnUserManageProvider.java的实现描述：cn_user管理实现类
 *  
 */
public class CnUserManageProvider extends AbstractSessionManagerProvider implements SessionManageProvider {

    private static CnUserManageProvider cnUserManageProvider = new CnUserManageProvider();

    private CnUserManageProvider(){
    }

    @Override
    public UserAuthenticationContext parseSession(HttpSession session) {

        SubUserContextModel userContext = new SubUserContextModel();

        Map mapSrc = (Map) session.getAttribute(HttpSessionConstants.COOKIE_USER_CLIENT_DATA);
        if (mapSrc == null) {
            return null;
        }

        Map map = new HashMap(mapSrc);
        UserAuthenticationContext usr = new UserAuthenticationContext();

        usr.setUserContext(userContext);

        String loginId = (String) map.get(UserAuthenticationContextConstants.LOGIN_ID);
        userContext.setLoginId(loginId);
        String userId  = (String) map.get(UserAuthenticationContextConstants.USER_ID);
        Long user_id = Long.valueOf(0);
        try {
            user_id = Long.valueOf(userId);
        } catch (Throwable t) {
            //不需处理
        }
        userContext.setUserId(user_id);
        userContext.setMemberId((String) map.get(UserAuthenticationContextConstants.MEMBER_ID));
        userContext.setAccountId((String) map.get(UserAuthenticationContextConstants.ACCOUNT_ID));
        userContext.setPassword((String) map.get(UserAuthenticationContextConstants.MD5_PASSWORD));
        userContext.setTimeStamp((String) map.get(UserAuthenticationContextConstants.TIMESTAMP));

        // 设置登录状态
        String signin = (String) map.get(UserAuthenticationContextConstants.LOGINED);
        boolean isLogin = "Y".equalsIgnoreCase(signin) ? true : false;
        isLogin = isLogin & (!StringUtils.isBlank(loginId));
        userContext.setAuthenticated(isLogin);

        // 判断会员的cookie是否过期
        if (isLogin) {
            if (isTimeStampExpired(userContext.getTimeStamp())) {
                usr.setAuthenticated(false, true);
            }
        }
        usr.setUserContext(userContext);
        return usr;
    }

    @Override
    public void writeSession(UserAuthenticationContext usr, HttpSession session) {

        Assert.isTrue(usr.getUserContext() instanceof SubUserContextModel);

        // save data to session that named __cookie_temp_client_data__
        Map<String, String> props = new HashMap<String, String>();
        // __signin_loginid__
        props.put(UserAuthenticationContextConstants.LOGIN_ID, usr.getLoginId());
        // __userid__
        props.put(UserAuthenticationContextConstants.USER_ID, String.valueOf(usr.getUserId()));
        // __signin_logined__
        props.put(UserAuthenticationContextConstants.LOGINED, (usr.isAuthenticated() ? "Y" : "N"));
        // __memberid__
        props.put(UserAuthenticationContextConstants.MEMBER_ID, usr.getMemberId());

        // __aid__
        props.put(UserAuthenticationContextConstants.ACCOUNT_ID, usr.getAccountId());

        // 增加一个时间戳
        props.put(UserAuthenticationContextConstants.TIMESTAMP, getTimeStampFromContext(usr.getUserContext()));
        // 增加password
        props.put(UserAuthenticationContextConstants.MD5_PASSWORD, usr.getPassword());

        session.setAttribute(HttpSessionConstants.COOKIE_USER_CLIENT_DATA, props);

    }

    public static CnUserManageProvider getInstance() {
        return cnUserManageProvider;
    }
}
