package com.apachecms.cmsx.dal.dao;

import org.springframework.transaction.support.TransactionCallback;

public interface BaseDAO {
	public Object execute(TransactionCallback callback);
}
