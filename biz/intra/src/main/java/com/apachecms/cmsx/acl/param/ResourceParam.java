package com.apachecms.cmsx.acl.param;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.apache.commons.lang.StringUtils;

import com.alibaba.citrus.util.StringUtil;

public class ResourceParam implements java.io.Serializable {
	private static final long serialVersionUID = 1560218606116190991L;

	// PK
	private String id;

	/**
	 * 菜单英文名,用于程序调用
	 */
	private String code;
	
	/**
	 * 菜单名字
	 */
	private String name;
	
	/**
	 * 父标示信息, 在菜单时使用
	 */
	private String parent = "";
	
	/**
	 * url
	 */
	private String url;
	
	/**
	 * 原始url
	 */
	private String fullUrl;
	
	/**
	 * url来源, dcms, elf, magma
	 */
	private String appName;
	
	/**
	 * url类型, 可以是菜单 (menu) 普通url(url) action
	 */
	private String resourceType;
	
	// 0 普通资源 1 白名单资源
	private String isWhite;
	
	/**
	 * 描述信息
	 */
	private String description;
	
	/**
	 * 菜单排序用
	 */
	private Long sort;
	
	// 子菜单信息
	private List<ResourceParam> params;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getParent() {
		return parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getAppName() {
		return appName;
	}

	public void setAppName(String appName) {
		this.appName = appName;
	}

	public String getResourceType() {
		return resourceType;
	}

	public void setResourceType(String resourceType) {
		this.resourceType = resourceType;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public List<ResourceParam> getParams() {
		return params;
	}

	public void setParams(List<ResourceParam> params) {
		this.params = params;
	}

	public Long getSort() {
		return sort;
	}

	public void setSort(Long sort) {
		this.sort = sort;
	}

	public String getIsWhite() {
		return isWhite;
	}

	public void setIsWhite(String isWhite) {
		this.isWhite = isWhite;
	}
	
	public static final String LEFT_SLASH = "/";
	public static final String SPOT       = ".";
	
	// 缓存菜单样式
	public static final ConcurrentMap<String, String> styleCache = new ConcurrentHashMap<String, String> ();
	
	public String getStyle(String str) {
    	if (StringUtil.isEmpty(url)) {
    		return str;
    	}
    	String ret = styleCache.get(id);
    	if (StringUtils.isNotEmpty(ret)) {
    		return ret;
    	}
    	ret = url;
    	int i = StringUtil.lastIndexOf(ret, LEFT_SLASH);
    	if (i > -1) {
    		int s = StringUtil.lastIndexOf(ret, SPOT);
    		ret = StringUtil.substring(ret, i + 1, (s > -1) ? s : ret.length());
    	}
    	ret = StringUtil.toCamelCase(ret);
    	ret = StringUtil.toLowerCase(ret);
    	ret = new StringBuilder().append(str).append('-').append(ret).toString();
    	styleCache.putIfAbsent(id, ret);
    	return ret;
    }
	
	public String getFullUrl() {
		return fullUrl;
	}

	public void setFullUrl(String fullUrl) {
		this.fullUrl = fullUrl;
	}
	
	@Override
	public String toString() {
		return new StringBuffer().append("code:").append(this.code).append(", name:").append(name).append(", url:").append(url).toString();
	}
}