package com.apachecms.cmsx.auth.valve;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.service.pipeline.PipelineContext;
import com.alibaba.citrus.service.pipeline.support.AbstractValve;
import com.apachecms.cmsx.auth.context.AuthSecureContextHolder;
import com.apachecms.cmsx.auth.context.UserAuthenticationContext;
import com.apachecms.cmsx.auth.provider.SessionManageProviderFactory;

/**
 * 类AuthContextValve.java的实现描述：获得登陆信息, 并对AuthSecurityContextHolder操作
 * 
 * @author minhui.dengmh 2011-12-5 下午02:38:35
 */
public final class AuthContextValve extends AbstractValve {

    private String               action;
    private boolean              subAccountSupport;

    @Autowired
    protected HttpServletRequest request;

    @Override
    public void invoke(PipelineContext pipelineContext) throws Exception {
        if ("cleanup".equals(action)) {
            cleanup();
        } else {
            defaultHandle();
        }

        pipelineContext.invokeNext();

    }

    /** 默认valve运行逻辑：主帐号时写cn_tmp到threadlocal；子帐号时写cn_user到threadlocal */
    @SuppressWarnings("unchecked")
    public void defaultHandle() {
        HttpSession session = request.getSession();

        // 1.从cn_tmp中获取会员登录信息,设置到AuthSecureContextHolder中
        UserAuthenticationContext userTmp = SessionManageProviderFactory.getCnTmpProvider().parseSession(session);
        if (userTmp != null) {
            AuthSecureContextHolder.setContext(userTmp);
        } else {
            // 如果应用支持子帐号
            if (subAccountSupport) {
                // 2.从cn_user中获取会员登录信息,设置到AuthSecureContextHolder中
                UserAuthenticationContext userA = SessionManageProviderFactory.getCnUserProvider().parseSession(session);
                if (userA != null) {
                    AuthSecureContextHolder.setContext(userA);
                }
            }

        }

        return;
    }

    /** 清理vavle运行逻辑：清理threadlocal中的内容 */
    public void cleanup() {
        AuthSecureContextHolder.setContext(null);
        return;
    }

    public void setAction(String action) {
        this.action = StringUtils.trimToNull(action);
    }

    public void setSubAccountSupport(boolean subAccountSupport) {
        this.subAccountSupport = subAccountSupport;
    }

}
