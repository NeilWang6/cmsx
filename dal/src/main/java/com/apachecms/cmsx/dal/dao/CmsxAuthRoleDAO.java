package com.apachecms.cmsx.dal.dao;

import com.apachecms.cmsx.dal.dataobject.CmsxAuthRoleDO;
import com.apachecms.cmsx.dal.query.CmsxAuthRoleQuery;
import java.util.List;

/**
 * 数据访问对象接口
 * @since 2014-02-07
 */
public interface CmsxAuthRoleDAO {

    /**
     * 插入数据
     * @param cmsxAuthRoleDO
     * @return 插入数据的主键
     */
    public Long insertCmsxAuthRoleDO(CmsxAuthRoleDO cmsxAuthRoleDO);

    /**
     * 统计记录数
     * @param cmsxAuthRoleDO
     * @return 查出的记录数
     */
    public Integer countCmsxAuthRoleDOByExample(CmsxAuthRoleDO cmsxAuthRoleDO);

    /**
     * 统计记录数
     * @param cmsxAuthRoleQuery
     * @return 查出的记录数
     */
    public Integer countCmsxAuthRoleQueryByExample(CmsxAuthRoleQuery cmsxAuthRoleQuery);

    /**
     * 更新记录
     * @param cmsxAuthRoleDO
     * @return 受影响的行数
     */
    public Integer updateCmsxAuthRoleDO(CmsxAuthRoleDO cmsxAuthRoleDO);

    /**
     * 获取对象列表
     * @param cmsxAuthRoleDO
     * @return 对象列表
     */
    public List<CmsxAuthRoleDO> findListByExample(CmsxAuthRoleDO cmsxAuthRoleDO);

    /**
     * 获取对象列表
     * @param cmsxAuthRoleQuery
     * @return 对象列表
     */
    public List<CmsxAuthRoleQuery> findListByExample(CmsxAuthRoleQuery cmsxAuthRoleQuery);

    /**
     * 根据主键获取cmsxAuthRoleDO
     * @param id
     * @return cmsxAuthRoleDO
     */
    public CmsxAuthRoleDO findCmsxAuthRoleDOByPrimaryKey(Long id);

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxAuthRoleDOByPrimaryKey(Long id);

}