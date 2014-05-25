package com.apachecms.cmsx.biz.imp;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.apachecms.cmsx.biz.ItemService;
import com.apachecms.cmsx.dal.dao.CtItemDAO;
import com.apachecms.cmsx.dal.dao.CtItemMetaDataDAO;
import com.apachecms.cmsx.dal.dataobject.CtItemDO;
import com.apachecms.cmsx.dal.dataobject.CtItemMetaDataDO;
import com.apachecms.cmsx.exception.DuplicateException;
import com.apachecms.cmsx.exception.NotExistsException;

@Resource(name="ItemService")
public class ItemServiceImpl implements ItemService{
	private static final Log _logger = LogFactory.getLog(ItemServiceImpl.class);

	// 控件
	@Autowired
	protected CtItemDAO ctItemDAO;
	// 控件Meta数据
	@Autowired
	protected CtItemMetaDataDAO ctItemMetaDataDAO;

	/**
	 * 创建控件
	 * 
	 * @return
	 */
	public CtItemDO doAddItem(long itemId, String itemName, String ctrlType, int itemType, String ctrlSourceType, int maxLen, String format, String attribute, String actionType, String ruleName, Integer ruleType) throws DuplicateException {

		if (itemId > 0 && StringUtils.isBlank(actionType)) {
			CtItemDO itemDO = ctItemDAO.getItemById(itemId);
			if (itemDO != null) {
				throw new DuplicateException("itemId exists:" + itemId);
			}
		}
		try {
			CtItemDO item = new CtItemDO();
			item.setId(itemId);
			item.setName(itemName);
			item.setCtrlType(ctrlType);
			item.setCtrlSourceType(ctrlSourceType);
			item.setItemType(itemType);
			item.setMaxLen(maxLen);
			item.setFormat(format);
			item.setAttribute(attribute);
			item.setRuleName(ruleName);
			item.setRuleType(ruleType);
			if (StringUtils.isNotBlank(actionType)) {
				ctItemDAO.updateItem(item);
			} else {
				ctItemDAO.insert(item);
			}
			return item;
		} catch (Exception e) {
			_logger.error("EnrollAO.doAddItem error.", e);
			return null;
		}
	}

	/**
	 * 获取控件信息
	 */
	public CtItemDO doGetItem(long id) {
		return ctItemDAO.getItemById(id);
	}

	/**
	 * 获取控件列表
	 * 
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<CtItemDO> doGetItemList() {
		return ctItemDAO.getAllItemList();
	}

	public CtItemMetaDataDO doGetItemMetadataById(long id) {
		return ctItemMetaDataDAO.getItemMetadataById(id);
	}

	/**
	 * 获取item的metadata
	 * 
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<CtItemMetaDataDO> doGetItemMetadata(long itemId) {
		List<Long> itemIdList = new ArrayList<Long>();
		itemIdList.add(itemId);
		return ctItemMetaDataDAO.getCtItemMetaData(itemIdList);
	}

	/**
	 * item的metadata
	 * 
	 * @return
	 */
	public CtItemMetaDataDO doAddItemMetadata(long itemId, String key, String value, String description, int orderNum) throws NotExistsException {

		if (itemId > 0) {
			CtItemDO itemDO = ctItemDAO.getItemById(itemId);
			if (itemDO == null) {
				throw new NotExistsException("ITEM_ID_NOT_EXIST");
			}
		} else {
			throw new NotExistsException("ITEM_ID_NOT_EXIST");
		}

		CtItemMetaDataDO itemMetadata = new CtItemMetaDataDO();
		itemMetadata.setItemId(itemId);
		itemMetadata.setMetadataKey(key);
		itemMetadata.setValue(value);
		itemMetadata.setDescription(description);
		itemMetadata.setOrderNum(orderNum);
		ctItemMetaDataDAO.insert(itemMetadata);

		return itemMetadata;
	}

	public void doUpdateItemMetadata(long id, String key, String value, String description, int orderNum) throws NotExistsException {

		CtItemMetaDataDO itemMetaData = null;
		if (id > 0) {
			itemMetaData = ctItemMetaDataDAO.getItemMetadataById(id);
		}
		if (itemMetaData == null) {
			throw new NotExistsException("ITEM_METADATA_ID_NOT_EXIST");
		}

		CtItemMetaDataDO itemMetadata = new CtItemMetaDataDO();
		itemMetadata.setId(id);
		itemMetadata.setMetadataKey(key);
		itemMetadata.setValue(value);
		itemMetadata.setDescription(description);
		itemMetadata.setOrderNum(orderNum);
		ctItemMetaDataDAO.update(itemMetadata);
	}

	public void doDeleteItemMetadata(long id) {
		ctItemMetaDataDAO.delete(id);
	}
}
