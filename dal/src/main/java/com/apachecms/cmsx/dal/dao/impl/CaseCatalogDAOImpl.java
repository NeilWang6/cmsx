package com.apachecms.cmsx.dal.dao.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.apachecms.cmsx.dal.dao.CaseCatalogDAO;
import com.apachecms.cmsx.dal.dao.common.PageInfo;
import com.apachecms.cmsx.dal.dataobject.CaseCatalog;

/**
 * 数据访问对象实现类
 * @since 2014-02-07
 */
public class CaseCatalogDAOImpl  extends SqlMapClientDaoSupport implements CaseCatalogDAO {

	@Override
	public CaseCatalog findById(Long id) {
		return (CaseCatalog) this.getSqlMapClientTemplate().queryForObject("cms_CmsxCaseCatalog.findCmsxCaseCatalogById", id);
	} 

	@Override
	public List<CaseCatalog> findByWhere(CaseCatalog bean) {
		return this.getSqlMapClientTemplate().queryForList("cms_CmsxCaseCatalog.findCmsxCaseCatalogByWhere", bean);
	}

	@Override
	public PageInfo<CaseCatalog> findByWhere(CaseCatalog bean, Integer currentPage, Integer pageSize) { 
		PageInfo<CaseCatalog> ret = null;
		Integer count = (Integer) this.getSqlMapClientTemplate().queryForObject("cms_CmsxCaseCatalog.findCmsxCaseCatalogCountByWhere", bean);
		if (null == count || 0 == count) {
			return ret;
		}
		
		currentPage = (null == currentPage || currentPage < 1) ? 1 : currentPage;
		pageSize  = null == pageSize ? 15 : pageSize;
		int start = (currentPage - 1) * pageSize + 1;
		int end   = currentPage * pageSize;
		
		Map<String, Object> values = new HashMap<String, Object> ();
		values.put("name",  bean.getName()); 
		values.put("start",        start);
		values.put("end",          end); 
		
		List<CaseCatalog> list = this.getSqlMapClientTemplate().queryForList("cms_CmsxCaseCatalog.findCmsxCaseCatalogPageByWhere", values);
		ret = new PageInfo<CaseCatalog> ();
		ret.setCurrentPage(currentPage);
		ret.setPageSize(pageSize);
		ret.setAllRow(count);
		ret.setList(list);
		ret.countTotalPage(pageSize, ret.getAllRow());
		return ret;
	}

	@Override
	public Object addCaseCatalog(CaseCatalog bean) {
		return this.getSqlMapClientTemplate().insert("cms_CmsxCaseCatalog.addCmsxCaseCatalog", bean);
	}

	@Override
	public int updateCaseCatalog(CaseCatalog bean) {
		return this.getSqlMapClientTemplate().update("cms_CmsxCaseCatalog.updateCmsxCaseCatalog", bean);
	}

	@Override
	public int delCaseCatalog(Long id) {
		return this.getSqlMapClientTemplate().delete("cms_CmsxCaseCatalog.deleteCmsxCaseCatalog", id);
	}

}