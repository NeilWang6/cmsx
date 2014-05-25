package com.apachecms.cmsx.acl;

import java.util.List;
import java.util.Map;

import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.RoleParam;
import com.apachecms.cmsx.acl.param.SiteRoleParam;
import com.apachecms.cmsx.acl.param.SiteRolesParam;
import com.apachecms.cmsx.acl.param.UserParam;

/**
 * 创建角色,移除权限
 * <pre>IRoleService</pre>
 * @author liuxinl.lx
 */
public interface IRoleService {
	/**
	 * 根据id查询角色
	 * @param id
	 * @return
	 */
	RoleParam getRoleByID(String id) throws ACLException;
	/**
	 * 查询全部角色
	 * @return
	 */
	List<RoleParam> getAllRoles();
	
	/**
	 * 查询当前用户对应的全部站点拥有的角色
	 * @param userID
	 * @param isOutsite
	 * @return
	 * @throws ACLException
	 */
	SiteRolesParam getSiteAndRolesByUserID(String userID, boolean isOutsite) throws ACLException;
	
	/**
	 * @param userID
	 * @param isOutsite
	 * @param status
	 * @return
	 * @throws ACLException
	 */
	public Map<Long, SiteRoleParam> getSiteAndRolesByUserIDAndStatus(String userID, boolean isOutsite, String status) throws ACLException;
	
	/**
	 * 查询站点对应的站点管理员
	 * @return
	 * @throws ACLException
	 */
	Map<Long, List<UserParam>> getAllSiteManager(List<Long> siteIDs) throws ACLException;
	
	/**
	 * 创建角色
	 * @param info
	 * @throws ACLException
	 */
	void createRole(RoleParam param) throws ACLException;
	
	/**
	 * 创建角色
	 * @param param
	 * @param userID
	 * @throws ACLException
	 */
	void createRole(RoleParam param, String userID) throws ACLException;
	
	/**
	 * 修改角色
	 * @param param
	 * @throws ACLException
	 */
	void updateRole(RoleParam param) throws ACLException;
	
	/**
	 * 修改角色
	 * @param param
	 * @param userID
	 * @throws ACLException
	 */
	void updateRole(RoleParam param, String userID) throws ACLException;
	
	/**
	 * 根据角色标示<pre>code</pre>删除角色
	 * @param id
	 * @throws ACLException
	 */
	void delRole(String id) throws ACLException;
}