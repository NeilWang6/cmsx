package com.apachecms.cmsx.acl.param;

/**
 * 用于ajax请求返回封装
 * @author liuxinl.lx
 */
public class AjaxResult<T> extends Result {
	private static final long serialVersionUID = 8442855083514811450L;

	@Override
	boolean isSuccess() {
		return (0 == this.code);
	}
	
	private T val;

	public T getVal() {
		return val;
	}

	public void setVal(T val) {
		this.val = val;
	}
}