package com.apachecms.cmsx.acl.service.resource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import com.alibaba.citrus.util.StringUtil;
import com.apachecms.cmsx.acl.IResourceService;
import com.apachecms.cmsx.acl.param.ResourceParam;
import com.apachecms.cmsx.acl.service.cache.CacheService;
import com.apachecms.cmsx.acl.service.cache.CacheValue;
import com.apachecms.cmsx.acl.service.config.ACLConfig;
import com.apachecms.cmsx.acl.service.util.ACLConstants;
import com.apachecms.cmsx.dal.dataobject.ACLResource;

/**
 * <pre>AbstractResourceService</pre>
 * @author liuxinl.lx
 */
public abstract class AbstractResourceService implements IResourceService {
	protected static final int DEFAULT_TIMEOUT             = 10 * 60;
	private   static final int DEFAULT_CACHE_SIZE          = 200;
	private                int cacheSize                   = DEFAULT_CACHE_SIZE;
	
	// 缓存接口
	protected CacheService cacheService;
	
	// ACL全局配置信息
	private ACLConfig aclConfig;
	
	/**
	 * 构造函数
	 */
	public AbstractResourceService() {
	}
	
	private final List<String> tempList = Collections.synchronizedList(new LinkedList<String> ());
	private final ConcurrentMap<String, Date> notifyCache = new ConcurrentHashMap<String, Date> ();
	
	/**
	 * 基于fifo的添加方法
	 * @param key
	 */
	private void putObj(String key, Date date) {
		this.notifyCache.putIfAbsent(key, date);
		tempList.add(key);
//		if (tempList.size() > cacheSize) {
//			try {
//				String removeKey = tempList.remove(0);
//				this.notifyCache.remove(removeKey);
//			} catch (Exception e) {
//			}
//		}
	}
	
	/**
	 * 消息通知,清除掉角色更新对应的用户临时缓存
	 * @param appName
	 * @param siteID
	 * @param userID
	 */
	protected void notify(String appNameUP, Long siteID, String userID) {
		this.notify(appNameUP, Arrays.asList(siteID), userID, 0);
	}
	
	private HashMap<String, CacheValue<String>> getObj(String key){
		if(cacheService!=null){
			return (HashMap<String, CacheValue<String>>) this.cacheService.getObj(key);
		}
		return null;
	}
	
	@SuppressWarnings("unchecked")
	/**
	 * 消息通知,清除掉角色更新对应的用户临时缓存
	 * @param appName
	 * @param siteIDs
	 * @param userID
	 * @param type
	 */
	protected void notify(String appNameUP, List<Long> siteIDs, String userID, int type) {
		if (StringUtil.isEmpty(appNameUP) || null == siteIDs || StringUtil.isEmpty(userID)) {
			return;
		}
		String key = appNameUP + ACLConstants._ROLE_RES_CHANGE_SET;
		HashMap<String, CacheValue<String>> map = getObj(key);
        // 判断角色是否存在资源变更
		if (null == map) {
			return;
		}
		
		int s;
		Map<String, CacheValue<String>> tempMap = new HashMap<String, CacheValue<String>> (map);
		// 防止并发问题
		if (0 == (s = tempMap.size())) {
			return;
		}
		
		List<String> roleIDs = new ArrayList<String> (s);
		Date now = new Date(), time, maxTimeout = now;
		boolean flag = false;
		CacheValue<String> e;
		for (Iterator<Map.Entry<String, CacheValue<String>>> iter = tempMap.entrySet().iterator();iter.hasNext();) {
			e = iter.next().getValue();
			// 角色变更资源缓存过期
			if (null == (time = e.getTime()) || now.after(time)) {
				flag = true;
				continue;
			}
			maxTimeout = (time.after(maxTimeout)) ? time : maxTimeout;
			roleIDs.add(e.getVal());
		}
		
		// 资源变更角色发送变化
		if (flag) {
			this.notifyCache.clear();
			this.tempList.clear();
		}

		if (0 == roleIDs.size()) {
			roleIDs = null;
			return;
		}
		
		key = appNameUP + this.getSiteIDStr(siteIDs) + userID + type;
		Date timeout;
		if (null != (timeout = notifyCache.get(key)) && (timeout.compareTo(maxTimeout)) > -1) {
			return;
		}
		
		// 是否拥有角色集合中的一个角色
		try {
			if (this.hasExistRoles(siteIDs, userID, roleIDs)) {
				// 清理当前用户对应的临时缓存
				this.doClearTempCache(appNameUP, siteIDs, userID, type);
			}

		} finally {
			this.putObj(key, maxTimeout);
		}
	}
	
	/**
	 * 清理临时缓存
	 * @param appNameUP
	 * @param siteIDs
	 * @param userID
	 */
	private void doClearTempCache(String appNameUP, List<Long> siteIDs, String userID, int type) {
		// 清理当前用户对应的临时缓存
		List<String> keys = new ArrayList<String> (5);
		if (0 == type) {
			Long siteID = siteIDs.get(0);
			// 个人在站点下的临时菜单缓存
			keys.add(appNameUP + "_" + siteID + "_" + userID + ACLConstants._MENU_RESOURCE_TREE);
			// 个人在站点下的临时权限缓存
			keys.add(appNameUP + _SITE_ + siteID + _ROLES_RESOURCES_ + userID);
			//
			keys.add(appNameUP + ACLConstants._URL_RESOURCE_GENERAL);
			keys.add(appNameUP + ACLConstants._ACTION_RESOURCE_GENERAL);
		} else {
			// 用户拥有的临时操作缓存
			keys.add(appNameUP + "_" + this.getSiteIDStr(siteIDs) + "_" + userID + ACLConstants._PERMISSION_TEMP_CACHE);
		}
		if(this.cacheService!=null){
			this.cacheService.removeObj(keys);
		} 
	}
	
	protected String getSiteIDStr(List<Long> siteIDs) {
		String ret = "";
		int s;
		if (null == siteIDs || 0 == (s = siteIDs.size())) {
			return ret;
		}

		if (1 == s) {
			return String.valueOf(siteIDs.get(0));
		}

		for (int i = 0; i < s; i++) {
			ret += String.valueOf(siteIDs.get(i));
		}
		return ret;
	}
	
	// 临时缓存用户在当前系统中拥有的角色
	public static final String _SITE_             = "_SITE_";
	public static final String _ROLES_RESOURCES_  = "_ROLES_RESOURCES_";
	
	/**
	 * 用户在当前站点下是否拥有角色集合
	 * @param siteID
	 * @param userID
	 * @param roleIDs
	 * @return
	 */
	protected abstract boolean hasExistRoles(List<Long> siteID, String userID, List<String> roleIDs);
	
	/**
	 * 清除缓存
	 * @param appName
	 * @param resourceType
	 */
	protected void clear(String appName, String resourceType) {
		if (StringUtil.isEmpty(appName) || StringUtil.isEmpty(resourceType)) {
			return;
		}
		String appNameUp = appName.trim().toUpperCase(); 
		List<String> keys = new ArrayList<String> ();
		if (ACLConstants.ACTION.equalsIgnoreCase(resourceType)) {
			keys.add(appNameUp + ACLConstants._OPERATE_RESOURCE);
			keys.add(appNameUp + ACLConstants._ACTION_RESOURCE_GENERAL);
		}
		else if (ACLConstants.MENU.equalsIgnoreCase(resourceType)) {
			keys.add(appNameUp + ACLConstants._MENU_RESOURCE_TREE);
		}
		else if (ACLConstants.URL.equalsIgnoreCase(resourceType)) {
			keys.add(appNameUp + ACLConstants._URL_RESOURCE_GENERAL);
		}
		// 白名单缓存清除
		keys.add(appNameUp + ACLConstants._RESOURCE_WHITE);
		if(this.cacheService!=null){
			this.cacheService.removeObj(keys);
		} 
	}
	
	protected ArrayList<ResourceParam> getParams(List<ACLResource> list, boolean flag) {
		ArrayList<ResourceParam> params = null;
		int s;
		if (null == list || 0 == (s = list.size())) {
			return params;
		}
		params = new ArrayList<ResourceParam> (s);
			
		ACLResource temp;
		ResourceParam param;
		String parent = "";
		String url;
		String id;
		Set<String> set = new HashSet<String> (s);
		for (int i = 0; i < s; i++) {
			temp = list.get(i);
			id  = temp.getId();
			if (set.contains(id)) {
				continue;
			}
			set.add(id);
			url = temp.getUrl();
			param = new ResourceParam();
			param.setId(temp.getId());
			parent = temp.getParentId();
			parent = (StringUtil.isEmpty(parent)) ? "" : parent;
			param.setParent(parent);
			param.setCode(temp.getResourceCode());
			param.setName(temp.getName());
			param.setResourceType(temp.getResourceType());
			param.setDescription(temp.getDescription());
			param.setIsWhite(temp.getIsWhite());
			param.setFullUrl(url);
			int l;
			if (!flag && (l = StringUtil.indexOf(url, ACLConstants.SPOT)) > -1) {
				url = StringUtil.substring(url, 0, l);
				url = StringUtil.toCamelCase(url);
			}
			param.setUrl(url);
			params.add(param);
		}
		set = null;
		return params;
	}

	public void setCacheService(CacheService cacheService) {
		this.cacheService = cacheService;
	}

	public void setCacheSize(int cacheSize) {
		this.cacheSize = cacheSize;
	}

	public void setAclConfig(ACLConfig aclConfig) {
		this.aclConfig = aclConfig;
	}
}