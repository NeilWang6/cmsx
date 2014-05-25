package com.apachecms.cmsx.acl.param;

import java.io.Serializable;

/**
 * 基础类
 * @author qinming.zhengqm
 */
public class BaseParam implements Serializable {
	private static final long serialVersionUID = -1624370024808546368L;

	/**
	 * 用户id
	 */
	private String userID;

	/**
	 * 是否内站用户
	 */
	private boolean inside;

	public String getUserID() {
		return userID;
	}

	public void setUserID(String userID) {
		this.userID = userID;
	}

	public boolean isInside() {
		return inside;
	}

	public void setInside(boolean inside) {
		this.inside = inside;
	}
}