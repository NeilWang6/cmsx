package com.apachecms.cmsx.auth.provider;


import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.springframework.util.Assert;

import com.apachecms.cmsx.auth.constants.HttpSessionConstants;
import com.apachecms.cmsx.auth.constants.UserAuthenticationContextConstants;
import com.apachecms.cmsx.auth.context.UserAuthenticationContext;
import com.apachecms.cmsx.auth.context.model.AdminUserContextModel;

/**
 * 类CnTmpManageProvider.java的实现描述：cn_tmp管理实现类
 *  
 */
public class CnTmpManageProvider extends AbstractSessionManagerProvider implements SessionManageProvider {

    private static CnTmpManageProvider cnTmpManageProvider = new CnTmpManageProvider();

    private CnTmpManageProvider(){
    }

    @Override
    public UserAuthenticationContext parseSession(HttpSession session) {

        AdminUserContextModel userContext = new AdminUserContextModel();

        Map mapSrc = (Map) session.getAttribute(HttpSessionConstants.COOKIE_TEMP_CLIENT_DATA);
        if (mapSrc == null) {
            return null;
        }

        // 如果vid不为空，且memberId和vid不相等，则是以前的子帐号登录，将其置为非登录状态(兼容期间起效，后面可以去除)
        if (StringUtils.isNotBlank((String) mapSrc.get(UserAuthenticationContextConstants.VACCOUNT_ID))
            && !StringUtils.equals((String) mapSrc.get(UserAuthenticationContextConstants.VACCOUNT_ID),
                                   (String) mapSrc.get(UserAuthenticationContextConstants.MEMBER_ID))) {
            session.setAttribute(HttpSessionConstants.COOKIE_TEMP_CLIENT_DATA, null);
            return null;
        }

        Map map = new HashMap(mapSrc);
        UserAuthenticationContext usr = new UserAuthenticationContext();

        usr.setUserContext(userContext);

        String loginId = (String) map.get(UserAuthenticationContextConstants.LOGIN_ID);
        userContext.setLoginId(loginId);
        
        Long user_id = Long.valueOf(0);
        if(map.get(UserAuthenticationContextConstants.USER_ID) != null){
            String userId  = (String) map.get(UserAuthenticationContextConstants.USER_ID);
            try {
                user_id = Long.valueOf(userId);
            } catch (Throwable t) {
                //不需处理
            }
        }      
        
        userContext.setUserId(user_id);

        // 父帐号中需要解析memberLevel
        userContext.setMemberLevel((String) map.get(UserAuthenticationContextConstants.MEMBER_LEVEL));
        // 主帐号将memberId作为accountId,读取accountId时会读取memberId
        userContext.setMemberId((String) map.get(UserAuthenticationContextConstants.MEMBER_ID));
        userContext.setPassword((String) map.get(UserAuthenticationContextConstants.MD5_PASSWORD));
        userContext.setVaccountId((String) map.get(UserAuthenticationContextConstants.VACCOUNT_ID));
        userContext.setTimeStamp((String) map.get(UserAuthenticationContextConstants.TIMESTAMP));

        // 设置登录状态
        String signin = (String) map.get(UserAuthenticationContextConstants.LOGINED);
        boolean isLogin = "Y".equalsIgnoreCase(signin) ? true : false;
        isLogin = isLogin & (!StringUtils.isBlank(loginId));

        userContext.setAuthenticated(isLogin);

        // remove known key
        map.remove(UserAuthenticationContextConstants.LOGIN_ID);
        map.remove(UserAuthenticationContextConstants.LOGINED);
        map.remove(UserAuthenticationContextConstants.MEMBER_LEVEL);
        map.remove(UserAuthenticationContextConstants.MEMBER_ID);
        map.remove(UserAuthenticationContextConstants.MD5_PASSWORD);
        map.remove(UserAuthenticationContextConstants.VACCOUNT_ID);
        map.remove(UserAuthenticationContextConstants.TIMESTAMP);
        map.remove(UserAuthenticationContextConstants.USER_ID);

        if (map.size() > 0) {
            userContext.setUnmanaged(map);
        }

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

        Assert.isTrue(usr.getUserContext() instanceof AdminUserContextModel);

        AdminUserContextModel context = (AdminUserContextModel) usr.getUserContext();

        // save data to session that named __cookie_temp_client_data__
        Map<String, String> props = new HashMap<String, String>();
        // __signin_loginid__
        props.put(UserAuthenticationContextConstants.LOGIN_ID, context.getLoginId());
        // __userid__
        props.put(UserAuthenticationContextConstants.USER_ID, String.valueOf(context.getUserId()));
        // __signin_logined__
        props.put(UserAuthenticationContextConstants.LOGINED, (context.isAuthenticated() ? "Y" : "N"));
        // __signin_member_level__
        props.put(UserAuthenticationContextConstants.MEMBER_LEVEL, context.getMemberLevel());
        // __memberid__
        props.put(UserAuthenticationContextConstants.MEMBER_ID, context.getMemberId()); 

        // 增加一个时间戳
        props.put(UserAuthenticationContextConstants.TIMESTAMP, getTimeStampFromContext(context));
        // 增加password
        props.put(UserAuthenticationContextConstants.MD5_PASSWORD, context.getPassword());

        // 增加vaccount
        if (!StringUtils.isEmpty(usr.getVaccountId())) {
            props.put(UserAuthenticationContextConstants.VACCOUNT_ID, context.getVaccountId());
        }

        Map unmanaged = context.getUnmanaged();
        if (unmanaged != null) {
            props.putAll(unmanaged);
        }

        session.setAttribute(HttpSessionConstants.COOKIE_TEMP_CLIENT_DATA, props);

    }

    public static CnTmpManageProvider getInstance() {
        return cnTmpManageProvider;
    }

}

