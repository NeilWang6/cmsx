package com.apachecms.cmsx.dal.dataobject;

import java.util.Date;

public class CtStInsExpDO {
    private Long    id;
    private Date    gmtModified;
    private Date    gmtCreate;
    private Long    stInsId;
    private String  stType;
    private Long    itemId;
    // 需要关联item表获取
    private String  ruleName;
    private Integer  ruleType;
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

    public Long getStInsId() {
        return stInsId;
    }

    public void setStInsId(Long stInsId) {
        this.stInsId = stInsId;
    }

    /**
     * @return the stType
     */
    public String getStType() {
        return stType;
    }

    /**
     * @param stType the stType to set
     */
    public void setStType(String stType) {
        this.stType = stType;
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

	public String getRuleName() {
		return ruleName;
	}

	public void setRuleName(String ruleName) {
		this.ruleName = ruleName;
	}

	public Integer getRuleType() {
		return ruleType;
	}

	public void setRuleType(Integer ruleType) {
		this.ruleType = ruleType;
	}
}
