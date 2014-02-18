package com.apachecms.cmsx.dal.dao;

import com.apachecms.cmsx.dal.dataobject.CmsxMetaPropDO;
import com.apachecms.cmsx.dal.query.CmsxMetaPropQuery;
import java.util.List;

/**
 * 数据访问对象接口
 * @since 2014-02-07
 */
public interface CmsxMetaPropDAO {

    /**
     * 插入数据
     * @param cmsxMetaPropDO
     * @return 插入数据的主键
     */
    public Long insertCmsxMetaPropDO(CmsxMetaPropDO cmsxMetaPropDO);

    /**
     * 统计记录数
     * @param cmsxMetaPropDO
     * @return 查出的记录数
     */
    public Integer countCmsxMetaPropDOByExample(CmsxMetaPropDO cmsxMetaPropDO);

    /**
     * 统计记录数
     * @param cmsxMetaPropQuery
     * @return 查出的记录数
     */
    public Integer countCmsxMetaPropQueryByExample(CmsxMetaPropQuery cmsxMetaPropQuery);

    /**
     * 更新记录
     * @param cmsxMetaPropDO
     * @return 受影响的行数
     */
    public Integer updateCmsxMetaPropDO(CmsxMetaPropDO cmsxMetaPropDO);

    /**
     * 获取对象列表
     * @param cmsxMetaPropDO
     * @return 对象列表
     */
    public List<CmsxMetaPropDO> findListByExample(CmsxMetaPropDO cmsxMetaPropDO);

    /**
     * 获取对象列表
     * @param cmsxMetaPropQuery
     * @return 对象列表
     */
    public List<CmsxMetaPropQuery> findListByExample(CmsxMetaPropQuery cmsxMetaPropQuery);

    /**
     * 根据主键获取cmsxMetaPropDO
     * @param id
     * @return cmsxMetaPropDO
     */
    public CmsxMetaPropDO findCmsxMetaPropDOByPrimaryKey(Long id);

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxMetaPropDOByPrimaryKey(Long id);

}