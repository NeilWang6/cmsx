package com.apachecms.cmsx.dal.dao;

import java.util.List;

import com.apachecms.cmsx.dal.dao.common.PageInfo;
import com.apachecms.cmsx.dal.dataobject.CaseCatalog;

/**
 * 数据访问对象接口
 * @since 2014-02-07
 */
public interface CaseCatalogDAO {

	public CaseCatalog findById(Long id); 

	public List<CaseCatalog> findByWhere(CaseCatalog bean);

	/**
	 * 分页查询
	 * 
	 * @param bean
	 * @param currentPage
	 * @param pageSize
	 * @return
	 */
	public PageInfo<CaseCatalog> findByWhere(CaseCatalog bean, Integer currentPage, Integer pageSize);

	public Object addCaseCatalog(CaseCatalog bean);

	public int updateCaseCatalog(CaseCatalog bean);

	public int delCaseCatalog(Long id);

}