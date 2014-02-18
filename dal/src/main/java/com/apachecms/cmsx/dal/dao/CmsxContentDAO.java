package com.apachecms.cmsx.dal.dao;

import com.apachecms.cmsx.dal.dataobject.CmsxContentDO;
import com.apachecms.cmsx.dal.query.CmsxContentQuery;
import java.util.List;

/**
 * 数据访问对象接口
 * @since 2014-02-07
 */
public interface CmsxContentDAO {

    /**
     * 插入数据
     * @param cmsxContentDO
     * @return 插入数据的主键
     */
    public Long insertCmsxContentDO(CmsxContentDO cmsxContentDO);

    /**
     * 统计记录数
     * @param cmsxContentDO
     * @return 查出的记录数
     */
    public Integer countCmsxContentDOByExample(CmsxContentDO cmsxContentDO);

    /**
     * 统计记录数
     * @param cmsxContentQuery
     * @return 查出的记录数
     */
    public Integer countCmsxContentQueryByExample(CmsxContentQuery cmsxContentQuery);

    /**
     * 更新记录
     * @param cmsxContentDO
     * @return 受影响的行数
     */
    public Integer updateCmsxContentDO(CmsxContentDO cmsxContentDO);

    /**
     * 获取对象列表
     * @param cmsxContentDO
     * @return 对象列表
     */
    public List<CmsxContentDO> findListByExample(CmsxContentDO cmsxContentDO);

    /**
     * 获取对象列表
     * @param cmsxContentQuery
     * @return 对象列表
     */
    public List<CmsxContentQuery> findListByExample(CmsxContentQuery cmsxContentQuery);

    /**
     * 根据主键获取cmsxContentDO
     * @param id
     * @return cmsxContentDO
     */
    public CmsxContentDO findCmsxContentDOByPrimaryKey(Long id);

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxContentDOByPrimaryKey(Long id);

}