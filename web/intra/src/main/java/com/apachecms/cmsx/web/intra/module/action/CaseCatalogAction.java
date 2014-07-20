package com.apachecms.cmsx.web.intra.module.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.service.uribroker.URIBrokerService;
import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.Navigator;
import com.alibaba.citrus.turbine.TurbineRunData;
import com.alibaba.citrus.turbine.dataresolver.Param;
import com.alibaba.citrus.util.Paginator;
import com.alibaba.citrus.util.StringUtil;
import com.alibaba.citrus.webx.WebxException;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.biz.CaseCatalogService;
import com.apachecms.cmsx.common.AuthToken;
import com.apachecms.cmsx.common.BizConstant;
import com.apachecms.cmsx.dal.dao.CtConfDAO;
import com.apachecms.cmsx.dal.dao.CtItemDAO;
import com.apachecms.cmsx.dal.dao.common.PageInfo;
import com.apachecms.cmsx.dal.dataobject.CaseCatalog;
import com.apachecms.cmsx.dal.dataobject.CtConfDO;
import com.apachecms.cmsx.dal.dataobject.CtItemDO;
import com.apachecms.cmsx.web.common.action.BaseAction;
import com.apachecms.cmsx.web.common.util.CommonUtil;

public class CaseCatalogAction extends BaseAction {
	private static final Log LOG = LogFactory.getLog(CaseCatalogAction.class);

	private static final int PAGE_SIZE = 1000;
	private static final String FG_TYPE = "fgType";
	private static final String ORDER_NUM = "orderNum";
	private static final String IS_NEED = "isNeed";
	private static final String IS_HIDDEN = "isHidden";
	private static final String IS_ENABLE = "isEnable";
	private static final String DEFAULT_VALUE = "defaultValue";
	private static final String TIPS = "tips";
	public static final String SEPARATOR_CHAR = "_";

	@Autowired
	private URIBrokerService uriBrokerService;
	@Autowired
	private CaseCatalogService caseCatalogService;
	@Autowired
	private CtItemDAO ctItemDAO;
	@Autowired
	private CtConfDAO ctConfDAO;

	/**
	 * @param rundata
	 * @param context
	 * @throws WebxException
	 */

	public void doList(TurbineRunData rundata, Context context) throws WebxException {
		Integer currentPage = rundata.getParameters().getInt("page", 1);
		Integer pageSize = rundata.getParameters().getInt("pageSize", PAGE_SIZE);
		String name = rundata.getParameters().getString("name");
		if (pageSize.intValue() <= 0) {
			pageSize = PAGE_SIZE;
		}
		Paginator paginator = new Paginator(PAGE_SIZE);
		paginator.setPage(currentPage);
		try {
			CaseCatalog param = new CaseCatalog();
			param.setName(name);

			PageInfo<CaseCatalog> data = caseCatalogService.findByWhere(param, currentPage, pageSize);
			int count = 0;
			List<CaseCatalog> list = new ArrayList<CaseCatalog>();
			if (data != null) {
				count = data.getAllRow();
				list = data.getList();
			}
			paginator.setItems(count);
			context.put("list", list);
			context.put("paginator", paginator);
			context.put("name", name);
			Map catalogMap = new HashMap();
			catalogMap.put(0L, "顶级分类");
			if(list!=null){
				for(CaseCatalog cata:list){
					catalogMap.put(cata.getId(), cata.getName());
				}
			}
			context.put("catalogMap", catalogMap);
		} catch (Exception e) {
			LOG.error("system error", e);
			rundata.setRedirectTarget("error.vm");
		}
	}

	public void doGet(TurbineRunData rundata, Context context) throws WebxException {
		Long id = rundata.getParameters().getLong("id");
		if (id != null && id.longValue() > 0) {
			try {
				CaseCatalog data = caseCatalogService.findById(id);
				context.put("data", data);
			} catch (Exception e) {
				LOG.error("system error", e);
			}
		}
		 
		List<CaseCatalog> list = caseCatalogService.findAll(null); 
		context.put("list", list);
	}

	public void doSaveOrUpdate(TurbineRunData rundata, Context context, @Param("id") Long id, @Param("name") String name,@Param("parentId") Long parentId, @Param("orderNum") Integer orderNum) throws WebxException {
		AuthToken authToken = CommonUtil.getAuthToken(rundata.getRequest());
		try {
			CaseCatalog data = new CaseCatalog();
			data.setId(id);
			data.setName(name);
			data.setParentId(parentId);
			data.setOrderNum(orderNum);

			if (data.getId() == null || data.getId().longValue() <= 0) {
				caseCatalogService.create(data, authToken.getUserId());
			} else {
				caseCatalogService.update(data, authToken.getUserId());
			}
			context.put("json", retJson(data.getId(), SUCCESS, ""));
		} catch (Exception e) {
			LOG.error(e.getMessage(), e);
			context.put("msg", e.getMessage());
			context.put("json", retJson(null, FAIL, e.getMessage()));
		}
	}

	/**
	 * 删除角色, 跟新状态
	 * 
	 * @param rundata
	 * @param context
	 * @throws WebxException
	 */
	public void doDel(TurbineRunData rundata, Context context, @Param(name = "id", defaultValue = "0") Long id) throws WebxException {
		AuthToken authToken = CommonUtil.getAuthToken(rundata.getRequest());
		if (id == null || id.longValue() <= 0) {
			return;
		}
		try {
			caseCatalogService.delete(id, authToken.getUserId());
			context.put("json", retJson(null, SUCCESS, ""));
		} catch (Exception e) {
			LOG.error(e.getMessage(), e);
			context.put("json", retJson(null, FAIL, e.getMessage()));
		}
	}

	public void doGetItem2Catalog(TurbineRunData rundata, Context context) throws WebxException {
		Long catalogId = rundata.getParameters().getLong("catalogId", 0L);
		try {
			CaseCatalog param = new CaseCatalog();
			PageInfo<CaseCatalog> pageInfo = caseCatalogService.findByWhere(param, 1, 500);
			if (pageInfo != null) {
				context.put("catalogList", pageInfo.getList());
			}
			List<CtConfDO> conflist = ctConfDAO.loadCtStConf(BizConstant.CONF_TYPE_CASE, catalogId);
			List<CtItemDO> itemList = ctItemDAO.getAllItemList();
			context.put("stConfList", conflist);
			context.put("itemList", itemList);
			List<CtItemDO> itemTempList = new ArrayList<CtItemDO>();
            Map<Long, String> itemMap = new HashMap<Long, String>();
            for (CtItemDO item : itemList) {
                itemMap.put(item.getId(), item.getName());
                for (CtConfDO stConf : conflist) {
                    if (item.getId().intValue() == stConf.getItemId().intValue()) {
                        itemTempList.add(item);
                    }
                }
            } 
            itemList.removeAll(itemTempList);
			context.put("itemMap", itemMap);
		} catch (Exception e) {
			e.printStackTrace();
			LOG.error(e.getMessage(), e);
		}
		context.put("catalogId", catalogId);
	}

	public void doSaveCaseConf(TurbineRunData rundata, Context context, Navigator nav, @Param("catalogId") Long catalogId) throws WebxException {
		String confType = rundata.getParameters().getString("confType", BizConstant.CONF_TYPE_CASE);
		long[] itemIds = rundata.getParameters().getLongs("itemId");
		List<CtConfDO> caseConfList = getStConfList(catalogId, confType, itemIds, rundata);

		caseCatalogService.saveCaseConf(catalogId, confType, caseConfList);
		nav.redirectTo("intraModule").withTarget("item2CaseCatalog").withParameter("action", "CaseCatalogAction").withParameter("event_submit_do_get_item_2_catalog", "true").withParameter("catalogId", catalogId.toString()).withParameter("success", "true");
	}

	@SuppressWarnings("unchecked")
	private List<CtConfDO> getStConfList(Long catalogId, String confType, long[] itemIds, TurbineRunData rundata) {
		List<CtConfDO> stConfList = new ArrayList<CtConfDO>();
		Set<String> paramKeys = rundata.getParameters().keySet();

		for (long itemId : itemIds) {
			CtConfDO stConf = new CtConfDO();
			stConf.setItemId(itemId);
			stConf.setCatalogId(catalogId);
			stConf.setConfType(confType);
			for (String key : paramKeys) {
				if (key.startsWith(FG_TYPE)) {
					String id = StringUtil.substringAfter(key, FG_TYPE + SEPARATOR_CHAR);
					if (Long.valueOf(id) == itemId) {
						stConf.setFgType(rundata.getParameters().getString(key));
					}
				}

				if (key.startsWith(ORDER_NUM)) {
					String id = StringUtil.substringAfter(key, ORDER_NUM + SEPARATOR_CHAR);
					if (Long.valueOf(id) == itemId) {
						stConf.setOrderNum(rundata.getParameters().getInt(key));
					}
				}

				if (key.startsWith(IS_NEED)) {
					String id = StringUtil.substringAfter(key, IS_NEED + SEPARATOR_CHAR);
					if (Long.valueOf(id) == itemId) {
						stConf.setIsNeed(rundata.getParameters().getString(key));
					}
				}

				if (key.startsWith(IS_HIDDEN)) {
					String id = StringUtil.substringAfter(key, IS_HIDDEN + SEPARATOR_CHAR);
					if (Long.valueOf(id) == itemId) {
						stConf.setIsHidden(rundata.getParameters().getString(key));
					}
				}
				if (key.startsWith(IS_ENABLE)) {
					String id = StringUtil.substringAfter(key, IS_ENABLE + SEPARATOR_CHAR);
					if (Long.valueOf(id) == itemId) {
						stConf.setIsEnable(rundata.getParameters().getString(key));
					}
				}

				if (key.startsWith(DEFAULT_VALUE)) {
					String id = StringUtil.substringAfter(key, DEFAULT_VALUE + SEPARATOR_CHAR);
					if (Long.valueOf(id) == itemId) {
						stConf.setDefaultValue(rundata.getParameters().getString(key));
					}
				}
				if (key.startsWith(TIPS)) {
					String id = StringUtil.substringAfter(key, TIPS + SEPARATOR_CHAR);
					if (Long.valueOf(id) == itemId) {
						stConf.setTips(rundata.getParameters().getString(key));
					}
				}
			}
			stConfList.add(stConf);
		}
		return stConfList;
	}
}
