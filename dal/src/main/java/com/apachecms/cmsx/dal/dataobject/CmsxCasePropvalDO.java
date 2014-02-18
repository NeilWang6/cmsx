package com.apachecms.cmsx.dal.dataobject;

import java.io.Serializable;
import java.util.Date;

/**
 * 数据对象
 * @since 2014-02-07
 */
public class CmsxCasePropvalDO implements Serializable {

    private static final long serialVersionUID = 139174911876588111L;

    /**
     * column CMSX_CASE_PROPVAL.ID
     */
    private Long id;

    /**
     * column CMSX_CASE_PROPVAL.GMT_CREATE
     */
    private Date gmtCreate;

    /**
     * column CMSX_CASE_PROPVAL.GMT_MODIFIED
     */
    private Date gmtModified;

    /**
     * column CMSX_CASE_PROPVAL.CREATE_USER
     */
    private String createUser;

    /**
     * column CMSX_CASE_PROPVAL.MODIFY_USER
     */
    private String modifyUser;

    /**
     * column CMSX_CASE_PROPVAL.CASE_ID
     */
    private Long caseId;

    /**
     * column CMSX_CASE_PROPVAL.PROP_ID
     */
    private Long propId;

    /**
     * column CMSX_CASE_PROPVAL.PROP_VAL
     */
    private String propVal;

    /**
     * column CMSX_CASE_PROPVAL.PROP_VALUE_TYPE
     */
    private String propValueType;

    public CmsxCasePropvalDO() {
        super();
    }

    public CmsxCasePropvalDO(Long id, Date gmtCreate, Date gmtModified, String createUser, String modifyUser, Long caseId, Long propId, String propVal, String propValueType) {
        this.id = id;
        this.gmtCreate = gmtCreate;
        this.gmtModified = gmtModified;
        this.createUser = createUser;
        this.modifyUser = modifyUser;
        this.caseId = caseId;
        this.propId = propId;
        this.propVal = propVal;
        this.propValueType = propValueType;
    }

    /**
     * getter for Column CMSX_CASE_PROPVAL.ID
     */
    public Long getId() {
        return id;
    }

    /**
     * setter for Column CMSX_CASE_PROPVAL.ID
     * @param id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * getter for Column CMSX_CASE_PROPVAL.GMT_CREATE
     */
    public Date getGmtCreate() {
        return gmtCreate;
    }

    /**
     * setter for Column CMSX_CASE_PROPVAL.GMT_CREATE
     * @param gmtCreate
     */
    public void setGmtCreate(Date gmtCreate) {
        this.gmtCreate = gmtCreate;
    }

    /**
     * getter for Column CMSX_CASE_PROPVAL.GMT_MODIFIED
     */
    public Date getGmtModified() {
        return gmtModified;
    }

    /**
     * setter for Column CMSX_CASE_PROPVAL.GMT_MODIFIED
     * @param gmtModified
     */
    public void setGmtModified(Date gmtModified) {
        this.gmtModified = gmtModified;
    }

    /**
     * getter for Column CMSX_CASE_PROPVAL.CREATE_USER
     */
    public String getCreateUser() {
        return createUser;
    }

    /**
     * setter for Column CMSX_CASE_PROPVAL.CREATE_USER
     * @param createUser
     */
    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    /**
     * getter for Column CMSX_CASE_PROPVAL.MODIFY_USER
     */
    public String getModifyUser() {
        return modifyUser;
    }

    /**
     * setter for Column CMSX_CASE_PROPVAL.MODIFY_USER
     * @param modifyUser
     */
    public void setModifyUser(String modifyUser) {
        this.modifyUser = modifyUser;
    }

    /**
     * getter for Column CMSX_CASE_PROPVAL.CASE_ID
     */
    public Long getCaseId() {
        return caseId;
    }

    /**
     * setter for Column CMSX_CASE_PROPVAL.CASE_ID
     * @param caseId
     */
    public void setCaseId(Long caseId) {
        this.caseId = caseId;
    }

    /**
     * getter for Column CMSX_CASE_PROPVAL.PROP_ID
     */
    public Long getPropId() {
        return propId;
    }

    /**
     * setter for Column CMSX_CASE_PROPVAL.PROP_ID
     * @param propId
     */
    public void setPropId(Long propId) {
        this.propId = propId;
    }

    /**
     * getter for Column CMSX_CASE_PROPVAL.PROP_VAL
     */
    public String getPropVal() {
        return propVal;
    }

    /**
     * setter for Column CMSX_CASE_PROPVAL.PROP_VAL
     * @param propVal
     */
    public void setPropVal(String propVal) {
        this.propVal = propVal;
    }

    /**
     * getter for Column CMSX_CASE_PROPVAL.PROP_VALUE_TYPE
     */
    public String getPropValueType() {
        return propValueType;
    }

    /**
     * setter for Column CMSX_CASE_PROPVAL.PROP_VALUE_TYPE
     * @param propValueType
     */
    public void setPropValueType(String propValueType) {
        this.propValueType = propValueType;
    }

}