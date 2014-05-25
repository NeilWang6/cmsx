package com.apachecms.cmsx.exception;

/**
 * ACLException
 * @author qinming.zhengqm
 */
public class DuplicateException extends Exception {
	private static final long serialVersionUID = 8861705118316619350L;
	
	public DuplicateException(String errorCode) {
		super(errorCode);
	}
	
	public DuplicateException(Throwable cause) {
		super(cause);
	}

	public DuplicateException(String errorCode, Throwable cause) {
		super(errorCode, cause);
	}
}