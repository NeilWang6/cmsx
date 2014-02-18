package com.apachecms.cmsx.dal.dataobject;

import java.io.Serializable;
import java.util.Date;

/**
 * 数据对象
 * @since 2014-02-07
 */
public class CmsxMetaPropenumDO implements Serializable {

    private static final long serialVersionUID = 139174912376962758L;

    /**
     * column CMSX_META_PROPENUM.ID
     */
    private Long id;

    /**
     * column CMSX_META_PROPENUM.GMT_CREATE
     */
    private Date gmtCreate;

    /**
     * column CMSX_META_PROPENUM.GMT_MODIFIED
     */
    private Date gmtModified;

    /**
     * column CMSX_META_PROPENUM.CREATE_USER
     */
    private String createUser;

    /**
     * column CMSX_META_PROPENUM.MODIFY_USER
     */
    private String modifyUser;

    /**
     * column CMSX_META_PROPENUM.CATALOGID
     */
    private Long catalogid;

    /**
     * column CMSX_META_PROPENUM.PROPID
     */
    private Long propid;

    /**
     * column CMSX_META_PROPENUM.PROPVAL
     */
    private String propval;

    /**
     * column CMSX_META_PROPENUM.PROPVALNAME
     */
    private String propvalname;

    /**
     * column CMSX_META_PROPENUM.ORDERNUM
     */
    private Long ordernum;

    public CmsxMetaPropenumDO() {
        super();
    }

    public CmsxMetaPropenumDO(Long id, Date gmtCreate, Date gmtModified, String createUser, String modifyUser, Long catalogid, Long propid, String propval, String propvalname, Long ordernum) {
        this.id = id;
        this.gmtCreate = gmtCreate;
        this.gmtModified = gmtModified;
        this.createUser = createUser;
        this.modifyUser = modifyUser;
        this.catalogid = catalogid;
        this.propid = propid;
        this.propval = propval;
        this.propvalname = propvalname;
        this.ordernum = ordernum;
    }

    /**
     * getter for Column CMSX_META_PROPENUM.ID
     */
    public Long getId() {
        return id;
    }

    /**
     * setter for Column CMSX_META_PROPENUM.ID
     * @param id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * getter for Column CMSX_META_PROPENUM.GMT_CREATE
     */
    public Date getGmtCreate() {
        return gmtCreate;
    }

    /**
     * setter for Column CMSX_META_PROPENUM.GMT_CREATE
     * @param gmtCreate
     */
    public void setGmtCreate(Date gmtCreate) {
        this.gmtCreate = gmtCreate;
    }

    /**
     * getter for Column CMSX_META_PROPENUM.GMT_MODIFIED
     */
    public Date getGmtModified() {
        return gmtModified;
    }

    /**
     * setter for Column CMSX_META_PROPENUM.GMT_MODIFIED
     * @param gmtModified
     */
    public void setGmtModified(Date gmtModified) {
        this.gmtModified = gmtModified;
    }

    /**
     * getter for Column CMSX_META_PROPENUM.CREATE_USER
     */
    public String getCreateUser() {
        return createUser;
    }

    /**
     * setter for Column CMSX_META_PROPENUM.CREATE_USER
     * @param createUser
     */
    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    /**
     * getter for Column CMSX_META_PROPENUM.MODIFY_USER
     */
    public String getModifyUser() {
        return modifyUser;
    }

    /**
     * setter for Column CMSX_META_PROPENUM.MODIFY_USER
     * @param modifyUser
     */
    public void setModifyUser(String modifyUser) {
        this.modifyUser = modifyUser;
    }

    /**
     * getter for Column CMSX_META_PROPENUM.CATALOGID
     */
    public Long getCatalogid() {
        return catalogid;
    }

    /**
     * setter for Column CMSX_META_PROPENUM.CATALOGID
     * @param catalogid
     */
    public void setCatalogid(Long catalogid) {
        this.catalogid = catalogid;
    }

    /**
     * getter for Column CMSX_META_PROPENUM.PROPID
     */
    public Long getPropid() {
        return propid;
    }

    /**
     * setter for Column CMSX_META_PROPENUM.PROPID
     * @param propid
     */
    public void setPropid(Long propid) {
        this.propid = propid;
    }

    /**
     * getter for Column CMSX_META_PROPENUM.PROPVAL
     */
    public String getPropval() {
        return propval;
    }

    /**
     * setter for Column CMSX_META_PROPENUM.PROPVAL
     * @param propval
     */
    public void setPropval(String propval) {
        this.propval = propval;
    }

    /**
     * getter for Column CMSX_META_PROPENUM.PROPVALNAME
     */
    public String getPropvalname() {
        return propvalname;
    }

    /**
     * setter for Column CMSX_META_PROPENUM.PROPVALNAME
     * @param propvalname
     */
    public void setPropvalname(String propvalname) {
        this.propvalname = propvalname;
    }

    /**
     * getter for Column CMSX_META_PROPENUM.ORDERNUM
     */
    public Long getOrdernum() {
        return ordernum;
    }

    /**
     * setter for Column CMSX_META_PROPENUM.ORDERNUM
     * @param ordernum
     */
    public void setOrdernum(Long ordernum) {
        this.ordernum = ordernum;
    }

}