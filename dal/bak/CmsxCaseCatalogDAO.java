package com.apachecms.cmsx.dal.dao;

import com.apachecms.cmsx.dal.dataobject.CmsxCaseCatalogDO;
import com.apachecms.cmsx.dal.query.CmsxCaseCatalogQuery;
import java.util.List;

/**
 * 数据访问对象接口
 * @since 2014-02-07
 */
public interface CmsxCaseCatalogDAO {

    /**
     * 插入数据
     * @param cmsxCaseCatalogDO
     * @return 插入数据的主键
     */
    public Long insertCmsxCaseCatalogDO(CmsxCaseCatalogDO cmsxCaseCatalogDO);

    /**
     * 统计记录数
     * @param cmsxCaseCatalogDO
     * @return 查出的记录数
     */
    public Integer countCmsxCaseCatalogDOByExample(CmsxCaseCatalogDO cmsxCaseCatalogDO);

    /**
     * 统计记录数
     * @param cmsxCaseCatalogQuery
     * @return 查出的记录数
     */
    public Integer countCmsxCaseCatalogQueryByExample(CmsxCaseCatalogQuery cmsxCaseCatalogQuery);

    /**
     * 更新记录
     * @param cmsxCaseCatalogDO
     * @return 受影响的行数
     */
    public Integer updateCmsxCaseCatalogDO(CmsxCaseCatalogDO cmsxCaseCatalogDO);

    /**
     * 获取对象列表
     * @param cmsxCaseCatalogDO
     * @return 对象列表
     */
    public List<CmsxCaseCatalogDO> findListByExample(CmsxCaseCatalogDO cmsxCaseCatalogDO);

    /**
     * 获取对象列表
     * @param cmsxCaseCatalogQuery
     * @return 对象列表
     */
    public List<CmsxCaseCatalogQuery> findListByExample(CmsxCaseCatalogQuery cmsxCaseCatalogQuery);

    /**
     * 根据主键获取cmsxCaseCatalogDO
     * @param id
     * @return cmsxCaseCatalogDO
     */
    public CmsxCaseCatalogDO findCmsxCaseCatalogDOByPrimaryKey(Long id);

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxCaseCatalogDOByPrimaryKey(Long id);

}