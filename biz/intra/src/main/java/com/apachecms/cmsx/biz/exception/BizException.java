package com.apachecms.cmsx.biz.exception;

/**
 * BizException
 * @author qinming.zhengqm
 */
public class BizException extends Exception {  
	private static final long serialVersionUID = -2712772709704576985L;

	public BizException(String errorCode) {
		super(errorCode);
	}
	
	public BizException(Throwable cause) {
		super(cause);
	}

	public BizException(String errorCode, Throwable cause) {
		super(errorCode, cause);
	}
}