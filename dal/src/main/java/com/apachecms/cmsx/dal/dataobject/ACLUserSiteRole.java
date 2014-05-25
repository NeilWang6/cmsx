package com.apachecms.cmsx.dal.dataobject;

import java.util.Date;

/**
 * 用户在当前站点下拥有的角色
 * @author qinming.zhengqm
 */
public class ACLUserSiteRole {
	// PK
	private String id;
	
	// 用户标示
    private String userId;
    
    // 站点id
    private Long siteId;
    
    // 角色id
    private String roleId;
    
    // 角色级别
    private int lev;
    
    // 0 申请 1 通过 -1 失效
    private String status;
    
    // 失效日期 为空时为永不失效
    private Date expiredDate;
    
    // 创建日期
    private Date gmtGreate;
    
    // 最后修改日期
    private Date gmtModified;
    
    private String createUser;
    
    private String modifyUser;
    
    private String roleName;
    
    // 不通过用户申请权限时记录原因
    private String message;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Long getSiteId() {
		return siteId;
	}

	public void setSiteId(Long siteId) {
		this.siteId = siteId;
	}

	public String getRoleId() {
		return roleId;
	}

	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Date getExpiredDate() {
		return expiredDate;
	}

	public void setExpiredDate(Date expiredDate) {
		this.expiredDate = expiredDate;
	}

	public Date getGmtGreate() {
		return gmtGreate;
	}

	public void setGmtGreate(Date gmtGreate) {
		this.gmtGreate = gmtGreate;
	}

	public Date getGmtModified() {
		return gmtModified;
	}

	public void setGmtModified(Date gmtModified) {
		this.gmtModified = gmtModified;
	}

	public String getCreateUser() {
		return createUser;
	}

	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}

	public String getModifyUser() {
		return modifyUser;
	}

	public void setModifyUser(String modifyUser) {
		this.modifyUser = modifyUser;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public int getLev() {
		return lev;
	}

	public void setLev(int lev) {
		this.lev = lev;
	}
}