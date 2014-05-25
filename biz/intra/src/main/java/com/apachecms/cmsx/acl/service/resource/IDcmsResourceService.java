package com.apachecms.cmsx.acl.service.resource;

import java.util.HashSet;

import com.apachecms.cmsx.acl.IResourceService;
import com.apachecms.cmsx.acl.exception.ACLException;

/**
 * 资源接口,兼容DCMS
 * @author liuxinl.lx
 */
public interface IDcmsResourceService extends IResourceService {

	@Deprecated
	/**
	 * 查询用户拥有的全部菜单信息不含级联关系,兼容dcms现有逻辑使用
	 * @param appName
	 * @param userID
	 * @param siteID
	 * @param isOutside
	 * @return
	 * @throws ACLException
	 */
	HashSet<String> listPermission(String appName, String userID, Long siteID, boolean isOutside) throws ACLException;
}