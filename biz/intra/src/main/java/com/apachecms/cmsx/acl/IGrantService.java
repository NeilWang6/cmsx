package com.apachecms.cmsx.acl;

import java.util.List;

import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.ApplyRoleParam;
import com.apachecms.cmsx.acl.param.PageParam;

/**
 * 授权接口
 * <pre>IGrantService</pre>
 * @author lx
 */
public interface IGrantService {
	/**
	 * 查询当前站点下所有申请的角色
	 * @param siteID
	 * @param userID
	 * @param isHandle 是否处理
	 * @param start
	 * @param end
	 * @return
	 * @throws ACLException
	 */
	PageParam<ApplyRoleParam> getApplyRoles(Long siteID, String userID, Boolean isHandle, Integer currentPage, String start, String end) throws ACLException;
	
	/**
	 * 审核权限
	 * @param ids 站点用户表id集合
	 * @param userID
	 * @param status
	 * @param msg
	 * @param appName
	 * @throws ACLException
	 */
	void addRoles2User(String[] ids, String status, String msg, String userID, String appName) throws ACLException;
	
	/**
	 * 移除权限
	 * @param ids 站点用户表id集合
	 * @param userID
	 * @throws ACLException
	 */
	void delRoles2User(String ids[], String userID) throws ACLException;

	/**
	 * 授予用户角色
	 * 
	 * 1.判断是否增量授权
	 *   是:直接后续流程
	 *   否:查询用户拥有的角色,存在则将其移除,没有则继续
	 * 2.将入参的角色集合授予当前用户  
	 * 
	 * @param user
	 * @param roles
	 * @param siteID
	 * @param incremental
	 * @throws ACLException
	 */
	@Deprecated
	void addRoles2User(String userID, List<String> roles, Long siteID) throws ACLException;
	
	/**
	 * 移除用户角色
	 * @param user
	 * @param roles
	 * @param siteID
	 * @throws ACLException
	 */
	@Deprecated
	void delRoles2User(String user, long siteID, List<String> roles) throws ACLException;

	/**
	 * 授予角色权限
	 * ps:约定这里的每一个权限对应一个菜单,所以这里权限集合里面的每一个权限都对应一个菜单,所以实际是将菜单授予该角色
	 * 即角色能够访问菜单的权限
	 * 
	 * 1.判断是否增量授权
	 *   是:直接后续流程
	 *   否:查询当前角色拥有的权限,如果当前角色存在权限则全部移除,没有则继续
	 * 2.将入参的权限集合授予当前角色
	 * 
	 * @param roleID
	 * @param permissions
	 * @param userID
	 * @throws ACLException
	 */
	void addPermissions2Role(String roleID, List<String> permissions, String userID) throws ACLException;
	
	/**
	 * 回收角色下的权限
	 * @param roleCode
	 * @param permissions
	 * @throws ACLException
	 */
	void delPermissions2Role(String roleID, List<String> permissions) throws ACLException;
	
	/**
	 * 回收角色下的权限
	 * @param ids
	 * @throws ACLException
	 */
	void delPermissions2Role(String ids[]) throws ACLException;
}