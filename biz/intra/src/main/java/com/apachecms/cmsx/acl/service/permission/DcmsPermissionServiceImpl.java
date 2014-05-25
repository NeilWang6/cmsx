package com.apachecms.cmsx.acl.service.permission;

import java.util.HashSet;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.util.StringUtil;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.PermissionParam;
import com.apachecms.cmsx.acl.param.PermissionResult;
import com.apachecms.cmsx.acl.service.resource.IDcmsResourceService;
import com.apachecms.cmsx.acl.service.resource.IPermissonResourceService;

/**
 * 验权接口,兼容DCMS
 * @author liuxinl.lx
 */
@Resource(name="permissionService")
public class DcmsPermissionServiceImpl extends PermissionServiceImpl implements IDcmsPermissionService, InitializingBean {
	private static final Log LOG = LogFactory.getLog(DcmsPermissionServiceImpl.class);
	private static final String DCMS = "dcms";
	
	// dcms资源接口
	@Autowired
	private IDcmsResourceService dcmsResourceService; 
	// 权限资源接口
	@Autowired
	private IPermissonResourceService permissonResourceService;
	
	 /**
     * 构造函数
     */
	public DcmsPermissionServiceImpl() {
		super();
	}
	
	public void afterPropertiesSet() {
		super.init();
		super.setPermissonResourceService(permissonResourceService);
	}
	
	@Override
	public boolean hasUrlResourcePermissionFor(String userid, String url, Long resourceId, boolean isOutside) {
		// 封装入参
		PermissionParam param = new PermissionParam();
		param.setUserID(userid);
		param.setUrl(url);
		param.setSiteID(resourceId);
		param.setAppName(DCMS);
		param.setInside(!isOutside);
		
		PermissionResult result;
		try {
			result = this.checkMenuPermission(param, 1);
		} catch (ACLException e) {
			result = new PermissionResult();
			result.setCode(-1);
			result.setMsg(e.getMessage());
		}
		
		return result.isSuccess() ? true : false;
	}
	
	@Override
	public boolean hasUrlResourcePermissionForAction(String userid, String url, Long resourceId, boolean isOutside) {
		// 封装入参
		PermissionParam param = new PermissionParam();
		param.setUserID(userid);
		param.setUrl(url);
		param.setSiteID(resourceId);
		param.setAppName(DCMS);
		param.setInside(!isOutside);
		
		PermissionResult result;
		try {
			result = this.checkMenuPermission(param, 0);
		} catch (ACLException e) {
			result = new PermissionResult();
			result.setCode(-1);
			result.setMsg(e.getMessage());
		}
		
		return result.isSuccess() ? true : false;
	}
	
	@Deprecated
	/**
	 * 验证菜单权限,兼容dcms菜单验证方案
	 * @param param
	 * @return
	 * @throws ACLException
	 */
	private PermissionResult checkMenuPermission(PermissionParam param, int resType) throws ACLException {
		String appName;
		String userID;
		String url;
		Long siteID;

		// 验证入参
		if (null == param || StringUtil.isEmpty(appName = param.getAppName())
				|| StringUtil.isEmpty(userID = param.getUserID())
				|| StringUtil.isEmpty(url = param.getUrl())
				|| (siteID = param.getSiteID()) < 0) {
			throw new ACLException("PermissionServiceImpl.checkMenuPermission:入参存在空, permissionParam:" + param);
		}				

		PermissionResult result = new PermissionResult();

		List<String> permissionIDs = this.getNeedPermissionCodesByRes(appName, url, resType);
		if (null == permissionIDs || 0 == permissionIDs.size()) {
			LOG.error("没有菜单权限, appName:" + appName + ", userID:" + userID + ", siteID" + siteID + ", url" + url);
			result.setCode(1);
			result.setMsg("没有菜单权限, appName:" + appName + ", userID:" + userID + ", siteID" + siteID + ", url" + url);
			return result;
		}

		// 获取拥有url的权限信息
		HashSet<String> set = this.dcmsResourceService.listPermission(appName, userID, siteID, !param.isInside());
		if (null == set || 0 == set.size()) {
			LOG.error("没有菜单权限, appName:" + appName + ", userID:" + userID + ", siteID" + siteID + ", url:" + url);
			result.setCode(1);
			result.setMsg("没有菜单权限, appName:" + appName + ", userID:" + userID + ", siteID" + siteID + ", url:" + url);
			return result;
		}

		boolean flag = false;

		for (String permissionID : permissionIDs) {
			// 开始验证菜单权限
			if (set.contains(permissionID)) {
				result.setCode(0);
				flag = true;
				break;
			}
		}

//		else {
//			String t;
//			int s;
//			for (String u : set) {
//				s = u.length();
//				t = StringUtil.substring(u, s - 1, s);
//				if (!SPOT.equals(t)) {
//					continue;
//				}
//				u = StringUtil.substring(u, 0, s - 1);
//				if (url.contains(u)) {
//					result.setCode(0);
//					flag = true;
//					break;
//				}
//			}
//		}

		if (!flag) {
			LOG.error("没有菜单权限, appName:" + appName + ", userID:" + userID + ", siteID" + siteID + ", url:" + url);
			result.setCode(1);
			result.setMsg("没有菜单权限, appName:" + appName + ", userID:" + userID + ", siteID" + siteID + ", url:" + url);
		}

		return result;
	}

	public void setDcmsResourceService(IDcmsResourceService dcmsResourceService) {
		this.dcmsResourceService = dcmsResourceService;
	}

	public void setPermissonResourceService(IPermissonResourceService permissonResourceService) {
		this.permissonResourceService = permissonResourceService;
	}
}