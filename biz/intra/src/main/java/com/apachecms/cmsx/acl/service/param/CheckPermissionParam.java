package com.apachecms.cmsx.acl.service.param;

import java.util.HashSet;
import java.util.Map;

import com.apachecms.cmsx.dal.dataobject.ACLResource;

public class CheckPermissionParam {

	// 是否拥有action权限
	private boolean hasAction  = false;
	
	// 是否验证过url权限
	private boolean isCheckUrl = false;
	
	// 是否拥有url权限
	private boolean hasUrl     = false;
	
	private Map<String, Map<String, ACLResource>> cache;
	
	// 白名单本地缓存
	private HashSet<String> whiteCache;

	public boolean isHasAction() {
		return hasAction;
	}

	public void setHasAction(boolean hasAction) {
		this.hasAction = hasAction;
	}

	public boolean isCheckUrl() {
		return isCheckUrl;
	}

	public void setCheckUrl(boolean isCheckUrl) {
		this.isCheckUrl = isCheckUrl;
	}

	public boolean isHasUrl() {
		return hasUrl;
	}

	public void setHasUrl(boolean hasUrl) {
		this.hasUrl = hasUrl;
	}

	public Map<String, Map<String, ACLResource>> getCache() {
		return cache;
	}

	public void setCache(Map<String, Map<String, ACLResource>> cache) {
		this.cache = cache;
	}

	public void setWhiteCache(HashSet<String> whiteCache) {
		this.whiteCache = whiteCache;
	}

	public HashSet<String> getWhiteCache() {
		return whiteCache;
	}
}