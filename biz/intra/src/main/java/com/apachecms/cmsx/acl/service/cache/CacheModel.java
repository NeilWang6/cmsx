package com.apachecms.cmsx.acl.service.cache;

/**
 * <pre>CacheParam</pre>
 * @author liuxinl.lx
 */
public class CacheModel {

	// 缓存key
	private java.io.Serializable key;
	
	// 缓存val
	private java.io.Serializable val;
	
	// 缓存时间
	private int expireTime;

	public java.io.Serializable getKey() {
		return key;
	}

	public void setKey(java.io.Serializable key) {
		this.key = key;
	}

	public java.io.Serializable getVal() {
		return val;
	}

	public void setVal(java.io.Serializable val) {
		this.val = val;
	}

	public int getExpireTime() {
		return expireTime;
	}

	public void setExpireTime(int expireTime) {
		this.expireTime = expireTime;
	}
}