package com.apachecms.cmsx.auth.access;

import static com.alibaba.citrus.util.StringUtil.toCamelCase;
import static com.alibaba.citrus.util.StringUtil.trimToNull;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.service.uribroker.URIBrokerService;
import com.alibaba.citrus.service.uribroker.uri.URIBroker;
import com.alibaba.citrus.turbine.TurbineConstant;
import com.alibaba.citrus.turbine.TurbineRunData;
import com.alibaba.citrus.turbine.util.TurbineUtil;
import com.alibaba.citrus.util.Assert;
import com.alibaba.citrus.util.StringUtil;
import com.alibaba.citrus.webx.WebxComponent;
import com.apachecms.cmsx.auth.access.permission.constants.PermissionConstant;

/**
 * 
 * @author zhengqinming
 *
 */
public class AccessServiceImpl extends AbstractAccessService {
 
    private static final String DEFAULT_EVENT_PATTERN     = "event_submit_do_";

    @Autowired
    private HttpServletRequest  request;

    @Autowired
    private WebxComponent       component;

    @Autowired
    private URIBrokerService    uriBrokerService;

    @Override
    public String getUrlEscaped() {
        TurbineRunData rundata = TurbineUtil.getTurbineRunData(request);
        if (checkIsActionRequest(rundata)) {
            return getActionPermissionURI(rundata);
        } else {
            return getScreenPermissionURI(rundata);
        }
    }

    /**
     * 判断是否是action请求
     */
    private boolean checkIsActionRequest(TurbineRunData rundata) {
        if (rundata.getParameters().getString(actionParam) != null) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public String getDenyRedirectUrl() {
        URIBroker uriBroker = uriBrokerService.getURIBroker(DENY_ACCESS_LINK);
        return uriBroker.render();
    }

    @Override
    public String getLoginUrl() {
        URIBroker uriBroker = uriBrokerService.getURIBroker(LOGIN_LINK);
        return uriBroker.addQueryData("Done", getRequestURL()).render();
    }

    /** 获取webx3.x的Screen的URI形式 */
    public String getScreenPermissionURI(TurbineRunData rundata) {
        String target = Assert.assertNotNull(rundata.getTarget(), "Target was not specified");

        target = getContent(target);
        if (target == null) {
            return null;
        }
        return component.getName() + PermissionConstant.DELIM + TurbineConstant.SCREEN_MODULE + PermissionConstant.DELIM + target;
    }

    /** 获取webx3.x的Action的URI形式 */
    public String getActionPermissionURI(TurbineRunData rundata) {
        String action = toCamelCase(trimToNull(rundata.getParameters().getString(actionParam)));
        if (action == null) {
            return null;
        }
        action = getContent(action);
        return component.getName() + PermissionConstant.DELIM + TurbineConstant.ACTION_MODULE + PermissionConstant.DELIM + action + PermissionConstant.DELIM + getDoEvent();
    }
    
    private String getRequestURL() {
        StringBuffer buffer = request.getRequestURL();
        String queryString = StringUtil.trimToNull(request.getQueryString());
        if (queryString != null) {
            buffer.append('?').append(queryString);
        }
        return buffer.toString();
    }

    /**
     * @see com.alibaba.citrus.service.moduleloader.impl.adapter.ActionEventAdapter#getEventName()
     */
    protected String getDoEvent() {
        String event = null;

        @SuppressWarnings("unchecked")
        Enumeration<String> e = request.getParameterNames();

        while (e.hasMoreElements()) {
            String originalKey = e.nextElement();
            String paramKey = StringUtil.toLowerCaseWithUnderscores(originalKey);

            if (paramKey.startsWith(DEFAULT_EVENT_PATTERN) && !StringUtil.isBlank(request.getParameter(originalKey))) {
                int startIndex = DEFAULT_EVENT_PATTERN.length();
                int endIndex = paramKey.length();

                // 支持<input type="image">
                if (paramKey.endsWith(IMAGE_BUTTON_SUFFIX_1)) {
                    endIndex -= IMAGE_BUTTON_SUFFIX_1.length();
                } else if (paramKey.endsWith(IMAGE_BUTTON_SUFFIX_2)) {
                    endIndex -= IMAGE_BUTTON_SUFFIX_2.length();
                } else if (paramKey.endsWith(IMAGE_BUTTON_SUFFIX_3)) {
                    endIndex -= IMAGE_BUTTON_SUFFIX_3.length();
                } else if (paramKey.endsWith(IMAGE_BUTTON_SUFFIX_4)) {
                    endIndex -= IMAGE_BUTTON_SUFFIX_4.length();
                }

                event = trimToNull(paramKey.substring(startIndex, endIndex));

                if (event != null) {
                    event = toCamelCase("do" + "_" + event);
                    break;
                }
            }
        }

        return event;
    }

}
