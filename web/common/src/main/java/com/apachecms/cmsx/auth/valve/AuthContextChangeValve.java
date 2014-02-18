package com.apachecms.cmsx.auth.valve;

import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.service.pipeline.PipelineContext;
import com.alibaba.citrus.service.pipeline.support.AbstractValve;
import com.alibaba.citrus.turbine.util.CsrfToken;
import com.apachecms.cmsx.auth.constants.HttpSessionConstants;
import com.apachecms.cmsx.auth.context.AuthSecureContextHolder;
import com.apachecms.cmsx.auth.context.UserAuthenticationContext;
import com.apachecms.cmsx.auth.cookie.IsLoginCookieProcess;
import com.apachecms.cmsx.auth.provider.SessionManageProviderFactory;
import com.apachecms.cmsx.auth.utils.AuthzSecurityUtil;

/**
 * 类AuthContextChangeValve.java的实现描述：cn_tmp和cn_user更新类，只能由会员注册，登录这边使用，其他地方请勿调用，
 *
 * @author zhengqinming
 *
 */
public class AuthContextChangeValve extends AbstractValve {

    @Autowired
    protected HttpServletRequest  request;

    @Autowired
    protected HttpServletResponse response;

    @Override
    public void invoke(PipelineContext pipelineContext) throws Exception {
        // if user object changed then, notify cookie changed.
        HttpSession session = request.getSession();
        UserAuthenticationContext usr = AuthSecureContextHolder.getContext();
        if (usr.isTouch()) {
            if (usr.isAuthenticated()) {
                // 如果是子帐号，信息写入cn_user;如果是父帐号，信息写入cn_tmp
                if (usr.isSubAccount()) {
                    // 写入cn_user，并确定移除cn_tmp
                    SessionManageProviderFactory.getCnUserProvider().writeSession(usr, session);
                    session.removeAttribute(HttpSessionConstants.COOKIE_TEMP_CLIENT_DATA);

                } else {
                    // 写入cn_tmp，并确定移除cn_user
                    SessionManageProviderFactory.getCnTmpProvider().writeSession(usr, session);
                    session.removeAttribute(HttpSessionConstants.COOKIE_USER_CLIENT_DATA);
                    // 精准营销使用，仅针对主帐号
                    session.setAttribute(HttpSessionConstants.SEC_LAST_LOGIN_ID,
                                         AuthzSecurityUtil.encodeForLoginId(usr.getLoginId()));

                    // 子帐号不写lastLoginId
                    session.setAttribute(HttpSessionConstants.LAST_LOGIN_ID, usr.getLoginId());
                    session.setAttribute(HttpSessionConstants.LAST_MID, usr.getMemberId());
                }

                String loginId = URLEncoder.encode(usr.getLoginId(), "UTF-8");
                
                // 会员的登录状态 变成true
                IsLoginCookieProcess.writeCookie(request,response, true, loginId);
            } else {// logout action
                session.removeAttribute(HttpSessionConstants.COOKIE_TEMP_CLIENT_DATA);
                session.removeAttribute(HttpSessionConstants.COOKIE_USER_CLIENT_DATA);
                IsLoginCookieProcess.writeCookie(request,response, false, "");
            }
        }// end first if

        if (usr.isAuthenticated() && session.getAttribute(CsrfToken.DEFAULT_TOKEN_KEY) == null) {
            CsrfToken csrfToken = new CsrfToken(request);
            csrfToken.getUniqueToken();
        }

        pipelineContext.invokeNext();
    }

}
