package com.apachecms.cmsx.acl.service.config;

import java.util.HashSet;
import java.util.Set;

import com.apachecms.cmsx.acl.service.cache.CacheValue;
import com.apachecms.cmsx.utils.Config;

/**
 * ACL全局配置信息
 * @author qinming.zhengqm
 */
public class ACLConfig extends Config {

	private final Set<CacheValue<String>> roleResChangeSet = new HashSet<CacheValue<String>> ();

	public Set<CacheValue<String>> getRoleResChangeSet() {
		return roleResChangeSet;
	}
}