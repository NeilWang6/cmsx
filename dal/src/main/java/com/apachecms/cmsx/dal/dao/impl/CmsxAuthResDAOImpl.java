package com.apachecms.cmsx.dal.dao.impl;

import com.apachecms.cmsx.dal.dao.CmsxAuthResDAO;
import com.apachecms.cmsx.dal.dataobject.CmsxAuthResDO;
import com.apachecms.cmsx.dal.query.CmsxAuthResQuery;
import java.util.List;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

/**
 * 数据访问对象实现类
 * @since 2014-03-14
 */
public class CmsxAuthResDAOImpl extends SqlMapClientDaoSupport implements CmsxAuthResDAO {

    /**
     * 插入数据
     * @param cmsxAuthResDO
     * @return 插入数据的主键
     */
    public Long insertCmsxAuthResDO(CmsxAuthResDO cmsxAuthResDO) {
        Object ID = getSqlMapClientTemplate().insert("CmsxAuthRes.insert", cmsxAuthResDO);
        return (Long) ID;
    }

    /**
     * 统计记录数
     * @param cmsxAuthResDO
     * @return 查出的记录数
     */
    public Integer countCmsxAuthResDOByExample(CmsxAuthResDO cmsxAuthResDO) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxAuthRes.countByDOExample", cmsxAuthResDO);
        return count;
    }

    /**
     * 统计记录数
     * @param cmsxAuthResQuery
     * @return 查出的记录数
     */
    public Integer countCmsxAuthResQueryByExample(CmsxAuthResQuery cmsxAuthResQuery) {
        Integer count = (Integer) getSqlMapClientTemplate().queryForObject("CmsxAuthRes.countByQueryExample", cmsxAuthResQuery);
        return count;
    }

    /**
     * 更新记录
     * @param cmsxAuthResDO
     * @return 受影响的行数
     */
    public Integer updateCmsxAuthResDO(CmsxAuthResDO cmsxAuthResDO) {
        int result = getSqlMapClientTemplate().update("CmsxAuthRes.update", cmsxAuthResDO);
        return result;
    }

    /**
     * 获取对象列表
     * @param cmsxAuthResDO
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxAuthResDO> findListByExample(CmsxAuthResDO cmsxAuthResDO) {
        List<CmsxAuthResDO> list = getSqlMapClientTemplate().queryForList("CmsxAuthRes.findListByDO", cmsxAuthResDO);
        return list;
    }

    /**
     * 获取对象列表
     * @param cmsxAuthResQuery
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public List<CmsxAuthResQuery> findListByExample(CmsxAuthResQuery cmsxAuthResQuery) {
        List<CmsxAuthResQuery> list = getSqlMapClientTemplate().queryForList("CmsxAuthRes.findListByQuery", cmsxAuthResQuery);
        return list;
    }

    /**
     * 根据主键获取cmsxAuthResDO
     * @param id
     * @return cmsxAuthResDO
     */
    public CmsxAuthResDO findCmsxAuthResDOByPrimaryKey(Long id) {
        CmsxAuthResDO cmsxAuthResDO = (CmsxAuthResDO) getSqlMapClientTemplate().queryForObject("CmsxAuthRes.findByPrimaryKey", id);
        return cmsxAuthResDO;
    }

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxAuthResDOByPrimaryKey(Long id) {
        Integer rows = (Integer) getSqlMapClientTemplate().delete("CmsxAuthRes.deleteByPrimaryKey", id);
        return rows;
    }

}