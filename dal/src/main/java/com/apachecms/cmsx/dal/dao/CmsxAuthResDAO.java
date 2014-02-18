package com.apachecms.cmsx.dal.dao;

import com.apachecms.cmsx.dal.dataobject.CmsxAuthResDO;
import com.apachecms.cmsx.dal.query.CmsxAuthResQuery;
import java.util.List;

/**
 * 数据访问对象接口
 * @since 2014-02-17
 */
public interface CmsxAuthResDAO {

    /**
     * 插入数据
     * @param cmsxAuthResDO
     * @return 插入数据的主键
     */
    public Long insertCmsxAuthResDO(CmsxAuthResDO cmsxAuthResDO);

    /**
     * 统计记录数
     * @param cmsxAuthResDO
     * @return 查出的记录数
     */
    public Integer countCmsxAuthResDOByExample(CmsxAuthResDO cmsxAuthResDO);

    /**
     * 统计记录数
     * @param cmsxAuthResQuery
     * @return 查出的记录数
     */
    public Integer countCmsxAuthResQueryByExample(CmsxAuthResQuery cmsxAuthResQuery);

    /**
     * 更新记录
     * @param cmsxAuthResDO
     * @return 受影响的行数
     */
    public Integer updateCmsxAuthResDO(CmsxAuthResDO cmsxAuthResDO);

    /**
     * 获取对象列表
     * @param cmsxAuthResDO
     * @return 对象列表
     */
    public List<CmsxAuthResDO> findListByExample(CmsxAuthResDO cmsxAuthResDO);

    /**
     * 获取对象列表
     * @param cmsxAuthResQuery
     * @return 对象列表
     */
    public List<CmsxAuthResQuery> findListByExample(CmsxAuthResQuery cmsxAuthResQuery);

    /**
     * 根据主键获取cmsxAuthResDO
     * @param id
     * @return cmsxAuthResDO
     */
    public CmsxAuthResDO findCmsxAuthResDOByPrimaryKey(Long id);

    /**
     * 删除记录
     * @param id
     * @return 受影响的行数
     */
    public Integer deleteCmsxAuthResDOByPrimaryKey(Long id);

}