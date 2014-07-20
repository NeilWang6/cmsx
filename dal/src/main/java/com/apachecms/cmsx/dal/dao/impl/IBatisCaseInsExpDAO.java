package com.apachecms.cmsx.dal.dao.impl;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.orm.ibatis.SqlMapClientCallback;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.apachecms.cmsx.dal.dao.CaseInsExpDAO;
import com.apachecms.cmsx.dal.dataobject.CaseInsExpDO;
import com.ibatis.sqlmap.client.SqlMapExecutor;

public class IBatisCaseInsExpDAO extends SqlMapClientDaoSupport implements CaseInsExpDAO {

    private static final String SQL_GET_ST_INS_EXP_LIST               = "getStInsExpListByInfo";
    private static final String SQL_GET_ST_INS_EXP_LIST_BY_STID_ITEMS = "SQL_GET_ST_INS_EXP_LIST_BY_STID_ITEMS";
    private static final String SQL_INSERT_CMSX_CASE_INS_EXP              = "SQL_INSERT_CMSX_CASE_INS_EXP";
    private static final String MS_UPDATE_CMSX_CASE_INS_EXP               = "MS_UPDATE_CMSX_CASE_INS_EXP";
    private static final String SQL_GET_ST_INS_EXP_LIST_BY_STID       = "SQL_GET_ST_INS_EXP_LIST_BY_STID";
    private static final String SQL_GET_ST_INS_EXP_AND_ITEMINFO_LIST_BY_STID       = "SQL_GET_ST_INS_EXP_AND_ITEMINFO_LIST_BY_STID";
    private static final String MS_DELETE_ST_INS_EXP_BY_STID          = "MS_DELETE_ST_INS_EXP_BY_STID";


    @SuppressWarnings("unchecked")
    public List<CaseInsExpDO> getStInsExpListByItemList(List<Long> itemIdList) {
        if (itemIdList == null || itemIdList.size() == 0) {
            return new ArrayList<CaseInsExpDO>(0);
        }
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("itemIdList", itemIdList);
        return getSqlMapClientTemplate().queryForList("getStInsExpListByItemList", param);
    }

    @SuppressWarnings("unchecked")
    public List<CaseInsExpDO> getStInsExpListByInfo(List<Long> stInsIdList, String stType, long itemId) {
        if (stInsIdList == null || stInsIdList.size() == 0) {
            return new ArrayList<CaseInsExpDO>();
        }
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("stInsIdList", stInsIdList);
        param.put("stType", stType);
        param.put("itemId", itemId);
        return getSqlMapClientTemplate().queryForList(SQL_GET_ST_INS_EXP_LIST, param);
    }

    public List<CaseInsExpDO> getStInsExpListByInfo(long stInsId, String stType, List<Long> itemIdList) {
        if (stInsId < 1 || stType == null || itemIdList == null || itemIdList.size() == 0) {
            return new ArrayList<CaseInsExpDO>(0);
        }
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("itemIdList", itemIdList);
        param.put("stInsId", stInsId);
        param.put("stType", stType);
        return getSqlMapClientTemplate().queryForList(SQL_GET_ST_INS_EXP_LIST_BY_STID_ITEMS, param);
    }

    public Long insert(CaseInsExpDO record) {
        return (Long) this.getSqlMapClientTemplate().insert(SQL_INSERT_CMSX_CASE_INS_EXP, record);
    }

    public void batchInsert(List<CaseInsExpDO> recordList) {
        if (recordList == null || recordList.size() == 0) {
            return;
        }
        final Iterator<CaseInsExpDO> iter = recordList.iterator();
        getSqlMapClientTemplate().execute(new SqlMapClientCallback() {

            public Object doInSqlMapClient(SqlMapExecutor executor) throws SQLException {
                executor.startBatch();
                while (iter.hasNext()) {
                    executor.insert(SQL_INSERT_CMSX_CASE_INS_EXP, iter.next());
                }
                executor.executeBatch();
                return null;
            }
        });
    }

    public int update(CaseInsExpDO record) {
        return this.getSqlMapClientTemplate().update(MS_UPDATE_CMSX_CASE_INS_EXP, record);
    }

    public List<CaseInsExpDO> getStInsExpListByInfo(long stInsId, String stType) {
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("stInsId", stInsId);
        param.put("stType", stType);
        return getSqlMapClientTemplate().queryForList(SQL_GET_ST_INS_EXP_LIST_BY_STID, param);
    }

    /**
     * 批量更新
     * 
     * @param list
     */
    public void batchUpdate(final List<CaseInsExpDO> list) {
        getSqlMapClientTemplate().execute(new SqlMapClientCallback() {

            public Object doInSqlMapClient(SqlMapExecutor executor) throws SQLException {
                executor.startBatch();
                for (CaseInsExpDO ctStInsExpDO : list) {
                    executor.update(MS_UPDATE_CMSX_CASE_INS_EXP, ctStInsExpDO);
                }
                executor.executeBatch();
                return null;
            }
        });
    }
    
    public int delete(long seriesInsId, String stType) {
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("stInsId", seriesInsId);
        param.put("stType", stType);
        return this.getSqlMapClientTemplate().delete("MS_DELETE_ST_INS_EXP_BY_STID_AND_TYPE", param);
    }
    
    public int delete(CaseInsExpDO record) {
        return this.getSqlMapClientTemplate().delete(MS_DELETE_ST_INS_EXP_BY_STID, record);
    }

    /**
     * 批量删除
     * 
     * @param list
     */
    public void batchDelete(final List<CaseInsExpDO> list) {
        getSqlMapClientTemplate().execute(new SqlMapClientCallback() {

            public Object doInSqlMapClient(SqlMapExecutor executor) throws SQLException {
                executor.startBatch();
                for (CaseInsExpDO ctStInsExpDO : list) {
                    executor.delete(MS_DELETE_ST_INS_EXP_BY_STID, ctStInsExpDO);
                }
                executor.executeBatch();
                return null;
            }
        });
    }

    public CaseInsExpDO getStInsExp(long stInsId, String stType, long itemId) {
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("itemId", itemId);
        param.put("stInsId", stInsId);
        param.put("stType", stType);
        List<CaseInsExpDO> list = (List<CaseInsExpDO>) this.getSqlMapClientTemplate().queryForList("getStInsExp", param);
        if(list!=null && list.size()>0){
            return list.get(0);
        }
        return null;
    }

	public List<CaseInsExpDO> getStInsExpAndItemInfoListByInfo(long stInsId,
			String stType) {
		Map<String, Object> param = new HashMap<String, Object>();
        param.put("stInsId", stInsId);
        param.put("stType", stType);
        return getSqlMapClientTemplate().queryForList(SQL_GET_ST_INS_EXP_AND_ITEMINFO_LIST_BY_STID, param);
	}

}
