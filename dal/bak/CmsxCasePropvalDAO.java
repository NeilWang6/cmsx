package com.apachecms.cmsx.dal.dao;

import com.apachecms.cmsx.dal.dataobject.CmsxCasePropvalDO;
import com.apachecms.cmsx.dal.query.CmsxCasePropvalQuery;
import java.util.List;

/**
 * 数据访问对象接口
 * @since 2014-02-07
 */
public interface CmsxCasePropvalDAO {

    /**
     * 插入数据
     * @param cmsxCasePropvalDO
     * @return 插入数据的主键
     */
    public Long insertCmsxCasePropvalDO(CmsxCasePropvalDO cmsxCasePropvalDO);

    /**
     * 统计记录数
     * @param cmsxCasePropvalDO
     * @return 查出的记录数
     */
    public Integer countCmsxCasePropvalDOByExample(CmsxCasePropvalDO cmsxCasePropvalDO);

    /**
     * 统计记录数
     * @param cmsxCasePropvalQuery
     * @return 查出的记录数
     */
    public Integer countCmsxCasePropvalQueryByExample(CmsxCasePropvalQuery cmsxCasePropvalQuery);

    /**
     * 更新记录
     * @param cmsxCasePropvalDO
     * @return 受影响的行数
     */
    public Integer updateCmsxCasePropvalDO(CmsxCasePropvalDO cmsxCasePropvalDO);

    /**
     * 获取对象列表
     * @param cmsxCasePropvalDO
     * @return 对象列表
     */
    public List<CmsxCasePropvalDO> findListByExample(CmsxCasePropvalDO cmsxCasePropvalDO);

    /**
     * 获取对象列表
     * @param cmsxCasePropvalQuery
     * @return 对象列表
     */
    public List<CmsxCasePropvalQuery> findListByExample(CmsxCasePropvalQuery cmsxCasePropvalQuery);

    /**
     * 根据主键获取cmsxCasePropvalDO
     * @param id
     * @return cmsxCasePropvalDO
     */
    public CmsxCasePropvalDO findCmsxCasePropvalDOByPrimaryKey(Long id);

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxCasePropvalDOByPrimaryKey(Long id);

}