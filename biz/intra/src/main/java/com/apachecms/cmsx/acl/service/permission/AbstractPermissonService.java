package com.apachecms.cmsx.acl.service.permission;

import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;

import com.alibaba.citrus.util.StringUtil;
import com.apachecms.cmsx.acl.IPermissionService;
import com.apachecms.cmsx.acl.service.permission.support.OtherPermissionService;

public abstract class AbstractPermissonService implements IPermissionService {
	protected static final String SPOT = "*";
	protected final ICheckPermissionService defaultCheckPermissionService;
	protected Map<Long, ICheckPermissionService> checkPermissionServiceFactory;
	
	public AbstractPermissonService() {
		this.defaultCheckPermissionService = new OtherPermissionService();
	}

	/**
	 * @param level
	 * @return
	 */
	protected ICheckPermissionService getCheckPermission(Long level) {
		ICheckPermissionService checkPermissionService = this.checkPermissionServiceFactory.get(level);
		if (null == checkPermissionService) {
			checkPermissionService = this.defaultCheckPermissionService;
		}
		return checkPermissionService;
	}
	
	/**
	 * 验证
	 * @param set
	 * @param url
	 * @return
	 */
	protected boolean check(HashSet<String> set, String url) {
		if (null == set || 0 == set.size()) {
			return false;
		}
		
		if (set.contains(url)) {
			return true;
		}

		int s;
		String u, t;
		boolean flag = false;
		for (Iterator<String> iter = set.iterator(); iter.hasNext();) {
			u = iter.next();
			s = u.length();
			t = StringUtil.substring(u, s - 1, s);
			if (!SPOT.equals(t)) {
				continue;
			}
			u = StringUtil.substring(u, 0, s - 1);
			if (url.indexOf(u, 0) > -1) {
				flag = true;
				break;
			}
		}
		
		return flag;
	}

	public void setCheckPermissionServiceFactory(Map<Long, ICheckPermissionService> checkPermissionServiceFactory) {
		this.checkPermissionServiceFactory = checkPermissionServiceFactory;
	}
}