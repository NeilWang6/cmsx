package com.apachecms.cmsx.dal.dataobject;

import java.io.Serializable;
import java.util.Date;

/**
 * 数据对象
 * @since 2014-02-07
 */
public class CmsxAdminRoleDO implements Serializable {

    private static final long serialVersionUID = 139174910331467980L;

    /**
     * column CMSX_ADMIN_ROLE.ID
     */
    private Long id;

    /**
     * column CMSX_ADMIN_ROLE.ADMINID
     */
    private Long adminid;

    /**
     * column CMSX_ADMIN_ROLE.ROLEID
     */
    private Long roleid;

    /**
     * column CMSX_ADMIN_ROLE.GMT_CREATE
     */
    private Date gmtCreate;

    /**
     * column CMSX_ADMIN_ROLE.GMT_MODIFIED
     */
    private Date gmtModified;

    /**
     * column CMSX_ADMIN_ROLE.CREATE_USER
     */
    private String createUser;

    /**
     * column CMSX_ADMIN_ROLE.MODIFY_USER
     */
    private String modifyUser;

    public CmsxAdminRoleDO() {
        super();
    }

    public CmsxAdminRoleDO(Long id, Long adminid, Long roleid, Date gmtCreate, Date gmtModified, String createUser, String modifyUser) {
        this.id = id;
        this.adminid = adminid;
        this.roleid = roleid;
        this.gmtCreate = gmtCreate;
        this.gmtModified = gmtModified;
        this.createUser = createUser;
        this.modifyUser = modifyUser;
    }

    /**
     * getter for Column CMSX_ADMIN_ROLE.ID
     */
    public Long getId() {
        return id;
    }

    /**
     * setter for Column CMSX_ADMIN_ROLE.ID
     * @param id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * getter for Column CMSX_ADMIN_ROLE.ADMINID
     */
    public Long getAdminid() {
        return adminid;
    }

    /**
     * setter for Column CMSX_ADMIN_ROLE.ADMINID
     * @param adminid
     */
    public void setAdminid(Long adminid) {
        this.adminid = adminid;
    }

    /**
     * getter for Column CMSX_ADMIN_ROLE.ROLEID
     */
    public Long getRoleid() {
        return roleid;
    }

    /**
     * setter for Column CMSX_ADMIN_ROLE.ROLEID
     * @param roleid
     */
    public void setRoleid(Long roleid) {
        this.roleid = roleid;
    }

    /**
     * getter for Column CMSX_ADMIN_ROLE.GMT_CREATE
     */
    public Date getGmtCreate() {
        return gmtCreate;
    }

    /**
     * setter for Column CMSX_ADMIN_ROLE.GMT_CREATE
     * @param gmtCreate
     */
    public void setGmtCreate(Date gmtCreate) {
        this.gmtCreate = gmtCreate;
    }

    /**
     * getter for Column CMSX_ADMIN_ROLE.GMT_MODIFIED
     */
    public Date getGmtModified() {
        return gmtModified;
    }

    /**
     * setter for Column CMSX_ADMIN_ROLE.GMT_MODIFIED
     * @param gmtModified
     */
    public void setGmtModified(Date gmtModified) {
        this.gmtModified = gmtModified;
    }

    /**
     * getter for Column CMSX_ADMIN_ROLE.CREATE_USER
     */
    public String getCreateUser() {
        return createUser;
    }

    /**
     * setter for Column CMSX_ADMIN_ROLE.CREATE_USER
     * @param createUser
     */
    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    /**
     * getter for Column CMSX_ADMIN_ROLE.MODIFY_USER
     */
    public String getModifyUser() {
        return modifyUser;
    }

    /**
     * setter for Column CMSX_ADMIN_ROLE.MODIFY_USER
     * @param modifyUser
     */
    public void setModifyUser(String modifyUser) {
        this.modifyUser = modifyUser;
    }

}