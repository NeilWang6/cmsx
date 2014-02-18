package com.apachecms.cmsx.dal.dao.impl;

import com.apachecms.cmsx.dal.dao.CmsxAuthMenuDAO;
import com.apachecms.cmsx.dal.dao.ibatis.DaoRouter;
import com.apachecms.cmsx.dal.dataobject.CmsxAuthMenuDO;
import com.apachecms.cmsx.dal.query.CmsxAuthMenuQuery;

import java.util.List;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

/**
 * 数据访问对象实现类
 * @since 2014-02-16
 */
public class CmsxAuthMenuDAOImpl extends DaoRouter implements CmsxAuthMenuDAO {

    /**
     * 插入数据
     * @param cmsxAuthMenuDO
     * @return 插入数据的主键
     */
    public Long insertCmsxAuthMenuDO(CmsxAuthMenuDO cmsxAuthMenuDO) {
        Object ID = getSqlMapClientTemplate().insert("CmsxAuthMenu.insert", cmsxAuthMenuDO);
        return (Long) ID;
    }

    /**
     * 统计记录数
     * @param cmsxAuthMenuDO
     * @return 查出的记录数
     */
    public Integer countCmsxAuthMenuDOByExample(CmsxAuthMenuDO cmsxAuthMenuDO) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxAuthMenu.countByDOExample", cmsxAuthMenuDO);
        return count;
    }

    /**
     * 统计记录数
     * @param cmsxAuthMenuQuery
     * @return 查出的记录数
     */
    public Integer countCmsxAuthMenuQueryByExample(CmsxAuthMenuQuery cmsxAuthMenuQuery) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxAuthMenu.countByQueryExample", cmsxAuthMenuQuery);
        return count;
    }

    /**
     * 更新记录
     * @param cmsxAuthMenuDO
     * @return 受影响的行数
     */
    public Integer updateCmsxAuthMenuDO(CmsxAuthMenuDO cmsxAuthMenuDO) {
        int result = getSqlMapClientTemplate().update("CmsxAuthMenu.update", cmsxAuthMenuDO);
        return result;
    }

    /**
     * 获取对象列表
     * @param cmsxAuthMenuDO
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxAuthMenuDO> findListByExample(CmsxAuthMenuDO cmsxAuthMenuDO) {
        List<CmsxAuthMenuDO> list = getSqlMapClientTemplate().queryForList("CmsxAuthMenu.findListByDO", cmsxAuthMenuDO);
        return list;
    }

    /**
     * 获取对象列表
     * @param cmsxAuthMenuQuery
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxAuthMenuQuery> findListByExample(CmsxAuthMenuQuery cmsxAuthMenuQuery) {
        List<CmsxAuthMenuQuery> list = getSqlMapClientTemplate().queryForList("CmsxAuthMenu.findListByQuery", cmsxAuthMenuQuery);
        return list;
    }

    /**
     * 根据主键获取cmsxAuthMenuDO
     * @param id
     * @return cmsxAuthMenuDO
     */
    public CmsxAuthMenuDO findCmsxAuthMenuDOByPrimaryKey(Long id) {
        CmsxAuthMenuDO cmsxAuthMenuDO = (CmsxAuthMenuDO) getSqlMapClientTemplate().queryForObject("CmsxAuthMenu.findByPrimaryKey", id);
        return cmsxAuthMenuDO;
    }

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxAuthMenuDOByPrimaryKey(Long id) {
        Integer rows = (Integer) getSqlMapClientTemplate().delete("CmsxAuthMenu.deleteByPrimaryKey", id);
        return rows;
    }

}