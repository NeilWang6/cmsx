package com.apachecms.cmsx.auth.valve;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.service.pipeline.Pipeline;
import com.alibaba.citrus.service.pipeline.PipelineContext;
import com.alibaba.citrus.service.pipeline.support.AbstractValve;
import com.alibaba.citrus.turbine.TurbineRunData;
import com.alibaba.citrus.turbine.util.TurbineUtil;
import com.alibaba.citrus.util.Assert;
import com.apachecms.cmsx.auth.access.AccessService;
import com.apachecms.cmsx.auth.permission.service.AuthPermissionService;

/**
 * 类AuthSecurityValve.java的实现描述：TODO 类实现描述
 * 
 * @author chao.qianc 2011-12-5 下午05:56:31
 */
public class AuthSecurityValve extends AbstractValve {

    @Autowired
    private AccessService      accessService;
    @Autowired
    private AuthPermissionService  permissionService;

    @Autowired
    private HttpServletRequest request;

    @Override
    public void invoke(PipelineContext pipelineContext) throws Exception {
        String urlEscaped = accessService.getUrlEscaped();
        Assert.assertNotNull(urlEscaped, "url request escaped can not be null");
        String role = accessService.getRole();
        if (permissionService.havePermission(urlEscaped, role)) {
            pipelineContext.invokeNext();
        } else {
            TurbineRunData rundata = TurbineUtil.getTurbineRunData(request);
            // 没有登录，先跳到需要登录的页面，已经登录，则访问没有权限访问页面
            if (accessService.isLogin()) {
                rundata.setRedirectLocation(accessService.getDenyRedirectUrl());
            } else {
                rundata.setRedirectLocation(accessService.getLoginUrl());
            }
            pipelineContext.breakPipeline(Pipeline.TOP_LABEL);
            return;
        }
    }

}
