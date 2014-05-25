package com.apachecms.cmsx.acl.exception;

/**
 * ACLException
 * @author qinming.zhengqm
 */
public class ACLException extends Exception {
	private static final long serialVersionUID = 8861705118316619350L;
	
	public ACLException(String errorCode) {
		super(errorCode);
	}
	
	public ACLException(Throwable cause) {
		super(cause);
	}

	public ACLException(String errorCode, Throwable cause) {
		super(errorCode, cause);
	}
}