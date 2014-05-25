package com.apachecms.cmsx.acl.param;

import java.util.List;

/**
 * 资源返回结果
 * @author qinming.zhengqm
 */
public class ResourceResult extends Result {
	private static final long serialVersionUID = 1553823633824182505L;
	
	/**
	 * 构造函数
	 */
	public ResourceResult() {}
	
	/**
	 * 构造函数
	 * @param code
	 */
	public ResourceResult(int code) {
		this.code = code;
	}
	
	/**
	 * 菜单资源
	 */
	private List<ResourceParam> params;
	
	/**
	 * 是否成功
	 * @return
	 */
	public boolean isSuccess() {
		return (0 == this.code);
	}

	public List<ResourceParam> getParams() {
		return params;
	}

	public void setParams(List<ResourceParam> params) {
		this.params = params;
	}
}