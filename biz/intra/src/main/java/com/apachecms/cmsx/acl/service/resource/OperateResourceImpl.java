package com.apachecms.cmsx.acl.service.resource;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.alibaba.citrus.util.StringUtil;
import com.apachecms.cmsx.acl.IOperateService;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.ResourceParam;
import com.apachecms.cmsx.acl.param.ResourceResult;
import com.apachecms.cmsx.acl.service.cache.CacheModel;
import com.apachecms.cmsx.acl.service.util.ACLConstants;
import com.apachecms.cmsx.dal.dataobject.ACLResource;
import com.apachecms.cmsx.dal.dataobject.ACLUserSiteRole;

@SuppressWarnings("unchecked")
/**
 * 操作资源实现
 * @author liuxinl.lx
 */
@Resource(name="operateService")
public class OperateResourceImpl extends ResourceServiceImpl implements IOperateService {
	@Override
	public ResourceResult listOperates(String appName) throws ACLException {
		ResourceResult result = new ResourceResult(0);
		if (StringUtil.isEmpty(appName)) {
			result.setCode(1);
			result.setMsg("getOperateResources入参为空");
			return result;
		}
		
		// 直接从tair中获取结果
		String key = appName.toUpperCase() + ACLConstants._OPERATE_RESOURCE;
		ArrayList<ResourceParam> params = (ArrayList<ResourceParam>) cacheService.getObj(key);
		if (null != params) {
			result.setParams(params);
			return result;
		}
		
		String msg = null;
		List<ACLResource> list = null;
		try {
			list = this.findByWhere(appName, ACLConstants.ACTION);
		} catch (Exception e) {
			LOG.error("ResourceServiceImpl.getOperateResources", e);
			msg = e.getMessage();
		}
		
		if (null == list || 0 == list.size()) {
			result.setCode(StringUtils.isNotEmpty(msg) ? -1 : 0);
			result.setMsg(msg);
			return result;
		}
		
		params = this.getParams(list, false);
		result.setParams(params);

		// 添加缓存
		CacheModel model = new CacheModel();
		model.setKey(key);
		model.setVal(params);
		this.cacheService.putObj(model);		
		
		return result;
	}
	
	@Override
	public ResourceResult listOperates(String appName, String user, Long siteID, boolean isOutside) throws ACLException {
		ResourceResult result = new ResourceResult(0);
		if (StringUtil.isEmpty(appName) || StringUtil.isEmpty(user) || null == siteID) {
			result.setCode(1);
			result.setMsg("getOperateResources3入参存在为空");
			return result;
		}
		
		// 用户拥有的菜单临时缓存
		String key = new StringBuilder().append(appName.trim().toUpperCase()).append('_')
				.append(siteID).append('_').append(user)
				.append(ACLConstants._OPERATE_RESOURCE).toString();
		ArrayList<ResourceParam> params = (ArrayList<ResourceParam>) this.cacheService.getObj(key);
		if (null != params) {
			result.setParams(params);
			return result;
		}
		
		List<ACLUserSiteRole> roles = null;
		String msg = null;
		try {
			roles = this.aclPermssionDAO.findRolesBySiteAndUser(siteID, user, isOutside, "1");
		} catch (Exception e) {
			LOG.error("ResourceServiceImpl.getOperateResources_1", e);
			msg = e.getMessage();
		}
		
		int s;
		if (null == roles || 0 == (s = roles.size())) {
			result.setCode(StringUtils.isNotEmpty(msg) ? -1 : 0);
			result.setMsg(msg);
			return result;
		}
		
		List<String> roleIds = new ArrayList<String> (s);
		Date now = new Date();
		Date expiredDate;
		for (ACLUserSiteRole temp : roles) {
			expiredDate = temp.getExpiredDate();
			if (null != expiredDate && expiredDate.before(now)) {
				continue;
			}
			roleIds.add(temp.getRoleId());
		}
		
		// 角色过期
		if (roleIds.isEmpty()) {
			return result;
		}
		
		List<ACLResource> list = null;
		try {
			list = this.aclResourceDAO.findResoucesByRoles(appName, new String[] { ACLConstants.ACTION }, roleIds);
		} catch (Exception e) {
			LOG.error("ResourceServiceImpl.getOperateResources_2", e);
			msg = e.getMessage();
		}
		
		if (null == list || 0 == list.size()) {
			result.setCode(StringUtils.isNotEmpty(msg) ? -1 : 0);
			result.setMsg(msg);
			return result;
		}

		params = this.getParams(list, false);
		result.setParams(params);

		// 添加缓存
		CacheModel model = new CacheModel();
		model.setKey(key);
		model.setVal(params);
		this.cacheService.putObj(model);
		
		return result;
	}
	
	@Override
	public HashSet<String> listPermissionCode(String userID, List<Long> siteIDs, boolean isOutside) throws ACLException {
		HashSet<String> result = null;
		int s;
		if (StringUtil.isEmpty(userID) || null == siteIDs || 0 == (s = siteIDs.size())) {
			throw new ACLException("ResourceServiceImpl.listPermissionCode 入参存在空 : userID:" + userID + ", siteIDs:" + siteIDs);
		}
		String appName = ACLConstants.DCMS;
		
		// 检测缓存内容是否更新
		this.notify(ACLConstants.DCMSUP, siteIDs, userID, 1);
		
		// 用户拥有的临时操作缓存
		String key = new StringBuilder().append(ACLConstants.DCMSUP).append('_')
				.append(this.getSiteIDStr(siteIDs)).append('_').append(userID)
				.append(ACLConstants._PERMISSION_TEMP_CACHE).toString();
		
		// 重tair中获取缓存
		result = (HashSet<String>) this.cacheService.getObj(key);
		if (null != result) {
			return result;
		}
		
		// 查询数据库获取用户拥有的权限
		List<ACLResource> list = this.doListPermission(appName, userID, siteIDs, isOutside, 0);
			
		s = 0;
		if (null == list || 0 == (s = list.size())) {
			return result;
		}
		
		result = new HashSet<String> (s);
		String url;
		ACLResource temp;
		for (int i = 0; i < s; i++) {
			temp = list.get(i);
			url = temp.getUrl();
			if (StringUtil.isEmpty(url) || StringUtil.indexOf(url, ACLConstants.LEFT_SLASH) > -1 || StringUtil.indexOf(url, ACLConstants.SPOT) > -1) {
				continue;
			}
			result.add(url);
		}
		
		// 添加缓存
		CacheModel model = new CacheModel();
		model.setKey(key);
		model.setVal(result);
		model.setExpireTime(DEFAULT_TIMEOUT);
		this.cacheService.putObj(model);
		
		return result;
	}
}