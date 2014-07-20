package com.apachecms.cmsx.dal.dao.impl;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.orm.ibatis.SqlMapClientCallback;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.apachecms.cmsx.dal.dao.CtItemMetaDataDAO;
import com.apachecms.cmsx.dal.dataobject.CtItemMetaDataDO;
import com.ibatis.sqlmap.client.SqlMapExecutor;

public class IBatisCtItemMetaDataDAO extends SqlMapClientDaoSupport implements CtItemMetaDataDAO {
 
    @SuppressWarnings("unchecked")
    public List<CtItemMetaDataDO> getCtItemMetaData(List<Long> itemsIdList) {
        if (itemsIdList == null || itemsIdList.size() == 0) {
            return new ArrayList<CtItemMetaDataDO>();
        }
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("itemsIdList", itemsIdList);
        return getSqlMapClientTemplate().queryForList("CT_ITEM_META_DATA.SQL_QUERY_ITEM_META_DATA_BY_ITEM_IDS", param);
    }

    public void insert(CtItemMetaDataDO itemMetadata) {
        this.getSqlMapClientTemplate().insert("CT_ITEM_META_DATA.insertItemMetadata", itemMetadata);
    }

    public void batchInsert(List<CtItemMetaDataDO> recordList) {
        if (recordList == null || recordList.size() == 0) {
            return;
        }
        final Iterator<CtItemMetaDataDO> iter = recordList.iterator();
        getSqlMapClientTemplate().execute(new SqlMapClientCallback() {

            public Object doInSqlMapClient(SqlMapExecutor executor) throws SQLException {
                executor.startBatch();
                while (iter.hasNext()) {
                    executor.insert("CT_ITEM_META_DATA.insertItemMetadata", iter.next());
                }
                executor.executeBatch();
                return null;
            }
        });
    }
    public CtItemMetaDataDO getItemMetadataById(long id) {
        return (CtItemMetaDataDO) getSqlMapClientTemplate().queryForObject("CT_ITEM_META_DATA.getItemMetadataById", id);
    }

    public int update(CtItemMetaDataDO itemMetadata) {
        return getSqlMapClientTemplate().update("CT_ITEM_META_DATA.updateItemMetadata", itemMetadata);
    }
    
    public int delete(long id) {
        return getSqlMapClientTemplate().delete("CT_ITEM_META_DATA.deleteItemMetadataById", id);
    }
    public int deleteByItemIds(List<Long> itemIds) {
        if(itemIds==null||itemIds.size()==0){
            return 0;
        }
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("itemIds", itemIds);
        return this.getSqlMapClientTemplate().delete("CT_ITEM_META_DATA.deleteItemMetadata", param);
    }

}