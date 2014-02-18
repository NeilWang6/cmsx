package com.apachecms.cmsx.dal.dao;

import com.apachecms.cmsx.dal.dataobject.CmsxAdminRoleDO;
import com.apachecms.cmsx.dal.query.CmsxAdminRoleQuery;
import java.util.List;

/**
 * 数据访问对象接口
 * @since 2014-02-07
 */
public interface CmsxAdminRoleDAO {

    /**
     * 插入数据
     * @param cmsxAdminRoleDO
     * @return 插入数据的主键
     */
    public Long insertCmsxAdminRoleDO(CmsxAdminRoleDO cmsxAdminRoleDO);

    /**
     * 统计记录数
     * @param cmsxAdminRoleDO
     * @return 查出的记录数
     */
    public Integer countCmsxAdminRoleDOByExample(CmsxAdminRoleDO cmsxAdminRoleDO);

    /**
     * 统计记录数
     * @param cmsxAdminRoleQuery
     * @return 查出的记录数
     */
    public Integer countCmsxAdminRoleQueryByExample(CmsxAdminRoleQuery cmsxAdminRoleQuery);

    /**
     * 更新记录
     * @param cmsxAdminRoleDO
     * @return 受影响的行数
     */
    public Integer updateCmsxAdminRoleDO(CmsxAdminRoleDO cmsxAdminRoleDO);

    /**
     * 获取对象列表
     * @param cmsxAdminRoleDO
     * @return 对象列表
     */
    public List<CmsxAdminRoleDO> findListByExample(CmsxAdminRoleDO cmsxAdminRoleDO);

    /**
     * 获取对象列表
     * @param cmsxAdminRoleQuery
     * @return 对象列表
     */
    public List<CmsxAdminRoleQuery> findListByExample(CmsxAdminRoleQuery cmsxAdminRoleQuery);

    /**
     * 根据主键获取cmsxAdminRoleDO
     * @param id
     * @return cmsxAdminRoleDO
     */
    public CmsxAdminRoleDO findCmsxAdminRoleDOByPrimaryKey(Long id);

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxAdminRoleDOByPrimaryKey(Long id);

}