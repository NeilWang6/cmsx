package com.apachecms.cmsx.biz;

import java.util.List;

import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.dal.dao.common.PageInfo;
import com.apachecms.cmsx.dal.dataobject.CaseCatalog;
import com.apachecms.cmsx.dal.dataobject.CtConfDO;
import com.apachecms.cmsx.exception.DuplicateException;

public interface CaseCatalogService {
	/**
	 * 创建user
	 * @param param
	 * @param opUserID
	 * @throws ACLException
	 */
	Long create(CaseCatalog param, String opUserID) throws  DuplicateException;

	/**
	 * 修改user
	 * @param param
	 * @param opUserID
	 * @throws ACLException
	 */
	void update(CaseCatalog param, String opUserID) throws  DuplicateException;
	
	/** 
	 * @param id
	 * @param opUserID
	 * @throws ACLException
	 */
	void delete(Long id, String opUserID) ; 
	
	/**
	 * 根据id查询用户
	 * @param id
	 * @return
	 * @throws ACLException
	 */
	CaseCatalog findById(Long id) ;
	
	/**
	 * 分页查询
	 * @return
	 * @throws ACLException
	 */
	PageInfo<CaseCatalog> findByWhere(CaseCatalog param, Integer currentPage, Integer pageSize);
	
	public boolean saveCaseConf(final Long catalogId, final String confType, final List<CtConfDO> caseConfList);
	

	List<CaseCatalog> findAll(CaseCatalog param);
}
