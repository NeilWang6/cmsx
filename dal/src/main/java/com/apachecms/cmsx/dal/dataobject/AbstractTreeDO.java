package com.apachecms.cmsx.dal.dataobject;

import java.util.ArrayList;
import java.util.List;

public abstract class AbstractTreeDO<T extends AbstractTreeDO> {
	private List<T> subList = new ArrayList<T>();

	public List<T> getSublist() {
		return subList;
	}

	public abstract Long getId();

	public abstract Long getParentId();

	public abstract Integer getOrderList();

	public abstract Integer getLev();
}
