package com.apachecms.cmsx.dal.dataobject;

/**
 * 角色拥有的资源
 * @author qinming.zhengqm
 */
public class ACLRoleResource implements java.io.Serializable {
	private static final long serialVersionUID = 4357987650529627136L;
	
	// PK
	private String id;

	// 资源名
	private String name;
	
	private String url;
	
	// 资源类型
	private String resourceType;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getResourceType() {
		return resourceType;
	}

	public void setResourceType(String resourceType) {
		this.resourceType = resourceType;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
}