package com.apachecms.cmsx.dal.query;

import java.io.Serializable;
import java.util.Date;

/**
 * 数据对象
 * @since 2014-02-07
 */
public class CmsxAuthRoleQuery implements Serializable {

    private static final long serialVersionUID = 139174911106857234L;

    /**
     * column CMSX_AUTH_ROLE.ID
     */
    private Long id;

    /**
     * column CMSX_AUTH_ROLE.GMT_CREATE
     */
    private Date gmtCreate;

    /**
     * column CMSX_AUTH_ROLE.GMT_MODIFIED
     */
    private Date gmtModified;

    /**
     * column CMSX_AUTH_ROLE.CREATE_USER
     */
    private String createUser;

    /**
     * column CMSX_AUTH_ROLE.MODIFY_USER
     */
    private String modifyUser;

    /**
     * column CMSX_AUTH_ROLE.ROLENAME
     */
    private String rolename;

    /**
     * column CMSX_AUTH_ROLE.MEMO
     */
    private String memo;

    public CmsxAuthRoleQuery() {
        super();
    }

    public CmsxAuthRoleQuery(Long id, Date gmtCreate, Date gmtModified, String createUser, String modifyUser, String rolename, String memo) {
        this.id = id;
        this.gmtCreate = gmtCreate;
        this.gmtModified = gmtModified;
        this.createUser = createUser;
        this.modifyUser = modifyUser;
        this.rolename = rolename;
        this.memo = memo;
    }

    /**
     * getter for Column CMSX_AUTH_ROLE.ID
     */
    public Long getId() {
        return id;
    }

    /**
     * setter for Column CMSX_AUTH_ROLE.ID
     * @param id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * getter for Column CMSX_AUTH_ROLE.GMT_CREATE
     */
    public Date getGmtCreate() {
        return gmtCreate;
    }

    /**
     * setter for Column CMSX_AUTH_ROLE.GMT_CREATE
     * @param gmtCreate
     */
    public void setGmtCreate(Date gmtCreate) {
        this.gmtCreate = gmtCreate;
    }

    /**
     * getter for Column CMSX_AUTH_ROLE.GMT_MODIFIED
     */
    public Date getGmtModified() {
        return gmtModified;
    }

    /**
     * setter for Column CMSX_AUTH_ROLE.GMT_MODIFIED
     * @param gmtModified
     */
    public void setGmtModified(Date gmtModified) {
        this.gmtModified = gmtModified;
    }

    /**
     * getter for Column CMSX_AUTH_ROLE.CREATE_USER
     */
    public String getCreateUser() {
        return createUser;
    }

    /**
     * setter for Column CMSX_AUTH_ROLE.CREATE_USER
     * @param createUser
     */
    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    /**
     * getter for Column CMSX_AUTH_ROLE.MODIFY_USER
     */
    public String getModifyUser() {
        return modifyUser;
    }

    /**
     * setter for Column CMSX_AUTH_ROLE.MODIFY_USER
     * @param modifyUser
     */
    public void setModifyUser(String modifyUser) {
        this.modifyUser = modifyUser;
    }

    /**
     * getter for Column CMSX_AUTH_ROLE.ROLENAME
     */
    public String getRolename() {
        return rolename;
    }

    /**
     * setter for Column CMSX_AUTH_ROLE.ROLENAME
     * @param rolename
     */
    public void setRolename(String rolename) {
        this.rolename = rolename;
    }

    /**
     * getter for Column CMSX_AUTH_ROLE.MEMO
     */
    public String getMemo() {
        return memo;
    }

    /**
     * setter for Column CMSX_AUTH_ROLE.MEMO
     * @param memo
     */
    public void setMemo(String memo) {
        this.memo = memo;
    }

}