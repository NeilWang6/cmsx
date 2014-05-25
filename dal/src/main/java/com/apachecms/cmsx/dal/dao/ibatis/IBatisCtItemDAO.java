package com.apachecms.cmsx.dal.dao.ibatis;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.apachecms.cmsx.dal.dao.CtItemDAO;
import com.apachecms.cmsx.dal.dataobject.CtItemDO;

public class IBatisCtItemDAO extends SqlMapClientDaoSupport implements CtItemDAO {

    private static final String SQL_QUERY_CT_ITEM_BY_IDS = "CT_ITEM.SQL_QUERY_CT_ITEM_BY_IDS";

    public Long insert(CtItemDO item) {
        if (item.getId() != null && item.getId() > 0) {
            return (Long)this.getSqlMapClientTemplate().insert("CT_ITEM.insertItemWithId", item);
        } else {
            return (Long)this.getSqlMapClientTemplate().insert("CT_ITEM.insertItem", item);
        }
    }

    @SuppressWarnings("unchecked")
    public List<CtItemDO> getItems(List<Long> itemsIdList) {
        if (itemsIdList == null || itemsIdList.size() == 0) {
            return new ArrayList<CtItemDO>();
        }
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("itemsIdList", itemsIdList);
        return getSqlMapClientTemplate().queryForList(SQL_QUERY_CT_ITEM_BY_IDS, param);
    }

    @SuppressWarnings("unchecked")
    public List<CtItemDO> getAllItemList() {
        return this.getSqlMapClientTemplate().queryForList("CT_ITEM.getAllItemList");
    }

    public CtItemDO getItemById(long id) {
        return (CtItemDO) this.getSqlMapClientTemplate().queryForObject("CT_ITEM.getItemById", id);
    }

    public void updateItem(CtItemDO item) {
        this.getSqlMapClientTemplate().update("CT_ITEM.updateItem", item);

    }
}
