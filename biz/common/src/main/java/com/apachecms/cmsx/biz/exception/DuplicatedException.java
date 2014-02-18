package com.apachecms.cmsx.biz.exception;

public class DuplicatedException extends RuntimeException {
 
	private static final long serialVersionUID = -8015029962039952275L;

	public DuplicatedException() {
    }

    public DuplicatedException(String message, Throwable cause) {
        super(message, cause);
    }

    public DuplicatedException(String message) {
        super(message);
    }

    public DuplicatedException(Throwable cause) {
        super(cause);
    }
}
