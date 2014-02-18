package com.apachecms.cmsx.dal.query;

import java.io.Serializable;
import java.util.Date;

/**
 * 数据对象
 * @since 2014-02-17
 */
public class CmsxAuthResQuery implements Serializable {

    private static final long serialVersionUID = 139265238912102151L;

    /**
     * column CMSX_AUTH_RES.ID
     */
    private Long id;

    /**
     * column CMSX_AUTH_RES.GMT_CREATE
     */
    private Date gmtCreate;

    /**
     * column CMSX_AUTH_RES.GMT_MODIFIED
     */
    private Date gmtModified;

    /**
     * column CMSX_AUTH_RES.CREATE_USER
     */
    private String createUser;

    /**
     * column CMSX_AUTH_RES.MODIFY_USER
     */
    private String modifyUser;

    /**
     * column CMSX_AUTH_RES.RESNAME
     */
    private String resname;

    /**
     * column CMSX_AUTH_RES.RESCODE
     */
    private String rescode;

    /**
     * column CMSX_AUTH_RES.RESURL
     */
    private String resurl;

    /**
     * column CMSX_AUTH_RES.MEMO
     */
    private String memo;

    /**
     * column CMSX_AUTH_RES.PARENT_ID
     */
    private Long parentId;

    /**
     * column CMSX_AUTH_RES.IS_REGX
     */
    private Short isRegx;

    public CmsxAuthResQuery() {
        super();
    }

    public CmsxAuthResQuery(Long id, Date gmtCreate, Date gmtModified, String createUser, String modifyUser, String resname, String rescode, String resurl, String memo, Long parentId, Short isRegx) {
        this.id = id;
        this.gmtCreate = gmtCreate;
        this.gmtModified = gmtModified;
        this.createUser = createUser;
        this.modifyUser = modifyUser;
        this.resname = resname;
        this.rescode = rescode;
        this.resurl = resurl;
        this.memo = memo;
        this.parentId = parentId;
        this.isRegx = isRegx;
    }

    /**
     * getter for Column CMSX_AUTH_RES.ID
     */
    public Long getId() {
        return id;
    }

    /**
     * setter for Column CMSX_AUTH_RES.ID
     * @param id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * getter for Column CMSX_AUTH_RES.GMT_CREATE
     */
    public Date getGmtCreate() {
        return gmtCreate;
    }

    /**
     * setter for Column CMSX_AUTH_RES.GMT_CREATE
     * @param gmtCreate
     */
    public void setGmtCreate(Date gmtCreate) {
        this.gmtCreate = gmtCreate;
    }

    /**
     * getter for Column CMSX_AUTH_RES.GMT_MODIFIED
     */
    public Date getGmtModified() {
        return gmtModified;
    }

    /**
     * setter for Column CMSX_AUTH_RES.GMT_MODIFIED
     * @param gmtModified
     */
    public void setGmtModified(Date gmtModified) {
        this.gmtModified = gmtModified;
    }

    /**
     * getter for Column CMSX_AUTH_RES.CREATE_USER
     */
    public String getCreateUser() {
        return createUser;
    }

    /**
     * setter for Column CMSX_AUTH_RES.CREATE_USER
     * @param createUser
     */
    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    /**
     * getter for Column CMSX_AUTH_RES.MODIFY_USER
     */
    public String getModifyUser() {
        return modifyUser;
    }

    /**
     * setter for Column CMSX_AUTH_RES.MODIFY_USER
     * @param modifyUser
     */
    public void setModifyUser(String modifyUser) {
        this.modifyUser = modifyUser;
    }

    /**
     * getter for Column CMSX_AUTH_RES.RESNAME
     */
    public String getResname() {
        return resname;
    }

    /**
     * setter for Column CMSX_AUTH_RES.RESNAME
     * @param resname
     */
    public void setResname(String resname) {
        this.resname = resname;
    }

    /**
     * getter for Column CMSX_AUTH_RES.RESCODE
     */
    public String getRescode() {
        return rescode;
    }

    /**
     * setter for Column CMSX_AUTH_RES.RESCODE
     * @param rescode
     */
    public void setRescode(String rescode) {
        this.rescode = rescode;
    }

    /**
     * getter for Column CMSX_AUTH_RES.RESURL
     */
    public String getResurl() {
        return resurl;
    }

    /**
     * setter for Column CMSX_AUTH_RES.RESURL
     * @param resurl
     */
    public void setResurl(String resurl) {
        this.resurl = resurl;
    }

    /**
     * getter for Column CMSX_AUTH_RES.MEMO
     */
    public String getMemo() {
        return memo;
    }

    /**
     * setter for Column CMSX_AUTH_RES.MEMO
     * @param memo
     */
    public void setMemo(String memo) {
        this.memo = memo;
    }

    /**
     * getter for Column CMSX_AUTH_RES.PARENT_ID
     */
    public Long getParentId() {
        return parentId;
    }

    /**
     * setter for Column CMSX_AUTH_RES.PARENT_ID
     * @param parentId
     */
    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    /**
     * getter for Column CMSX_AUTH_RES.IS_REGX
     */
    public Short getIsRegx() {
        return isRegx;
    }

    /**
     * setter for Column CMSX_AUTH_RES.IS_REGX
     * @param isRegx
     */
    public void setIsRegx(Short isRegx) {
        this.isRegx = isRegx;
    }

}