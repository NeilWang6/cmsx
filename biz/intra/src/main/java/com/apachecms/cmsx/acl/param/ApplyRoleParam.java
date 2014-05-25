package com.apachecms.cmsx.acl.param;

import java.text.SimpleDateFormat;

/**
 * 申请角色信息
 * @author liuxinl.lx
 */
public class ApplyRoleParam {
	// 申请表id
	private String id;

	// 用户标示
	private String userID;
	
	// 角色id
	private String roleID;
	
	// 角色名
	private String roleName;
	
	// 0 申请 1 通过 -1 失效
    private String status;
    
    // 创建日期
    private java.util.Date gmtGreate;
    
    // 创建日期
    private String gmtGreateStr;
    
    // 最后修改日期
    private java.util.Date gmtModified;
    
    // 最后修改日期
    private String gmtModifiedStr;
    
    // 不通过用户申请权限时记录原因
    private String message;

	public String getUserID() {
		return userID;
	}

	public void setUserID(String userID) {
		this.userID = userID;
	}

	public String getRoleID() {
		return roleID;
	}

	public void setRoleID(String roleID) {
		this.roleID = roleID;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public java.util.Date getGmtModified() {
		return gmtModified;
	}

	public void setGmtModified(java.util.Date gmtModified) {
		this.gmtModified    = gmtModified;
		this.gmtModifiedStr = getDateStr(gmtModified);
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public java.util.Date getGmtGreate() {
		return gmtGreate;
	}

	public void setGmtGreate(java.util.Date gmtGreate) {
		this.gmtGreate    = gmtGreate;
		this.gmtGreateStr = getDateStr(gmtGreate);
	}

	public String getGmtGreateStr() {
		return gmtGreateStr;
	}

	public void setGmtGreateStr(String gmtGreateStr) {
		this.gmtGreateStr = gmtGreateStr;
	}

	public String getGmtModifiedStr() {
		return gmtModifiedStr;
	}

	public void setGmtModifiedStr(String gmtModifiedStr) {
		this.gmtModifiedStr = gmtModifiedStr;
	}
	
	static final String DEFAULT_DATE_FORMAT = "yyyy-MM-dd";
	static final SimpleDateFormat sdf = new SimpleDateFormat(DEFAULT_DATE_FORMAT);
	
	private static String getDateStr(java.util.Date date) {
		return sdf.format(date);
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}