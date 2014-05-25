package com.apachecms.cmsx.acl.param;

import java.io.Serializable;

/**
 * <pre>Result</pre>
 * @author qinming.zhengqm
 */
public abstract class Result implements Serializable {
	private static final long serialVersionUID = -1111102313054730442L;

	/**
	 * code 0:成功
	 */
	protected int code;
	
	/**
	 * 验权失败原因
	 */
	protected String msg;
	
	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}
	
	/**
	 * 是否成功
	 * @return
	 */
	abstract boolean isSuccess();
}