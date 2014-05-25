package com.apachecms.cmsx.dal.dao.impl;

import com.apachecms.cmsx.dal.dao.CmsxCasePropvalDAO;
import com.apachecms.cmsx.dal.dao.ibatis.DaoRouter;
import com.apachecms.cmsx.dal.dataobject.CmsxCasePropvalDO;
import com.apachecms.cmsx.dal.query.CmsxCasePropvalQuery;

import java.util.List;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

/**
 * 数据访问对象实现类
 * @since 2014-02-07
 */
public class CmsxCasePropvalDAOImpl extends DaoRouter implements CmsxCasePropvalDAO {

    /**
     * 插入数据
     * @param cmsxCasePropvalDO
     * @return 插入数据的主键
     */
    public Long insertCmsxCasePropvalDO(CmsxCasePropvalDO cmsxCasePropvalDO) {
        Object ID = getSqlMapClientTemplate().insert("CmsxCasePropval.insert", cmsxCasePropvalDO);
        return (Long) ID;
    }

    /**
     * 统计记录数
     * @param cmsxCasePropvalDO
     * @return 查出的记录数
     */
    public Integer countCmsxCasePropvalDOByExample(CmsxCasePropvalDO cmsxCasePropvalDO) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxCasePropval.countByDOExample", cmsxCasePropvalDO);
        return count;
    }

    /**
     * 统计记录数
     * @param cmsxCasePropvalQuery
     * @return 查出的记录数
     */
    public Integer countCmsxCasePropvalQueryByExample(CmsxCasePropvalQuery cmsxCasePropvalQuery) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxCasePropval.countByQueryExample", cmsxCasePropvalQuery);
        return count;
    }

    /**
     * 更新记录
     * @param cmsxCasePropvalDO
     * @return 受影响的行数
     */
    public Integer updateCmsxCasePropvalDO(CmsxCasePropvalDO cmsxCasePropvalDO) {
        int result = getSqlMapClientTemplate().update("CmsxCasePropval.update", cmsxCasePropvalDO);
        return result;
    }

    /**
     * 获取对象列表
     * @param cmsxCasePropvalDO
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxCasePropvalDO> findListByExample(CmsxCasePropvalDO cmsxCasePropvalDO) {
        List<CmsxCasePropvalDO> list = getSqlMapClientTemplate().queryForList("CmsxCasePropval.findListByDO", cmsxCasePropvalDO);
        return list;
    }

    /**
     * 获取对象列表
     * @param cmsxCasePropvalQuery
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxCasePropvalQuery> findListByExample(CmsxCasePropvalQuery cmsxCasePropvalQuery) {
        List<CmsxCasePropvalQuery> list = getSqlMapClientTemplate().queryForList("CmsxCasePropval.findListByQuery", cmsxCasePropvalQuery);
        return list;
    }

    /**
     * 根据主键获取cmsxCasePropvalDO
     * @param id
     * @return cmsxCasePropvalDO
     */
    public CmsxCasePropvalDO findCmsxCasePropvalDOByPrimaryKey(Long id) {
        CmsxCasePropvalDO cmsxCasePropvalDO = (CmsxCasePropvalDO) getSqlMapClientTemplate().queryForObject("CmsxCasePropval.findByPrimaryKey", id);
        return cmsxCasePropvalDO;
    }

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxCasePropvalDOByPrimaryKey(Long id) {
        Integer rows = (Integer) getSqlMapClientTemplate().delete("CmsxCasePropval.deleteByPrimaryKey", id);
        return rows;
    }

}