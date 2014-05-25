package com.apachecms.cmsx.acl.service.resource;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

import javax.annotation.Resource;

import com.alibaba.citrus.util.StringUtil;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.service.cache.CacheModel;
import com.apachecms.cmsx.acl.service.util.ACLConstants;
import com.apachecms.cmsx.dal.dataobject.ACLResource;

@SuppressWarnings("unchecked")
/**
 * <pre>PermissonResourceServiceImpl</pre>
 * @author liuxinl.lx
 */
@Resource(name="permissonResourceService")
public class PermissonResourceServiceImpl extends ResourceServiceImpl implements IPermissonResourceService {

	@Override
	public HashSet<String> findWhiteResByAppName(String appName) throws ACLException {
		if (StringUtil.isEmpty(appName)) {
			throw new ACLException("ResourceServiceImpl.findWhiteResByAppName 入参存在空 .");
		}
		String key = appName.trim().toUpperCase() + ACLConstants._RESOURCE_WHITE;
		HashSet<String> set = (HashSet<String>) this.cacheService.getObj(key);
		if (null != set) {
			return set;
		}

		List<ACLResource> list = this.findByWhere(appName, null, true);
		int s;
		if (null == list || 0 == (s = list.size())) {
			return set;
		}
		set = new HashSet<String> (s);
		String url;
		String type;
		ACLResource temp;
		int l;
		for (int i = 0; i < s; i++) {
			temp = list.get(i);
			url  = temp.getUrl();
			type = temp.getResourceType();
			if (StringUtil.isEmpty(url)) {
				continue;
			}
			if (!ACLConstants.ACTION.equals(type) && (l = StringUtil.indexOf(url, ACLConstants.SPOT)) > -1) {
				url = StringUtil.substring(url, 0, l);
			}
			set.add(StringUtil.toCamelCase(url));
		}

		if (set.size() > 0) {
			// 添加缓存
			CacheModel model = new CacheModel();
			model.setKey(key);
			model.setVal(set);
			this.cacheService.putObj(model);
		}
		return set;
	}

	@Override
	public HashMap<String, List<String>> findGeneralResByAppNameAndResType(String appName, int resType) throws ACLException {
		if (StringUtil.isEmpty(appName)) {
			throw new ACLException("ResourceServiceImpl.findGeneralResByAppNameAndResType 入参存在空 .");
		}
		String appNameUp = appName.trim().toUpperCase();
		String key = appNameUp + ((0 == resType) ? ACLConstants._ACTION_RESOURCE_GENERAL : ACLConstants._URL_RESOURCE_GENERAL);
		HashMap<String, List<String>> map = (HashMap<String, List<String>>) this.cacheService.getObj(key);
		if (null != map) {
			return map;
		}

		String resourceTypes[] = (0 == resType) ? new String[] { ACLConstants.ACTION } : new String[] { ACLConstants.MENU, ACLConstants.URL };
		List<ACLResource> list = this.findByWhere(appName, resourceTypes, false);
		int s;
		if (null == list || 0 == (s = list.size())) {
			return map;
		}
		map = new HashMap<String, List<String>> ();
		String url;
		int l;
		ACLResource temp;
		for (int i = 0; i < s; i++) {
			temp = list.get(i);
			url = temp.getUrl();
			if (StringUtil.isEmpty(url)) {
				continue;
			}
//			if (0 != resType && (l = StringUtil.indexOf(url, ACLConstants.SPOT)) > -1) {
//				url = StringUtil.substring(url, 0, l);
//			}
//			url = StringUtil.toCamelCase(url);
			if (0 != resType) {
				if ((l = StringUtil.indexOf(url, ACLConstants.SPOT)) > -1) {
					url = StringUtil.substring(url, 0, l);
				}
				url = StringUtil.toCamelCase(url);
			}
			List<String> values = map.get(url);
			if (null == values) {
				values = new ArrayList<String> ();
				map.put(url, values);
			}
			values.add(temp.getId());
		}
		
		// 添加缓存
		CacheModel model = new CacheModel();
		model.setKey(key);
		model.setVal(map);
		this.cacheService.putObj(model);
		
		return map;
	}
}