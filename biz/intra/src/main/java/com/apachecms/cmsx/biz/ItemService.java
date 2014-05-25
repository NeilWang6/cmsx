package com.apachecms.cmsx.biz;

import java.util.List;

import com.apachecms.cmsx.dal.dataobject.CtItemDO;
import com.apachecms.cmsx.dal.dataobject.CtItemMetaDataDO;
import com.apachecms.cmsx.exception.DuplicateException;
import com.apachecms.cmsx.exception.NotExistsException;

public interface ItemService {
	public CtItemDO doAddItem(long itemId, String itemName, String ctrlType, int itemType, String ctrlSourceType, int maxLen, String format, String attribute, String actionType, String ruleName, Integer ruleType) throws DuplicateException;

	public CtItemDO doGetItem(long id);

	public List<CtItemDO> doGetItemList();

	public CtItemMetaDataDO doGetItemMetadataById(long id);

	public List<CtItemMetaDataDO> doGetItemMetadata(long itemId);

	public CtItemMetaDataDO doAddItemMetadata(long itemId, String key, String value, String description, int orderNum) throws NotExistsException;

	public void doUpdateItemMetadata(long id, String key, String value, String description, int orderNum) throws NotExistsException;

	public void doDeleteItemMetadata(long id);
}
