package com.apachecms.cmsx.dal.dao.impl;

import com.apachecms.cmsx.dal.dao.CmsxAuthRoleResDAO;
import com.apachecms.cmsx.dal.dao.ibatis.DaoRouter;
import com.apachecms.cmsx.dal.dataobject.CmsxAuthRoleResDO;
import com.apachecms.cmsx.dal.query.CmsxAuthRoleResQuery;

import java.util.List;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

/**
 * 数据访问对象实现类
 * @since 2014-02-07
 */
public class CmsxAuthRoleResDAOImpl extends DaoRouter implements CmsxAuthRoleResDAO {

    /**
     * 插入数据
     * @param cmsxAuthRoleResDO
     * @return 插入数据的主键
     */
    public Long insertCmsxAuthRoleResDO(CmsxAuthRoleResDO cmsxAuthRoleResDO) {
        Object ID = getSqlMapClientTemplate().insert("CmsxAuthRoleRes.insert", cmsxAuthRoleResDO);
        return (Long) ID;
    }

    /**
     * 统计记录数
     * @param cmsxAuthRoleResDO
     * @return 查出的记录数
     */
    public Integer countCmsxAuthRoleResDOByExample(CmsxAuthRoleResDO cmsxAuthRoleResDO) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxAuthRoleRes.countByDOExample", cmsxAuthRoleResDO);
        return count;
    }

    /**
     * 统计记录数
     * @param cmsxAuthRoleResQuery
     * @return 查出的记录数
     */
    public Integer countCmsxAuthRoleResQueryByExample(CmsxAuthRoleResQuery cmsxAuthRoleResQuery) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxAuthRoleRes.countByQueryExample", cmsxAuthRoleResQuery);
        return count;
    }

    /**
     * 更新记录
     * @param cmsxAuthRoleResDO
     * @return 受影响的行数
     */
    public Integer updateCmsxAuthRoleResDO(CmsxAuthRoleResDO cmsxAuthRoleResDO) {
        int result = getSqlMapClientTemplate().update("CmsxAuthRoleRes.update", cmsxAuthRoleResDO);
        return result;
    }

    /**
     * 获取对象列表
     * @param cmsxAuthRoleResDO
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxAuthRoleResDO> findListByExample(CmsxAuthRoleResDO cmsxAuthRoleResDO) {
        List<CmsxAuthRoleResDO> list = getSqlMapClientTemplate().queryForList("CmsxAuthRoleRes.findListByDO", cmsxAuthRoleResDO);
        return list;
    }

    /**
     * 获取对象列表
     * @param cmsxAuthRoleResQuery
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxAuthRoleResQuery> findListByExample(CmsxAuthRoleResQuery cmsxAuthRoleResQuery) {
        List<CmsxAuthRoleResQuery> list = getSqlMapClientTemplate().queryForList("CmsxAuthRoleRes.findListByQuery", cmsxAuthRoleResQuery);
        return list;
    }

    /**
     * 根据主键获取cmsxAuthRoleResDO
     * @param id
     * @return cmsxAuthRoleResDO
     */
    public CmsxAuthRoleResDO findCmsxAuthRoleResDOByPrimaryKey(Long id) {
        CmsxAuthRoleResDO cmsxAuthRoleResDO = (CmsxAuthRoleResDO) getSqlMapClientTemplate().queryForObject("CmsxAuthRoleRes.findByPrimaryKey", id);
        return cmsxAuthRoleResDO;
    }

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxAuthRoleResDOByPrimaryKey(Long id) {
        Integer rows = (Integer) getSqlMapClientTemplate().delete("CmsxAuthRoleRes.deleteByPrimaryKey", id);
        return rows;
    }

}