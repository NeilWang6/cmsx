package com.apachecms.cmsx.dal.dao;

import java.util.List;

import com.apachecms.cmsx.dal.dataobject.CtItemMetaDataDO;

public interface CtItemMetaDataDAO {
	public List<CtItemMetaDataDO> getCtItemMetaData(List<Long> itemsIdList);

	/**
	 * 新增item metadata
	 * 
	 * @param item
	 * @return
	 */
	public void insert(CtItemMetaDataDO itemMetadata);

	public void batchInsert(List<CtItemMetaDataDO> recordList);

	public int deleteByItemIds(List<Long> itemIds);

	/**
	 * 根据主键id获取metadata对象
	 * 
	 * @param id
	 * @return
	 */
	public CtItemMetaDataDO getItemMetadataById(long id);

	public int update(CtItemMetaDataDO itemMetadata);

	public int delete(long id);
}
