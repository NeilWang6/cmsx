package com.apachecms.cmsx.dal.dao.impl;

import com.apachecms.cmsx.dal.dao.CmsxMetaPropenumDAO;
import com.apachecms.cmsx.dal.dao.ibatis.DaoRouter;
import com.apachecms.cmsx.dal.dataobject.CmsxMetaPropenumDO;
import com.apachecms.cmsx.dal.query.CmsxMetaPropenumQuery;

import java.util.List;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

/**
 * 数据访问对象实现类
 * @since 2014-02-07
 */
public class CmsxMetaPropenumDAOImpl extends DaoRouter implements CmsxMetaPropenumDAO {

    /**
     * 插入数据
     * @param cmsxMetaPropenumDO
     * @return 插入数据的主键
     */
    public Long insertCmsxMetaPropenumDO(CmsxMetaPropenumDO cmsxMetaPropenumDO) {
        Object ID = getSqlMapClientTemplate().insert("CmsxMetaPropenum.insert", cmsxMetaPropenumDO);
        return (Long) ID;
    }

    /**
     * 统计记录数
     * @param cmsxMetaPropenumDO
     * @return 查出的记录数
     */
    public Integer countCmsxMetaPropenumDOByExample(CmsxMetaPropenumDO cmsxMetaPropenumDO) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxMetaPropenum.countByDOExample", cmsxMetaPropenumDO);
        return count;
    }

    /**
     * 统计记录数
     * @param cmsxMetaPropenumQuery
     * @return 查出的记录数
     */
    public Integer countCmsxMetaPropenumQueryByExample(CmsxMetaPropenumQuery cmsxMetaPropenumQuery) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxMetaPropenum.countByQueryExample", cmsxMetaPropenumQuery);
        return count;
    }

    /**
     * 更新记录
     * @param cmsxMetaPropenumDO
     * @return 受影响的行数
     */
    public Integer updateCmsxMetaPropenumDO(CmsxMetaPropenumDO cmsxMetaPropenumDO) {
        int result = getSqlMapClientTemplate().update("CmsxMetaPropenum.update", cmsxMetaPropenumDO);
        return result;
    }

    /**
     * 获取对象列表
     * @param cmsxMetaPropenumDO
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxMetaPropenumDO> findListByExample(CmsxMetaPropenumDO cmsxMetaPropenumDO) {
        List<CmsxMetaPropenumDO> list = getSqlMapClientTemplate().queryForList("CmsxMetaPropenum.findListByDO", cmsxMetaPropenumDO);
        return list;
    }

    /**
     * 获取对象列表
     * @param cmsxMetaPropenumQuery
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxMetaPropenumQuery> findListByExample(CmsxMetaPropenumQuery cmsxMetaPropenumQuery) {
        List<CmsxMetaPropenumQuery> list = getSqlMapClientTemplate().queryForList("CmsxMetaPropenum.findListByQuery", cmsxMetaPropenumQuery);
        return list;
    }

    /**
     * 根据主键获取cmsxMetaPropenumDO
     * @param id
     * @return cmsxMetaPropenumDO
     */
    public CmsxMetaPropenumDO findCmsxMetaPropenumDOByPrimaryKey(Long id) {
        CmsxMetaPropenumDO cmsxMetaPropenumDO = (CmsxMetaPropenumDO) getSqlMapClientTemplate().queryForObject("CmsxMetaPropenum.findByPrimaryKey", id);
        return cmsxMetaPropenumDO;
    }

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxMetaPropenumDOByPrimaryKey(Long id) {
        Integer rows = (Integer) getSqlMapClientTemplate().delete("CmsxMetaPropenum.deleteByPrimaryKey", id);
        return rows;
    }

}