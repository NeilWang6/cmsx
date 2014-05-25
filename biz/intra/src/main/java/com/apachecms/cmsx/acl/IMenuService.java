package com.apachecms.cmsx.acl;

import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.ResourceResult;

/**
 * 菜单接口, url扩展接口
 * <pre>IMenuService</pre>
 * @author lx
 */
public interface IMenuService extends IResourceService {
	/**
	 * 查询全部菜单
	 * @param appName
	 * @return
	 * @throws ACLException
	 */
	ResourceResult listMenu(String appName) throws ACLException;

	/**
	 * 查询全部菜单
	 * @param appName 应用名
	 * @return
	 * @throws ACLException
	 */
	ResourceResult listTreeMenu(String appName) throws ACLException;

	/**
	 * 根据用户标示<pre>userID</pre>查询菜单信息,包括子菜单信息
	 * @param appName
	 * @param siteID
	 * @param userID
	 * @param isOutside
	 * @return
	 * @throws ACLException
	 */
	ResourceResult listTreeMenu(String appName, Long siteID, String userID, boolean isOutside) throws ACLException;
}