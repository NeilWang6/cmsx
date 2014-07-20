package com.apachecms.cmsx.dal.dataobject;

import java.util.Date;

public class CaseInsExpDO {
    private Long    id;
    private Date    gmtModified;
    private Date    gmtCreate;
    private Long    caseInsId;
    private Long  catalogId;
    private Long    itemId; 
    private String  value;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getGmtModified() {
        return gmtModified;
    }

    public void setGmtModified(Date gmtModified) {
        this.gmtModified = gmtModified;
    }

    public Date getGmtCreate() {
        return gmtCreate;
    }

    public void setGmtCreate(Date gmtCreate) {
        this.gmtCreate = gmtCreate;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

	public Long getCaseInsId() {
		return caseInsId;
	}

	public void setCaseInsId(Long caseInsId) {
		this.caseInsId = caseInsId;
	}

	public Long getCatalogId() {
		return catalogId;
	}

	public void setCatalogId(Long catalogId) {
		this.catalogId = catalogId;
	}
	
	
}
