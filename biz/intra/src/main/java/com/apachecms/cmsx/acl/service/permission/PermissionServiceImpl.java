package com.apachecms.cmsx.acl.service.permission;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.alibaba.citrus.util.StringUtil;
import com.apachecms.cmsx.acl.IPermissionService;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.PermissionParam;
import com.apachecms.cmsx.acl.param.PermissionResult;
import com.apachecms.cmsx.acl.service.cache.CacheModel;
import com.apachecms.cmsx.acl.service.cache.CacheService;
import com.apachecms.cmsx.acl.service.param.CheckPermissionParam;
import com.apachecms.cmsx.acl.service.permission.support.OtherPermissionService;
import com.apachecms.cmsx.acl.service.resource.IPermissonResourceService;
import com.apachecms.cmsx.acl.service.util.ACLConstants;
import com.apachecms.cmsx.dal.dao.IACLRoleDAO;
import com.apachecms.cmsx.dal.dataobject.ACLSiteRole;

@SuppressWarnings("unchecked")
/**
 * 验权实现
 * @author liuxinl.lx
 */
public class PermissionServiceImpl extends AbstractPermissonService implements IPermissionService {
	private static final Log LOG = LogFactory.getLog(PermissionServiceImpl.class);
	/*
	 * 临时tair缓存,用于提高效率
	 */
	// 临时缓存用户在当前系统中拥有的角色
	public static final String _SITE_  = "_SITE_";
	public static final String _ROLES_ = "_ROLES_";

	// 临时缓存超时时长
	private static final int DEFAULT_EXPIRE_TIME = 60 * 10;

	// 缓存
	private CacheService cacheService;
	
	// 权限资源
    private IPermissonResourceService permissonResourceService;
    
    // 角色接口
 	private IACLRoleDAO aclRoleDAO;

    /**
     * 构造函数
     */
	public PermissionServiceImpl() {
		super();
	}

	public void init() {
		((OtherPermissionService) this.defaultCheckPermissionService).setAclRoleDAO(aclRoleDAO);
		((OtherPermissionService) this.defaultCheckPermissionService).setCacheService(cacheService);
		((OtherPermissionService) this.defaultCheckPermissionService).setExpireTime(DEFAULT_EXPIRE_TIME);
	}

	@Override
	public PermissionResult checkPermission(PermissionParam param) throws ACLException {
		// 验证入参
		String action, url;
		if (null == param || StringUtil.isEmpty(param.getAppName())
				|| StringUtil.isEmpty(param.getUserID())
				|| param.getSiteID() < 0) {
			throw new ACLException(
					"PermissionServiceImpl.checkPermission:入参存在空, permissionParam:" + param);
		}
		action = param.getAction();
		url    = param.getUrl();
		PermissionResult result = new PermissionResult();

		// 验证action权限
		CheckPermissionParam ret = this.checkActionPermission(action, param);
		if (!ret.isHasAction()) {
			result.setCode(1);
			result.setMsg("[" + action + "]:action没有权限, userID:" + param.getUserID() + ", siteID:" + param.getSiteID());
			return result;
		}

		if (ret.isHasUrl() || this.checkUrlPermission(url, param, ret)) {
			result.setCode(0);
			return result;
		}

		result.setCode(2);
		result.setMsg("[" + url + "]:url没有权限, userID:" + param.getUserID() + ", siteID:" + param.getSiteID());

		return result;
	}

	/**
	 * 验证url权限
	 * @param param0
	 * @param param1
	 * @return
	 * @throws ACLException
	 */
	private boolean checkUrlPermission(String url, PermissionParam param0, CheckPermissionParam param1) throws ACLException {
		if (StringUtil.isEmpty(url)) {
			throw new ACLException("url must not be null .");
		}
		
		String appName = param0.getAppName();

		// 白名单处理
		HashSet<String> set = param1.getWhiteCache();
		if (null == set) {
			set = this.permissonResourceService.findWhiteResByAppName(appName);
		}

		if (null != set && this.check(set, url)) {
			return true;
		} 

		// 开始鉴权流程
		if (!param1.isCheckUrl()) {
			// 判断当前url是否存在于需要鉴权的资源
			List<String> permissionIDs = this.getNeedPermissionCodesByRes(appName, url, 1);
			if (null == permissionIDs || 0 == permissionIDs.size()) {
				return param0.isRetWhenResNotExist();
			}
			
			param0.setUrls(permissionIDs);
			
			// 开始鉴权流程
			ArrayList<ACLSiteRole> roles = this.getRoles(param0.getSiteID(), param0.getUserID(), appName.toUpperCase());
			if (null == roles || 0 == roles.size()) {
				return false;
			}
			CheckPermissionParam ret = this.getCheckPermission(roles.get(0).getLev()).check(roles, param0, false);
			return ret.isHasUrl();
		}

		return false;
	}

	/**
	 * 验证action权限
	 * 
	 * (1).判断action是否为空,为空直接下个流程
	 * (2).获取当前系统(如dcms)的action白名单,从tair中获取code设计为例如:DCMS_ACTION_WHITE,为空则从数据库获取，然后存入tair 
	 * (3).判断当前action是否白名单，是直接下个流程
	 * (4).判断当前action是否需要鉴权，否则直接下个流程 
	 * (5).action鉴权,通过则下个流程，失败直接返回false
	 * 
	 * @param param
	 * @param map0
	 * @return
	 * @throws ACLException
	 */
	private CheckPermissionParam checkActionPermission(String action, PermissionParam param) throws ACLException {
		CheckPermissionParam ret = new CheckPermissionParam();
		String appName = param.getAppName();
		if (StringUtil.isEmpty(appName)) {
			throw new ACLException("appName must not be null .");
		}
		
		if (StringUtil.isEmpty(action)) {
			ret.setHasAction(true);
			return ret;
		}
		
//		appName = appName.toUpperCase();

		// 查看是否白名单
		HashSet<String> set = this.permissonResourceService.findWhiteResByAppName(appName);
		ret.setWhiteCache(set);
		
		if (null != set && this.check(set, action)) {
			ret.setHasAction(true);
			return ret;
		}

		set = null;

		// 判断当前action是否存在于需要鉴权的资源
		List<String> permissionIDs = this.getNeedPermissionCodesByRes(appName, action, 0);
		if (null == permissionIDs || 0 == permissionIDs.size()) {
			ret.setHasAction(param.isRetWhenResNotExist());
			return ret;
		}
		
		param.setActions(permissionIDs);
		
		// 判断当前url是否存在于需要鉴权的资源
		permissionIDs = this.getNeedPermissionCodesByRes(appName, param.getUrl(), 1);
		param.setUrls(permissionIDs);
		
		permissionIDs = null;

		// 开始鉴权流程
		// 获取拥有的角色
		ArrayList<ACLSiteRole> roles = this.getRoles(param.getSiteID(), param.getUserID(), appName);

		if (null == roles || 0 == roles.size()) {
			ret.setHasAction(false);
			return ret;
		}

		return this.getCheckPermission(roles.get(0).getLev()).check(roles, param, true);
	}
	
	/**
	 * 判断当前系统中的目标url是否需要鉴权,如果需要获取的code,否则返回空
	 * @param appName
	 * @param url
	 * @param resType
	 * @return
	 */
	protected List<String> getNeedPermissionCodesByRes(String appName, String url, int resType) throws ACLException {
		HashMap<String, List<String>> map = null;
		try {
			map = this.permissonResourceService.findGeneralResByAppNameAndResType(appName, resType);
		} catch (Exception e) {
			LOG.error("PermissionServiceImpl.getNeedPermissionCodesByRes.findGeneralResByAppNameAndResType", e);
		}
		
		if (null == map || 0 == map.size()) {
			return null;
		}
		
		// 完全匹配
		List<String> ret = null;
		if (null != (ret = map.get(url))) {
			return ret;
		}
		
		List<String> values = new ArrayList<String> (3);
		Map.Entry<String, List<String>> e;
		String key = null, t;
		int s;
		for (Iterator<Map.Entry<String, List<String>>> iter = map.entrySet().iterator();iter.hasNext();) {
			e   = iter.next();
			key = e.getKey();
			s   = key.length();
			t   = StringUtil.substring(key, s - 1, s);
			if (!SPOT.equals(t)) {
				continue;
			}
			t = StringUtil.substring(key, 0, s - 1);
			if (url.contains(t)) {
				values.add(key);
			}
		}
		
		key = null;
		
		if (1 == (s = values.size())) {
			key = values.get(0);
		} else if (s > 1) {
			t   = values.get(0);
			key = t;
			int current = t.split(ACLConstants.LEFT_SLASH).length - 1, max = current;
			for (int i = 1; i < s; i++) {
				t = values.get(0);
				current = t.split(ACLConstants.LEFT_SLASH).length - 1;
				if (current > max) {
					key = t;
					max = current;
				}
			}
		}
		
		return StringUtil.isEmpty(key) ? null : map.get(key);
	}
	
	/**
	 * @param siteID
	 * @param userID
	 * @param appName
	 * @return
	 */
	private ArrayList<ACLSiteRole> getRoles(long siteID, String userID, String appName) {
		String key = appName + _SITE_ + siteID + _ROLES_ + userID;
		ArrayList<ACLSiteRole> roles = (ArrayList<ACLSiteRole>) this.cacheService.getObj(key);
		if (null == roles) {
			roles = (ArrayList<ACLSiteRole>) this.aclRoleDAO.findRoleBySiteAndUser(siteID, userID);
			if (null != roles && roles.size() > 0) {
				CacheModel model = new CacheModel();
				model.setKey(key);
				model.setVal(roles);
				model.setExpireTime(DEFAULT_EXPIRE_TIME);
				this.cacheService.putObj(model);
			}
		}
		return roles;
	}

	public void setAclRoleDAO(IACLRoleDAO aclRoleDAO) {
		this.aclRoleDAO = aclRoleDAO;
	}

	public void setCacheService(CacheService cacheService) {
		this.cacheService = cacheService;
	}

	public void setPermissonResourceService(IPermissonResourceService permissonResourceService) {
		this.permissonResourceService = permissonResourceService;
	}
}