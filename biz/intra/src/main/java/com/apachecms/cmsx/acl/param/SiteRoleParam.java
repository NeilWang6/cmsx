package com.apachecms.cmsx.acl.param;

import java.util.List;

/**
 * <pre>SiteRoleParam</pre>
 * @author liuxinl.lx
 */
public class SiteRoleParam extends BaseParam {
	private static final long serialVersionUID = -4386723285072697854L;

	// 站点id
	private Long siteID;
	
	// 申请中角色
	private List<RoleParam> applyRoles;
	
	// 以通过且未过期角色
	private List<RoleParam> grantRoles;
	
	// 被取消的角色
	private List<RoleParam> cancelRoles;
	
	public Long getSiteID() {
		return siteID;
	}

	public void setSiteID(Long siteID) {
		this.siteID = siteID;
	}

	public List<RoleParam> getApplyRoles() {
		return applyRoles;
	}

	public void setApplyRoles(List<RoleParam> applyRoles) {
		this.applyRoles = applyRoles;
	}

	public List<RoleParam> getGrantRoles() {
		return grantRoles;
	}

	public void setGrantRoles(List<RoleParam> grantRoles) {
		this.grantRoles = grantRoles;
	}

	public List<RoleParam> getCancelRoles() {
		return cancelRoles;
	}

	public void setCancelRoles(List<RoleParam> cancelRoles) {
		this.cancelRoles = cancelRoles;
	}
}