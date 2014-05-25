package com.apachecms.cmsx.acl.service.permission.support;

import java.util.List;

import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.PermissionParam;
import com.apachecms.cmsx.acl.service.param.CheckPermissionParam;
import com.apachecms.cmsx.acl.service.permission.ICheckPermissionService;
import com.apachecms.cmsx.dal.dataobject.ACLSiteRole;

/**
 * 系统管理员验权
 * @author liuxinl.lx
 */
public class SystemManagerPermissionService implements ICheckPermissionService {

	@Override
	public CheckPermissionParam check(List<ACLSiteRole> roles, PermissionParam param, boolean checkAction)
			throws ACLException {
		CheckPermissionParam param0 = new CheckPermissionParam();
		param0.setHasAction(true);
		param0.setCheckUrl(true);
		param0.setHasUrl(true);
		return param0;
	}

}
