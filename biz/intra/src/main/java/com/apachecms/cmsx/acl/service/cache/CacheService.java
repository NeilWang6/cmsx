package com.apachecms.cmsx.acl.service.cache;

import java.util.List;

/**
 * 缓存服务
 * @author liuxinl.lx
 */
public interface CacheService {
	/**
	 * 获取缓存信息
	 * @param key
	 * @return
	 */
	Object getObj(java.io.Serializable key);
	
	/**
	 * 添加缓存
	 * @param param
	 */
	void putObj(CacheModel model);
	
	/**
	 * 添加缓存
	 * @param params
	 */
	void putObj(List<CacheModel> params);
	
	/**
	 * 删除缓存
	 * @param key
	 */
	void removeObj(java.io.Serializable key);
	
	/**
	 * 删除缓存
	 * @param keys
	 */
	void removeObj(List<? extends java.io.Serializable> keys);
}