package com.apachecms.cmsx.acl.service.resource;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.alibaba.citrus.util.StringUtil;
import com.apachecms.cmsx.acl.IMenuService;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.ResourceParam;
import com.apachecms.cmsx.acl.param.ResourceResult;
import com.apachecms.cmsx.acl.service.cache.CacheModel;
import com.apachecms.cmsx.acl.service.util.ACLConstants;
import com.apachecms.cmsx.dal.dataobject.ACLResource;
import com.apachecms.cmsx.dal.dataobject.ACLUserSiteRole;

/**
 * 菜单资源实现
 * @author liuxinl.lx
 */
@Resource(name="menuResource")
public class MenuResourceImpl extends ResourceServiceImpl implements IMenuService {
	private static final Log LOG = LogFactory.getLog(MenuResourceImpl.class);
	
	@Override
	public ResourceResult listMenu(String appName) throws ACLException {
		ResourceResult result = new ResourceResult(0);
		if (StringUtil.isEmpty(appName)) {
			result.setCode(1);
			result.setMsg("MenuResourceImpl.listMenu_1 入参为空, appName:" + appName);
			return result;
		}
		
		appName = appName.trim();
		
		// 获取菜单数据信息
		List<ACLResource> list = this.findByWhere(appName, ACLConstants.MENU);
		if (null == list || 0 == list.size()) {
			return result;
		}
		
		ArrayList<ResourceParam> params = this.getParams(list, true);
		result.setParams(params);
		
		return result;
	}

	@SuppressWarnings("unchecked")
	@Override
	public ResourceResult listTreeMenu(String appName) throws ACLException {
		ResourceResult result = new ResourceResult(0);
		if (StringUtil.isEmpty(appName)) {
			result.setCode(1);
			result.setMsg("MenuResourceImpl.listTreeMenu_1 入参为空, appName:" + appName);
			return result;
		}
		
		appName = appName.trim();
		String appNameUp = appName.toUpperCase();
		
		// 直接从tair中获取结果
		String key = appNameUp + ACLConstants._MENU_RESOURCE_TREE;
		ArrayList<ResourceParam> params = null;
		if(cacheService!=null){
			params = (ArrayList<ResourceParam>) cacheService.getObj(key);
		}
		if (null != params) {
			result.setParams(params);
			return result;
		}
		
		// 获取菜单数据信息
		List<ACLResource> list = this.findByWhere(appName, ACLConstants.MENU);
		if (null == list || 0 == list.size()) {
			return result;
		}
		
		// 转换树
		params = this.listTreeMenu(list);
		result.setParams(params);
		
		// 添加缓存
		CacheModel model = new CacheModel();
		model.setKey(key);
		model.setVal(params);
		if(cacheService!=null){
			this.cacheService.putObj(model);
		}
		
		return result;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public ResourceResult listTreeMenu(String appName, Long siteID, String userID, boolean isOutside) throws ACLException {
		ResourceResult result = new ResourceResult(0);
		if (StringUtil.isEmpty(appName) || StringUtil.isEmpty(userID) || null == siteID) {
			result.setCode(1);
			result.setMsg("MenuResourceImpl.listTreeMenu_4入参存在为空, appName:" + appName + ", userID:" + userID + ", siteID:" + siteID + ", isOutside:" + isOutside);
			return result;
		}
		
		appName = appName.trim();
		String appNameUp = appName.toUpperCase();
		
		// 检测缓存内容是否更新
		this.notify(appNameUp, siteID, userID);
		
		// 用户拥有的菜单临时缓存
		String key = appNameUp + "_" + siteID + "_" + userID + ACLConstants._MENU_RESOURCE_TREE;
		ArrayList<ResourceParam> params = null;
		if(cacheService!=null){
			params = (ArrayList<ResourceParam>) this.cacheService.getObj(key);
		}
		if (null != params) {
			result.setParams(params);
			return result;
		}
		
		// 根据站点id和用户查询当前用户拥有的角色
		List<Long> siteIDs = new ArrayList<Long> (2);
		siteIDs.add(siteID);
		List<ACLUserSiteRole> roles = this.findRolesBySiteAndUser(siteIDs, userID, isOutside);
		int s = 0;
		if (null == roles || 0 == (s = roles.size())) {
//			result.setMsg(userID + "在站点[" + siteID + "]下还没有申请角色");
//			return result;
			LOG.warn(userID + "在站点[" + siteID + "]下还没有申请角色");
		}
		
		// 用于判断是否存在系统管理员
		boolean isSystem = false;
		List<String> roleIDs = null;
		if (s > 0) {
			roleIDs = new ArrayList<String> (s);
			Date now = new Date();
			Date expiredDate;
			for (ACLUserSiteRole temp : roles) {
				expiredDate = temp.getExpiredDate();
				if (null != expiredDate && expiredDate.before(now)) {
					continue;
				}
				roleIDs.add(temp.getRoleId());
				if (SYSTEM_LEV == temp.getLev()) {
					isSystem = true;
					break;
				}
			}								
		}
		
		List<ACLResource> list = null;
		
		// 角色过期
		if (null == roleIDs || 0 == roleIDs.size()) {
//			result.setMsg(userID + "在站点[" + siteID + "]下申请的角色已过期.");
			LOG.warn(userID + "在站点[" + siteID + "]下申请的角色已过期.");
			// 查询白名单
			ACLResource res = new ACLResource();
			res.setIsDelete(ACLConstants.EFFECTIVE);
			res.setResourceType(ACLConstants.MENU);
			res.setIsWhite(ACLConstants.WHITE);
			res.setAppName(appName);
			list = this.findByWhere(res);
		} else {
			// 查询角色对应的菜单权限集合
			list = isSystem ? this.findByWhere(appName, ACLConstants.MENU)
					: this.findResoucesByRoles(appName, new String[] { ACLConstants.MENU }, roleIDs, true);
		}
		
		if (null == list || 0 == list.size()) {
			result.setMsg("角色" + roleIDs + "没有对应的菜单资源.");
			return result;
		}
		
		// 转换树
		params = this.listTreeMenu(list);
		result.setParams(params);
		
		// 添加缓存
		CacheModel model = new CacheModel();
		model.setKey(key);
		model.setVal(params);
		model.setExpireTime(DEFAULT_TIMEOUT);
		if(cacheService!=null){
			this.cacheService.putObj(model);
		}
		return result;
	}
	
	/**
	 * 转换树
	 * @param list
	 * @return
	 */
	private ArrayList<ResourceParam> listTreeMenu(List<ACLResource> list) {
		ArrayList<ResourceParam> params = null;
		int s;
		if (null == list || 0 == (s = list.size())) {
			return params;
		}
		
		params = new ArrayList<ResourceParam> ();
		Map<String, ResourceParam> paramMap = new HashMap<String, ResourceParam> ();
		ResourceParam param, pparam;
		String id, pid;
		ACLResource temp;
		
		// 组织一级节点
		for (int i = 0; i < s; i++) {
			temp  = list.get(i);
			id    = temp.getId();
			pid   = temp.getParentId();
			param = new ResourceParam();
			param.setId(id);
			param.setParent(pid);
			param.setCode(temp.getResourceCode());
			param.setName(temp.getName());
			param.setResourceType(temp.getResourceType());
			param.setUrl(temp.getUrl());
			param.setDescription(temp.getDescription());
			if (null == pid) {
				params.add(param);
			}
			paramMap.put(id, param);
		}
		
		// 用于去重,多个角色对应相同的权限
		Set<String> set = new HashSet<String> ();

		// 组织子节点
		List<ResourceParam> sonList = null;
		for (int i = 0; i < s; i++) {
			temp = list.get(i);
			id   = temp.getId();
			pid  = temp.getParentId();
			// pid为空为一级节点,pparam为空则是当前菜单的父菜单没有被授权
			if (null == pid || set.contains(id) || null == (pparam  = paramMap.get(pid))) {
				continue;
			}
			param   = paramMap.get(id);
			sonList = pparam.getParams();
			sonList = null == sonList ? new ArrayList<ResourceParam>() : sonList;
			pparam.setParams(sonList);
			sonList.add(param);
			set.add(id);
		}
		
		set = null;
		
		return params;
	}
}