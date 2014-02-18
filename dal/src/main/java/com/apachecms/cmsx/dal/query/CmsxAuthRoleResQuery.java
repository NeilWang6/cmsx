package com.apachecms.cmsx.dal.query;

import java.io.Serializable;
import java.util.Date;

/**
 * 数据对象
 * @since 2014-02-07
 */
public class CmsxAuthRoleResQuery implements Serializable {

    private static final long serialVersionUID = 139174911279288759L;

    /**
     * column CMSX_AUTH_ROLE_RES.ID
     */
    private Long id;

    /**
     * column CMSX_AUTH_ROLE_RES.GMT_CREATE
     */
    private Date gmtCreate;

    /**
     * column CMSX_AUTH_ROLE_RES.GMT_MODIFIED
     */
    private Date gmtModified;

    /**
     * column CMSX_AUTH_ROLE_RES.CREATE_USER
     */
    private String createUser;

    /**
     * column CMSX_AUTH_ROLE_RES.MODIFY_USER
     */
    private String modifyUser;

    /**
     * column CMSX_AUTH_ROLE_RES.ROLEID
     */
    private Long roleid;

    /**
     * column CMSX_AUTH_ROLE_RES.RESID
     */
    private Long resid;

    public CmsxAuthRoleResQuery() {
        super();
    }

    public CmsxAuthRoleResQuery(Long id, Date gmtCreate, Date gmtModified, String createUser, String modifyUser, Long roleid, Long resid) {
        this.id = id;
        this.gmtCreate = gmtCreate;
        this.gmtModified = gmtModified;
        this.createUser = createUser;
        this.modifyUser = modifyUser;
        this.roleid = roleid;
        this.resid = resid;
    }

    /**
     * getter for Column CMSX_AUTH_ROLE_RES.ID
     */
    public Long getId() {
        return id;
    }

    /**
     * setter for Column CMSX_AUTH_ROLE_RES.ID
     * @param id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * getter for Column CMSX_AUTH_ROLE_RES.GMT_CREATE
     */
    public Date getGmtCreate() {
        return gmtCreate;
    }

    /**
     * setter for Column CMSX_AUTH_ROLE_RES.GMT_CREATE
     * @param gmtCreate
     */
    public void setGmtCreate(Date gmtCreate) {
        this.gmtCreate = gmtCreate;
    }

    /**
     * getter for Column CMSX_AUTH_ROLE_RES.GMT_MODIFIED
     */
    public Date getGmtModified() {
        return gmtModified;
    }

    /**
     * setter for Column CMSX_AUTH_ROLE_RES.GMT_MODIFIED
     * @param gmtModified
     */
    public void setGmtModified(Date gmtModified) {
        this.gmtModified = gmtModified;
    }

    /**
     * getter for Column CMSX_AUTH_ROLE_RES.CREATE_USER
     */
    public String getCreateUser() {
        return createUser;
    }

    /**
     * setter for Column CMSX_AUTH_ROLE_RES.CREATE_USER
     * @param createUser
     */
    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    /**
     * getter for Column CMSX_AUTH_ROLE_RES.MODIFY_USER
     */
    public String getModifyUser() {
        return modifyUser;
    }

    /**
     * setter for Column CMSX_AUTH_ROLE_RES.MODIFY_USER
     * @param modifyUser
     */
    public void setModifyUser(String modifyUser) {
        this.modifyUser = modifyUser;
    }

    /**
     * getter for Column CMSX_AUTH_ROLE_RES.ROLEID
     */
    public Long getRoleid() {
        return roleid;
    }

    /**
     * setter for Column CMSX_AUTH_ROLE_RES.ROLEID
     * @param roleid
     */
    public void setRoleid(Long roleid) {
        this.roleid = roleid;
    }

    /**
     * getter for Column CMSX_AUTH_ROLE_RES.RESID
     */
    public Long getResid() {
        return resid;
    }

    /**
     * setter for Column CMSX_AUTH_ROLE_RES.RESID
     * @param resid
     */
    public void setResid(Long resid) {
        this.resid = resid;
    }

}