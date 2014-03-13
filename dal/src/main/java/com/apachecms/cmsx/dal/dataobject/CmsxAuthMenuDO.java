package com.apachecms.cmsx.dal.dataobject;

import java.io.Serializable;
import java.util.Date;

/**
 * 数据对象
 * @since 2014-03-14
 */
public class CmsxAuthMenuDO extends AbstractTreeDO<CmsxAuthMenuDO> implements Serializable {

    private static final long serialVersionUID = 139472700046742817L;

    /**
     * column CMSX_AUTH_MENU.ID
     */
    private Long id;

    /**
     * column CMSX_AUTH_MENU.PARENT_ID
     */
    private Long parentId;

    /**
     * column CMSX_AUTH_MENU.MENU_NAME
     */
    private String menuName;

    /**
     * column CMSX_AUTH_MENU.RES_ID
     */
    private Long resId;

    /**
     * column CMSX_AUTH_MENU.GMT_CREATE
     */
    private Date gmtCreate;

    /**
     * column CMSX_AUTH_MENU.GMT_MODIFIED
     */
    private Date gmtModified;

    /**
     * column CMSX_AUTH_MENU.CREATE_USER
     */
    private String createUser;

    /**
     * column CMSX_AUTH_MENU.MODIFY_USER
     */
    private String modifyUser;

    /**
     * column CMSX_AUTH_MENU.STATUS
     */
    private Short status;

    /**
     * column CMSX_AUTH_MENU.LEV
     */
    private Integer lev;

    /**
     * column CMSX_AUTH_MENU.ORDER_LIST
     */
    private Integer orderList;

    public CmsxAuthMenuDO() {
        super();
    }

    public CmsxAuthMenuDO(Long id, Long parentId, String menuName, Long resId, Date gmtCreate, Date gmtModified, String createUser, String modifyUser, Short status, Integer lev, Integer orderList) {
        this.id = id;
        this.parentId = parentId;
        this.menuName = menuName;
        this.resId = resId;
        this.gmtCreate = gmtCreate;
        this.gmtModified = gmtModified;
        this.createUser = createUser;
        this.modifyUser = modifyUser;
        this.status = status;
        this.lev = lev;
        this.orderList = orderList;
    }

    /**
     * getter for Column CMSX_AUTH_MENU.ID
     */
    public Long getId() {
        return id;
    }

    /**
     * setter for Column CMSX_AUTH_MENU.ID
     * @param id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * getter for Column CMSX_AUTH_MENU.PARENT_ID
     */
    public Long getParentId() {
        return parentId;
    }

    /**
     * setter for Column CMSX_AUTH_MENU.PARENT_ID
     * @param parentId
     */
    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    /**
     * getter for Column CMSX_AUTH_MENU.MENU_NAME
     */
    public String getMenuName() {
        return menuName;
    }

    /**
     * setter for Column CMSX_AUTH_MENU.MENU_NAME
     * @param menuName
     */
    public void setMenuName(String menuName) {
        this.menuName = menuName;
    }

    /**
     * getter for Column CMSX_AUTH_MENU.RES_ID
     */
    public Long getResId() {
        return resId;
    }

    /**
     * setter for Column CMSX_AUTH_MENU.RES_ID
     * @param resId
     */
    public void setResId(Long resId) {
        this.resId = resId;
    }

    /**
     * getter for Column CMSX_AUTH_MENU.GMT_CREATE
     */
    public Date getGmtCreate() {
        return gmtCreate;
    }

    /**
     * setter for Column CMSX_AUTH_MENU.GMT_CREATE
     * @param gmtCreate
     */
    public void setGmtCreate(Date gmtCreate) {
        this.gmtCreate = gmtCreate;
    }

    /**
     * getter for Column CMSX_AUTH_MENU.GMT_MODIFIED
     */
    public Date getGmtModified() {
        return gmtModified;
    }

    /**
     * setter for Column CMSX_AUTH_MENU.GMT_MODIFIED
     * @param gmtModified
     */
    public void setGmtModified(Date gmtModified) {
        this.gmtModified = gmtModified;
    }

    /**
     * getter for Column CMSX_AUTH_MENU.CREATE_USER
     */
    public String getCreateUser() {
        return createUser;
    }

    /**
     * setter for Column CMSX_AUTH_MENU.CREATE_USER
     * @param createUser
     */
    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    /**
     * getter for Column CMSX_AUTH_MENU.MODIFY_USER
     */
    public String getModifyUser() {
        return modifyUser;
    }

    /**
     * setter for Column CMSX_AUTH_MENU.MODIFY_USER
     * @param modifyUser
     */
    public void setModifyUser(String modifyUser) {
        this.modifyUser = modifyUser;
    }

    /**
     * getter for Column CMSX_AUTH_MENU.STATUS
     */
    public Short getStatus() {
        return status;
    }

    /**
     * setter for Column CMSX_AUTH_MENU.STATUS
     * @param status
     */
    public void setStatus(Short status) {
        this.status = status;
    }

    /**
     * getter for Column CMSX_AUTH_MENU.LEV
     */
    public Integer getLev() {
        return lev;
    }

    /**
     * setter for Column CMSX_AUTH_MENU.LEV
     * @param lev
     */
    public void setLev(Integer lev) {
        this.lev = lev;
    }

    /**
     * getter for Column CMSX_AUTH_MENU.ORDER_LIST
     */
    public Integer getOrderList() {
        return orderList;
    }

    /**
     * setter for Column CMSX_AUTH_MENU.ORDER_LIST
     * @param orderList
     */
    public void setOrderList(Integer orderList) {
        this.orderList = orderList;
    }

}