package com.apachecms.cmsx.acl.service.resource;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import javax.annotation.Resource;

import com.alibaba.citrus.util.StringUtil;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.service.cache.CacheModel;
import com.apachecms.cmsx.acl.service.util.ACLConstants;
import com.apachecms.cmsx.dal.dataobject.ACLResource;

/** 
 * 资源接口,兼容 
 * @author qinming.zhengqm
 */
@Resource(name="dcmsResourceService")
public class DcmsResourceServiceImpl extends ResourceServiceImpl implements IDcmsResourceService {

	@SuppressWarnings("unchecked")
	@Override
	public HashSet<String> listPermission(String appName, String userID, Long siteID, boolean isOutside) throws ACLException {
		HashSet<String> result = null;
		if (StringUtil.isEmpty(appName) || StringUtil.isEmpty(userID) || null == siteID) {
			throw new ACLException("DcmsResourceServiceImpl.listPermission_4 入参存在空 , appName：" + appName + ", userID:" + userID + ", isOutside:" + isOutside + ", siteID:" + siteID);
		}
		
		appName = appName.trim();
		
		// 用户拥有的菜单临时缓存
		String key = new StringBuilder().append(appName.toUpperCase()).append('_')
				.append(siteID).append('_').append(userID)
				.append(ACLConstants._MENU_TEMP_CACHE).toString();
		result = (HashSet<String>) this.cacheService.getObj(key);
		if (null != result) {
			return result;
		}
		
		// 查询数据库获取用户拥有的权限
		List<Long> siteIDs = new ArrayList<Long> (2);
		siteIDs.add(siteID);
		List<ACLResource> list = this.doListPermission(appName, userID, siteIDs, isOutside, 0);
		
		int s;
		if (null == list || 0 == (s = list.size())) {
			return result;
		}
		
		result = new HashSet<String> (s);
		String url;
		String id;
		ACLResource temp;
		for (int i = 0; i < s; i++) {
			temp = list.get(i);
			url = temp.getUrl();
			id  = temp.getId();
			if (StringUtil.isEmpty(url)) {
				continue;
			}
			result.add(id);
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