package com.apachecms.cmsx.acl.service.cache;

import java.util.Date;

/**
 * 缓存对象<pre>CacheValue</pre>,含加入缓存时间
 * @author liuxinl.lx
 */
public class CacheValue<T> implements java.io.Serializable {
	private static final long serialVersionUID = -682843451299667487L;

	// 加入缓存时间
	private Date time;

	// 缓存对象
	private T val;

	public Date getTime() {
		return time;
	}

	public void setTime(Date time) {
		this.time = time;
	}

	public T getVal() {
		return val;
	}

	public void setVal(T val) {
		this.val = val;
	}
	
	@Override
	public int hashCode() {
		return this.val.hashCode();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public boolean equals(Object obj) {
		if (null == obj) {
			return false;
		}
        return val.equals(((CacheValue<T>) obj).getVal());	
	}
}