package com.apachecms.cmsx.dal.dao;

import java.util.List;

import com.apachecms.cmsx.dal.dao.common.PageInfo;
import com.apachecms.cmsx.dal.dataobject.ACLResource;

public interface IACLResourceDAO {

	/**
	 * 根据系统和code查询资源是否存在
	 * 
	 * @param appName
	 * @param resourceCode
	 * @return
	 */
	public List<ACLResource> getResourceCountByAppNameAndCode(String appName, String resourceCode);

	/**
	 * 根据角色id查询资源
	 * 
	 * @param roleID
	 * @return
	 */
	public List<ACLResource> findResourcesByRoleID(String appName, String resourceType, String roleID);

	/**
	 * 根据角色id查询资源
	 * 
	 * @param roleID
	 * @param bean
	 * @param currentPage
	 * @param pageSize
	 * @return
	 */
	public PageInfo<ACLResource> findResourcesByRoleID(String roleID, ACLResource bean, int currentPage, int pageSize);

	/**
	 * 还能申请的资源
	 * 
	 * @param roleID
	 * @param bean
	 * @param currentPage
	 * @param pageSize
	 * @return
	 */
	public PageInfo<ACLResource> findAclResourcesCanApply(String roleID, ACLResource bean, int currentPage, int pageSize);

	public ACLResource findById(Object id);

	public List<ACLResource> findByWhere(ACLResource bean);

	/**
	 * 分页查询
	 * 
	 * @param bean
	 * @param currentPage
	 * @param pageSize
	 * @return
	 */
	public PageInfo<ACLResource> findByWhere(ACLResource bean, Integer currentPage, Integer pageSize);

	public Object addAclResource(ACLResource bean);

	public int updateAclResource(ACLResource bean);

	public int delAclResource(Object id);

	/**
	 * @param appName
	 * @param resourceType
	 * @param roleIDs
	 * @return
	 */
	public List<ACLResource> findResoucesByRoles(String appName, String resourceType[], List<String> roleIDs);
}