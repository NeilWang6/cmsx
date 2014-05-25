package com.apachecms.cmsx.utils;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * 配置文件抽象类
 * @author qinming.zhengqm
 */
public abstract class Config {
	// 配置文件
	protected Map<String, String> extConfigs;
	// number cache
	protected final ConcurrentMap<String, Number> numbers = new ConcurrentHashMap<String, Number> ();
	
	/**
	 * @param key
	 * @return
	 */
	public String getParameter(String key) {
		this.checkConfig();
		return this.extConfigs.get(key);
	}

	/**
	 * @param key
	 * @param defaultVal
	 * @return
	 */
	public String getParameter(String key, String defaultVal) {
		String val = this.getParameter(key);
		if (null == val || 0 == val.length()) {
			return defaultVal;
		}
		return val;
	}
	
	/**
	 * @param key
	 * @param defaultVal
	 * @return
	 */
	public boolean getParameter(String key, boolean defaultVal) {
		String val = this.getParameter(key);
		if (null == val || 0 == val.length()) {
			return defaultVal;
		}
		return Boolean.valueOf(key);
	}
	
	/**
	 * @param key
	 * @param defaultVal
	 * @return
	 */
	public int getParameter(String key, int defaultVal) {
		Number n = this.numbers.get(key);
		if (null != n) {
			return n.intValue();
		}
		String val = this.getParameter(key);
		if (null == val || 0 == val.length()) {
			return defaultVal;
		}
		int i = Integer.parseInt(val);
		this.numbers.put(key, i);
		return i;
	}

	/**
	 * @param key
	 * @param defaultVal
	 * @return
	 */
	public long getParameter(String key, long defaultVal) {
		Number n = this.numbers.get(key);
		if (null != n) {
			return n.longValue();
		}
		String val = this.getParameter(key);
		if (null == val || 0 == val.length()) {
			return defaultVal;
		}
		long l = Integer.parseInt(val);
		this.numbers.put(key, l);
		return l;
	}
	
	/**
	 * 验证配置文件
	 */
	protected void checkConfig() {
		if (null == extConfigs) {
			this.extConfigs = new HashMap<String, String> ();
		}
	}

	public void setExtConfigs(Map<String, String> extConfigs) {
		this.extConfigs = extConfigs;
	}
}