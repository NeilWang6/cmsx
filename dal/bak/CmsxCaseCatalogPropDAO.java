package com.apachecms.cmsx.dal.dao;

import com.apachecms.cmsx.dal.dataobject.CmsxCaseCatalogPropDO;
import com.apachecms.cmsx.dal.query.CmsxCaseCatalogPropQuery;
import java.util.List;

/**
 * 数据访问对象接口
 * @since 2014-02-07
 */
public interface CmsxCaseCatalogPropDAO {

    /**
     * 插入数据
     * @param cmsxCaseCatalogPropDO
     * @return 插入数据的主键
     */
    public Long insertCmsxCaseCatalogPropDO(CmsxCaseCatalogPropDO cmsxCaseCatalogPropDO);

    /**
     * 统计记录数
     * @param cmsxCaseCatalogPropDO
     * @return 查出的记录数
     */
    public Integer countCmsxCaseCatalogPropDOByExample(CmsxCaseCatalogPropDO cmsxCaseCatalogPropDO);

    /**
     * 统计记录数
     * @param cmsxCaseCatalogPropQuery
     * @return 查出的记录数
     */
    public Integer countCmsxCaseCatalogPropQueryByExample(CmsxCaseCatalogPropQuery cmsxCaseCatalogPropQuery);

    /**
     * 更新记录
     * @param cmsxCaseCatalogPropDO
     * @return 受影响的行数
     */
    public Integer updateCmsxCaseCatalogPropDO(CmsxCaseCatalogPropDO cmsxCaseCatalogPropDO);

    /**
     * 获取对象列表
     * @param cmsxCaseCatalogPropDO
     * @return 对象列表
     */
    public List<CmsxCaseCatalogPropDO> findListByExample(CmsxCaseCatalogPropDO cmsxCaseCatalogPropDO);

    /**
     * 获取对象列表
     * @param cmsxCaseCatalogPropQuery
     * @return 对象列表
     */
    public List<CmsxCaseCatalogPropQuery> findListByExample(CmsxCaseCatalogPropQuery cmsxCaseCatalogPropQuery);

    /**
     * 根据主键获取cmsxCaseCatalogPropDO
     * @param id
     * @return cmsxCaseCatalogPropDO
     */
    public CmsxCaseCatalogPropDO findCmsxCaseCatalogPropDOByPrimaryKey(Long id);

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxCaseCatalogPropDOByPrimaryKey(Long id);

}