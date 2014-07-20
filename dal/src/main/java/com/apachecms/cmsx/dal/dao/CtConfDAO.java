package com.apachecms.cmsx.dal.dao;

import java.util.List;

import com.apachecms.cmsx.dal.dataobject.CtConfDO;

public interface CtConfDAO {
	public List<CtConfDO> loadCtStConf(String confType, long catalogId);

	/**
	 * 批量插入
	 * 
	 * @param stConfList
	 */
	public void batchInsert(List<CtConfDO> stConfList);

	/**
	 * 根据配置类型和案例分类删除配置项
	 * 
	 * @param confType
	 * @param seriesType
	 * @return
	 */
	public int deleteCtStConfByConfTypeAndSeriesType(String confType, long catalogId);
}
