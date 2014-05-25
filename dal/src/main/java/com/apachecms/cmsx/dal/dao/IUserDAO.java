package com.apachecms.cmsx.dal.dao;

import java.util.List;

import com.apachecms.cmsx.dal.dao.common.PageInfo;
import com.apachecms.cmsx.dal.dataobject.CmsUser;

@SuppressWarnings("rawtypes")
public interface IUserDAO {

	public CmsUser findById(String id);
	
	public CmsUser findByUserId(String userId);

	public List<CmsUser> findByWhere(CmsUser bean);

	/**
	 * 分页查询
	 * 
	 * @param bean
	 * @param currentPage
	 * @param pageSize
	 * @return
	 */
	public PageInfo<CmsUser> findByWhere(CmsUser bean, Integer currentPage, Integer pageSize);

	public Object addCmsUser(CmsUser bean);

	public int updateCmsUser(CmsUser bean);

	public int delCmsUser(String id);
}