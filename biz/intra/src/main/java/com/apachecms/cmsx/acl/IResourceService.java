package com.apachecms.cmsx.acl;

import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.PageParam;
import com.apachecms.cmsx.acl.param.ResourceParam;

/**
 * 资源接口
 * <pre>IResourceService</pre>
 * @author lx
 */
public interface IResourceService {
	/**
	 * 创建resource
	 * @param param
	 * @param userID
	 * @throws ACLException
	 */
	void create(ResourceParam param, String userID) throws ACLException;

	/**
	 * 修改resource
	 * @param param
	 * @param userID
	 * @throws ACLException
	 */
	void update(ResourceParam param, String userID) throws ACLException;
	
	/**
	 * 删除resource
	 * 在删除resource时,需要查询判断是否当前resource还授予了某角色,如果有则抛出异常,不允许直接删除
	 * 
	 * @param resourceID
	 * @param userID
	 * @throws ACLException
	 */
	void delete(String resourceID, String userID) throws ACLException;
	
	/**
	 * 根据id查询资源
	 * @param resourceID
	 * @return
	 * @throws ACLException
	 */
	ResourceParam findById(String resourceID) throws ACLException;
	
	/**
	 * 分页查询
	 * @return
	 * @throws ACLException
	 */
	PageParam<ResourceParam> findByWhere(ResourceParam param, Integer currentPage, Integer pageSize) throws ACLException;
	
	/**
	 * 根据角色id查询
	 * @param roleID
	 * @return
	 * @throws ACLException
	 */
	public PageParam<ResourceParam> findByRoleID(String roleID, ResourceParam param, int currentPage, int pageSize, boolean isSelect) throws ACLException;
}