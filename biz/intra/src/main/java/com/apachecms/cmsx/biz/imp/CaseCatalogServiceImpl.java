package com.apachecms.cmsx.biz.imp;

import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;

import com.alibaba.citrus.util.StringUtil;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.biz.CaseCatalogService;
import com.apachecms.cmsx.dal.dao.CaseCatalogDAO;
import com.apachecms.cmsx.dal.dao.CtConfDAO;
import com.apachecms.cmsx.dal.dao.CtItemDAO;
import com.apachecms.cmsx.dal.dao.common.PageInfo;
import com.apachecms.cmsx.dal.dataobject.CaseCatalog;
import com.apachecms.cmsx.dal.dataobject.CtConfDO;
import com.apachecms.cmsx.exception.DuplicateException;

@Resource(name="caseCatalogService")
public class CaseCatalogServiceImpl implements CaseCatalogService { 
	protected static final Log LOG = LogFactory.getLog(CaseCatalogServiceImpl.class);
	@Autowired
	private CaseCatalogDAO caseCatalogDAO;
	@Autowired
	private CtItemDAO          ctItemDAO;
	@Autowired
	private CtConfDAO  caseConfDAO;
	@Autowired
	private TransactionTemplate transactionTemplate;
	
	@Override
	public Long create(CaseCatalog param, String opUserID) throws DuplicateException { 
		if(param==null || StringUtil.isEmpty(param.getName())){
			throw new RuntimeException("创建分类入参存在空.");
		} 
		CaseCatalog catalog = new CaseCatalog(); 
		catalog.setName(param.getName());
		caseCatalogDAO.addCaseCatalog(catalog);
		return catalog.getId();
	}

	@Override
	public void update(CaseCatalog param, String opUserID) throws DuplicateException {
		if (null == param || StringUtil.isEmpty(param.getName())) {
            throw new RuntimeException("更新分类入参存在空.");
		} 
		Long id = param.getId(); 
		CaseCatalog catalog = caseCatalogDAO.findById(id); 
		if(catalog==null){
			throw new RuntimeException("id not exists!");
		}
		catalog.setName(param.getName());
		catalog.setOrderNum(param.getOrderNum());
		catalog.setParentId(param.getParentId()); 
		caseCatalogDAO.updateCaseCatalog(catalog);
	}

	@Override
	public void delete(Long id, String opUserID) {
		CaseCatalog catalog = caseCatalogDAO.findById(id);
		if(catalog!=null){
			LOG.info("delete catalog, ID: " + id + ", by " + opUserID + ". catalog=[" + catalog+ "]");
			caseCatalogDAO.delCaseCatalog(id);
		}
	} 

	@Override
	public CaseCatalog findById(Long id)  { 
		return caseCatalogDAO.findById(id);
	}

	@Override
	public PageInfo<CaseCatalog> findByWhere(CaseCatalog param, Integer currentPage, Integer pageSize)  {
		CaseCatalog catalog = new CaseCatalog();
		if(param!=null){
			BeanUtils.copyProperties(param, catalog);
		}
		return caseCatalogDAO.findByWhere(catalog, currentPage, pageSize); 
	}
	
	public boolean saveCaseConf(final Long catalogId, final String confType, final List<CtConfDO> caseConfList){ 
        try {
        	transactionTemplate.execute(new TransactionCallbackWithoutResult() {
                @Override
                protected void doInTransactionWithoutResult(TransactionStatus status) {
                	caseConfDAO.deleteCtStConfByConfTypeAndSeriesType(confType, catalogId);
                	caseConfDAO.batchInsert(caseConfList);
                }
            });
        	return true;
        } catch (Exception t) {
            return false;
        } 
	}

	@Override
	public List<CaseCatalog> findAll(CaseCatalog param) { 
		return caseCatalogDAO.findByWhere(param); 
	}

}
