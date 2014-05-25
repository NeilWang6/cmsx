package com.apachecms.cmsx.dal.dataobject;
 
public class ACLRole {
    // pk
    private String id;
    // 角色名
    private String name;
    // 角色级别
    private Long lev;
    // 0:内站点角色 1:外站角色
    private String isOutsite;
    // 0 删除 1 正常
    private String isDelete;
    // 描述信息
    private String description;
    // 创建日期
    private java.util.Date gmtCreate;
    // 最后修改日期
    private java.util.Date gmtModified;
    // 创建者
    private String createUser;
    // 最后修改者
    private String modifyUser;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getLev() {
        return lev;
    }

    public void setLev(Long lev) {
        this.lev = lev;
    }

    public String getIsOutsite() {
        return isOutsite;
    }

    public void setIsOutsite(String isOutsite) {
        this.isOutsite = isOutsite;
    }

    public String getIsDelete() {
        return isDelete;
    }

    public void setIsDelete(String isDelete) {
        this.isDelete = isDelete;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public java.util.Date getGmtCreate() {
        return gmtCreate;
    }

    public void setGmtCreate(java.util.Date gmtCreate) {
        this.gmtCreate = gmtCreate;
    }

    public java.util.Date getGmtModified() {
        return gmtModified;
    }

    public void setGmtModified(java.util.Date gmtModified) {
        this.gmtModified = gmtModified;
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    public String getModifyUser() {
        return modifyUser;
    }

    public void setModifyUser(String modifyUser) {
        this.modifyUser = modifyUser;
    }
}