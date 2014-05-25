package com.apachecms.cmsx.acl.service.permission.support;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.util.StringUtil;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.PermissionParam;
import com.apachecms.cmsx.acl.service.cache.CacheModel;
import com.apachecms.cmsx.acl.service.cache.CacheService;
import com.apachecms.cmsx.acl.service.param.CheckPermissionParam;
import com.apachecms.cmsx.acl.service.permission.ICheckPermissionService;
import com.apachecms.cmsx.dal.dao.IACLRoleDAO;
import com.apachecms.cmsx.dal.dataobject.ACLRoleResource;
import com.apachecms.cmsx.dal.dataobject.ACLSiteRole;

/**
 * 普通角色验权
 * @author liuxinl.lx
 */
public class OtherPermissionService implements ICheckPermissionService {
//	private static final String SPOT = "*";
	
	/*
	 * 临时tair缓存,用于提高效率
	 */
	// 临时缓存用户在当前系统中拥有的角色
	public static final String _SITE_             = "_SITE_";
	public static final String _ROLES_RESOURCES_  = "_ROLES_RESOURCES_";
	
	// 临时缓存超时时长
	private static final int DEFAULT_EXPIRE_TIME   = 60;
	
	private int expireTime = DEFAULT_EXPIRE_TIME;
	
	// 角色接口
	@Autowired
	private IACLRoleDAO aclRoleDAO;
	
	// 缓存
	private CacheService cacheService;

	@SuppressWarnings("unchecked")
	@Override
	public CheckPermissionParam check(List<ACLSiteRole> roles, PermissionParam param, boolean checkAction) 
			throws ACLException {
		List<String> temp = new ArrayList<String> (roles.size());
		Date expiredDate = null;
		Date now         = new Date();
		for (ACLSiteRole usr : roles) {
			expiredDate = usr.getExpiredDate();
			if (null != expiredDate && expiredDate.before(now)) {
				continue;
			}
			temp.add(usr.getId());
		}
		
		CheckPermissionParam param0 = new CheckPermissionParam();
		
		// 角色过期
		if (0 == temp.size()) {
			param0.setHasAction(false);
			param0.setHasUrl(false);
			return param0;
		}
		
		// 根据角色查询当前系统下的授权资源
		String url;
		String appName = param.getAppName();
		String key = appName.toUpperCase() + _SITE_ + param.getSiteID() + _ROLES_RESOURCES_ + param.getUserID();
		HashSet<String> resourceSet = (HashSet<String>) this.cacheService.getObj(key);
		if (null == resourceSet) {
			List<ACLRoleResource> resources = this.aclRoleDAO.findResourceByRoles(appName, temp);
			if (null == resources || 0 == resources.size()) {
				param0.setHasAction(false);
				return param0;
			}
			resourceSet = new HashSet<String> ();
			String rid;
			for (ACLRoleResource res : resources) {
				url = res.getUrl();
				rid = res.getId();
				if (StringUtil.isEmpty(url) || resourceSet.contains(rid)) {
					continue;
				}
				resourceSet.add(rid);
			}
			if (resourceSet.size() > 0) {
				CacheModel model = new CacheModel();
				model.setKey(key);
				model.setVal(resourceSet);
				model.setExpireTime(expireTime);
				this.cacheService.putObj(model);
			}
			url = null;
		}
		
		
		// 验证action权限
		if (checkAction) {
			this.checkAction(resourceSet, param.getActions(), param0);
		}
		
		param0.setCheckUrl(true);
		
		// 验证url权限
		url = param.getUrl();
		if (null == url || 0 == url.length()) {
			param0.setHasUrl(param.isRetWhenResNotExist());
			return param0;
		}
		
//		if (set.contains(url)) {
//			param0.setHasUrl(true);
//		} else {
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
//					param0.setHasUrl(true);
//					break;
//				}
//			}
//		}
		// 验证url
		this.checkUrl(resourceSet, param.getUrls(), param0);

		return param0;
	}
	
	/**
	 * 验证url
	 * @param set
	 * @param url
	 * @param param0
	 */
	private void checkUrl(HashSet<String> set, List<String> urls, CheckPermissionParam param0) {
		for (String url : urls) {
			if (set.contains(url)) {
				param0.setHasUrl(true);
				break;
			}
		}
	}
	
	/**
	 * 验证action
	 * @param set
	 * @param action
	 * @param param0
	 */
	private void checkAction(Set<String> set, List<String> actions, CheckPermissionParam param0) {
		for (String action : actions) {
			if (set.contains(action)) {
				param0.setHasAction(true);
				break;
			}
		}
	}

	public void setAclRoleDAO(IACLRoleDAO aclRoleDAO) {
		this.aclRoleDAO = aclRoleDAO;
	}

	public void setExpireTime(int expireTime) {
		this.expireTime = expireTime;
	}

	public void setCacheService(CacheService cacheService) {
		this.cacheService = cacheService;
	}
}