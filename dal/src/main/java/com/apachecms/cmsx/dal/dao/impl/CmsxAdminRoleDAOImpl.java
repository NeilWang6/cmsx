package com.apachecms.cmsx.dal.dao.impl;

import com.apachecms.cmsx.dal.dao.CmsxAdminRoleDAO;
import com.apachecms.cmsx.dal.dao.ibatis.DaoRouter;
import com.apachecms.cmsx.dal.dataobject.CmsxAdminRoleDO;
import com.apachecms.cmsx.dal.query.CmsxAdminRoleQuery;

import java.util.List;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

/**
 * 数据访问对象实现类
 * @since 2014-02-07
 */
public class CmsxAdminRoleDAOImpl extends DaoRouter implements CmsxAdminRoleDAO {

    /**
     * 插入数据
     * @param cmsxAdminRoleDO
     * @return 插入数据的主键
     */
    public Long insertCmsxAdminRoleDO(CmsxAdminRoleDO cmsxAdminRoleDO) {
        Object ID = getSqlMapClientTemplate().insert("CmsxAdminRole.insert", cmsxAdminRoleDO);
        return (Long) ID;
    }

    /**
     * 统计记录数
     * @param cmsxAdminRoleDO
     * @return 查出的记录数
     */
    public Integer countCmsxAdminRoleDOByExample(CmsxAdminRoleDO cmsxAdminRoleDO) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxAdminRole.countByDOExample", cmsxAdminRoleDO);
        return count;
    }

    /**
     * 统计记录数
     * @param cmsxAdminRoleQuery
     * @return 查出的记录数
     */
    public Integer countCmsxAdminRoleQueryByExample(CmsxAdminRoleQuery cmsxAdminRoleQuery) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxAdminRole.countByQueryExample", cmsxAdminRoleQuery);
        return count;
    }

    /**
     * 更新记录
     * @param cmsxAdminRoleDO
     * @return 受影响的行数
     */
    public Integer updateCmsxAdminRoleDO(CmsxAdminRoleDO cmsxAdminRoleDO) {
        int result = getSqlMapClientTemplate().update("CmsxAdminRole.update", cmsxAdminRoleDO);
        return result;
    }

    /**
     * 获取对象列表
     * @param cmsxAdminRoleDO
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxAdminRoleDO> findListByExample(CmsxAdminRoleDO cmsxAdminRoleDO) {
        List<CmsxAdminRoleDO> list = getSqlMapClientTemplate().queryForList("CmsxAdminRole.findListByDO", cmsxAdminRoleDO);
        return list;
    }

    /**
     * 获取对象列表
     * @param cmsxAdminRoleQuery
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxAdminRoleQuery> findListByExample(CmsxAdminRoleQuery cmsxAdminRoleQuery) {
        List<CmsxAdminRoleQuery> list = getSqlMapClientTemplate().queryForList("CmsxAdminRole.findListByQuery", cmsxAdminRoleQuery);
        return list;
    }

    /**
     * 根据主键获取cmsxAdminRoleDO
     * @param id
     * @return cmsxAdminRoleDO
     */
    public CmsxAdminRoleDO findCmsxAdminRoleDOByPrimaryKey(Long id) {
        CmsxAdminRoleDO cmsxAdminRoleDO = (CmsxAdminRoleDO) getSqlMapClientTemplate().queryForObject("CmsxAdminRole.findByPrimaryKey", id);
        return cmsxAdminRoleDO;
    }

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxAdminRoleDOByPrimaryKey(Long id) {
        Integer rows = (Integer) getSqlMapClientTemplate().delete("CmsxAdminRole.deleteByPrimaryKey", id);
        return rows;
    }

}