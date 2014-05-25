package com.apachecms.cmsx.dal.dao.common;

import java.util.HashMap;
import java.util.Map;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;
import org.springframework.transaction.support.TransactionCallback;
import org.springframework.transaction.support.TransactionTemplate;

import com.apachecms.cmsx.dal.dao.BaseDAO;

/**
 * 将 Spring Transaction 外移，跨多DAO事务
 * 
 * TODO Comment of BaseDAOImpl
 * @author zalot.zhaoh
 *
 */
public class BaseDAOImpl extends SqlMapClientDaoSupport implements BaseDAO{ 
    /* 
     * clob统一在dcms_box_content中管理，这里实现公共操作方法 
     */
    private static final String MS_SELECT_CONTENT_BY_RESOURCEID_AND_TYPE  = "dcms.boxcontent.MS_SELECT_CONTENT_BY_RESOURCEID_AND_TYPE"; 
    private static final String MS_INSERT_BOXCONTENT = "dcms.boxcontent.MS_INSERT_BOXCONTENT";
    private static final String MS_UPDATE_BOX_CONTENT = "dcms.boxcontent.MS_UPDATE_BOX_CONTENT";
    private static final String MS_DELETE_BOX_CONTENT_TYPE = "dcms.boxcontent.MS_DELETE_BOX_CONTENT_TYPE";
    
    //事务
	private TransactionTemplate transactionTemplate;
	
	public void setTransactionTemplate(TransactionTemplate transactionTemplate){
		this.transactionTemplate = transactionTemplate;
	}
	
	/* (non-Javadoc)
	 * @see com.alibaba.china.dcms.dal.daointerface.BaseDAO#execute(org.springframework.transaction.support.TransactionCallback)
	 */
	public Object execute(TransactionCallback callback){
		return transactionTemplate.execute(callback);
	}

	/**
	 * 删除clob内容
	 * @param resourceType
	 * @param resourceId
	 * @return
	 */
	public int deleteContent(String resourceType, Long resourceId) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("resourceType", resourceType);
        params.put("resourceId", resourceId);
        return super.getSqlMapClientTemplate().update(MS_DELETE_BOX_CONTENT_TYPE, params);
    } 
 
}
