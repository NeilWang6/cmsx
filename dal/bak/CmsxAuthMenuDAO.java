package com.apachecms.cmsx.dal.dao;

import com.apachecms.cmsx.dal.dataobject.CmsxAuthMenuDO;
import com.apachecms.cmsx.dal.query.CmsxAuthMenuQuery;
import java.util.List;

/**
 * 数据访问对象接口
 * @since 2014-03-14
 */
public interface CmsxAuthMenuDAO {

    /**
     * 插入数据
     * @param cmsxAuthMenuDO
     * @return 插入数据的主键
     */
    public Long insertCmsxAuthMenuDO(CmsxAuthMenuDO cmsxAuthMenuDO);

    /**
     * 统计记录数
     * @param cmsxAuthMenuDO
     * @return 查出的记录数
     */
    public Integer countCmsxAuthMenuDOByExample(CmsxAuthMenuDO cmsxAuthMenuDO);

    /**
     * 统计记录数
     * @param cmsxAuthMenuQuery
     * @return 查出的记录数
     */
    public Integer countCmsxAuthMenuQueryByExample(CmsxAuthMenuQuery cmsxAuthMenuQuery);

    /**
     * 更新记录
     * @param cmsxAuthMenuDO
     * @return 受影响的行数
     */
    public Integer updateCmsxAuthMenuDO(CmsxAuthMenuDO cmsxAuthMenuDO);

    /**
     * 获取对象列表
     * @param cmsxAuthMenuDO
     * @return 对象列表
     */
    public List<CmsxAuthMenuDO> findListByExample(CmsxAuthMenuDO cmsxAuthMenuDO);

    /**
     * 获取对象列表
     * @param cmsxAuthMenuQuery
     * @return 对象列表
     */
    public List<CmsxAuthMenuQuery> findListByExample(CmsxAuthMenuQuery cmsxAuthMenuQuery);

    /**
     * 根据主键获取cmsxAuthMenuDO
     * @param id
     * @return cmsxAuthMenuDO
     */
    public CmsxAuthMenuDO findCmsxAuthMenuDOByPrimaryKey(Long id);

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxAuthMenuDOByPrimaryKey(Long id);

}