package com.apachecms.cmsx.dal.dao.impl;

import com.apachecms.cmsx.dal.dao.CmsxCaseCatalogDAO;
import com.apachecms.cmsx.dal.dao.ibatis.DaoRouter;
import com.apachecms.cmsx.dal.dataobject.CmsxCaseCatalogDO;
import com.apachecms.cmsx.dal.query.CmsxCaseCatalogQuery;

import java.util.List;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

/**
 * 数据访问对象实现类
 * @since 2014-02-07
 */
public class CmsxCaseCatalogDAOImpl extends DaoRouter implements CmsxCaseCatalogDAO {

    /**
     * 插入数据
     * @param cmsxCaseCatalogDO
     * @return 插入数据的主键
     */
    public Long insertCmsxCaseCatalogDO(CmsxCaseCatalogDO cmsxCaseCatalogDO) {
        Object ID = getSqlMapClientTemplate().insert("CmsxCaseCatalog.insert", cmsxCaseCatalogDO);
        return (Long) ID;
    }

    /**
     * 统计记录数
     * @param cmsxCaseCatalogDO
     * @return 查出的记录数
     */
    public Integer countCmsxCaseCatalogDOByExample(CmsxCaseCatalogDO cmsxCaseCatalogDO) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxCaseCatalog.countByDOExample", cmsxCaseCatalogDO);
        return count;
    }

    /**
     * 统计记录数
     * @param cmsxCaseCatalogQuery
     * @return 查出的记录数
     */
    public Integer countCmsxCaseCatalogQueryByExample(CmsxCaseCatalogQuery cmsxCaseCatalogQuery) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxCaseCatalog.countByQueryExample", cmsxCaseCatalogQuery);
        return count;
    }

    /**
     * 更新记录
     * @param cmsxCaseCatalogDO
     * @return 受影响的行数
     */
    public Integer updateCmsxCaseCatalogDO(CmsxCaseCatalogDO cmsxCaseCatalogDO) {
        int result = getSqlMapClientTemplate().update("CmsxCaseCatalog.update", cmsxCaseCatalogDO);
        return result;
    }

    /**
     * 获取对象列表
     * @param cmsxCaseCatalogDO
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxCaseCatalogDO> findListByExample(CmsxCaseCatalogDO cmsxCaseCatalogDO) {
        List<CmsxCaseCatalogDO> list = getSqlMapClientTemplate().queryForList("CmsxCaseCatalog.findListByDO", cmsxCaseCatalogDO);
        return list;
    }

    /**
     * 获取对象列表
     * @param cmsxCaseCatalogQuery
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxCaseCatalogQuery> findListByExample(CmsxCaseCatalogQuery cmsxCaseCatalogQuery) {
        List<CmsxCaseCatalogQuery> list = getSqlMapClientTemplate().queryForList("CmsxCaseCatalog.findListByQuery", cmsxCaseCatalogQuery);
        return list;
    }

    /**
     * 根据主键获取cmsxCaseCatalogDO
     * @param id
     * @return cmsxCaseCatalogDO
     */
    public CmsxCaseCatalogDO findCmsxCaseCatalogDOByPrimaryKey(Long id) {
        CmsxCaseCatalogDO cmsxCaseCatalogDO = (CmsxCaseCatalogDO) getSqlMapClientTemplate().queryForObject("CmsxCaseCatalog.findByPrimaryKey", id);
        return cmsxCaseCatalogDO;
    }

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxCaseCatalogDOByPrimaryKey(Long id) {
        Integer rows = (Integer) getSqlMapClientTemplate().delete("CmsxCaseCatalog.deleteByPrimaryKey", id);
        return rows;
    }

}