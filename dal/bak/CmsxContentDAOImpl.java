package com.apachecms.cmsx.dal.dao.impl;

import com.apachecms.cmsx.dal.dao.CmsxContentDAO;
import com.apachecms.cmsx.dal.dao.ibatis.DaoRouter;
import com.apachecms.cmsx.dal.dataobject.CmsxContentDO;
import com.apachecms.cmsx.dal.query.CmsxContentQuery;

import java.util.List;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

/**
 * 数据访问对象实现类
 * @since 2014-02-07
 */
public class CmsxContentDAOImpl extends DaoRouter implements CmsxContentDAO {

    /**
     * 插入数据
     * @param cmsxContentDO
     * @return 插入数据的主键
     */
    public Long insertCmsxContentDO(CmsxContentDO cmsxContentDO) {
        Object ID = getSqlMapClientTemplate().insert("CmsxContent.insert", cmsxContentDO);
        return (Long) ID;
    }

    /**
     * 统计记录数
     * @param cmsxContentDO
     * @return 查出的记录数
     */
    public Integer countCmsxContentDOByExample(CmsxContentDO cmsxContentDO) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxContent.countByDOExample", cmsxContentDO);
        return count;
    }

    /**
     * 统计记录数
     * @param cmsxContentQuery
     * @return 查出的记录数
     */
    public Integer countCmsxContentQueryByExample(CmsxContentQuery cmsxContentQuery) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxContent.countByQueryExample", cmsxContentQuery);
        return count;
    }

    /**
     * 更新记录
     * @param cmsxContentDO
     * @return 受影响的行数
     */
    public Integer updateCmsxContentDO(CmsxContentDO cmsxContentDO) {
        int result = getSqlMapClientTemplate().update("CmsxContent.update", cmsxContentDO);
        return result;
    }

    /**
     * 获取对象列表
     * @param cmsxContentDO
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxContentDO> findListByExample(CmsxContentDO cmsxContentDO) {
        List<CmsxContentDO> list = getSqlMapClientTemplate().queryForList("CmsxContent.findListByDO", cmsxContentDO);
        return list;
    }

    /**
     * 获取对象列表
     * @param cmsxContentQuery
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxContentQuery> findListByExample(CmsxContentQuery cmsxContentQuery) {
        List<CmsxContentQuery> list = getSqlMapClientTemplate().queryForList("CmsxContent.findListByQuery", cmsxContentQuery);
        return list;
    }

    /**
     * 根据主键获取cmsxContentDO
     * @param id
     * @return cmsxContentDO
     */
    public CmsxContentDO findCmsxContentDOByPrimaryKey(Long id) {
        CmsxContentDO cmsxContentDO = (CmsxContentDO) getSqlMapClientTemplate().queryForObject("CmsxContent.findByPrimaryKey", id);
        return cmsxContentDO;
    }

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxContentDOByPrimaryKey(Long id) {
        Integer rows = (Integer) getSqlMapClientTemplate().delete("CmsxContent.deleteByPrimaryKey", id);
        return rows;
    }

}