package com.apachecms.cmsx.dal.dataobject;

import java.io.Serializable;
import java.util.Date;

/**
 * 数据对象
 * @since 2014-02-07
 */
public class CmsxAdminDO implements Serializable {

    private static final long serialVersionUID = 139174909913315353L;

    /**
     * column CMSX_ADMIN.ID
     */
    private Long id;

    /**
     * column CMSX_ADMIN.USERID
     */
    private String userid;

    /**
     * column CMSX_ADMIN.PASSWORD
     */
    private String password;

    /**
     * column CMSX_ADMIN.REALNAME
     */
    private String realname;

    /**
     * column CMSX_ADMIN.STATUS
     */
    private Short status;

    /**
     * column CMSX_ADMIN.GMT_CREATE
     */
    private Date gmtCreate;

    /**
     * column CMSX_ADMIN.GMT_MODIFIED
     */
    private Date gmtModified;

    /**
     * column CMSX_ADMIN.CREATE_USER
     */
    private String createUser;

    /**
     * column CMSX_ADMIN.MODIFY_USER
     */
    private String modifyUser;

    public CmsxAdminDO() {
        super();
    }

    public CmsxAdminDO(Long id, String userid, String password, String realname, Short status, Date gmtCreate, Date gmtModified, String createUser, String modifyUser) {
        this.id = id;
        this.userid = userid;
        this.password = password;
        this.realname = realname;
        this.status = status;
        this.gmtCreate = gmtCreate;
        this.gmtModified = gmtModified;
        this.createUser = createUser;
        this.modifyUser = modifyUser;
    }

    /**
     * getter for Column CMSX_ADMIN.ID
     */
    public Long getId() {
        return id;
    }

    /**
     * setter for Column CMSX_ADMIN.ID
     * @param id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * getter for Column CMSX_ADMIN.USERID
     */
    public String getUserid() {
        return userid;
    }

    /**
     * setter for Column CMSX_ADMIN.USERID
     * @param userid
     */
    public void setUserid(String userid) {
        this.userid = userid;
    }

    /**
     * getter for Column CMSX_ADMIN.PASSWORD
     */
    public String getPassword() {
        return password;
    }

    /**
     * setter for Column CMSX_ADMIN.PASSWORD
     * @param password
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * getter for Column CMSX_ADMIN.REALNAME
     */
    public String getRealname() {
        return realname;
    }

    /**
     * setter for Column CMSX_ADMIN.REALNAME
     * @param realname
     */
    public void setRealname(String realname) {
        this.realname = realname;
    }

    /**
     * getter for Column CMSX_ADMIN.STATUS
     */
    public Short getStatus() {
        return status;
    }

    /**
     * setter for Column CMSX_ADMIN.STATUS
     * @param status
     */
    public void setStatus(Short status) {
        this.status = status;
    }

    /**
     * getter for Column CMSX_ADMIN.GMT_CREATE
     */
    public Date getGmtCreate() {
        return gmtCreate;
    }

    /**
     * setter for Column CMSX_ADMIN.GMT_CREATE
     * @param gmtCreate
     */
    public void setGmtCreate(Date gmtCreate) {
        this.gmtCreate = gmtCreate;
    }

    /**
     * getter for Column CMSX_ADMIN.GMT_MODIFIED
     */
    public Date getGmtModified() {
        return gmtModified;
    }

    /**
     * setter for Column CMSX_ADMIN.GMT_MODIFIED
     * @param gmtModified
     */
    public void setGmtModified(Date gmtModified) {
        this.gmtModified = gmtModified;
    }

    /**
     * getter for Column CMSX_ADMIN.CREATE_USER
     */
    public String getCreateUser() {
        return createUser;
    }

    /**
     * setter for Column CMSX_ADMIN.CREATE_USER
     * @param createUser
     */
    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    /**
     * getter for Column CMSX_ADMIN.MODIFY_USER
     */
    public String getModifyUser() {
        return modifyUser;
    }

    /**
     * setter for Column CMSX_ADMIN.MODIFY_USER
     * @param modifyUser
     */
    public void setModifyUser(String modifyUser) {
        this.modifyUser = modifyUser;
    }

}