package com.apachecms.cmsx.exception;

/**
 * ACLException
 * @author qinming.zhengqm
 */
public class NotExistsException extends Exception {
	private static final long serialVersionUID = 8861705118316619350L;
	
	public NotExistsException(String errorCode) {
		super(errorCode);
	}
	
	public NotExistsException(Throwable cause) {
		super(cause);
	}

	public NotExistsException(String errorCode, Throwable cause) {
		super(errorCode, cause);
	}
}