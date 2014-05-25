package com.apachecms.cmsx.dal.dao;

import java.util.List;

import com.apachecms.cmsx.dal.dataobject.CtItemDO;

public interface CtItemDAO {
	public List<CtItemDO> getItems(List<Long> itemsIdList);

	/**
	 * 新增控件
	 * 
	 * @param item
	 * @return
	 */
	public Long insert(CtItemDO item);

	/**
	 * 获取所有控件
	 * 
	 * @return
	 */
	public List<CtItemDO> getAllItemList();

	/**
	 * 根据主键获取item信息
	 * 
	 * @param id
	 * @return
	 */
	public CtItemDO getItemById(long id);

	/**
	 * 根据主键id更新item信息
	 * 
	 * @param item
	 */
	public void updateItem(CtItemDO item);
}
