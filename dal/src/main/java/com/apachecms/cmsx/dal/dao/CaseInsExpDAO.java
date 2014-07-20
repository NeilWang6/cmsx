package com.apachecms.cmsx.dal.dao;

import java.util.List;

import com.apachecms.cmsx.dal.dataobject.CaseInsExpDO;

public interface CaseInsExpDAO {
	public List<CaseInsExpDO> getStInsExpListByItemList(List<Long> itemIdList);

	public List<CaseInsExpDO> getStInsExpListByInfo(List<Long> stInsIdList, String stType, long itemId);

	/**
	 * 查询一个专场\活动实例的多个item
	 * 
	 * @param stInsId
	 * @param itemIdList
	 * @return
	 */
	public List<CaseInsExpDO> getStInsExpListByInfo(long stInsId, String stType, List<Long> itemIdList);

	public Long insert(CaseInsExpDO record);

	public void batchInsert(List<CaseInsExpDO> recordList);

	public int update(CaseInsExpDO record);

	public List<CaseInsExpDO> getStInsExpListByInfo(long stInsId, String stType);

	/**
	 * 查询带item属性的
	 * 
	 * @param stInsId
	 * @param stType
	 * @return
	 */
	public List<CaseInsExpDO> getStInsExpAndItemInfoListByInfo(long stInsId, String stType);

	public void batchUpdate(final List<CaseInsExpDO> list);

	public int delete(CaseInsExpDO record);

	public int delete(long seriesInsId, String stType);

	public void batchDelete(final List<CaseInsExpDO> list);

	public CaseInsExpDO getStInsExp(long stInsId, String stType, long itemId);
}
