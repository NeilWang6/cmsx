package com.apachecms.cmsx.dal.dao.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.apachecms.cmsx.dal.dao.IACLPermssionDAO;
import com.apachecms.cmsx.dal.dao.common.PageInfo;
import com.apachecms.cmsx.dal.dataobject.ACLRoleResources;
import com.apachecms.cmsx.dal.dataobject.ACLUserSiteRole;

@SuppressWarnings("unchecked")
/**
 * @author liuxinl.lx
 */
@Resource(name="aclPermssionDAO")
public class ACLPermssionDAOImpl extends SqlMapClientDaoSupport implements IACLPermssionDAO {
	
	public Object addAclRoleResources(ACLRoleResources bean) {
		return this.getSqlMapClientTemplate().insert("acl_role_resource.insertAclRoleResources", bean);
	}
	
	public int delAclRoleResources(String id) {
		return this.getSqlMapClientTemplate().delete("acl_role_resource.deleteAclRoleResources", id);
	}
	
    public int delAclRoleResources(String roleID, String permission) {
    	Map<String, Object> values = new HashMap<String, Object> ();
		values.put("roleID",     roleID);
		values.put("permission", permission);
		return this.getSqlMapClientTemplate().delete("acl_role_resource.deleteAclRoleResourceByRoleIDAndResourceCode", values);
	}

	@Override
	public Object addAclUserSiteRole(ACLUserSiteRole bean) {
		return this.getSqlMapClientTemplate().insert("acl_user_site_role.insertACLUserSiteRole", bean);
	}
	
	public int updateAclUserSiteRole(ACLUserSiteRole bean) {
		return this.getSqlMapClientTemplate().update("acl_user_site_role.updateACLUserSiteRole", bean);
	}
	
	public List<ACLUserSiteRole> findUserIDandSiteIDByIDs(List<String> ids) {
		Map<String, Object> values = new HashMap<String, Object>() ;
		values.put("ids", ids);
		return this.getSqlMapClientTemplate().queryForList("acl_user_site_role.findUserIDandSiteIDByIDs", values);
	}
	
	@Override
	public List<ACLUserSiteRole> findRolesBySiteAndUser(long siteID, String userID, boolean isOutSite, String status) {
		List<Long> siteIDs = new ArrayList<Long> (2);
		siteIDs.add(-1L);
		siteIDs.add(siteID);
		return this.findRolesBySitesAndUser(siteIDs, userID, isOutSite, status);
	}
	
	public List<ACLUserSiteRole> findRolesBySitesAndUser(List<Long> siteIDs, String userID, boolean isOutSite, String status) {
		Map<String, Object> values = new HashMap<String, Object> ();
		values.put("isDelete", "1");
		if (StringUtils.isNotEmpty(status)) {
			values.put("status", status);
		}
		values.put("isOutSite", isOutSite ? "1" : "0");
		siteIDs.add(-1L);
		values.put("siteIDs", siteIDs);
		values.put("userID", userID);
		return this.getSqlMapClientTemplate().queryForList("acl_user_site_role.findRolesBySiteAndUser", values);
	}
	
	/**
	 * @param siteID
	 * @param status
	 * @param startDate
	 * @param endDate
	 * @return
	 */
	public PageInfo<ACLUserSiteRole> findRolesBySite(Map<String, Object> values) {
		PageInfo<ACLUserSiteRole> ret = null;
		if (null == values) {
			return ret;
		}

		Integer count = (Integer) this.getSqlMapClientTemplate().queryForObject("acl_user_site_role.findRolesBySiteCount", values);
		if (null == count || 0 == count) {
			return ret;
		}

		Integer currentPage = (Integer) values.get("currentPage");
		currentPage = (null == currentPage || currentPage < 1) ? 1 : currentPage;
		Integer pageSize    = (Integer) values.get("pageSize");
		pageSize  = null == pageSize ? 15 : pageSize;
		int start = (currentPage - 1) * pageSize + 1;
		int end   = currentPage * pageSize;
		values.put("start", start);
		values.put("end",   end);
		List<ACLUserSiteRole> list = this.getSqlMapClientTemplate().queryForList("acl_user_site_role.findRolesBySite", values);
		ret = new PageInfo<ACLUserSiteRole> ();
		ret.setCurrentPage(currentPage);
		ret.setPageSize(pageSize);
		ret.setAllRow(count);
		ret.setList(list);
		ret.countTotalPage(pageSize, ret.getAllRow());
		return ret;
	}

	@Override
	public int existRolesCount(List<Long> siteIDs, String userID, List<String> roleIDs) {
		Map<String, Object> values = new HashMap<String, Object> ();
		if (1 == siteIDs.size()) {
			values.put("siteID",  siteIDs.get(0));
		} else {
			values.put("siteIDs", siteIDs);
		}
		values.put("userID", userID);
		if (1 == roleIDs.size()) {
			values.put("roleID",  roleIDs.get(0));
		} else {
			values.put("roleIDs", roleIDs);
		}
		values.put("status", "1");
		return (Integer) this.getSqlMapClientTemplate().queryForObject("acl_user_site_role.existRolesCount", values);
	}
}