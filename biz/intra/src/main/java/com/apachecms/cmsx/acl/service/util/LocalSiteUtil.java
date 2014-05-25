package com.apachecms.cmsx.acl.service.util;

@Deprecated
/**
 * 缓存当前站点使用,兼容dcms鉴权时使用
 * @author liuxinl.lx
 */
public abstract class LocalSiteUtil {

	// 在当前线程中缓存站点id
	private static final ThreadLocal<Long> session = new ThreadLocal<Long> ();
	
	public static Long getSiteID() {
		return session.get();
	}
	
	public static void setSiteID(long siteID) {
		session.set(siteID);
	}
	
	public static void remove() {
		session.remove();
	}
}