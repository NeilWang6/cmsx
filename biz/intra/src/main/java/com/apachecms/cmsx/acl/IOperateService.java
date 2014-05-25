package com.apachecms.cmsx.acl;

import java.util.HashSet;
import java.util.List;

import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.ResourceResult;

/**
 * 操作資源接口
 * <pre>IOperateService</pre>
 * @author lx
 */
public interface IOperateService extends IResourceService {
	/**
	 * 獲取當前系統下的全部操作資源信息
	 * @param appName
	 * @return
	 * @throws ACLException
	 */
	ResourceResult listOperates(String appName) throws ACLException;
	
	/**
	 * 獲取user當前系統下擁有權限全部操作資源信息
	 * @param appName
	 * @param user
	 * @param siteID
	 * @param isOutside
	 * @return
	 * @throws ACLException
	 */
	ResourceResult listOperates(String appName, String user, Long siteID, boolean isOutside) throws ACLException;
	
	@Deprecated
	/**
	 * 查询用户拥有的全部权限code,兼容dcms现有逻辑使用
	 * @param userID
	 * @param siteID
	 * @return
	 * @throws ACLException
	 */
	HashSet<String> listPermissionCode(String userID, List<Long> siteIDs, boolean isOutside) throws ACLException;
}