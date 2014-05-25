package com.apachecms.cmsx.dal.dataobject;

import java.util.Date;
 
public class ResourceSite extends BaseDO {

    private static final long serialVersionUID = -5374179643032487909L;
    private long              id;
    private Long              siteId;                               // 类目ID
    private Long              resourceId;                              // 资源ID
    private String            resourceType;                            // 资源类型
    private Date              gmtCreate;                               // 创建时间
    private Date              gmtModified;                             // 修改时间

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Long getSiteId() {
        return siteId;
    }

    public void setSiteId(Long siteId) {
        this.siteId = siteId;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public Date getGmtCreate() {
        return gmtCreate;
    }

    public void setGmtCreate(Date gmtCreate) {
        this.gmtCreate = gmtCreate;
    }

    public Date getGmtModified() {
        return gmtModified;
    }

    public void setGmtModified(Date gmtModified) {
        this.gmtModified = gmtModified;
    }

}
