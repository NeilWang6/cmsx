package com.apachecms.cmsx.auth.provider;


import org.apache.commons.lang.StringUtils;

import com.apachecms.cmsx.auth.constants.UserAuthenticationContextConstants;
import com.apachecms.cmsx.auth.context.UserContext;

/**
 * 类SessionManagerProviderHelper.java的实现描述：Session管理提供虚拟基类
 *  
 */
public abstract class AbstractSessionManagerProvider implements SessionManageProvider {

    /**
     * 判断时间是否过期(true为过期，false为未过期)
     * 
     * @param timeStampStr
     */
    protected boolean isTimeStampExpired(String timeStampStr) {
        long loginTime = 0;
        try {
            loginTime = Long.parseLong(timeStampStr);
        } catch (NumberFormatException e) {

        }
        long now = System.currentTimeMillis() / 1000;

        return ((now - loginTime) > UserAuthenticationContextConstants.COOKIE_VALIDITY);
    }

    /**
     *从UserContext中获取登录时间戳:如果没有，默认取当前时间
     * 
     * @param userContext
     */
    protected String getTimeStampFromContext(UserContext userContext) {
        String timeStamp = userContext.getTimeStamp();
        // 没有timeStamp，默认取当前时间
        if (StringUtils.isBlank(timeStamp)) {
            timeStamp = String.valueOf(System.currentTimeMillis() / 1000);
        }
        return timeStamp;
    }

}
