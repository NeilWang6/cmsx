package com.apachecms.cmsx.acl.service.permission;

import java.util.List;

import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.PermissionParam;
import com.apachecms.cmsx.acl.service.param.CheckPermissionParam;
import com.apachecms.cmsx.dal.dataobject.ACLSiteRole;

public interface ICheckPermissionService {

	/**
	 * 验权
	 * @param roles
	 * @param param
	 * @return
	 * @throws ACLException
	 */
	CheckPermissionParam check(List<ACLSiteRole> roles, PermissionParam param, boolean checkAction) throws ACLException;
}