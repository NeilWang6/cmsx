package com.apachecms.cmsx.dal.dataobject;

import java.io.Serializable;
import java.util.Date;

/**
 * 数据对象
 * @since 2014-02-07
 */
public class CmsxContentDO implements Serializable {

    private static final long serialVersionUID = 139174912038612360L;

    /**
     * column CMSX_CONTENT.ID
     */
    private Long id;

    /**
     * column CMSX_CONTENT.GMT_CREATE
     */
    private Date gmtCreate;

    /**
     * column CMSX_CONTENT.GMT_MODIFIED
     */
    private Date gmtModified;

    /**
     * column CMSX_CONTENT.CREATE_USER
     */
    private String createUser;

    /**
     * column CMSX_CONTENT.MODIFY_USER
     */
    private String modifyUser;

    /**
     * column CMSX_CONTENT.CONTENT
     */
    private String content;

    /**
     * column CMSX_CONTENT.STATUS
     */
    private String status;

    public CmsxContentDO() {
        super();
    }

    public CmsxContentDO(Long id, Date gmtCreate, Date gmtModified, String createUser, String modifyUser, String content, String status) {
        this.id = id;
        this.gmtCreate = gmtCreate;
        this.gmtModified = gmtModified;
        this.createUser = createUser;
        this.modifyUser = modifyUser;
        this.content = content;
        this.status = status;
    }

    /**
     * getter for Column CMSX_CONTENT.ID
     */
    public Long getId() {
        return id;
    }

    /**
     * setter for Column CMSX_CONTENT.ID
     * @param id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * getter for Column CMSX_CONTENT.GMT_CREATE
     */
    public Date getGmtCreate() {
        return gmtCreate;
    }

    /**
     * setter for Column CMSX_CONTENT.GMT_CREATE
     * @param gmtCreate
     */
    public void setGmtCreate(Date gmtCreate) {
        this.gmtCreate = gmtCreate;
    }

    /**
     * getter for Column CMSX_CONTENT.GMT_MODIFIED
     */
    public Date getGmtModified() {
        return gmtModified;
    }

    /**
     * setter for Column CMSX_CONTENT.GMT_MODIFIED
     * @param gmtModified
     */
    public void setGmtModified(Date gmtModified) {
        this.gmtModified = gmtModified;
    }

    /**
     * getter for Column CMSX_CONTENT.CREATE_USER
     */
    public String getCreateUser() {
        return createUser;
    }

    /**
     * setter for Column CMSX_CONTENT.CREATE_USER
     * @param createUser
     */
    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    /**
     * getter for Column CMSX_CONTENT.MODIFY_USER
     */
    public String getModifyUser() {
        return modifyUser;
    }

    /**
     * setter for Column CMSX_CONTENT.MODIFY_USER
     * @param modifyUser
     */
    public void setModifyUser(String modifyUser) {
        this.modifyUser = modifyUser;
    }

    /**
     * getter for Column CMSX_CONTENT.CONTENT
     */
    public String getContent() {
        return content;
    }

    /**
     * setter for Column CMSX_CONTENT.CONTENT
     * @param content
     */
    public void setContent(String content) {
        this.content = content;
    }

    /**
     * getter for Column CMSX_CONTENT.STATUS
     */
    public String getStatus() {
        return status;
    }

    /**
     * setter for Column CMSX_CONTENT.STATUS
     * @param status
     */
    public void setStatus(String status) {
        this.status = status;
    }

}