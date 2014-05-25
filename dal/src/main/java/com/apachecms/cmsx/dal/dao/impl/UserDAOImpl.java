package com.apachecms.cmsx.dal.dao.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.apachecms.cmsx.dal.dao.IUserDAO;
import com.apachecms.cmsx.dal.dao.common.PageInfo;
import com.apachecms.cmsx.dal.dataobject.ACLResource;
import com.apachecms.cmsx.dal.dataobject.CmsUser;

public class UserDAOImpl extends SqlMapClientDaoSupport implements IUserDAO {

	@Override
	public CmsUser findById(String id) {
		return (CmsUser) this.getSqlMapClientTemplate().queryForObject("cms_CmsUser.findCmsUserById", id);
	}
	
	@Override
	public CmsUser findByUserId(String userId) {
		return (CmsUser) this.getSqlMapClientTemplate().queryForObject("cms_CmsUser.findCmsUserByUserId", userId);
	}

	@Override
	public List<CmsUser> findByWhere(CmsUser bean) {
		return this.getSqlMapClientTemplate().queryForList("cms_CmsUser.findCmsUserByWhere", bean);
	}

	@Override
	public PageInfo<CmsUser> findByWhere(CmsUser bean, Integer currentPage, Integer pageSize) { 
		PageInfo<CmsUser> ret = null;
		Integer count = (Integer) this.getSqlMapClientTemplate().queryForObject("cms_CmsUser.findCmsUserCountByWhere", bean);
		if (null == count || 0 == count) {
			return ret;
		}
		
		currentPage = (null == currentPage || currentPage < 1) ? 1 : currentPage;
		pageSize  = null == pageSize ? 15 : pageSize;
		int start = (currentPage - 1) * pageSize + 1;
		int end   = currentPage * pageSize;
		
		Map<String, Object> values = new HashMap<String, Object> ();
		values.put("userId",  bean.getUserId());
		values.put("fullName", bean.getFullName());
		values.put("status",    bean.getStatus());  
		values.put("start",        start);
		values.put("end",          end); 
		
		List<CmsUser> list = this.getSqlMapClientTemplate().queryForList("cms_CmsUser.findCmsUserPageByWhere", values);
		ret = new PageInfo<CmsUser> ();
		ret.setCurrentPage(currentPage);
		ret.setPageSize(pageSize);
		ret.setAllRow(count);
		ret.setList(list);
		ret.countTotalPage(pageSize, ret.getAllRow());
		return ret;
	}

	@Override
	public Object addCmsUser(CmsUser bean) {
		return this.getSqlMapClientTemplate().insert("cms_CmsUser.addCmsUser", bean);
	}

	@Override
	public int updateCmsUser(CmsUser bean) {
		return this.getSqlMapClientTemplate().update("cms_CmsUser.updateCmsUser", bean);
	}

	@Override
	public int delCmsUser(String id) {
		return this.getSqlMapClientTemplate().delete("cms_CmsUser.deleteCmsUser", id);
	}

}
