package com.apachecms.cmsx.dal.dao.impl;

import com.apachecms.cmsx.dal.dao.CmsxAuthRoleDAO;
import com.apachecms.cmsx.dal.dao.ibatis.DaoRouter;
import com.apachecms.cmsx.dal.dataobject.CmsxAuthRoleDO;
import com.apachecms.cmsx.dal.query.CmsxAuthRoleQuery;

import java.util.List;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

/**
 * 数据访问对象实现类
 * 
 * @since 2014-02-07
 */
public class CmsxAuthRoleDAOImpl extends DaoRouter implements CmsxAuthRoleDAO {

	/**
	 * 插入数据
	 * 
	 * @param cmsxAuthRoleDO
	 * @return 插入数据的主键
	 */
	public Long insertCmsxAuthRoleDO(CmsxAuthRoleDO cmsxAuthRoleDO) {
		Object ID = getSqlMapClientTemplate().insert("CmsxAuthRole.insert", cmsxAuthRoleDO);
		return (Long) ID;
	}

	/**
	 * 统计记录数
	 * 
	 * @param cmsxAuthRoleDO
	 * @return 查出的记录数
	 */
	public Integer countCmsxAuthRoleDOByExample(CmsxAuthRoleDO cmsxAuthRoleDO) {
		Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxAuthRole.countByDOExample", cmsxAuthRoleDO);
		return count;
	}

	/**
	 * 统计记录数
	 * 
	 * @param cmsxAuthRoleQuery
	 * @return 查出的记录数
	 */
	public Integer countCmsxAuthRoleQueryByExample(CmsxAuthRoleQuery cmsxAuthRoleQuery) {
		Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxAuthRole.countByQueryExample", cmsxAuthRoleQuery);
		return count;
	}

	/**
	 * 更新记录
	 * 
	 * @param cmsxAuthRoleDO
	 * @return 受影响的行数
	 */
	public Integer updateCmsxAuthRoleDO(CmsxAuthRoleDO cmsxAuthRoleDO) {
		int result = getSqlMapClientTemplate().update("CmsxAuthRole.update", cmsxAuthRoleDO);
		return result;
	}

	/**
	 * 获取对象列表
	 * 
	 * @param cmsxAuthRoleDO
	 * @return 对象列表
	 */
	@SuppressWarnings("unchecked")
	public List<CmsxAuthRoleDO> findListByExample(CmsxAuthRoleDO cmsxAuthRoleDO) {
		List<CmsxAuthRoleDO> list = getSqlMapClientTemplate().queryForList("CmsxAuthRole.findListByDO", cmsxAuthRoleDO);
		return list;
	}

	/**
	 * 获取对象列表
	 * 
	 * @param cmsxAuthRoleQuery
	 * @return 对象列表
	 */
	@SuppressWarnings("unchecked")
	public List<CmsxAuthRoleQuery> findListByExample(CmsxAuthRoleQuery cmsxAuthRoleQuery) {
		List<CmsxAuthRoleQuery> list = getSqlMapClientTemplate().queryForList("CmsxAuthRole.findListByQuery", cmsxAuthRoleQuery);
		return list;
	}

	/**
	 * 根据主键获取cmsxAuthRoleDO
	 * 
	 * @param id
	 * @return cmsxAuthRoleDO
	 */
	public CmsxAuthRoleDO findCmsxAuthRoleDOByPrimaryKey(Long id) {
		CmsxAuthRoleDO cmsxAuthRoleDO = (CmsxAuthRoleDO) getSqlMapClientTemplate().queryForObject("CmsxAuthRole.findByPrimaryKey", id);
		return cmsxAuthRoleDO;
	}

	/**
	 * 删除记录
	 * 
	 * @param id
	 * @return 受影响的行数
	 */
	public Integer deleteCmsxAuthRoleDOByPrimaryKey(Long id) {
		Integer rows = (Integer) getSqlMapClientTemplate().delete("CmsxAuthRole.deleteByPrimaryKey", id);
		return rows;
	}

}