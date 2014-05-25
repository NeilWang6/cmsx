package com.apachecms.cmsx.dal.dao.impl;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.apachecms.cmsx.dal.dao.IACLResourceDAO;
import com.apachecms.cmsx.dal.dao.common.PageInfo;
import com.apachecms.cmsx.dal.dataobject.ACLResource;
 
@Resource(name="aclResourceDAO") 
public class ACLResourceDAOImpl extends SqlMapClientDaoSupport implements IACLResourceDAO {
	
	@SuppressWarnings("unchecked")
	@Override
	public List<ACLResource> getResourceCountByAppNameAndCode(String appName, String resourceCode) {
		Map<String, Object> values = new HashMap<String, Object> ();
		values.put("appName",      appName);
		values.put("resourceCode", resourceCode);
		return this.getSqlMapClientTemplate().queryForList("acl_resource.findResourceCountByAppNameAndCode", values);
	}
	
	@SuppressWarnings("unchecked")
	public List<ACLResource> findResourcesByRoleID(String appName, String resourceType, String roleID) {
		Map<String, Object> values = new HashMap<String, Object> ();
		values.put("roleID",       roleID);
		values.put("appName",      appName);
		values.put("resourceType", resourceType);
		values.put("isDelete",     "1");
		return this.getSqlMapClientTemplate().queryForList("acl_resource.findAclResourcesByRoleID", values);
	}
	
	@SuppressWarnings("unchecked")
	public PageInfo<ACLResource> findResourcesByRoleID(String roleID, ACLResource bean, int currentPage, int pageSize) {
		Map<String, Object> values = new HashMap<String, Object> ();
		values.put("roleID",       roleID);
		values.put("appName",      bean.getAppName());
		values.put("resourceType", bean.getResourceType());
		values.put("isDelete",     "1");
		
		PageInfo<ACLResource> ret = null;
		Integer count = (Integer) this.getSqlMapClientTemplate().queryForObject("acl_resource.findAclResourcesCountByRoleID", values);
		if (null == count || 0 == count) {
			return ret;
		}
		
		currentPage = (currentPage < 1) ? 1 : currentPage;
		pageSize    = 0 == pageSize ? 15 : pageSize;
		int start = (currentPage - 1) * pageSize + 1;
		int end   = currentPage * pageSize;
		values.put("start", start);
		values.put("end",   end);
		
		List<ACLResource> list = this.getSqlMapClientTemplate().queryForList("acl_resource.findAclResourcesPageByRoleID", values);
		ret = new PageInfo<ACLResource> ();
		ret.setCurrentPage(currentPage);
		ret.setPageSize(pageSize);
		ret.setAllRow(count);
		ret.setList(list);
		ret.countTotalPage(pageSize, ret.getAllRow());
		return ret;
	}
	
	@SuppressWarnings("unchecked")
	public PageInfo<ACLResource> findAclResourcesCanApply(String roleID, ACLResource bean, int currentPage, int pageSize) {
		Map<String, Object> values = new HashMap<String, Object> ();
		values.put("roleID",       roleID);
		values.put("appName",      bean.getAppName());
		values.put("resourceType", bean.getResourceType());
		values.put("isDelete",     "1");
		values.put("isWhite",      "0");
		
		PageInfo<ACLResource> ret = null;
		Integer count = (Integer) this.getSqlMapClientTemplate().queryForObject("acl_resource.findAclResourcesCountCanApply", values);
		if (null == count || 0 == count) {
			return ret;
		}
		
		currentPage = (currentPage < 1) ? 1 : currentPage;
		pageSize    = 0 == pageSize ? 15 : pageSize;
		int start = (currentPage - 1) * pageSize + 1;
		int end   = currentPage * pageSize;
		values.put("start", start);
		values.put("end",   end);
		List<ACLResource> list = this.getSqlMapClientTemplate().queryForList("acl_resource.findAclResourcesPageCanApply", values);
		ret = new PageInfo<ACLResource> ();
		ret.setCurrentPage(currentPage);
		ret.setPageSize(pageSize);
		ret.setAllRow(count);
		ret.setList(list);
		ret.countTotalPage(pageSize, ret.getAllRow());
		return ret;
	}

	/**
	 *  
	 * @param id
	 * @return
	 */
	public ACLResource findById(Object id) {
		return (ACLResource) this.getSqlMapClientTemplate().queryForObject("acl_resource.findAclResourceById", id);
	}
	
	/**
	 *  
	 * @param bean
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<ACLResource> findByWhere(ACLResource bean) {
		return this.getSqlMapClientTemplate().queryForList("acl_resource.findAclResourceByWhere", bean);
	}
	
	@SuppressWarnings("unchecked")
	public PageInfo<ACLResource> findByWhere(ACLResource bean, Integer currentPage, Integer pageSize) {
	    if(bean!=null){
	        bean.setIsDelete("1");
	    }
		PageInfo<ACLResource> ret = null;
		Integer count = (Integer) this.getSqlMapClientTemplate().queryForObject("acl_resource.findAclResourceCountByWhere", bean);
		if (null == count || 0 == count) {
			return ret;
		}
		
		currentPage = (null == currentPage || currentPage < 1) ? 1 : currentPage;
		pageSize  = null == pageSize ? 15 : pageSize;
		int start = (currentPage - 1) * pageSize + 1;
		int end   = currentPage * pageSize;
		
		Map<String, Object> values = new HashMap<String, Object> ();
		values.put("appName",  bean.getAppName());
		values.put("isDelete",     "1");
		values.put("url",          bean.getUrl());
		values.put("name",         bean.getName());
		values.put("resourceCode", bean.getResourceCode());
		values.put("start",        start);
		values.put("end",          end);
		values.put("resourceType",          bean.getResourceType());
		
		
		List<ACLResource> list = this.getSqlMapClientTemplate().queryForList("acl_resource.findAclResourcePageByWhere", values);
		ret = new PageInfo<ACLResource> ();
		ret.setCurrentPage(currentPage);
		ret.setPageSize(pageSize);
		ret.setAllRow(count);
		ret.setList(list);
		ret.countTotalPage(pageSize, ret.getAllRow());
		return ret;
	}
	
	@SuppressWarnings("unchecked")
	public List<ACLResource> findResoucesByRoles(String appName, String resourceType[], List<String> roleIDs) {
		Map<String, Object> values = new HashMap<String, Object> ();
		values.put("appName",      appName);
		if (1 == resourceType.length) {
			values.put("resourceType", resourceType[0]);
		} else {
			values.put("resourceTypes", Arrays.asList(resourceType));
		}
		values.put("isDelete",     "1");
		values.put("isWhite",      "1");
		if (1 == roleIDs.size()) {
			values.put("roleID",   roleIDs.get(0));
		} else {
			values.put("roleIDs",  roleIDs);
		}
		return this.getSqlMapClientTemplate().queryForList("acl_resource.findResoucesByRoles", values);
	}
	
	/**
	 *  
	 * @param bean
	 * @return
	 */
    public Object addAclResource(ACLResource bean) {
    	return this.getSqlMapClientTemplate().insert("acl_resource.insertAclResource", bean);
    }
    
    /**
	 *  
	 * @param bean
	 */
	public int updateAclResource(ACLResource bean) {
		return this.getSqlMapClientTemplate().update("acl_resource.updateAclResource", bean);
	}
	
	/**
	 *  
	 * @param id
	 */
	public int delAclResource(Object id) {
		return this.getSqlMapClientTemplate().delete("acl_resource.deleteAclResource", id);
	}
}