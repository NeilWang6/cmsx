package com.apachecms.cmsx.dal.dao.impl;

import com.apachecms.cmsx.dal.dao.CmsxCaseCatalogPropDAO;
import com.apachecms.cmsx.dal.dao.ibatis.DaoRouter;
import com.apachecms.cmsx.dal.dataobject.CmsxCaseCatalogPropDO;
import com.apachecms.cmsx.dal.query.CmsxCaseCatalogPropQuery;

import java.util.List;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

/**
 * 数据访问对象实现类
 * @since 2014-02-07
 */
public class CmsxCaseCatalogPropDAOImpl extends DaoRouter implements CmsxCaseCatalogPropDAO {

    /**
     * 插入数据
     * @param cmsxCaseCatalogPropDO
     * @return 插入数据的主键
     */
    public Long insertCmsxCaseCatalogPropDO(CmsxCaseCatalogPropDO cmsxCaseCatalogPropDO) {
        Object ID = getSqlMapClientTemplate().insert("CmsxCaseCatalogProp.insert", cmsxCaseCatalogPropDO);
        return (Long) ID;
    }

    /**
     * 统计记录数
     * @param cmsxCaseCatalogPropDO
     * @return 查出的记录数
     */
    public Integer countCmsxCaseCatalogPropDOByExample(CmsxCaseCatalogPropDO cmsxCaseCatalogPropDO) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxCaseCatalogProp.countByDOExample", cmsxCaseCatalogPropDO);
        return count;
    }

    /**
     * 统计记录数
     * @param cmsxCaseCatalogPropQuery
     * @return 查出的记录数
     */
    public Integer countCmsxCaseCatalogPropQueryByExample(CmsxCaseCatalogPropQuery cmsxCaseCatalogPropQuery) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxCaseCatalogProp.countByQueryExample", cmsxCaseCatalogPropQuery);
        return count;
    }

    /**
     * 更新记录
     * @param cmsxCaseCatalogPropDO
     * @return 受影响的行数
     */
    public Integer updateCmsxCaseCatalogPropDO(CmsxCaseCatalogPropDO cmsxCaseCatalogPropDO) {
        int result = getSqlMapClientTemplate().update("CmsxCaseCatalogProp.update", cmsxCaseCatalogPropDO);
        return result;
    }

    /**
     * 获取对象列表
     * @param cmsxCaseCatalogPropDO
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxCaseCatalogPropDO> findListByExample(CmsxCaseCatalogPropDO cmsxCaseCatalogPropDO) {
        List<CmsxCaseCatalogPropDO> list = getSqlMapClientTemplate().queryForList("CmsxCaseCatalogProp.findListByDO", cmsxCaseCatalogPropDO);
        return list;
    }

    /**
     * 获取对象列表
     * @param cmsxCaseCatalogPropQuery
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxCaseCatalogPropQuery> findListByExample(CmsxCaseCatalogPropQuery cmsxCaseCatalogPropQuery) {
        List<CmsxCaseCatalogPropQuery> list = getSqlMapClientTemplate().queryForList("CmsxCaseCatalogProp.findListByQuery", cmsxCaseCatalogPropQuery);
        return list;
    }

    /**
     * 根据主键获取cmsxCaseCatalogPropDO
     * @param id
     * @return cmsxCaseCatalogPropDO
     */
    public CmsxCaseCatalogPropDO findCmsxCaseCatalogPropDOByPrimaryKey(Long id) {
        CmsxCaseCatalogPropDO cmsxCaseCatalogPropDO = (CmsxCaseCatalogPropDO) getSqlMapClientTemplate().queryForObject("CmsxCaseCatalogProp.findByPrimaryKey", id);
        return cmsxCaseCatalogPropDO;
    }

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxCaseCatalogPropDOByPrimaryKey(Long id) {
        Integer rows = (Integer) getSqlMapClientTemplate().delete("CmsxCaseCatalogProp.deleteByPrimaryKey", id);
        return rows;
    }

}