package com.apachecms.cmsx.dal.dao;

import com.apachecms.cmsx.dal.dataobject.CmsxAuthRoleResDO;
import com.apachecms.cmsx.dal.query.CmsxAuthRoleResQuery;
import java.util.List;

/**
 * 数据访问对象接口
 * @since 2014-02-07
 */
public interface CmsxAuthRoleResDAO {

    /**
     * 插入数据
     * @param cmsxAuthRoleResDO
     * @return 插入数据的主键
     */
    public Long insertCmsxAuthRoleResDO(CmsxAuthRoleResDO cmsxAuthRoleResDO);

    /**
     * 统计记录数
     * @param cmsxAuthRoleResDO
     * @return 查出的记录数
     */
    public Integer countCmsxAuthRoleResDOByExample(CmsxAuthRoleResDO cmsxAuthRoleResDO);

    /**
     * 统计记录数
     * @param cmsxAuthRoleResQuery
     * @return 查出的记录数
     */
    public Integer countCmsxAuthRoleResQueryByExample(CmsxAuthRoleResQuery cmsxAuthRoleResQuery);

    /**
     * 更新记录
     * @param cmsxAuthRoleResDO
     * @return 受影响的行数
     */
    public Integer updateCmsxAuthRoleResDO(CmsxAuthRoleResDO cmsxAuthRoleResDO);

    /**
     * 获取对象列表
     * @param cmsxAuthRoleResDO
     * @return 对象列表
     */
    public List<CmsxAuthRoleResDO> findListByExample(CmsxAuthRoleResDO cmsxAuthRoleResDO);

    /**
     * 获取对象列表
     * @param cmsxAuthRoleResQuery
     * @return 对象列表
     */
    public List<CmsxAuthRoleResQuery> findListByExample(CmsxAuthRoleResQuery cmsxAuthRoleResQuery);

    /**
     * 根据主键获取cmsxAuthRoleResDO
     * @param id
     * @return cmsxAuthRoleResDO
     */
    public CmsxAuthRoleResDO findCmsxAuthRoleResDOByPrimaryKey(Long id);

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxAuthRoleResDOByPrimaryKey(Long id);

}