package com.apachecms.cmsx.dal.dataobject;

/**
 * 当前站点下的角色
 * @author qinming.zhengqm
 */
public class ACLSiteRole implements java.io.Serializable {
	private static final long serialVersionUID = 158103730372258467L;

	// 角色id
	private String id;

	// 角色名
    private String name;
    
    private Long siteID;
    
    private String status;
    
    private String userID;
    
    private String userName;
    
    // 角色级别
    private Long lev;
	
    // 0 删除 1 正常
    private String isDelete;
    
    // 失效日期 为空时为永不失效
    private java.util.Date expiredDate;
    
    private String message;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getLev() {
		return lev;
	}

	public void setLev(Long lev) {
		this.lev = lev;
	}

	public String getIsDelete() {
		return isDelete;
	}

	public void setIsDelete(String isDelete) {
		this.isDelete = isDelete;
	}

	public java.util.Date getExpiredDate() {
		return expiredDate;
	}

	public void setExpiredDate(java.util.Date expiredDate) {
		this.expiredDate = expiredDate;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Long getSiteID() {
		return siteID;
	}

	public void setSiteID(Long siteID) {
		this.siteID = siteID;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getUserID() {
		return userID;
	}

	public void setUserID(String userID) {
		this.userID = userID;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}