package com.apachecms.cmsx.acl.domain;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * <pre>MenuInfo</pre>
 * @author qinming.zhengqm
 */
public class ResourceInfo implements Serializable {
	private static final long serialVersionUID = -4211675606301018244L;
	
	/**
	 * pk
	 */
	private String urlID;
	
	/**
	 * 菜单名字
	 */
	private String urlName;

	/**
	 * 菜单编码
	 */
	private String permissionCode;
	
	/**
	 * 父标示 
	 */
	private String parent;
	
	/**
	 * url
	 */
	private String url;
	
	/**
	 * 用于同一层菜单的排列顺序
	 */
	private String sort;
	
	/**
	 * url来源, dcms, elf, magma
	 */
	private String appName;
	
	/**
	 * url类型, 可以是菜 ?(menu)  ?url(url) action
	 */
	private String resourceType;
	
	/**
	 * 是内站点还是外站 ? 0内站 1外站
	 */
	private String siteType;
	
	/**
	 * 描述信息
	 */
	private String description;
	
	/**
	 * 创建日期
	 */
	private Date gmtCreate;
	
	/**
	 *  修改日期
	 */
	private Date gmtModified;
	
	/**
	 * 创建人
	 */
	private String createUser;
	
	/**
	 *  修改人
	 */
	private String modifiedUser;
	
	/**
	 * 是否叶子节点
	 */
	private boolean isLeaf;
	
	/**
	 * 全部子菜单
	 */
	private List<ResourceInfo> subMenuInfos;


	public String getUrlID() {
		return urlID;
	}

	public void setUrlID(String urlID) {
		this.urlID = urlID;
	}

	public String getPermissionCode() {
		return permissionCode;
	}

	public void setPermissionCode(String permissionCode) {
		this.permissionCode = permissionCode;
	}

	public String getUrlName() {
		return urlName;
	}

	public void setUrlName(String urlName) {
		this.urlName = urlName;
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

	public String getSort() {
		return sort;
	}

	public void setSort(String sort) {
		this.sort = sort;
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

	public String getSiteType() {
		return siteType;
	}

	public void setSiteType(String siteType) {
		this.siteType = siteType;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getGmtCreate() {
		return gmtCreate;
	}

	public void setGmtCreate(Date gmtCreate) {
		this.gmtCreate = gmtCreate;
	}

	public Date getGmtModified() {
		return gmtModified;
	}

	public void setGmtModified(Date gmtModified) {
		this.gmtModified = gmtModified;
	}

	public String getCreateUser() {
		return createUser;
	}

	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}

	public String getModifiedUser() {
		return modifiedUser;
	}

	public void setModifiedUser(String modifiedUser) {
		this.modifiedUser = modifiedUser;
	}

	public boolean isLeaf() {
		return isLeaf;
	}

	public void setLeaf(boolean isLeaf) {
		this.isLeaf = isLeaf;
	}

	public List<ResourceInfo> getSubMenuInfos() {
		return subMenuInfos;
	}

	public void setSubMenuInfos(List<ResourceInfo> subMenuInfos) {
		this.subMenuInfos = subMenuInfos;
	}
}