package com.apachecms.cmsx.acl;

import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.PermissionParam;
import com.apachecms.cmsx.acl.param.PermissionResult;

/**
 * 验权接口
 * @author liuxinl.lx
 */
public interface IPermissionService {
	/**
	 * 验证screen或action权限
	 *
	 * 1.action鉴权
	 *   (1).判断action是否为空,为空直接下个流程
	 *   (2).获取当前系统(如dcms)的action白名单,从tair中获取code设计为例如:DCMS_ACTION_WHITE,为空则从数据库获取，然后存入tair
	 *   (3).判断当前action是否白名单，是直接下个流程
	 *   (4).判断当前action是否需要鉴权，否则直接下个流程
	 *   (5).action鉴权,通过则下个流程，失败直接返回false
	 *
	 * 2.url鉴权
	 *   (1).判断url是否为空,为空直接返回true
	 *   (2).获取当前系统的url白名单,从tair中获取code设计为例如:DCMS_URL_WHITE,为空则从数据库获取,然后存入tair
	 *   (3).判断当前url是否白名单,是则直接返回true
	 *   (4).判断当前url是否需要鉴权,否则直接返回true
	 *   (5).url鉴权,通过返回true,否则返回false
	 *
	 *   ps: tair中缓存信息    
	 *                    永久缓存:  
	 *                    DCMS_ACTION_WHITE action对应的白名单信息                     value Map<String, ResourceInfo> key是action
	 *                    DCMS_URL_WHITE    url对应的白名单信息 包括菜单             value Map<String, ResourceInfo> key是url
	 *
	 *                    DCMS_URL_LIST
	 *                    DCMS_ACTION_LIST
	 *                    DCMS_MENU_TREE_LIST
	 *                    DCMS_MENU_LIST
	 *
	 * @param param
	 *
	 * @return
	 * @throws ACLException
	 */
	PermissionResult checkPermission(PermissionParam param) throws ACLException;
}