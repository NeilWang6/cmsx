package com.apachecms.cmsx.dal.query;

import java.io.Serializable;
import java.util.Date;

/**
 * 数据对象
 * @since 2014-02-07
 */
public class CmsxCaseCatalogPropQuery implements Serializable {

    private static final long serialVersionUID = 139174911725460705L;

    /**
     * column CMSX_CASE_CATALOG_PROP.ID
     */
    private Long id;

    /**
     * column CMSX_CASE_CATALOG_PROP.GMT_CREATE
     */
    private Date gmtCreate;

    /**
     * column CMSX_CASE_CATALOG_PROP.GMT_MODIFIED
     */
    private Date gmtModified;

    /**
     * column CMSX_CASE_CATALOG_PROP.CREATE_USER
     */
    private String createUser;

    /**
     * column CMSX_CASE_CATALOG_PROP.MODIFY_USER
     */
    private String modifyUser;

    /**
     * column CMSX_CASE_CATALOG_PROP.CATALOGID
     */
    private Long catalogid;

    /**
     * column CMSX_CASE_CATALOG_PROP.PROP_ID
     */
    private Long propId;

    /**
     * column CMSX_CASE_CATALOG_PROP.PROP_ALIAS
     */
    private String propAlias;

    /**
     * column CMSX_CASE_CATALOG_PROP.IS_KEYPROP
     */
    private Short isKeyprop;

    /**
     * column CMSX_CASE_CATALOG_PROP.CUST_VALID_REGEX
     */
    private String custValidRegex;

    /**
     * column CMSX_CASE_CATALOG_PROP.ORDERNUM
     */
    private Integer ordernum;

    public CmsxCaseCatalogPropQuery() {
        super();
    }

    public CmsxCaseCatalogPropQuery(Long id, Date gmtCreate, Date gmtModified, String createUser, String modifyUser, Long catalogid, Long propId, String propAlias, Short isKeyprop, String custValidRegex, Integer ordernum) {
        this.id = id;
        this.gmtCreate = gmtCreate;
        this.gmtModified = gmtModified;
        this.createUser = createUser;
        this.modifyUser = modifyUser;
        this.catalogid = catalogid;
        this.propId = propId;
        this.propAlias = propAlias;
        this.isKeyprop = isKeyprop;
        this.custValidRegex = custValidRegex;
        this.ordernum = ordernum;
    }

    /**
     * getter for Column CMSX_CASE_CATALOG_PROP.ID
     */
    public Long getId() {
        return id;
    }

    /**
     * setter for Column CMSX_CASE_CATALOG_PROP.ID
     * @param id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * getter for Column CMSX_CASE_CATALOG_PROP.GMT_CREATE
     */
    public Date getGmtCreate() {
        return gmtCreate;
    }

    /**
     * setter for Column CMSX_CASE_CATALOG_PROP.GMT_CREATE
     * @param gmtCreate
     */
    public void setGmtCreate(Date gmtCreate) {
        this.gmtCreate = gmtCreate;
    }

    /**
     * getter for Column CMSX_CASE_CATALOG_PROP.GMT_MODIFIED
     */
    public Date getGmtModified() {
        return gmtModified;
    }

    /**
     * setter for Column CMSX_CASE_CATALOG_PROP.GMT_MODIFIED
     * @param gmtModified
     */
    public void setGmtModified(Date gmtModified) {
        this.gmtModified = gmtModified;
    }

    /**
     * getter for Column CMSX_CASE_CATALOG_PROP.CREATE_USER
     */
    public String getCreateUser() {
        return createUser;
    }

    /**
     * setter for Column CMSX_CASE_CATALOG_PROP.CREATE_USER
     * @param createUser
     */
    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    /**
     * getter for Column CMSX_CASE_CATALOG_PROP.MODIFY_USER
     */
    public String getModifyUser() {
        return modifyUser;
    }

    /**
     * setter for Column CMSX_CASE_CATALOG_PROP.MODIFY_USER
     * @param modifyUser
     */
    public void setModifyUser(String modifyUser) {
        this.modifyUser = modifyUser;
    }

    /**
     * getter for Column CMSX_CASE_CATALOG_PROP.CATALOGID
     */
    public Long getCatalogid() {
        return catalogid;
    }

    /**
     * setter for Column CMSX_CASE_CATALOG_PROP.CATALOGID
     * @param catalogid
     */
    public void setCatalogid(Long catalogid) {
        this.catalogid = catalogid;
    }

    /**
     * getter for Column CMSX_CASE_CATALOG_PROP.PROP_ID
     */
    public Long getPropId() {
        return propId;
    }

    /**
     * setter for Column CMSX_CASE_CATALOG_PROP.PROP_ID
     * @param propId
     */
    public void setPropId(Long propId) {
        this.propId = propId;
    }

    /**
     * getter for Column CMSX_CASE_CATALOG_PROP.PROP_ALIAS
     */
    public String getPropAlias() {
        return propAlias;
    }

    /**
     * setter for Column CMSX_CASE_CATALOG_PROP.PROP_ALIAS
     * @param propAlias
     */
    public void setPropAlias(String propAlias) {
        this.propAlias = propAlias;
    }

    /**
     * getter for Column CMSX_CASE_CATALOG_PROP.IS_KEYPROP
     */
    public Short getIsKeyprop() {
        return isKeyprop;
    }

    /**
     * setter for Column CMSX_CASE_CATALOG_PROP.IS_KEYPROP
     * @param isKeyprop
     */
    public void setIsKeyprop(Short isKeyprop) {
        this.isKeyprop = isKeyprop;
    }

    /**
     * getter for Column CMSX_CASE_CATALOG_PROP.CUST_VALID_REGEX
     */
    public String getCustValidRegex() {
        return custValidRegex;
    }

    /**
     * setter for Column CMSX_CASE_CATALOG_PROP.CUST_VALID_REGEX
     * @param custValidRegex
     */
    public void setCustValidRegex(String custValidRegex) {
        this.custValidRegex = custValidRegex;
    }

    /**
     * getter for Column CMSX_CASE_CATALOG_PROP.ORDERNUM
     */
    public Integer getOrdernum() {
        return ordernum;
    }

    /**
     * setter for Column CMSX_CASE_CATALOG_PROP.ORDERNUM
     * @param ordernum
     */
    public void setOrdernum(Integer ordernum) {
        this.ordernum = ordernum;
    }

}