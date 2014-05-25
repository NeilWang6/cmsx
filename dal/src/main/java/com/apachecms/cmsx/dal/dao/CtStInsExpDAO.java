package com.apachecms.cmsx.dal.dao;

import java.util.List;

import com.apachecms.cmsx.dal.dataobject.CtStInsExpDO;

public interface CtStInsExpDAO {
	public List<CtStInsExpDO> getStInsExpListByItemList(List<Long> itemIdList);

	public List<CtStInsExpDO> getStInsExpListByInfo(List<Long> stInsIdList, String stType, long itemId);

	/**
	 * 查询一个专场\活动实例的多个item
	 * 
	 * @param stInsId
	 * @param itemIdList
	 * @return
	 */
	public List<CtStInsExpDO> getStInsExpListByInfo(long stInsId, String stType, List<Long> itemIdList);

	public Long insert(CtStInsExpDO record);

	public void batchInsert(List<CtStInsExpDO> recordList);

	public int update(CtStInsExpDO record);

	public List<CtStInsExpDO> getStInsExpListByInfo(long stInsId, String stType);

	/**
	 * 查询带item属性的
	 * 
	 * @param stInsId
	 * @param stType
	 * @return
	 */
	public List<CtStInsExpDO> getStInsExpAndItemInfoListByInfo(long stInsId, String stType);

	public void batchUpdate(final List<CtStInsExpDO> list);

	public int delete(CtStInsExpDO record);

	public int delete(long seriesInsId, String stType);

	public void batchDelete(final List<CtStInsExpDO> list);

	public CtStInsExpDO getStInsExp(long stInsId, String stType, long itemId);
}
