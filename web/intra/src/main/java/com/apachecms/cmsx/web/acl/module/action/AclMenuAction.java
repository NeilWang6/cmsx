package com.apachecms.cmsx.web.acl.module.action;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.TurbineRunData;
import com.alibaba.citrus.util.StringUtil;
import com.alibaba.citrus.webx.WebxException;
import com.apachecms.cmsx.acl.IMenuService;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.ResourceParam;
import com.apachecms.cmsx.common.AuthToken;
import com.apachecms.cmsx.web.common.action.BaseAction;
import com.apachecms.cmsx.web.common.util.CommonUtil;

public class AclMenuAction extends BaseAction{
	private static final Log LOG = LogFactory.getLog(AclMenuAction.class);
	private static final String APP_NAME = "dcms"; 
	public static final String LIST_RESOURCE_PARAM = "listResourceParam";
	private static final String MENU = "menu";
	
	@Autowired
	private IMenuService menuResource;
	
	/**
	 * 添加或更新菜单
	 * @param rundata
	 * @param context
	 * @throws WebxException
	 */
	public void doAddOrUpdateMenu(TurbineRunData rundata, Context context) throws WebxException {
		AuthToken authToken = CommonUtil.getAuthToken(rundata.getRequest());
		String userId       = authToken.getUserId();
		String id           = rundata.getParameters().getString("id");
		String code         = rundata.getParameters().getString("code");
		String name         = rundata.getParameters().getString("name");
		String parent       = rundata.getParameters().getString("parent");
		String url          = rundata.getParameters().getString("url");
		String appName      = rundata.getParameters().getString("appName");
		String isWhite      = rundata.getParameters().getString("isWhite");
		String description  = rundata.getParameters().getString("description");
		Long   sort         = rundata.getParameters().getLong("sort");
		
		ResourceParam param = new ResourceParam();
		param.setId(id);
		param.setCode(code);
		param.setName(name);
		param.setParent(parent);
		param.setUrl(url);
		param.setAppName(appName);
		param.setResourceType(MENU);
		param.setIsWhite(isWhite);
		param.setDescription(description);
		param.setSort(sort);
		
		try {
			if (StringUtil.isEmpty(id)) {
				this.menuResource.create(param, userId);
			} else {
				this.menuResource.update(param, userId);
			} 
			context.put("status", "success");
		} catch (ACLException e) {
			LOG.error("ACLResourceAO.doAddOrUpdateMenu.ACLException", e);
			context.put("error", e.getMessage());
		} catch (Exception e) {
			LOG.error("ACLResourceAO.doAddOrUpdateMenu.Exception", e); 
			throw new WebxException("AclMenuAction.doAddOrUpdateMenu:", e);
		}
	}
	
	/**
	 * 删除菜单
	 * @param rundata
	 * @param context
	 * @throws WebxException
	 */
	public void doDelMenu(TurbineRunData rundata, Context context) throws WebxException {
		AuthToken authToken = CommonUtil.getAuthToken(rundata.getRequest());
		String userId       = authToken.getUserId();
		String id     = rundata.getParameters().getString("id");
		
		try {
			this.menuResource.delete(id, userId);
			context.put("status", "success");
		} catch (ACLException e) {
			LOG.error("ACLResourceAO.doDelMenu.ACLException", e);
			context.put("status", "fail");
		} catch (Exception e) {
			LOG.error("ACLResourceAO.doDelMenu.Exception", e);
			context.put("status", "fail");
		}
	}
}