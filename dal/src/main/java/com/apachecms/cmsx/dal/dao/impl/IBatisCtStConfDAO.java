package com.apachecms.cmsx.dal.dao.impl;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.orm.ibatis.SqlMapClientCallback;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.apachecms.cmsx.dal.dao.CtStConfDAO;
import com.apachecms.cmsx.dal.dataobject.CtStConfDO;
import com.ibatis.sqlmap.client.SqlMapExecutor;

public class IBatisCtStConfDAO extends SqlMapClientDaoSupport implements CtStConfDAO {

    private static final String SQL_QUERY_ST_CONF = "SQL_QUERY_ST_CONF";

    @SuppressWarnings("unchecked")
    public List<CtStConfDO> loadCtStConf(String confType, Integer seriesType) {
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("confType", confType);
        param.put("seriesType", seriesType);
        return getSqlMapClientTemplate().queryForList(SQL_QUERY_ST_CONF, param);
    }

    public void batchInsert(List<CtStConfDO> stConfList) {
        if (stConfList == null || stConfList.size() == 0) {
            return;
        }
        final Iterator<CtStConfDO> iter = stConfList.iterator();
        getSqlMapClientTemplate().execute(new SqlMapClientCallback() {

            public Object doInSqlMapClient(SqlMapExecutor executor) throws SQLException {
                executor.startBatch();
                while (iter.hasNext()) {
                    executor.insert("insertCtStConf", iter.next());
                }
                executor.executeBatch();
                return null;
            }
        });
    }

    public int deleteCtStConfByConfTypeAndSeriesType(String confType, int seriesType) {
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("confType", confType);
        param.put("seriesType", seriesType);
        return getSqlMapClientTemplate().delete("deleteCtStConfByConfTypeAndSeriesType", param);
    }
}