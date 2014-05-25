package com.apachecms.cmsx.acl.service.permission;

import com.apachecms.cmsx.acl.IPermissionService;

/**
 * 验权接口,兼容DCMS
 * @author liuxinl.lx
 */
public interface IDcmsPermissionService extends IPermissionService {
	@Deprecated
	/**
	 * 此方法为兼容dcms验证菜单权限使用
	 * @param userid
	 * @param url
	 * @param resourceId
	 * @param isOutside
	 * @return
	 */
	boolean hasUrlResourcePermissionFor(String userid, String url, Long resourceId, boolean isOutside);
	
	@Deprecated
	/**
	 * 此方法为兼容dcms验证code权限使用
	 * @param userid
	 * @param url
	 * @param resourceId
	 * @param isOutside
	 * @return
	 */
	public boolean hasUrlResourcePermissionForAction(String userid, String url, Long resourceId, boolean isOutside);
}