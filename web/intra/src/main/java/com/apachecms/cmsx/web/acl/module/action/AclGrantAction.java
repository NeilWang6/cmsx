package com.apachecms.cmsx.web.acl.module.action;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.TurbineRunData;
import com.alibaba.citrus.util.StringUtil;
import com.alibaba.citrus.webx.WebxException;
import com.apachecms.cmsx.acl.IGrantService;
import com.apachecms.cmsx.acl.IRoleService;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.common.AuthToken;
import com.apachecms.cmsx.web.common.action.BaseAction;
import com.apachecms.cmsx.web.common.util.CommonUtil;

public class AclGrantAction extends BaseAction{
	private static final Log LOG = LogFactory.getLog(AclGrantAction.class);
	private static final String TYPE = "0"; 
	private static final String DCMS = "dcms"; 
	public static final String PAGE_APPLY_ROLES = "pageApplyRoles";
	@Autowired
	private IGrantService grantService;
	@Autowired
	private IRoleService roleService;

	/**
	 * 审核权限
	 * 查询当前站点下所有申请的角色
	 * @throws WebxException
	 */
	public void doAddRoles2User(TurbineRunData rundata, Context context) throws WebxException {
		AuthToken authToken = CommonUtil.getAuthToken(rundata.getRequest());
		String[] ids        = rundata.getParameters().getStrings("ids");
		Boolean isPass      = rundata.getParameters().getBoolean("isPass");
		String message      = rundata.getParameters().getString("message");
		String type         = rundata.getParameters().getString("type");
		 
		Long   siteId       = authToken.getProfileSite();
		
		String status = null;
		if (null != isPass) {
			status = isPass ? "1" : "-1";
		}
		String ret = null;
		try {
			this.grantService.addRoles2User(ids, status, message, authToken.getUserId(), DCMS); 
			context.put("siteId", siteId);
			if (StringUtil.isEmpty(type) || !TYPE.equals(type)) {
				// 处理返回结果 
				ret = retJson(null, "success", "", "");
			}else{ 
				ret = retJson(null, "fail", "fail", "");
			}
			printStream(rundata.getResponse(), ret); 
		} catch (Exception e) {
			LOG.error("ACLGrantPermissonAO.doAddRoles2User.Exception", e);
			context.put("error", e.getMessage()); 
		}
	}
	
	/**
	 * 移除权限
	 * 查询当前站点下所有申请的角色
	 * @throws WebxException
	 */
	public void delRoles2User(TurbineRunData rundata, Context context) throws WebxException {
		String userId = rundata.getParameters().getString("userId");
		String[] ids  = rundata.getParameters().getStrings("ids");
		
		try {
			this.grantService.delRoles2User(ids, userId);
		} catch (Exception e) {
			LOG.error("ACLGrantPermissonAO.delRoles2User.Exception", e);
			throw new WebxException("ACLGrantAction.delRoles2User:", e);
		} 
	}
}