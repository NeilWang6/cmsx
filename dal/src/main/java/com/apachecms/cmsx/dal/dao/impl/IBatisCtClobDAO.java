package com.apachecms.cmsx.dal.dao.impl;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.orm.ibatis.SqlMapClientCallback;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.apachecms.cmsx.dal.dao.CtClobDAO;
import com.apachecms.cmsx.dal.dataobject.CtClobDO;
import com.ibatis.sqlmap.client.SqlMapExecutor;

public class IBatisCtClobDAO extends SqlMapClientDaoSupport implements CtClobDAO {

    private static final String SQL_SELECT_CT_CLOB_BY_ID     = "SQL_SELECT_CT_CLOB_BY_ID";
    private static final String SQL_SELECT_CT_CLOB_BY_ID_DIV = "SQL_SELECT_CT_CLOB_BY_ID_DIV";

    @SuppressWarnings("unchecked")
    public List<CtClobDO> queryCtClobDO(List<Long> ids) {
        if (null == ids || ids.size() < 1) {
            return null;
        }
        Map<String, Object> param = new HashMap<String, Object>(1);
        param.put("ids", ids);

        return this.getSqlMapClientTemplate().queryForList(SQL_SELECT_CT_CLOB_BY_ID, param);
    }

    public CtClobDO queryCtClobDO(String clobId) {
        if (StringUtils.isBlank(clobId)) {
            return null;
        }

        return (CtClobDO) this.getSqlMapClientTemplate().queryForObject(SQL_SELECT_CT_CLOB_BY_ID_DIV, clobId);

    }

    public int deleteById(Long id) {
        return this.getSqlMapClientTemplate().delete("SQL_DELETE_CT_CLOB_BY_ID", id);

    }
    public long insert(String value) {
        CtClobDO clobDO = new CtClobDO();
        clobDO.setValue(value);
        return (Long) this.getSqlMapClientTemplate().insert("SQL_INSERT_CT_CLOB", clobDO);
    }

    public int updateClob(CtClobDO clobDO) {
        return this.getSqlMapClientTemplate().update("updateClob", clobDO);
    }

    @SuppressWarnings("unchecked")
    public List<CtClobDO> getClobByInfo(int offset, int length) {
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("offset", offset);
        param.put("length", length);
        return getSqlMapClientTemplate().queryForList("getClobByInfo", param);
    }

    public void batchUpdate(List<CtClobDO> recordList) {
        if (recordList == null || recordList.size() == 0) {
            return;
        }
        final Iterator<CtClobDO> iter = recordList.iterator();
        getSqlMapClientTemplate().execute(new SqlMapClientCallback() {

            public Object doInSqlMapClient(SqlMapExecutor executor) throws SQLException {
                executor.startBatch();
                while (iter.hasNext()) {
                    executor.update("updateClob", iter.next());
                }
                executor.executeBatch();
                return null;
            }
        });
    }
}
