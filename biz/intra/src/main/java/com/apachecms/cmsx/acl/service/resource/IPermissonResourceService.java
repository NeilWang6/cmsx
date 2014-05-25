package com.apachecms.cmsx.acl.service.resource;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

import com.apachecms.cmsx.acl.IResourceService;
import com.apachecms.cmsx.acl.exception.ACLException;

/**
 * 与权限相关的资源信息
 * @author liuxinl.lx
 */
public interface IPermissonResourceService extends IResourceService {
	/**
	 * 根据<pre>appName</pre>查询当前系统的白名单资源
	 * ps:白名单资源包括 menu:菜单 url:普通url action:操作
	 * 白名单资源需要tair缓存,以提高效率 key设计:系统名+常量(_RESOURCE_WHITE) 例如 DCMS_RESOURCE_WHITE
	 * 
	 * @return
	 * @throws ACLException
	 */
	HashSet<String> findWhiteResByAppName(String appName) throws ACLException;
	
	/**
	 * 根据<pre>appName</pre>和<pre>resType</pre>查询当前系统的普通资源
	 * ps:普通资源包括 menu:菜单 url:普通url action:操作
	 * 普通资源需要tair分别缓存:如 DCMS_URL_RESOURCE_GENERAL    (菜单url和url缓存key)
	 *                     DCMS_ACTION_RESOURCE_GENERAL (action缓存key)
	 * 
	 * @param appName
	 * @param resType
	 * @return
	 * @throws ACLException
	 */
	public HashMap<String, List<String>> findGeneralResByAppNameAndResType(String appName, int resType) throws ACLException;
}