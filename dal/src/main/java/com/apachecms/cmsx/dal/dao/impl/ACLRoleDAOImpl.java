package com.apachecms.cmsx.dal.dao.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.apachecms.cmsx.dal.dao.IACLRoleDAO;
import com.apachecms.cmsx.dal.dataobject.ACLRole;
import com.apachecms.cmsx.dal.dataobject.ACLRoleResource;
import com.apachecms.cmsx.dal.dataobject.ACLSiteRole;

@SuppressWarnings("unchecked")
@Resource(name="aclRoleDAO")
public class ACLRoleDAOImpl extends SqlMapClientDaoSupport implements IACLRoleDAO {

	/**
	 * @param id
	 * @return
	 */
	public ACLRole findById(Object id) {
		return (ACLRole) this.getSqlMapClientTemplate().queryForObject("acl_role.findACLRoleBeanById", id);
	}
	
	public int findRolesByIds(List<String> roles) {
		Map<String, Object> values = new HashMap<String, Object> ();
		values.put("isDelete", PASS);
		values.put("roleIDs", roles);
		return (Integer) this.getSqlMapClientTemplate().queryForObject("acl_role.findACLRolesByIDs", values);
	}
	
	/**
	 * @param bean
	 * @return
	 */
	public List<ACLRole> findByWhere(ACLRole bean) {
		return this.getSqlMapClientTemplate().queryForList("acl_role.findACLRoleBeanByWhere", bean);
	}
	
	/**
	 * @param bean
	 * @return
	 */
    public Object addACLRoleBean(ACLRole bean) {
    	return this.getSqlMapClientTemplate().insert("acl_role.insertACLRoleBean", bean);
    }
    
    /**
	 * @param bean
	 */
	public int updateACLRoleBean(ACLRole bean) {
		return this.getSqlMapClientTemplate().update("acl_role.updateACLRoleBean", bean);
	}
	
	/**
	 * @param id
	 */
	public int delACLRoleBean(Object id) {
		return this.getSqlMapClientTemplate().delete("acl_role.deleteACLRoleBean", id);
	}
	
	private static final String PASS      = "1";
	private static final String IS_DELETE = "1";

	@Override
	public List<ACLSiteRole> findRoleBySiteAndUser(long siteID, String userID) {
		Map<String, Object> values = new HashMap<String, Object> ();
		values.put("status", PASS);
		values.put("isDelete", IS_DELETE);
		List<Long> siteIDs = new ArrayList<Long> (2);
		siteIDs.add(siteID);
		siteIDs.add(-1L);
		values.put("siteIDs", siteIDs);
		values.put("userID", userID);
		return this.getSqlMapClientTemplate().queryForList("acl_role.findRoleBySiteAndUser", values);
	}
	
	@Override
	public List<ACLRoleResource> findResourceByRoles(String appName, List<String> roleIDs) {
		Map<String, Object> values = new HashMap<String, Object>();
		values.put("isDelete", PASS);
		values.put("appName", appName);
		if (1 == roleIDs.size()) {
			values.put("roleID", roleIDs.get(0));
		} else {
			values.put("roleIDs", roleIDs);
		}
		return this.getSqlMapClientTemplate().queryForList("acl_role.findResourceByRoles", values);
	}

	@Override
	public List<ACLRole> getAllRoles() {
		ACLRole aclRole = new ACLRole();
		aclRole.setIsDelete(PASS);
		return this.getSqlMapClientTemplate().queryForList("acl_role.findACLRoleBeanByWhere", aclRole);
	}
	
	private static final List<String> STATUS = new ArrayList<String> (2);
	static {
		STATUS.add("0");
		STATUS.add("1");
	}
	
	@Override
	public List<ACLRole> canApplyRoles(long siteID, String userID, String isOutsite) {
		Map<String, Object> values = new HashMap<String, Object> ();
		values.put("status",    STATUS);
		values.put("userID",    userID);
		values.put("siteID",    siteID);
		values.put("isDelete",  "1");
		values.put("lev",       1);
		values.put("isOutsite", isOutsite);
		return this.getSqlMapClientTemplate().queryForList("acl_role.findACLRolesCanApply", values);
	}

	@Override
	public List<ACLSiteRole> getSiteAndRolesByUserID(String userID, String isOutsite, String status) {
		Map<String, Object> values = new HashMap<String, Object> ();
		values.put("userID",  userID);
		values.put("outSite", isOutsite);
		values.put("siteID",  "-1");
		values.put("isDelete", "1");
		if (StringUtils.isNotEmpty(status)) {
			values.put("status", status);
		}
		return this.getSqlMapClientTemplate().queryForList("acl_role.findSiteAndRolesByUserID", values);
	}
	
	@Override
	public List<ACLSiteRole> getAllSiteManager(List<Long> siteIDs) {
		Map<String, Object> values = new HashMap<String, Object> ();
		values.put("isDelete", "1");
		values.put("lev",      10);
		values.put("status",   "1");
		if (null != siteIDs && siteIDs.size() > 0) {
			values.put("siteIDs", siteIDs);
		} else {
			values.put("siteID",   "-1");
		}
		return this.getSqlMapClientTemplate().queryForList("acl_role.findAllSiteManager", values);
	}
}