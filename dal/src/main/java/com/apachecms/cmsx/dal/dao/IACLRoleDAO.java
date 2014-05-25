package com.apachecms.cmsx.dal.dao;

import java.util.List;

import com.apachecms.cmsx.dal.dataobject.ACLRole;
import com.apachecms.cmsx.dal.dataobject.ACLRoleResource;
import com.apachecms.cmsx.dal.dataobject.ACLSiteRole;

public interface IACLRoleDAO {
	/**
	 * 查询全部角色
	 * 
	 * @return
	 */
	public List<ACLRole> getAllRoles();

	/**
	 * 用户在当前站点下还能申请的角色
	 * 
	 * @param siteID
	 * @param userID
	 * @param isOutsite
	 * @return
	 */
	public List<ACLRole> canApplyRoles(long siteID, String userID, String isOutsite);

	/**
	 * 查询当前用户对应的全部站点拥有的角色
	 * 
	 * @param userID
	 * @param isOutsite
	 * @return
	 */
	public List<ACLSiteRole> getSiteAndRolesByUserID(String userID, String isOutsite, String status);

	/**
	 * 查询站点对应的站点管理员
	 * 
	 * @param userID
	 * @param isOutsite
	 * @return
	 */
	public List<ACLSiteRole> getAllSiteManager(List<Long> siteIDs);

	/**
	 * 根据角色id查询存在的角色个数
	 * 
	 * @param roles
	 * @return
	 */
	public int findRolesByIds(List<String> roles);

	/**
	 * @param siteID
	 * @param userID
	 * @return
	 */
	public List<ACLSiteRole> findRoleBySiteAndUser(long siteID, String userID);

	/**
	 * 根据角色查询当前系统下的授权资源
	 * 
	 * @param appName
	 * @param roleIDs
	 * @return
	 */
	public List<ACLRoleResource> findResourceByRoles(String appName, List<String> roleIDs);

	/**
	 * @param id
	 * @return
	 */
	public ACLRole findById(Object id);

	/**
	 * @param bean
	 * @return
	 */
	public List<ACLRole> findByWhere(ACLRole bean);

	/**
	 * @param bean
	 * @return
	 */
	public Object addACLRoleBean(ACLRole bean);

	/**
	 * @param bean
	 */
	public int updateACLRoleBean(ACLRole bean);

	/**
	 * @param id
	 */
	public int delACLRoleBean(Object id);
}