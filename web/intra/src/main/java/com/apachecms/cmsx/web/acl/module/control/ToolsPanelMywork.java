package com.apachecms.cmsx.web.acl.module.control;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.TurbineRunData;
import com.alibaba.citrus.webx.WebxException;
import com.apachecms.cmsx.acl.IMenuService;
import com.apachecms.cmsx.acl.param.ResourceParam;
import com.apachecms.cmsx.acl.param.ResourceResult;
import com.apachecms.cmsx.common.AuthToken;
import com.apachecms.cmsx.web.common.util.CommonUtil;

public class ToolsPanelMywork {
	private static final Log LOG = LogFactory.getLog(ToolsPanelMywork.class);
	@Autowired
	private IMenuService menuResource;
	private static final String APP_NAME = "dcms";
	public static final String LIST_RESOURCE_PARAM = "listResourceParam";

    public void execute(TurbineRunData rundata, Context context) throws Exception {
        AuthToken authToken = CommonUtil.getAuthToken(rundata.getRequest()); 
        context.put("authToken", authToken);
        String userID = authToken.getUserId();
        Long siteID = authToken.getProfileSite();
        boolean isOutside = false;
        try {
			ResourceResult ret = this.menuResource.listTreeMenu(APP_NAME, siteID, userID, isOutside);
			 
			List<ResourceParam> params = null;
			if (ret.isSuccess() && null != (params = ret.getParams()) && params.size() > 0) {
				if (null != params) {
					context.put(LIST_RESOURCE_PARAM, params);
				}
			}
			
		} catch (Exception e) {
			LOG.error("ACLResourceAO.doGetTreeMenuByUserAndSite.Exception", e);
			throw new WebxException("ToolsPanelMywork.execute:", e);
		} 
    }
}
