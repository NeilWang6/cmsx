package com.apachecms.cmsx.dal.dao;

import java.util.List;

import com.apachecms.cmsx.dal.dataobject.CtStConfDO;

public interface CtStConfDAO {
	public List<CtStConfDO> loadCtStConf(String confType, Integer seriesType);

	/**
	 * 批量插入
	 * 
	 * @param stConfList
	 */
	public void batchInsert(List<CtStConfDO> stConfList);

	/**
	 * 根据配置类型和专场类型删除专场活动配置项
	 * 
	 * @param confType
	 * @param seriesType
	 * @return
	 */
	public int deleteCtStConfByConfTypeAndSeriesType(String confType, int seriesType);
}
