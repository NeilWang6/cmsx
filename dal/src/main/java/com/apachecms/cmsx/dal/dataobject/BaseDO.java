package com.apachecms.cmsx.dal.dataobject;

import java.io.Serializable;

import org.apache.commons.lang.builder.ToStringBuilder;

public class BaseDO implements Serializable {

    private static final long serialVersionUID = 741231858441822688L;

    /**
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
}

