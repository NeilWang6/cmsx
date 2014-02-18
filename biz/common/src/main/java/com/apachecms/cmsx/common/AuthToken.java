package com.apachecms.cmsx.common;

import java.util.ArrayList;
import java.util.List;

public class AuthToken {
	private String userId;
	private String ip;
	private List<Long> userRoles; // 拥有的所有角色id列表
	private List<String> resCodes; // 拥有的权限列表

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public List<Long> getUserRoles() {
		if(userRoles==null){
			userRoles = new ArrayList<Long>();
		}
		return userRoles;
	}

	public void setUserRoles(List<Long> userRoles) {
		this.userRoles = userRoles;
	}

	public List<String> getResCodes() {
		if(resCodes==null){
			resCodes = new ArrayList<String>();
		}
		return resCodes;
	}

	public void setResCodes(List<String> resCodes) {
		this.resCodes = resCodes;
	}

}
