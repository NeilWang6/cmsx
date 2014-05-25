package com.apachecms.cmsx.web.acl.module.action;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.TurbineRunData;
import com.alibaba.citrus.webx.WebxException;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.ApplyParam;
import com.apachecms.cmsx.acl.param.RoleParam;
import com.apachecms.cmsx.acl.service.permission.IDcmsApplyService;
import com.apachecms.cmsx.web.common.action.BaseAction;

public class ACLApplyAction extends BaseAction{
	private static final Log LOG = LogFactory.getLog(ACLApplyAction.class);
	@Autowired
	private IDcmsApplyService   dcmsApplyService;
	
	/**
	 * 查询当前用户可以申请的角色
	 * @throws WebxException
	 */
	public void doGetRoles(TurbineRunData rundata, Context context) throws WebxException {
		boolean isOutsite = false;
		List<RoleParam> roles = null;
		try {
			roles = this.dcmsApplyService.getRoles(isOutsite); 
			 
		} catch (ACLException e) {
			LOG.error("ApplyPermissionAO.doGetRoles.ACLException", e);
			throw new WebxException(e);
		} catch (Exception e) {
			LOG.error("ApplyPermissionAO.doGetRoles.Exception", e);
			throw new WebxException(e);
		} 
	}
	
	/**
	 * 申请某站点下的角色
	 * @param rundata
	 * @param context
	 * @throws WebxException
	 */
	public void doApplyRoles2User(TurbineRunData rundata, Context context) throws WebxException {
		String userId    = rundata.getParameters().getString("userId");
		Long   siteId    = rundata.getParameters().getLong("siteId");
		String[] roles   = rundata.getParameters().getStrings("roles");
		Date expiredDate = rundata.getParameters().getDate("expiredDate", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
		
		ApplyParam param = new ApplyParam();
    	param.setSiteID(siteId);
    	param.setRoles(Arrays.asList(roles));
    	param.setExpiredDate(expiredDate);
    	param.setUserID(userId);
    	
    	try {
			this.dcmsApplyService.applyRoles2User(param); 
		} catch (ACLException e) {
			LOG.error("ApplyPermissionAO.doApplyRoles2User.ACLException", e);
			throw new WebxException(e);
		} catch (Exception e) {
			LOG.error("ApplyPermissionAO.doApplyRoles2User.Exception", e);
			throw new WebxException(e);
		} 
	}
}
