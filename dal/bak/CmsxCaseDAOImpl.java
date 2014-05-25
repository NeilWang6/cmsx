package com.apachecms.cmsx.dal.dao.impl;

import com.apachecms.cmsx.dal.dao.CmsxCaseDAO;
import com.apachecms.cmsx.dal.dao.ibatis.DaoRouter;
import com.apachecms.cmsx.dal.dataobject.CmsxCaseDO;
import com.apachecms.cmsx.dal.query.CmsxCaseQuery;

import java.util.List;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

/**
 * 数据访问对象实现类
 * @since 2014-02-07
 */
public class CmsxCaseDAOImpl extends DaoRouter implements CmsxCaseDAO {

    /**
     * 插入数据
     * @param cmsxCaseDO
     * @return 插入数据的主键
     */
    public Long insertCmsxCaseDO(CmsxCaseDO cmsxCaseDO) {
        Object ID = getSqlMapClientTemplate().insert("CmsxCase.insert", cmsxCaseDO);
        return (Long) ID;
    }

    /**
     * 统计记录数
     * @param cmsxCaseDO
     * @return 查出的记录数
     */
    public Integer countCmsxCaseDOByExample(CmsxCaseDO cmsxCaseDO) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxCase.countByDOExample", cmsxCaseDO);
        return count;
    }

    /**
     * 统计记录数
     * @param cmsxCaseQuery
     * @return 查出的记录数
     */
    public Integer countCmsxCaseQueryByExample(CmsxCaseQuery cmsxCaseQuery) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxCase.countByQueryExample", cmsxCaseQuery);
        return count;
    }

    /**
     * 更新记录
     * @param cmsxCaseDO
     * @return 受影响的行数
     */
    public Integer updateCmsxCaseDO(CmsxCaseDO cmsxCaseDO) {
        int result = getSqlMapClientTemplate().update("CmsxCase.update", cmsxCaseDO);
        return result;
    }

    /**
     * 获取对象列表
     * @param cmsxCaseDO
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxCaseDO> findListByExample(CmsxCaseDO cmsxCaseDO) {
        List<CmsxCaseDO> list = getSqlMapClientTemplate().queryForList("CmsxCase.findListByDO", cmsxCaseDO);
        return list;
    }

    /**
     * 获取对象列表
     * @param cmsxCaseQuery
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxCaseQuery> findListByExample(CmsxCaseQuery cmsxCaseQuery) {
        List<CmsxCaseQuery> list = getSqlMapClientTemplate().queryForList("CmsxCase.findListByQuery", cmsxCaseQuery);
        return list;
    }

    /**
     * 根据主键获取cmsxCaseDO
     * @param id
     * @return cmsxCaseDO
     */
    public CmsxCaseDO findCmsxCaseDOByPrimaryKey(Long id) {
        CmsxCaseDO cmsxCaseDO = (CmsxCaseDO) getSqlMapClientTemplate().queryForObject("CmsxCase.findByPrimaryKey", id);
        return cmsxCaseDO;
    }

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxCaseDOByPrimaryKey(Long id) {
        Integer rows = (Integer) getSqlMapClientTemplate().delete("CmsxCase.deleteByPrimaryKey", id);
        return rows;
    }

}