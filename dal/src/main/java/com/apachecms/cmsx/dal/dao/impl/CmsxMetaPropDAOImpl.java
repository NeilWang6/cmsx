package com.apachecms.cmsx.dal.dao.impl;

import com.apachecms.cmsx.dal.dao.CmsxMetaPropDAO;
import com.apachecms.cmsx.dal.dao.ibatis.DaoRouter;
import com.apachecms.cmsx.dal.dataobject.CmsxMetaPropDO;
import com.apachecms.cmsx.dal.query.CmsxMetaPropQuery;

import java.util.List;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

/**
 * 数据访问对象实现类
 * @since 2014-02-07
 */
public class CmsxMetaPropDAOImpl extends DaoRouter implements CmsxMetaPropDAO {

    /**
     * 插入数据
     * @param cmsxMetaPropDO
     * @return 插入数据的主键
     */
    public Long insertCmsxMetaPropDO(CmsxMetaPropDO cmsxMetaPropDO) {
        Object ID = getSqlMapClientTemplate().insert("CmsxMetaProp.insert", cmsxMetaPropDO);
        return (Long) ID;
    }

    /**
     * 统计记录数
     * @param cmsxMetaPropDO
     * @return 查出的记录数
     */
    public Integer countCmsxMetaPropDOByExample(CmsxMetaPropDO cmsxMetaPropDO) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxMetaProp.countByDOExample", cmsxMetaPropDO);
        return count;
    }

    /**
     * 统计记录数
     * @param cmsxMetaPropQuery
     * @return 查出的记录数
     */
    public Integer countCmsxMetaPropQueryByExample(CmsxMetaPropQuery cmsxMetaPropQuery) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxMetaProp.countByQueryExample", cmsxMetaPropQuery);
        return count;
    }

    /**
     * 更新记录
     * @param cmsxMetaPropDO
     * @return 受影响的行数
     */
    public Integer updateCmsxMetaPropDO(CmsxMetaPropDO cmsxMetaPropDO) {
        int result = getSqlMapClientTemplate().update("CmsxMetaProp.update", cmsxMetaPropDO);
        return result;
    }

    /**
     * 获取对象列表
     * @param cmsxMetaPropDO
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxMetaPropDO> findListByExample(CmsxMetaPropDO cmsxMetaPropDO) {
        List<CmsxMetaPropDO> list = getSqlMapClientTemplate().queryForList("CmsxMetaProp.findListByDO", cmsxMetaPropDO);
        return list;
    }

    /**
     * 获取对象列表
     * @param cmsxMetaPropQuery
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxMetaPropQuery> findListByExample(CmsxMetaPropQuery cmsxMetaPropQuery) {
        List<CmsxMetaPropQuery> list = getSqlMapClientTemplate().queryForList("CmsxMetaProp.findListByQuery", cmsxMetaPropQuery);
        return list;
    }

    /**
     * 根据主键获取cmsxMetaPropDO
     * @param id
     * @return cmsxMetaPropDO
     */
    public CmsxMetaPropDO findCmsxMetaPropDOByPrimaryKey(Long id) {
        CmsxMetaPropDO cmsxMetaPropDO = (CmsxMetaPropDO) getSqlMapClientTemplate().queryForObject("CmsxMetaProp.findByPrimaryKey", id);
        return cmsxMetaPropDO;
    }

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxMetaPropDOByPrimaryKey(Long id) {
        Integer rows = (Integer) getSqlMapClientTemplate().delete("CmsxMetaProp.deleteByPrimaryKey", id);
        return rows;
    }

}