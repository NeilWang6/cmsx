package com.apachecms.cmsx.dal.query;

import java.io.Serializable;
import java.util.Date;

/**
 * 数据对象
 * @since 2014-02-07
 */
public class CmsxCaseCatalogQuery implements Serializable {

    private static final long serialVersionUID = 139174911587252181L;

    /**
     * column CMSX_CASE_CATALOG.ID
     */
    private Long id;

    /**
     * column CMSX_CASE_CATALOG.PARENT_ID
     */
    private Long parentId;

    /**
     * column CMSX_CASE_CATALOG.NAME
     */
    private String name;

    /**
     * column CMSX_CASE_CATALOG.GMT_CREATE
     */
    private Date gmtCreate;

    /**
     * column CMSX_CASE_CATALOG.GMT_MODIFIED
     */
    private Date gmtModified;

    /**
     * column CMSX_CASE_CATALOG.CREATE_USER
     */
    private String createUser;

    /**
     * column CMSX_CASE_CATALOG.MODIFY_USER
     */
    private String modifyUser;

    public CmsxCaseCatalogQuery() {
        super();
    }

    public CmsxCaseCatalogQuery(Long id, Long parentId, String name, Date gmtCreate, Date gmtModified, String createUser, String modifyUser) {
        this.id = id;
        this.parentId = parentId;
        this.name = name;
        this.gmtCreate = gmtCreate;
        this.gmtModified = gmtModified;
        this.createUser = createUser;
        this.modifyUser = modifyUser;
    }

    /**
     * getter for Column CMSX_CASE_CATALOG.ID
     */
    public Long getId() {
        return id;
    }

    /**
     * setter for Column CMSX_CASE_CATALOG.ID
     * @param id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * getter for Column CMSX_CASE_CATALOG.PARENT_ID
     */
    public Long getParentId() {
        return parentId;
    }

    /**
     * setter for Column CMSX_CASE_CATALOG.PARENT_ID
     * @param parentId
     */
    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    /**
     * getter for Column CMSX_CASE_CATALOG.NAME
     */
    public String getName() {
        return name;
    }

    /**
     * setter for Column CMSX_CASE_CATALOG.NAME
     * @param name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * getter for Column CMSX_CASE_CATALOG.GMT_CREATE
     */
    public Date getGmtCreate() {
        return gmtCreate;
    }

    /**
     * setter for Column CMSX_CASE_CATALOG.GMT_CREATE
     * @param gmtCreate
     */
    public void setGmtCreate(Date gmtCreate) {
        this.gmtCreate = gmtCreate;
    }

    /**
     * getter for Column CMSX_CASE_CATALOG.GMT_MODIFIED
     */
    public Date getGmtModified() {
        return gmtModified;
    }

    /**
     * setter for Column CMSX_CASE_CATALOG.GMT_MODIFIED
     * @param gmtModified
     */
    public void setGmtModified(Date gmtModified) {
        this.gmtModified = gmtModified;
    }

    /**
     * getter for Column CMSX_CASE_CATALOG.CREATE_USER
     */
    public String getCreateUser() {
        return createUser;
    }

    /**
     * setter for Column CMSX_CASE_CATALOG.CREATE_USER
     * @param createUser
     */
    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    /**
     * getter for Column CMSX_CASE_CATALOG.MODIFY_USER
     */
    public String getModifyUser() {
        return modifyUser;
    }

    /**
     * setter for Column CMSX_CASE_CATALOG.MODIFY_USER
     * @param modifyUser
     */
    public void setModifyUser(String modifyUser) {
        this.modifyUser = modifyUser;
    }

}