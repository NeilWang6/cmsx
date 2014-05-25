package com.apachecms.cmsx.acl.service.cache.support;

import java.io.Serializable;
import java.util.List;

import com.apachecms.cmsx.acl.service.cache.CacheModel;
import com.apachecms.cmsx.acl.service.cache.CacheService;

/**
 * tair实现
 * @author liuxinl.lx
 */
public class TairCacheService implements CacheService {
//	private TairManagerService tairManagerService;
	
	public TairCacheService() {
		
	}
	
//	public TairCacheService(TairManagerService tairManagerService) {
//		this.tairManagerService = tairManagerService;
//	}

	@Override
	public Object getObj(Serializable key) {
		return null; //this.tairManagerService.get(key);
	}

	@Override
	public void putObj(CacheModel model) {
		if (null == model) {
			return;
		}

		try {
//			this.tairManagerService.put(model.getKey(), model.getVal(), model.getExpireTime());
		} catch (Exception e) {
		}
	}

	@Override
	public void putObj(List<CacheModel> params) {
		int s;
		if (null == params || 0 == (s = params.size())) {
			return;
		}
		for (int i = 0; i < s; i++) {
			this.putObj(params.get(i));
		}
	}

	@Override
	public void removeObj(java.io.Serializable key) {
		try {
//			this.tairManagerService.remove(key);
		} catch (Exception e) {
		}
	}
	
	@Override
	public void removeObj(List<? extends java.io.Serializable> keys) {
		int s;
		if (null == keys || 0 == (s = keys.size())) {
			return;
		}
		for (int i = 0; i < s; i++) {
			this.removeObj((java.io.Serializable) keys.get(i));
		}
	}

//	public void setTairManagerService(TairManagerService tairManagerService) {
//		this.tairManagerService = tairManagerService;
//	}
}