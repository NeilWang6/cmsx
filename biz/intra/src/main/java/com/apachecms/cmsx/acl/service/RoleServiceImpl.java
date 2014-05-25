package com.apachecms.cmsx.acl.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.util.StringUtil;
import com.apachecms.cmsx.acl.IRoleService;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.RoleParam;
import com.apachecms.cmsx.acl.param.SiteRoleParam;
import com.apachecms.cmsx.acl.param.SiteRolesParam;
import com.apachecms.cmsx.acl.param.UserParam;
import com.apachecms.cmsx.acl.service.util.SnoGerUtil;
import com.apachecms.cmsx.dal.dao.IACLRoleDAO;
import com.apachecms.cmsx.dal.dataobject.ACLRole;
import com.apachecms.cmsx.dal.dataobject.ACLSiteRole;
//import com.alibaba.china.cms.server.acl.param.UserParam;

/**
 * 角色实现 
 * @author qinming.zhengqm
 */
@Resource(name="roleService")
public class RoleServiceImpl implements IRoleService {
	private static final Log LOG = LogFactory.getLog(RoleServiceImpl.class);
	// 角色接口
	@Autowired
	private IACLRoleDAO aclRoleDAO;

	@Override
	public void createRole(RoleParam param) throws ACLException {
		this.createRole(param, "system");
	}

	@Override
	public void createRole(RoleParam param, String userID) throws ACLException {
		String name;
		Long lev;
		String isOutsite;
		if (null == param || null == (name = param.getName())
				|| 0 == name.length() || null == (lev = param.getLev())
				|| null == (isOutsite = param.getIsOutsite())
				|| 0 == isOutsite.length()) {
			throw new ACLException("添加角色存在参数为空!");
		}

		ACLRole role = new ACLRole();
		// uuid
		role.setId(SnoGerUtil.getUUID());
		role.setName(name);
		role.setLev(lev);
		role.setIsOutsite(isOutsite);
		role.setIsDelete("1");
		Date now = new Date();
		role.setGmtCreate(now);
		role.setGmtModified(now);
		role.setCreateUser(userID);
		role.setModifyUser(userID);
		role.setDescription(param.getDescription());
		try {
			this.aclRoleDAO.addACLRoleBean(role);
		} catch (Exception e) {
			LOG.error("创建角色失败!", e);
			throw new ACLException("创建角色失败!", e);
		}
	}

	@Override
	public void updateRole(RoleParam param) throws ACLException {
		this.updateRole(param, "system");
	}

	@Override
	public void updateRole(RoleParam param, String userID) throws ACLException {
		String id;
		if (null == param || null == (id = param.getId()) || 0 == id.length()) {
			throw new ACLException("修改角色存在参数为空!");
		}
		ACLRole role = new ACLRole();
		role.setId(id);
		role.setName(param.getName());
		role.setLev(param.getLev());
		role.setIsOutsite(param.getIsOutsite());
		role.setModifyUser(userID);
		role.setDescription(param.getDescription());
		try {
			this.aclRoleDAO.updateACLRoleBean(role);
		} catch (Exception e) {
			LOG.error("更新角色失败!", e);
			throw new ACLException("更新角色失败!", e);
		}
	}

	@Override
	public void delRole(String id) throws ACLException {
		if (null == id || 0 == id.length()) {
			throw new ACLException("删除角色id为空!");
		}
		ACLRole role = new ACLRole();
		role.setId(id);
		role.setIsDelete("0");
		try {
			this.aclRoleDAO.updateACLRoleBean(role);
		} catch (Exception e) {
			LOG.error("删除角色失败!", e);
			throw new ACLException("删除角色失败!", e);
		}
	}

	public void setAclRoleDAO(IACLRoleDAO aclRoleDAO) {
		this.aclRoleDAO = aclRoleDAO;
	}
	
	/**
	 * 根据id查询角色
	 * @param id
	 * @return
	 */
	public RoleParam getRoleByID(String id) throws ACLException {
		if (null == id || 0 == id.length()) {
			throw new ACLException("查询角色id为空!");
		}
		ACLRole role = this.aclRoleDAO.findById(id);
		RoleParam param = null;
		if (null == role) {
			return param;
		}
		param = new RoleParam();
		param.setId(role.getId());
		param.setName(role.getName());
		param.setLev(role.getLev());
		param.setIsOutsite(role.getIsOutsite());
		param.setDescription(role.getDescription());
		return param;
	}

	@Override
	public List<RoleParam> getAllRoles() {
		List<ACLRole> list =  this.aclRoleDAO.getAllRoles();
		List<RoleParam> ret = null;
		int s;
		if (null == list || 0 == (s = list.size())) {
			return ret;
		}
		RoleParam param = null;
		ret = new ArrayList<RoleParam> (s);
		for (ACLRole role : list) {
			param = new RoleParam();
			param.setId(role.getId());
			param.setName(role.getName());
			param.setLev(role.getLev());
			param.setIsOutsite(role.getIsOutsite());
			param.setDescription(role.getDescription());
			ret.add(param);
		}
		return ret;
	}
	
	private static final String APPLY  = "0";
	private static final String GRANT  = "1";
	private static final String CANCEL = "-1";
//	private static final Long   LEV   = 10L;
	
	public Map<Long, List<UserParam>> getAllSiteManager(List<Long> siteIDs) throws ACLException {
		List<ACLSiteRole> siteRoles = null;
		try {
			siteRoles = this.aclRoleDAO.getAllSiteManager(siteIDs);
		} catch (Exception e) {
			LOG.error("RoleServiceImpl.getAllSiteManager", e);
		}
		
		Map<Long, List<UserParam>> ret = null;
		int s;
		if (null == siteRoles || 0 == (s = siteRoles.size())) {
			return ret;
		}
		
		ret = new HashMap<Long, List<UserParam>> (s);
		
		long siteID;
		String userID;
		String userName;
		ACLSiteRole siteRole;
		UserParam param = null;
		List<UserParam> params;
		for (int i = 0; i < s; i++) {
			siteRole = siteRoles.get(i);
			siteID   = siteRole.getSiteID();
			userID   = siteRole.getUserID();
			userName = siteRole.getUserName();
			param    = new UserParam();
			param.setUserId(userID);
			param.setFullName(StringUtil.isEmpty(userName) ? userID : userName);
			params = ret.get(siteID);
			if (null == params) {
				params = new ArrayList<UserParam>();
				ret.put(siteID, params);
			}
			params.add(param);
		}

		return ret;
	}
	
	@Override
	public Map<Long, SiteRoleParam> getSiteAndRolesByUserIDAndStatus(String userID, boolean isOutsite, String status) 
			throws ACLException {
		if (StringUtil.isEmpty(userID)) {
			throw new ACLException("userID为空!");
		}
		String outsite = isOutsite ? "1" : "0";
		
		List<ACLSiteRole> siteRoles = null;
		try {
			siteRoles = this.aclRoleDAO.getSiteAndRolesByUserID(userID, outsite, status);
		} catch (Exception e) {
			LOG.error("RoleServiceImpl.getSiteAndRolesByUserIDAndStatus", e);
		}
		
		int s;
		Map<Long, SiteRoleParam> ret = null;
		if (null == siteRoles || 0 == (s = siteRoles.size())) {
			return ret;
		}
		
		ret = new HashMap<Long, SiteRoleParam> (s);
		
		Long siteID;
		RoleParam role;
		ACLSiteRole temp;
		SiteRoleParam param;
		List<RoleParam> roles = null;
		for (int i = 0; i < s; i++) {
			temp   = siteRoles.get(i);
			siteID = temp.getSiteID();
			
			param = ret.get(siteID);
			if (null == param) {
				param = new SiteRoleParam();
				ret.put(siteID, param);
			}
			
			param.setSiteID(siteID);
			
			// 角色信息
			role = new RoleParam();
			role.setId(temp.getId());
			role.setName(temp.getName());
			
			if (APPLY.equals(status)) {
				roles = param.getApplyRoles();
				if (null == roles) {
					param.setApplyRoles(new ArrayList<RoleParam>());
					roles = param.getApplyRoles();
				}
			} else if (GRANT.equals(status)) {
				roles = param.getGrantRoles();
				if (null == roles) {
					param.setGrantRoles(new ArrayList<RoleParam>());
					roles = param.getGrantRoles();
				}
			} else if (CANCEL.equals(status)) {
				roles = param.getCancelRoles();
				if (null == roles) {
					param.setCancelRoles(new ArrayList<RoleParam>());
					roles = param.getCancelRoles();
					role.setMessage(temp.getMessage());
				}
			}
			roles.add(role);
		}
		
		return ret;
	}
	
	@Override
	public SiteRolesParam getSiteAndRolesByUserID(String userID, boolean isOutsite)
			throws ACLException {
		if (StringUtil.isEmpty(userID)) {
			throw new ACLException("userID为空!");
		}
		
		String outsite = isOutsite ? "1" : "0";
		
		List<ACLSiteRole> siteRoles = null;
		try {
			siteRoles = this.aclRoleDAO.getSiteAndRolesByUserID(userID, outsite, null);
		} catch (Exception e) {
			LOG.error("RoleServiceImpl.getSiteAndRolesByUserID", e);
		}
		
		int s;
		SiteRolesParam ret = null;
		Map<Long, SiteRoleParam> map = null;
		if (null == siteRoles || 0 == (s = siteRoles.size())) {
			return ret;
		}
		
		ret = new SiteRolesParam ();
		map = new HashMap<Long, SiteRoleParam> ();
		ACLSiteRole siteRole;
		SiteRoleParam param;
		Long siteID;
		String status;
		Date now = new Date();
		Date expiredDate;
		RoleParam role;
		List<RoleParam> roles;
		for (int i = 0; i < s; i++) {
			siteRole = siteRoles.get(i);
			siteID = siteRole.getSiteID();
			param = map.get(siteID);
			if (null == param) {
				param = new SiteRoleParam();
				map.put(siteID, param);
			}
			param.setSiteID(siteID);
			status = siteRole.getStatus();
			expiredDate = siteRole.getExpiredDate();
			
			// 角色集合
			if (APPLY.equals(status)) {
				if (null == expiredDate || now.before(expiredDate)) {
					param.setApplyRoles((null == (roles = param.getApplyRoles())) ? new ArrayList<RoleParam>() : roles);
					roles = param.getApplyRoles();
					role = new RoleParam();
					role.setId(siteRole.getId());
					role.setName(siteRole.getName());
					roles.add(role);
				}
			} else if (GRANT.equals(status)) {
				if (null == expiredDate || now.before(expiredDate)) {
					param.setGrantRoles((null == (roles = param.getGrantRoles())) ? new ArrayList<RoleParam>() : roles);
					roles = param.getGrantRoles();
					role = new RoleParam();
					role.setId(siteRole.getId());
					role.setName(siteRole.getName());
					roles.add(role);
				}
			}
		}

		ret.setSiteRoleParams(map);
		
		return ret;
	}
}