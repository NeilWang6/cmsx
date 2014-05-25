package com.apachecms.cmsx.dal.query;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 数据对象
 * @since 2014-02-07
 */
public class CmsxCaseQuery implements Serializable {

    private static final long serialVersionUID = 139174911438613050L;

    /**
     * column CMSX_CASE.ID
     */
    private Long id;

    /**
     * column CMSX_CASE.GMT_CREATE
     */
    private Date gmtCreate;

    /**
     * column CMSX_CASE.GMT_MODIFIED
     */
    private Date gmtModified;

    /**
     * column CMSX_CASE.CREATE_USER
     */
    private String createUser;

    /**
     * column CMSX_CASE.MODIFY_USER
     */
    private String modifyUser;

    /**
     * column CMSX_CASE.PROJ_NUM
     */
    private String projNum;

    /**
     * column CMSX_CASE.PROJ_NAME
     */
    private String projName;

    /**
     * column CMSX_CASE.PROJ_BUILD_TYPE
     */
    private String projBuildType;

    /**
     * column CMSX_CASE.FIREST_CATALOG_ID
     */
    private Long firestCatalogId;

    /**
     * column CMSX_CASE.SECOND_CATALOG_ID
     */
    private Long secondCatalogId;

    /**
     * column CMSX_CASE.IS_STAGE
     */
    private Short isStage;

    /**
     * column CMSX_CASE.STAGE
     */
    private Integer stage;

    /**
     * column CMSX_CASE.PROJ_STATUS
     */
    private String projStatus;

    /**
     * column CMSX_CASE.PROJ_PLACE
     */
    private String projPlace;

    /**
     * column CMSX_CASE.WAY
     */
    private String way;

    /**
     * column CMSX_CASE.TOTAL_INVEST
     */
    private BigDecimal totalInvest;

    /**
     * column CMSX_CASE.STATUS
     */
    private String status;

    public CmsxCaseQuery() {
        super();
    }

    public CmsxCaseQuery(Long id, Date gmtCreate, Date gmtModified, String createUser, String modifyUser, String projNum, String projName, String projBuildType, Long firestCatalogId, Long secondCatalogId, Short isStage, Integer stage, String projStatus, String projPlace, String way, BigDecimal totalInvest, String status) {
        this.id = id;
        this.gmtCreate = gmtCreate;
        this.gmtModified = gmtModified;
        this.createUser = createUser;
        this.modifyUser = modifyUser;
        this.projNum = projNum;
        this.projName = projName;
        this.projBuildType = projBuildType;
        this.firestCatalogId = firestCatalogId;
        this.secondCatalogId = secondCatalogId;
        this.isStage = isStage;
        this.stage = stage;
        this.projStatus = projStatus;
        this.projPlace = projPlace;
        this.way = way;
        this.totalInvest = totalInvest;
        this.status = status;
    }

    /**
     * getter for Column CMSX_CASE.ID
     */
    public Long getId() {
        return id;
    }

    /**
     * setter for Column CMSX_CASE.ID
     * @param id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * getter for Column CMSX_CASE.GMT_CREATE
     */
    public Date getGmtCreate() {
        return gmtCreate;
    }

    /**
     * setter for Column CMSX_CASE.GMT_CREATE
     * @param gmtCreate
     */
    public void setGmtCreate(Date gmtCreate) {
        this.gmtCreate = gmtCreate;
    }

    /**
     * getter for Column CMSX_CASE.GMT_MODIFIED
     */
    public Date getGmtModified() {
        return gmtModified;
    }

    /**
     * setter for Column CMSX_CASE.GMT_MODIFIED
     * @param gmtModified
     */
    public void setGmtModified(Date gmtModified) {
        this.gmtModified = gmtModified;
    }

    /**
     * getter for Column CMSX_CASE.CREATE_USER
     */
    public String getCreateUser() {
        return createUser;
    }

    /**
     * setter for Column CMSX_CASE.CREATE_USER
     * @param createUser
     */
    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    /**
     * getter for Column CMSX_CASE.MODIFY_USER
     */
    public String getModifyUser() {
        return modifyUser;
    }

    /**
     * setter for Column CMSX_CASE.MODIFY_USER
     * @param modifyUser
     */
    public void setModifyUser(String modifyUser) {
        this.modifyUser = modifyUser;
    }

    /**
     * getter for Column CMSX_CASE.PROJ_NUM
     */
    public String getProjNum() {
        return projNum;
    }

    /**
     * setter for Column CMSX_CASE.PROJ_NUM
     * @param projNum
     */
    public void setProjNum(String projNum) {
        this.projNum = projNum;
    }

    /**
     * getter for Column CMSX_CASE.PROJ_NAME
     */
    public String getProjName() {
        return projName;
    }

    /**
     * setter for Column CMSX_CASE.PROJ_NAME
     * @param projName
     */
    public void setProjName(String projName) {
        this.projName = projName;
    }

    /**
     * getter for Column CMSX_CASE.PROJ_BUILD_TYPE
     */
    public String getProjBuildType() {
        return projBuildType;
    }

    /**
     * setter for Column CMSX_CASE.PROJ_BUILD_TYPE
     * @param projBuildType
     */
    public void setProjBuildType(String projBuildType) {
        this.projBuildType = projBuildType;
    }

    /**
     * getter for Column CMSX_CASE.FIREST_CATALOG_ID
     */
    public Long getFirestCatalogId() {
        return firestCatalogId;
    }

    /**
     * setter for Column CMSX_CASE.FIREST_CATALOG_ID
     * @param firestCatalogId
     */
    public void setFirestCatalogId(Long firestCatalogId) {
        this.firestCatalogId = firestCatalogId;
    }

    /**
     * getter for Column CMSX_CASE.SECOND_CATALOG_ID
     */
    public Long getSecondCatalogId() {
        return secondCatalogId;
    }

    /**
     * setter for Column CMSX_CASE.SECOND_CATALOG_ID
     * @param secondCatalogId
     */
    public void setSecondCatalogId(Long secondCatalogId) {
        this.secondCatalogId = secondCatalogId;
    }

    /**
     * getter for Column CMSX_CASE.IS_STAGE
     */
    public Short getIsStage() {
        return isStage;
    }

    /**
     * setter for Column CMSX_CASE.IS_STAGE
     * @param isStage
     */
    public void setIsStage(Short isStage) {
        this.isStage = isStage;
    }

    /**
     * getter for Column CMSX_CASE.STAGE
     */
    public Integer getStage() {
        return stage;
    }

    /**
     * setter for Column CMSX_CASE.STAGE
     * @param stage
     */
    public void setStage(Integer stage) {
        this.stage = stage;
    }

    /**
     * getter for Column CMSX_CASE.PROJ_STATUS
     */
    public String getProjStatus() {
        return projStatus;
    }

    /**
     * setter for Column CMSX_CASE.PROJ_STATUS
     * @param projStatus
     */
    public void setProjStatus(String projStatus) {
        this.projStatus = projStatus;
    }

    /**
     * getter for Column CMSX_CASE.PROJ_PLACE
     */
    public String getProjPlace() {
        return projPlace;
    }

    /**
     * setter for Column CMSX_CASE.PROJ_PLACE
     * @param projPlace
     */
    public void setProjPlace(String projPlace) {
        this.projPlace = projPlace;
    }

    /**
     * getter for Column CMSX_CASE.WAY
     */
    public String getWay() {
        return way;
    }

    /**
     * setter for Column CMSX_CASE.WAY
     * @param way
     */
    public void setWay(String way) {
        this.way = way;
    }

    /**
     * getter for Column CMSX_CASE.TOTAL_INVEST
     */
    public BigDecimal getTotalInvest() {
        return totalInvest;
    }

    /**
     * setter for Column CMSX_CASE.TOTAL_INVEST
     * @param totalInvest
     */
    public void setTotalInvest(BigDecimal totalInvest) {
        this.totalInvest = totalInvest;
    }

    /**
     * getter for Column CMSX_CASE.STATUS
     */
    public String getStatus() {
        return status;
    }

    /**
     * setter for Column CMSX_CASE.STATUS
     * @param status
     */
    public void setStatus(String status) {
        this.status = status;
    }

}