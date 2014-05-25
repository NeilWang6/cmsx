package com.apachecms.cmsx.acl.param;


public class UserParam {
	private String id; 
	
	private String userId;

	private String password;

	private String fullName;

	private String email;

	private String depId;

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

	public java.lang.String getUserId() {
		if(userId!=null){
			this.userId = this.userId.toLowerCase();
		}
		return userId;
	}

	public void setUserId(java.lang.String newuserId) {
		if(newuserId!=null){
			this.userId = newuserId.toLowerCase();
		}
		this.userId = newuserId;
	}

	public java.lang.String getPassword() {
		return password;
	}

	public void setPassword(java.lang.String password) {
		this.password = password;
	}

	public java.lang.String getFullName() {
		return fullName;
	}

	public void setFullName(java.lang.String fullName) {
		this.fullName = fullName;
	}

	public java.lang.String getEmail() {
		return email;
	}

	public void setEmail(java.lang.String email) {
		this.email = email;
	}

	public String getDepId() {
		return depId;
	}

	public void setDepId(String depId) {
		this.depId = depId;
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

}