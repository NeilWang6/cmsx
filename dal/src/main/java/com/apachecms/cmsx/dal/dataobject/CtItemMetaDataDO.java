package com.apachecms.cmsx.dal.dataobject;

import java.util.Date;

public class CtItemMetaDataDO {

	private Long id;

	private Date gmtModified;

	private Date gmtCreate;

	private Long itemId;

	private String metadataKey;

	private String value;

	private String description;

	private Integer orderNum;

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

	public String getMetadataKey() {
		return metadataKey;
	}

	public void setMetadataKey(String metadataKey) {
		this.metadataKey = metadataKey;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getItemId() {
		return itemId;
	}

	public void setItemId(Long itemId) {
		this.itemId = itemId;
	}

	public Integer getOrderNum() {
		return orderNum;
	}

	public void setOrderNum(Integer orderNum) {
		this.orderNum = orderNum;
	}
}
