package com.apachecms.cmsx.dal.dao;

import java.util.List;

import com.apachecms.cmsx.dal.dataobject.CtClobDO;

public interface CtClobDAO {
	   /**
     * 插入一条记录
     */
    public long insert(String value);
    
    public int deleteById(Long id);
    
    /**
     * 批量查询查询clob
     */

    List<CtClobDO> queryCtClobDO(List<Long> ids);

    /**
     * 单条查询
     */
    CtClobDO queryCtClobDO(String clobId);

    /**
     * 更新操作
     * 
     * @param clobDO
     * @return
     */
    public int updateClob(CtClobDO clobDO);

    public List<CtClobDO> getClobByInfo(int offset, int length);

    public void batchUpdate(List<CtClobDO> recordList);
}
