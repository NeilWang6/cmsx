package com.apachecms.cmsx.dal.dao;

import com.apachecms.cmsx.dal.dataobject.CmsxCaseDO;
import com.apachecms.cmsx.dal.query.CmsxCaseQuery;
import java.util.List;

/**
 * 数据访问对象接口
 * @since 2014-02-07
 */
public interface CmsxCaseDAO {

    /**
     * 插入数据
     * @param cmsxCaseDO
     * @return 插入数据的主键
     */
    public Long insertCmsxCaseDO(CmsxCaseDO cmsxCaseDO);

    /**
     * 统计记录数
     * @param cmsxCaseDO
     * @return 查出的记录数
     */
    public Integer countCmsxCaseDOByExample(CmsxCaseDO cmsxCaseDO);

    /**
     * 统计记录数
     * @param cmsxCaseQuery
     * @return 查出的记录数
     */
    public Integer countCmsxCaseQueryByExample(CmsxCaseQuery cmsxCaseQuery);

    /**
     * 更新记录
     * @param cmsxCaseDO
     * @return 受影响的行数
     */
    public Integer updateCmsxCaseDO(CmsxCaseDO cmsxCaseDO);

    /**
     * 获取对象列表
     * @param cmsxCaseDO
     * @return 对象列表
     */
    public List<CmsxCaseDO> findListByExample(CmsxCaseDO cmsxCaseDO);

    /**
     * 获取对象列表
     * @param cmsxCaseQuery
     * @return 对象列表
     */
    public List<CmsxCaseQuery> findListByExample(CmsxCaseQuery cmsxCaseQuery);

    /**
     * 根据主键获取cmsxCaseDO
     * @param id
     * @return cmsxCaseDO
     */
    public CmsxCaseDO findCmsxCaseDOByPrimaryKey(Long id);

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxCaseDOByPrimaryKey(Long id);

}