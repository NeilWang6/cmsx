package com.apachecms.cmsx.acl.param;

import java.util.List;

/**
 * <pre>ApplyParam</pre>
 * @author liuxinl.lx
 */
public class ApplyParam extends BaseParam {
	private static final long serialVersionUID = 9021268173719444192L;
	
	// 站点id
	private Long siteID;
		
	// 角色code集合
	private List<String> roles;
	
	// 失效日期 为空时为永不失效
    private java.util.Date expiredDate;

	public Long getSiteID() {
		return siteID;
	}

	public void setSiteID(Long siteID) {
		this.siteID = siteID;
	}

	public List<String> getRoles() {
		return roles;
	}

	public void setRoles(List<String> roles) {
		this.roles = roles;
	}

	public java.util.Date getExpiredDate() {
		return expiredDate;
	}

	public void setExpiredDate(java.util.Date expiredDate) {
		this.expiredDate = expiredDate;
	}
}