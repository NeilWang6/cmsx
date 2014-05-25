package com.apachecms.cmsx.dal.dao.impl;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.orm.ibatis.SqlMapClientCallback;

import com.apachecms.cmsx.dal.dao.ResourceSiteDAO;
import com.apachecms.cmsx.dal.dao.common.BaseDAOImpl;
import com.apachecms.cmsx.dal.dataobject.ResourceSite;
import com.ibatis.sqlmap.client.SqlMapExecutor;

public class ResourceSiteDAOImpl extends BaseDAOImpl implements ResourceSiteDAO {

    private final static String namespace            = "dcms.resourcesite.";
    private final static String updateResourceSite   = namespace + "updateResourceSite";
    private final static String MS_ADD_RESOURCE_SITE = namespace + "MS_ADD_RESOURCE_SITE";
    private final static String getResourceSite      = namespace + "getResourceSite";
    private final static String deleteResourceSite   = namespace + "deleteResourceSite";
    private final static String queryResourceSite    = namespace + "queryResourceSite";

    public int updateResourceSiteBySiteId(long otherSiteId, long siteId) {
        Map<String, Long> param = new HashMap<String, Long>();
        param.put("otherSiteId", otherSiteId);
        param.put("siteId", siteId);
        return getSqlMapClientTemplate().update(updateResourceSite, param);
    }

    public Integer batchAddResourceSite(final List<ResourceSite> list) {
        return (Integer) getSqlMapClientTemplate().execute(new SqlMapClientCallback() {

            public Object doInSqlMapClient(SqlMapExecutor executor) throws SQLException {
                executor.startBatch();
                if (null != list && !list.isEmpty()) {
                    for (ResourceSite resourceSite : list) {
                        executor.insert(MS_ADD_RESOURCE_SITE, resourceSite);
                    }
                }
                return executor.executeBatch();
            }
        });
    }

    public void batchAddResourceSite(final long resourceId, final List<Long> siteIds, final String resourceType) {

        getSqlMapClientTemplate().execute(new SqlMapClientCallback() {

            public Object doInSqlMapClient(SqlMapExecutor executor) throws SQLException {
                executor.startBatch();
                ResourceSite resourceSite = new ResourceSite();
                resourceSite.setResourceId(resourceId);
                resourceSite.setResourceType(resourceType);
                for (Long siteId : siteIds) {
                    if (siteId > 0) {
                        resourceSite.setSiteId(siteId);
                        executor.insert(MS_ADD_RESOURCE_SITE, resourceSite);
                    }
                }
                executor.executeBatch();
                return null;
            }
        });

    }

    @Override
    public List<Long> queryResourcesSiteId(Long resourceId, String resourceType) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("resourceId", resourceId);
        map.put("resourceType", resourceType);
        return (List<Long>) this.getSqlMapClientTemplate().queryForList(queryResourceSite, map);
    }

    /**
     * 根据站点和类型查询关系
     * 
     * @param siteId
     * @param resourceType
     * @return
     */
    @Override
    public List<ResourceSite> getResourceSiteBySiteAndType(long siteId, String resourceType) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("siteId", siteId);
        map.put("resourceType", resourceType);
        return (List<ResourceSite>) this.getSqlMapClientTemplate().queryForList(
                                                                                namespace
                                                                                        + "getResourceSiteBySiteAndType",
                                                                                map);
    }

    /*
     * (non-Javadoc)
     * @see
     * com.alibaba.china.cmshollywood.dcms.dal.daointerface.ResourceSiteDAO#deleteResourceSiteBySiteAndType(java.lang
     * .Long, java.lang.String)
     */
    @Override
    public void deleteResourceSiteBySiteAndType(Long siteId, String resourceType) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("siteId", siteId);
        map.put("resourceType", resourceType);
        this.getSqlMapClientTemplate().delete(namespace + "deleteResourceBySiteAndType", map);
    }

    /*
     * 增加资源站点
     */
    @Override
    public void addResourceSite(long resourceId, long siteId, String resourceType) {
        ResourceSite resourceSite = new ResourceSite();
        resourceSite.setResourceId(resourceId);
        resourceSite.setResourceType(resourceType);
        resourceSite.setSiteId(siteId);
        getSqlMapClientTemplate().insert(MS_ADD_RESOURCE_SITE, resourceSite);

    }

    /*
     * (non-Javadoc)
     * @see
     * com.alibaba.china.cmshollywood.dcms.dal.daointerface.ResourceSiteDAO#deleteResourceSiteBySiteAndTypeAndResourceId
     * (java.lang.Long, java.lang.String, java.lang.Long)
     */
    @Override
    public void deleteResourceSiteBySiteAndTypeAndResourceId(Long siteId, String resourceType, Long resourceId) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("siteId", siteId);
        map.put("resourceType", resourceType);
        map.put("resourceId", resourceId);
        this.getSqlMapClientTemplate().delete(namespace + "deleteResourceBySiteAndTypeAndResourceId", map);

    }

}
