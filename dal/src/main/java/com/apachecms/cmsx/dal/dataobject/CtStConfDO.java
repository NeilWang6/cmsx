package com.apachecms.cmsx.dal.dataobject;

import java.util.Date;

public class CtStConfDO {
	private Long id;

	private Date gmtModified;

	private Date gmtCreate;

	private String confType;

	private Integer seriesType;

	private Long itemId;

	private String defaultValue;

	private Integer orderNum;

	private String fgType;

	private String isHidden;

	private String isNeed;

	private String isEnable;

	private String tips;

	private Integer showDevice;

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

	public String getConfType() {
		return confType;
	}

	public void setConfType(String confType) {
		this.confType = confType;
	}

	public Long getItemId() {
		return itemId;
	}

	public void setItemId(Long itemId) {
		this.itemId = itemId;
	}

	public String getDefaultValue() {
		return defaultValue;
	}

	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getSeriesType() {
		return seriesType;
	}

	public void setSeriesType(Integer seriesType) {
		this.seriesType = seriesType;
	}

	public Integer getOrderNum() {
		return orderNum;
	}

	public void setOrderNum(Integer orderNum) {
		this.orderNum = orderNum;
	}

	public String getFgType() {
		return fgType;
	}

	public void setFgType(String fgType) {
		this.fgType = fgType;
	}

	public String getIsHidden() {
		return isHidden;
	}

	public void setIsHidden(String isHidden) {
		this.isHidden = isHidden;
	}

	public String getIsNeed() {
		return isNeed;
	}

	public void setIsNeed(String isNeed) {
		this.isNeed = isNeed;
	}

	public String getIsEnable() {
		return isEnable;
	}

	public void setIsEnable(String isEnable) {
		this.isEnable = isEnable;
	}

	public String getTips() {
		return tips;
	}

	public void setTips(String tips) {
		this.tips = tips;
	}

	public Integer getShowDevice() {
		return showDevice;
	}

	public void setShowDevice(Integer showDevice) {
		this.showDevice = showDevice;
	}
}
