package com.apachecms.cmsx.acl.service.permission;

import com.apachecms.cmsx.acl.IApplyService;
import com.apachecms.cmsx.acl.exception.ACLException;

/**
 * 兼容DCMS申请权限
 * @author liuxinl.lx
 */
public interface IDcmsApplyService extends IApplyService {
	/**
	 * 申请资源权限
	 * @param resourceID
	 * @param resourceType
	 * @param userID
	 * @param isOutsite
	 * @throws ACLException
	 */
	void applyResPermission(String resourceID, String resourceType, String userID, boolean isOutsite) throws ACLException;
}