package com.apachecms.cmsx.dal.dataobject;

import java.util.Date;

import org.apache.commons.lang.builder.ReflectionToStringBuilder;

public class CmsUser extends BaseDO {
	private static final long serialVersionUID = -8976867745756L;
	// pk
    private String id;
	/**
	 * The gmtCreate field
	 */
	private Date gmtCreate;
	/**
	 * The gmtModified field
	 */
	private Date gmtModified;
	/**
	 * The userId field
	 */
	private java.lang.String userId;
	/**
	 * The password field
	 */
	private java.lang.String password;
	/**
	 * The fullName field
	 */
	private java.lang.String fullName;
	/**
	 * The email field
	 */
	private java.lang.String email;

	private String depId;
	/**
	 * The roleName field
	 */
	private java.lang.String roleName;

	private String groups;

	private String groupids;

	private Long profileSite;
	
	private String status;
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public java.lang.String getRoleName() {
		return roleName;
	}

	public void setRoleName(java.lang.String roleName) {
		this.roleName = roleName;
	}

	public String getGroups() {
		return groups;
	}

	public void setGroups(String groups) {
		this.groups = groups;
	}

	public String getGroupids() {
		return groupids;
	}

	public void setGroupids(String groupids) {
		this.groupids = groupids;
	}

	public String getDepId() {
		return depId;
	}

	public void setDepId(String depId) {
		this.depId = depId;
	}

	/**
	 * Returns the userId
	 * 
	 * @return the userId
	 */
	public java.lang.String getUserId() {
		if(userId!=null){
			this.userId = this.userId.toLowerCase();
		}
		return userId;
	}

	/**
	 * Sets the userId
	 * 
	 * @param newUserId
	 *            the new userId
	 */
	public void setUserId(java.lang.String newUserId) {
		if(newUserId!=null){
			this.userId = newUserId.toLowerCase();
		}
		this.userId = newUserId;
	}

	/**
	 * Returns the password
	 * 
	 * @return the password
	 */
	public java.lang.String getPassword() {
		return password;
	}

	/**
	 * Sets the password
	 * 
	 * @param newPassword
	 *            the new password
	 */
	public void setPassword(java.lang.String newPassword) {
		this.password = newPassword;
	}

	/**
	 * Returns the fullName
	 * 
	 * @return the fullName
	 */
	public java.lang.String getFullName() {
		return fullName;
	}

	/**
	 * Sets the fullName
	 * 
	 * @param newFullName
	 *            the new fullName
	 */
	public void setFullName(java.lang.String newFullName) {
		this.fullName = newFullName;
	}

	/**
	 * Returns the email
	 * 
	 * @return the email
	 */
	public java.lang.String getEmail() {
		return email;
	}

	/**
	 * Sets the email
	 * 
	 * @param newEmail
	 *            the new email
	 */
	public void setEmail(java.lang.String newEmail) {
		this.email = newEmail;
	}

	public Date getGmtCreate() {
		return gmtCreate;
	}

	public void setGmtCreate(Date gmtCreate) {
		this.gmtCreate = gmtCreate;
	}

	public Date getGmtModified() {
		return gmtModified;
	}

	public void setGmtModified(Date gmtModified) {
		this.gmtModified = gmtModified;
	}

	public Long getProfileSite() {
		return profileSite;
	}

	public void setProfileSite(Long profileSite) {
		this.profileSite = profileSite;
	} 
	
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((userId == null) ? 0 : userId.hashCode());
		return result;
	}

	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		CmsUser other = (CmsUser) obj;
		if (userId == null) {
			if (other.userId != null)
				return false;
		} else if (!userId.equals(other.userId))
			return false;
		return true;
	}

	
	public String toString(){
		return ReflectionToStringBuilder.toString(this);
	}
}