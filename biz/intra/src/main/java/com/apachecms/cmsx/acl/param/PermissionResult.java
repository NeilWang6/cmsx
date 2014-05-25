package com.apachecms.cmsx.acl.param;

/**
 * 验权返回结果
 * 
 * @author lx
 */
public class PermissionResult extends Result {
	private static final long serialVersionUID = -827392208552471190L;

	@Override
	public boolean isSuccess() {
		return (0 == this.code);
	}
}