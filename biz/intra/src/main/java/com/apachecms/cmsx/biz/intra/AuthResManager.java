package com.apachecms.cmsx.biz.intra;

import java.util.List;

import com.apachecms.cmsx.biz.exception.DuplicatedException;
import com.apachecms.cmsx.common.AuthToken;
import com.apachecms.cmsx.dal.dataobject.CmsxAuthResDO;

public interface AuthResManager {
	
	/**
	 * 
	 * @param authRes
	 * @throws DuplicatedException
	 */
	public void saveAuthRes(CmsxAuthResDO authRes, AuthToken authToken) throws DuplicatedException;
	
	/**
	 * 
	 * @param id
	 * @return
	 */
	public CmsxAuthResDO get(long id);
	
	/**
	 * 
	 * @param cache
	 * @return
	 */
	public List<CmsxAuthResDO> getAll(boolean cache);

}
