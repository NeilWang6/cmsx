package com.apachecms.cmsx.dal.query;

import java.io.Serializable;
import java.util.Date;

/**
 * 数据对象
 * @since 2014-02-07
 */
public class CmsxMetaPropQuery implements Serializable {

    private static final long serialVersionUID = 139174912205474437L;

    /**
     * column CMSX_META_PROP.ID
     */
    private Long id;

    /**
     * column CMSX_META_PROP.GMT_CREATE
     */
    private Date gmtCreate;

    /**
     * column CMSX_META_PROP.GMT_MODIFIED
     */
    private Date gmtModified;

    /**
     * column CMSX_META_PROP.CREATE_USER
     */
    private String createUser;

    /**
     * column CMSX_META_PROP.MODIFY_USER
     */
    private String modifyUser;

    /**
     * column CMSX_META_PROP.PROP_CODE
     */
    private String propCode;

    /**
     * column CMSX_META_PROP.PROP_NAME
     */
    private String propName;

    /**
     * column CMSX_META_PROP.PROP_ALIAS_NAME
     */
    private String propAliasName;

    /**
     * column CMSX_META_PROP.PROP_VIEW_TYPE
     */
    private String propViewType;

    /**
     * column CMSX_META_PROP.PROP_VIEW_ATTR
     */
    private String propViewAttr;

    /**
     * column CMSX_META_PROP.PROP_VALID_REGEX
     */
    private String propValidRegex;

    /**
     * column CMSX_META_PROP.CTRL_PATH
     */
    private String ctrlPath;

    /**
     * column CMSX_META_PROP.MEMO
     */
    private String memo;

    public CmsxMetaPropQuery() {
        super();
    }

    public CmsxMetaPropQuery(Long id, Date gmtCreate, Date gmtModified, String createUser, String modifyUser, String propCode, String propName, String propAliasName, String propViewType, String propViewAttr, String propValidRegex, String ctrlPath, String memo) {
        this.id = id;
        this.gmtCreate = gmtCreate;
        this.gmtModified = gmtModified;
        this.createUser = createUser;
        this.modifyUser = modifyUser;
        this.propCode = propCode;
        this.propName = propName;
        this.propAliasName = propAliasName;
        this.propViewType = propViewType;
        this.propViewAttr = propViewAttr;
        this.propValidRegex = propValidRegex;
        this.ctrlPath = ctrlPath;
        this.memo = memo;
    }

    /**
     * getter for Column CMSX_META_PROP.ID
     */
    public Long getId() {
        return id;
    }

    /**
     * setter for Column CMSX_META_PROP.ID
     * @param id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * getter for Column CMSX_META_PROP.GMT_CREATE
     */
    public Date getGmtCreate() {
        return gmtCreate;
    }

    /**
     * setter for Column CMSX_META_PROP.GMT_CREATE
     * @param gmtCreate
     */
    public void setGmtCreate(Date gmtCreate) {
        this.gmtCreate = gmtCreate;
    }

    /**
     * getter for Column CMSX_META_PROP.GMT_MODIFIED
     */
    public Date getGmtModified() {
        return gmtModified;
    }

    /**
     * setter for Column CMSX_META_PROP.GMT_MODIFIED
     * @param gmtModified
     */
    public void setGmtModified(Date gmtModified) {
        this.gmtModified = gmtModified;
    }

    /**
     * getter for Column CMSX_META_PROP.CREATE_USER
     */
    public String getCreateUser() {
        return createUser;
    }

    /**
     * setter for Column CMSX_META_PROP.CREATE_USER
     * @param createUser
     */
    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    /**
     * getter for Column CMSX_META_PROP.MODIFY_USER
     */
    public String getModifyUser() {
        return modifyUser;
    }

    /**
     * setter for Column CMSX_META_PROP.MODIFY_USER
     * @param modifyUser
     */
    public void setModifyUser(String modifyUser) {
        this.modifyUser = modifyUser;
    }

    /**
     * getter for Column CMSX_META_PROP.PROP_CODE
     */
    public String getPropCode() {
        return propCode;
    }

    /**
     * setter for Column CMSX_META_PROP.PROP_CODE
     * @param propCode
     */
    public void setPropCode(String propCode) {
        this.propCode = propCode;
    }

    /**
     * getter for Column CMSX_META_PROP.PROP_NAME
     */
    public String getPropName() {
        return propName;
    }

    /**
     * setter for Column CMSX_META_PROP.PROP_NAME
     * @param propName
     */
    public void setPropName(String propName) {
        this.propName = propName;
    }

    /**
     * getter for Column CMSX_META_PROP.PROP_ALIAS_NAME
     */
    public String getPropAliasName() {
        return propAliasName;
    }

    /**
     * setter for Column CMSX_META_PROP.PROP_ALIAS_NAME
     * @param propAliasName
     */
    public void setPropAliasName(String propAliasName) {
        this.propAliasName = propAliasName;
    }

    /**
     * getter for Column CMSX_META_PROP.PROP_VIEW_TYPE
     */
    public String getPropViewType() {
        return propViewType;
    }

    /**
     * setter for Column CMSX_META_PROP.PROP_VIEW_TYPE
     * @param propViewType
     */
    public void setPropViewType(String propViewType) {
        this.propViewType = propViewType;
    }

    /**
     * getter for Column CMSX_META_PROP.PROP_VIEW_ATTR
     */
    public String getPropViewAttr() {
        return propViewAttr;
    }

    /**
     * setter for Column CMSX_META_PROP.PROP_VIEW_ATTR
     * @param propViewAttr
     */
    public void setPropViewAttr(String propViewAttr) {
        this.propViewAttr = propViewAttr;
    }

    /**
     * getter for Column CMSX_META_PROP.PROP_VALID_REGEX
     */
    public String getPropValidRegex() {
        return propValidRegex;
    }

    /**
     * setter for Column CMSX_META_PROP.PROP_VALID_REGEX
     * @param propValidRegex
     */
    public void setPropValidRegex(String propValidRegex) {
        this.propValidRegex = propValidRegex;
    }

    /**
     * getter for Column CMSX_META_PROP.CTRL_PATH
     */
    public String getCtrlPath() {
        return ctrlPath;
    }

    /**
     * setter for Column CMSX_META_PROP.CTRL_PATH
     * @param ctrlPath
     */
    public void setCtrlPath(String ctrlPath) {
        this.ctrlPath = ctrlPath;
    }

    /**
     * getter for Column CMSX_META_PROP.MEMO
     */
    public String getMemo() {
        return memo;
    }

    /**
     * setter for Column CMSX_META_PROP.MEMO
     * @param memo
     */
    public void setMemo(String memo) {
        this.memo = memo;
    }

}