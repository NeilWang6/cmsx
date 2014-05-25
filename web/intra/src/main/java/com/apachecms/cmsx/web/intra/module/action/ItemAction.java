package com.apachecms.cmsx.web.intra.module.action;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.TurbineRunData;
import com.alibaba.citrus.webx.WebxException;
import com.apachecms.cmsx.biz.ItemService;
import com.apachecms.cmsx.dal.dataobject.CtItemDO;
import com.apachecms.cmsx.dal.dataobject.CtItemMetaDataDO;
import com.apachecms.cmsx.exception.DuplicateException;
import com.apachecms.cmsx.exception.NotExistsException;

public class ItemAction {
	private final Log _logger = LogFactory.getLog(ItemAction.class);
	@Autowired
	private ItemService itemService;

	public void doList(TurbineRunData rundata, Context context) throws WebxException {
		try {
			List<CtItemDO> itemList = itemService.doGetItemList();
			context.put("itemList", itemList);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void doGetItem(TurbineRunData rundata, Context context) throws WebxException {
		try {
			long id = rundata.getParameters().getLong("id");
			CtItemDO item = itemService.doGetItem(id);
			context.put("item", item);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void doAddItem(TurbineRunData rundata, Context context) throws WebxException {
		long itemId = rundata.getParameters().getLong("itemId", 0);
		String itemName = rundata.getParameters().getString("itemName", "").trim();
		String ctrlType = rundata.getParameters().getString("ctrlType", "").trim();
		int itemType = rundata.getParameters().getInt("itemType", 1);
		String ctrlSourceType = rundata.getParameters().getString("ctrlSourceType", "").trim();
		int maxLen = rundata.getParameters().getInt("maxLen");
		String format = rundata.getParameters().getString("format", "").trim();
		String attribute = rundata.getParameters().getString("attribute", "").trim();
		String ruleName = rundata.getParameters().getString("ruleName", "").trim();
		int ruleType = rundata.getParameters().getInt("ruleType");
		String actionType = rundata.getParameters().getString("actionType");

		try {
			itemService.doAddItem(itemId, itemName, ctrlType, itemType, ctrlSourceType, maxLen, format, attribute, actionType, ruleName, ruleType);
			rundata.setRedirectLocation("item_list.htm?action=ItemAction&event_submit_do_list=true");
		} catch (DuplicateException e) {
			context.put("errorMsg", "Id已存在");
			rundata.setRedirectTarget("error.vm");
		}

	}

	public void doAddItemMetadata(TurbineRunData rundata, Context context) throws WebxException {

		long itemId = rundata.getParameters().getLong("itemId", 0);
		String key = rundata.getParameters().getString("key", "").trim();
		String value = rundata.getParameters().getString("value", "").trim();
		String description = rundata.getParameters().getString("description", "").trim();
		int orderNum = rundata.getParameters().getInt("orderNum", 1);

		try {
			itemService.doAddItemMetadata(itemId, key, value, description, orderNum);
			rundata.setRedirectLocation("itemMetadata.htm?action=ItemAction&event_submit_do_showItemMetadata=true&itemId=" + rundata.getParameters().getLong("itemId", 0));
		} catch (NotExistsException nee) {
			context.put("errorMsg", "Id不存在");
			rundata.setRedirectTarget("error.vm");
		} catch (Exception e) {
			_logger.error("Error when ItemAction.doAddItemMetadata:", e);
			throw new WebxException("Error when ItemAction.doAddItemMetadata:", e);
		}
	}

	public void doUpdateItemMetadata(TurbineRunData rundata, Context context) throws WebxException {
		long id = rundata.getParameters().getLong("id", 0);
		String key = rundata.getParameters().getString("key", "").trim();
		String value = rundata.getParameters().getString("value", "").trim();
		String description = rundata.getParameters().getString("description", "").trim();
		int orderNum = rundata.getParameters().getInt("orderNum", 1);

		try {
			itemService.doUpdateItemMetadata(id, key, value, description, orderNum);
			rundata.setRedirectLocation("itemMetadata.htm?action=ItemAction&event_submit_do_showItemMetadata=true&itemId=" + rundata.getParameters().getLong("itemId", 0));
		} catch (NotExistsException nee) {
			context.put("errorMsg", "Id不存在");
			rundata.setRedirectTarget("error.vm");
		} catch (Exception e) {
			_logger.error("Error when ItemAction.doUpdateItemMetadata:", e);
			throw new WebxException("Error when ItemAction.doUpdateItemMetadata:", e);
		}
	}

	public void doDeleteItemMetadata(TurbineRunData rundata, Context context) throws WebxException {

		long id = rundata.getParameters().getLong("id", 0);
		if (id < 1) {
			return;
		}

		try {
			itemService.doDeleteItemMetadata(id);

			rundata.setRedirectLocation("itemMetadata.htm?itemId=" + rundata.getParameters().getLong("itemId", 0));
		} catch (Exception e) {
			_logger.error("Error when ItemAction.doDeleteItemMetadata:", e);
			throw new WebxException("Error when ItemAction.doDeleteItemMetadata:", e);
		}
	}

	public void doShowItemMetadata(TurbineRunData rundata, Context context) throws WebxException {
		long itemId = rundata.getParameters().getLong("itemId", 0);
		long id = rundata.getParameters().getLong("id", 0);
		try {

			List<CtItemMetaDataDO> itemMetadataList = itemService.doGetItemMetadata(itemId);
			CtItemMetaDataDO itemMetadata = itemService.doGetItemMetadataById(id);

			context.put("itemMetadataList", itemMetadataList);
			context.put("itemMetadata", itemMetadata);
			context.put("itemId", itemId);
			context.put("id", id);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
