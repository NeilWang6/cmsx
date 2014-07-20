package com.apachecms.cmsx.dal.dao.impl;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.orm.ibatis.SqlMapClientCallback;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.apachecms.cmsx.dal.dao.CtConfDAO;
import com.apachecms.cmsx.dal.dataobject.CtConfDO;
import com.ibatis.sqlmap.client.SqlMapExecutor;

public class IBatisCtConfDAO extends SqlMapClientDaoSupport implements CtConfDAO { 

    @SuppressWarnings("unchecked")
    public List<CtConfDO> loadCtStConf(String confType, long catalogId) {
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("confType", confType);
        param.put("catalogId", catalogId);
        return getSqlMapClientTemplate().queryForList("CT_CONF.SQL_QUERY_ST_CONF", param);
    }

    public void batchInsert(List<CtConfDO> stConfList) {
        if (stConfList == null || stConfList.size() == 0) {
            return;
        }
        final Iterator<CtConfDO> iter = stConfList.iterator();
        getSqlMapClientTemplate().execute(new SqlMapClientCallback() {

            public Object doInSqlMapClient(SqlMapExecutor executor) throws SQLException {
                executor.startBatch();
                while (iter.hasNext()) {
                    executor.insert("CT_CONF.insertCtStConf", iter.next());
                }
                executor.executeBatch();
                return null;
            }
        });
    }

    public int deleteCtStConfByConfTypeAndSeriesType(String confType, long catalogId) {
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("confType", confType);
        param.put("catalogId", catalogId);
        return getSqlMapClientTemplate().delete("CT_CONF.deleteCaseConfByConfTypeAndCatalog", param);
    }
}