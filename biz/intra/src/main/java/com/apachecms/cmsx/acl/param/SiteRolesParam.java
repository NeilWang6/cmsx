package com.apachecms.cmsx.acl.param;

import java.util.List;
import java.util.Map;

/**
 * <pre>SiteRolesParam</pre>
 * @author liuxinl.lx
 */
public class SiteRolesParam {
	
	private Map<Long, SiteRoleParam> siteRoleParams;
	
	private List<String> siteManager;

	public Map<Long, SiteRoleParam> getSiteRoleParams() {
		return siteRoleParams;
	}

	public void setSiteRoleParams(Map<Long, SiteRoleParam> siteRoleParams) {
		this.siteRoleParams = siteRoleParams;
	}

	public List<String> getSiteManager() {
		return siteManager;
	}

	public void setSiteManager(List<String> siteManager) {
		this.siteManager = siteManager;
	}
}