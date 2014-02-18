package com.apachecms.cmsx.dal.dao;

import com.apachecms.cmsx.dal.dataobject.CmsxAdminDO;
import com.apachecms.cmsx.dal.query.CmsxAdminQuery;
import java.util.List;

/**
 * 数据访问对象接口
 * @since 2014-02-07
 */
public interface CmsxAdminDAO{

    /**
     * 插入数据
     * @param cmsxAdminDO
     * @return 插入数据的主键
     */
    public Long insertCmsxAdminDO(CmsxAdminDO cmsxAdminDO);

    /**
     * 统计记录数
     * @param cmsxAdminDO
     * @return 查出的记录数
     */
    public Integer countCmsxAdminDOByExample(CmsxAdminDO cmsxAdminDO);

    /**
     * 统计记录数
     * @param cmsxAdminQuery
     * @return 查出的记录数
     */
    public Integer countCmsxAdminQueryByExample(CmsxAdminQuery cmsxAdminQuery);

    /**
     * 更新记录
     * @param cmsxAdminDO
     * @return 受影响的行数
     */
    public Integer updateCmsxAdminDO(CmsxAdminDO cmsxAdminDO);

    /**
     * 获取对象列表
     * @param cmsxAdminDO
     * @return 对象列表
     */
    public List<CmsxAdminDO> findListByExample(CmsxAdminDO cmsxAdminDO);

    /**
     * 获取对象列表
     * @param cmsxAdminQuery
     * @return 对象列表
     */
    public List<CmsxAdminQuery> findListByExample(CmsxAdminQuery cmsxAdminQuery);

    /**
     * 根据主键获取cmsxAdminDO
     * @param id
     * @return cmsxAdminDO
     */
    public CmsxAdminDO findCmsxAdminDOByPrimaryKey(Long id);

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxAdminDOByPrimaryKey(Long id);

}