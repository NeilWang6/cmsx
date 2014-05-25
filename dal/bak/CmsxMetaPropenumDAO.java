package com.apachecms.cmsx.dal.dao;

import com.apachecms.cmsx.dal.dataobject.CmsxMetaPropenumDO;
import com.apachecms.cmsx.dal.query.CmsxMetaPropenumQuery;
import java.util.List;

/**
 * 数据访问对象接口
 * @since 2014-02-07
 */
public interface CmsxMetaPropenumDAO {

    /**
     * 插入数据
     * @param cmsxMetaPropenumDO
     * @return 插入数据的主键
     */
    public Long insertCmsxMetaPropenumDO(CmsxMetaPropenumDO cmsxMetaPropenumDO);

    /**
     * 统计记录数
     * @param cmsxMetaPropenumDO
     * @return 查出的记录数
     */
    public Integer countCmsxMetaPropenumDOByExample(CmsxMetaPropenumDO cmsxMetaPropenumDO);

    /**
     * 统计记录数
     * @param cmsxMetaPropenumQuery
     * @return 查出的记录数
     */
    public Integer countCmsxMetaPropenumQueryByExample(CmsxMetaPropenumQuery cmsxMetaPropenumQuery);

    /**
     * 更新记录
     * @param cmsxMetaPropenumDO
     * @return 受影响的行数
     */
    public Integer updateCmsxMetaPropenumDO(CmsxMetaPropenumDO cmsxMetaPropenumDO);

    /**
     * 获取对象列表
     * @param cmsxMetaPropenumDO
     * @return 对象列表
     */
    public List<CmsxMetaPropenumDO> findListByExample(CmsxMetaPropenumDO cmsxMetaPropenumDO);

    /**
     * 获取对象列表
     * @param cmsxMetaPropenumQuery
     * @return 对象列表
     */
    public List<CmsxMetaPropenumQuery> findListByExample(CmsxMetaPropenumQuery cmsxMetaPropenumQuery);

    /**
     * 根据主键获取cmsxMetaPropenumDO
     * @param id
     * @return cmsxMetaPropenumDO
     */
    public CmsxMetaPropenumDO findCmsxMetaPropenumDOByPrimaryKey(Long id);

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxMetaPropenumDOByPrimaryKey(Long id);

}