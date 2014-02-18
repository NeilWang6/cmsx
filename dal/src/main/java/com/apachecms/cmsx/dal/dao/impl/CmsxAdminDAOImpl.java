package com.apachecms.cmsx.dal.dao.impl;

import java.util.List;

import com.apachecms.cmsx.dal.dao.CmsxAdminDAO;
import com.apachecms.cmsx.dal.dao.ibatis.DaoRouter;
import com.apachecms.cmsx.dal.dataobject.CmsxAdminDO;
import com.apachecms.cmsx.dal.query.CmsxAdminQuery;

/**
 * 数据访问对象实现类
 * @since 2014-02-07
 */
public class CmsxAdminDAOImpl extends DaoRouter implements CmsxAdminDAO {

    /**
     * 插入数据
     * @param cmsxAdminDO
     * @return 插入数据的主键
     */
    public Long insertCmsxAdminDO(CmsxAdminDO cmsxAdminDO) {
        Object ID = getSqlMapClientTemplate().insert("CmsxAdmin.insert", cmsxAdminDO);
        return (Long) ID;
    }

    /**
     * 统计记录数
     * @param cmsxAdminDO
     * @return 查出的记录数
     */
    public Integer countCmsxAdminDOByExample(CmsxAdminDO cmsxAdminDO) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxAdmin.countByDOExample", cmsxAdminDO);
        return count;
    }

    /**
     * 统计记录数
     * @param cmsxAdminQuery
     * @return 查出的记录数
     */
    public Integer countCmsxAdminQueryByExample(CmsxAdminQuery cmsxAdminQuery) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxAdmin.countByQueryExample", cmsxAdminQuery);
        return count;
    }

    /**
     * 更新记录
     * @param cmsxAdminDO
     * @return 受影响的行数
     */
    public Integer updateCmsxAdminDO(CmsxAdminDO cmsxAdminDO) {
        int result = getSqlMapClientTemplate().update("CmsxAdmin.update", cmsxAdminDO);
        return result;
    }

    /**
     * 获取对象列表
     * @param cmsxAdminDO
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxAdminDO> findListByExample(CmsxAdminDO cmsxAdminDO) {
        List<CmsxAdminDO> list = getSqlMapClientTemplate().queryForList("CmsxAdmin.findListByDO", cmsxAdminDO);
        return list;
    }

    /**
     * 获取对象列表
     * @param cmsxAdminQuery
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxAdminQuery> findListByExample(CmsxAdminQuery cmsxAdminQuery) {
        List<CmsxAdminQuery> list = getSqlMapClientTemplate().queryForList("CmsxAdmin.findListByQuery", cmsxAdminQuery);
        return list;
    }

    /**
     * 根据主键获取cmsxAdminDO
     * @param id
     * @return cmsxAdminDO
     */
    public CmsxAdminDO findCmsxAdminDOByPrimaryKey(Long id) {
        CmsxAdminDO cmsxAdminDO = (CmsxAdminDO) getSqlMapClientTemplate().queryForObject("CmsxAdmin.findByPrimaryKey", id);
        return cmsxAdminDO;
    }

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxAdminDOByPrimaryKey(Long id) {
        Integer rows = (Integer) getSqlMapClientTemplate().delete("CmsxAdmin.deleteByPrimaryKey", id);
        return rows;
    }

}