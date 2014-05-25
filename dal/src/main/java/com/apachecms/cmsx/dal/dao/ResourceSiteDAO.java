package com.apachecms.cmsx.dal.dao;

import java.util.List;

import com.apachecms.cmsx.dal.dataobject.ResourceSite;
 
public interface ResourceSiteDAO {

    /**
     * 修改资源类目
     * 
     * @param id
     * @param status
     * @return
     */
    public int updateResourceSiteBySiteId(long otherSiteId, long siteId);
    /**
     * 添加资源类目关系
     * @param resourceId
     * @param siteIds
     * @param resourceType
     */
    public void batchAddResourceSite(final long resourceId, final List<Long> siteIds,String resourceType);
    public Integer batchAddResourceSite(final List<ResourceSite> list) ;

    
    /**
     * 根据站点和类型查询关系
     * @param siteId
     * @param resourceType
     * @return
     */
    public List<ResourceSite> getResourceSiteBySiteAndType(long siteId,String resourceType);
    
    /**
     * 根据站点id和类目删除
     * @param siteId 站点id
     * @param resourceType 资源类型
     */
    public void deleteResourceSiteBySiteAndType(Long siteId, String resourceType);
    /**
     * 增加站点资源
     * @param resourceId 资源id
     * @param siteId 站点id
     * @param resourceType 资源类型
     */
    public void addResourceSite(final long resourceId, long siteId,String resourceType);

    
    /**
     * 查询资源对应的类目
     * @param resourceId
     * @param resourceType
     * @return
     */
    public List <Long> queryResourcesSiteId(Long resourceId, String resourceType);
    /**
     * 删除
     * @param siteId
     * @param resourceType
     * @param resourceId
     */
    public void deleteResourceSiteBySiteAndTypeAndResourceId(Long siteId, String resourceType,Long resourceId);
    
}
