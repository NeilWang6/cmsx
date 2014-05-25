package com.apachecms.cmsx.web.acl.module.screen;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.turbine.TurbineRunData;
import com.alibaba.citrus.webx.WebxException;
import com.apachecms.cmsx.acl.IMenuService;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.ResourceParam;
import com.apachecms.cmsx.acl.param.ResourceResult;
import com.apachecms.cmsx.utils.ValidateUtil;
//import com.alibaba.china.cms.web.util.util.WebUtils;

@SuppressWarnings("unchecked")
/**
 * 菜单
 * @author liuxinl.lx
 */
public class ListTreeMenu {
	private static final Log LOG = LogFactory.getLog(ListTreeMenu.class);
	@Autowired
	private IMenuService menuResource;
	
	private static final String MENU = "menu";
	private static final String APP_NAME = "dcms";
	
	public static final String LIST_RESOURCE_PARAM = "listResourceParam";
	public static final String EXCEPTION           = "Exception";
	
	public void execute(TurbineRunData rundata) throws WebxException {
		rundata.setLayoutEnabled(false); 
        String appName = rundata.getParameters().getString("appName");
        String callback = rundata.getParameters().getString("callback", "");
        try { 
			ResourceResult resourceResult = this.menuResource.listMenu(appName); 
			List<ResourceParam> params = null;
			if (resourceResult.isSuccess()) {
				params = resourceResult.getParams();
			}
			
			
			Map<String, Object> ret = new HashMap<String, Object>(3);
			ret.put("status", "200");
			ret.put("msg", "success");
			ret.put("data", params);

	        // 输出JSONP
	        ValidateUtil.outputJSONP(rundata, callback, ret);  
	        
		} catch (Exception e) {
			LOG.error("ACLResourceAO.doGetMenu.Exception", e);
			throw new WebxException(e);
		} 
	}
}