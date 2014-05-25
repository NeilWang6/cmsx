package com.apachecms.cmsx.acl.param;

/**
 * RoleParam
 * @author qinming.zhengqm
 */
public class RoleParam {
	// 角色id
	private String id;
	
	// 角色名
	private String name;
	
	// 角色级别 1:系统管理员 10:站点管理员 100:其他类型角色
    private Long lev;
    
    private String message;
    
    // 0:内站点角色 1:外站角色
    private String isOutsite;
    
    // 描述信息
    private String description;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getLev() {
		return lev;
	}

	public void setLev(Long lev) {
		this.lev = lev;
	}

	public String getIsOutsite() {
		return isOutsite;
	}

	public void setIsOutsite(String isOutsite) {
		this.isOutsite = isOutsite;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	@Override
	public String toString() {
		return new StringBuffer().append("name:").append(name).append(", lev:").append(lev).toString();
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}