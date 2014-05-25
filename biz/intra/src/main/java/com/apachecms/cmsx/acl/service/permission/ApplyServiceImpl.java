package com.apachecms.cmsx.acl.service.permission;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.alibaba.citrus.util.StringUtil;
import com.apachecms.cmsx.acl.IApplyService;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.ApplyParam;
import com.apachecms.cmsx.acl.param.RoleParam;
import com.apachecms.cmsx.acl.service.util.SnoGerUtil;
import com.apachecms.cmsx.dal.dao.IACLPermssionDAO;
import com.apachecms.cmsx.dal.dao.IACLRoleDAO;
import com.apachecms.cmsx.dal.dataobject.ACLRole;
import com.apachecms.cmsx.dal.dataobject.ACLUserSiteRole;

/**
 * 申请角色实现
 * 
 * @author liuxinl.lx
 */
public class ApplyServiceImpl implements IApplyService {
	private static final Log LOG = LogFactory.getLog(ApplyServiceImpl.class);
	private static final String APPLY_STATUS = "0";
	private static final String FAIL_STATUS  = "-1";
//	private static final String PASS_STATUS  = "1";
	// 角色接口
	protected IACLRoleDAO aclRoleDAO;
	protected IACLPermssionDAO aclPermssionDAO;
	
	@Override
	public List<RoleParam> canApplyRoles(Long siteID, String userID, boolean isOutsite) throws ACLException {
		if (StringUtil.isEmpty(userID) || null == siteID) {
			throw new ACLException("ApplyServiceImpl.canApplyRoles 存在参数为空 。");
		}
		String outsite = isOutsite ? "1" : "0";
		List<ACLRole> roles = null;
		try {
			roles = this.aclRoleDAO.canApplyRoles(siteID, userID, outsite);
		} catch (Exception e) {
			LOG.error("ApplyServiceImpl.canApplyRoles", e);
		}
		
		int s;
		List<RoleParam> ret = null;
		if (null == roles || 0 == (s = roles.size())) {
			LOG.warn("ApplyServiceImpl.canApplyRoles roles is null, siteID:" + siteID + ", userID:" + userID + ", isOutsite:" + isOutsite);
			return ret;
		}
		
		ret = new ArrayList<RoleParam> (s);
		ACLRole role = null;
		RoleParam param = null;
		for (int i = 0; i < s; i++) {
			role = roles.get(i);
			param = new RoleParam();
			param.setId(role.getId());
			param.setName(role.getName());
			param.setLev(role.getLev());
			param.setIsOutsite(role.getIsOutsite());
			ret.add(param);
		}

		return ret;
	}

	@Override
	public void applyRoles2User(ApplyParam param) throws ACLException {
		String userID = null;
		Long siteID = null;
		List<String> roles = null;
		int roleSize;
		if (null == param || null == (userID = param.getUserID())
				|| 0 == userID.length() || null == (siteID = param.getSiteID())
				|| null == (roles = param.getRoles()) || 0 == (roleSize = roles.size())) {
           throw new ACLException("申请权限需要的参数存在空.");
		}
		
		int s;
		
		// 验证入参的角色id是否存在
		try {
			s = this.aclRoleDAO.findRolesByIds(roles);
		} catch (Exception e) {
			throw new ACLException("查询角色个数失败, roles:" + roles + " userID:" + userID + " siteID:" + siteID, e);
		}
		
		if (roleSize != s) {
			throw new ACLException("您申请的角色不存在或已移除, roles:" + roles + " userID:" + userID + " siteID:" + siteID);
		}
		
		// 查询当前用户在当前站前下拥有的角色
		List<ACLUserSiteRole> roleIds = this.aclPermssionDAO.findRolesBySiteAndUser(siteID, userID, !param.isInside(), null);
		Map<String, ACLUserSiteRole> temp = null;
		if (null != roleIds && (s = roleIds.size()) > 0) {
			temp = new HashMap<String, ACLUserSiteRole> (s);
			for (ACLUserSiteRole bean : roleIds) {
				temp.put(bean.getRoleId(), bean);
			}
		}
		
		Date now = new Date();
		ACLUserSiteRole aclUserSiteRole = null;
		String status;
		Date expiredDate;
		for (String roleID : roles) {
			if (null == temp || !temp.containsKey(roleID)) {
				aclUserSiteRole = new ACLUserSiteRole();
				aclUserSiteRole.setId(SnoGerUtil.getUUID());
				aclUserSiteRole.setSiteId(siteID);
				aclUserSiteRole.setUserId(userID);
				aclUserSiteRole.setRoleId(roleID);
				aclUserSiteRole.setStatus(APPLY_STATUS);
				aclUserSiteRole.setExpiredDate(param.getExpiredDate());
				aclUserSiteRole.setGmtGreate(now);
				aclUserSiteRole.setGmtModified(now);
				aclUserSiteRole.setCreateUser(userID);
				aclUserSiteRole.setModifyUser(userID);
				try {
					this.aclPermssionDAO.addAclUserSiteRole(aclUserSiteRole);
				} catch (Exception e) {
					throw new ACLException("申请权限失败, roleID:" + roleID + " userID:" + userID + " siteID:" + siteID, e);
				}
				continue;
			}
			
			aclUserSiteRole = temp.get(roleID);
			status = aclUserSiteRole.getStatus();
			expiredDate = aclUserSiteRole.getExpiredDate();
			// 申请的角色被移除或者已过期
			if (FAIL_STATUS.equals(status) || (null != expiredDate && expiredDate.before(now))) {
				aclUserSiteRole.setExpiredDate(param.getExpiredDate());
				aclUserSiteRole.setStatus(APPLY_STATUS);
				aclUserSiteRole.setGmtModified(now);
				try {
					this.aclPermssionDAO.updateAclUserSiteRole(aclUserSiteRole);
				} catch (Exception e) {
					throw new ACLException("申请权限失败2, roleID:" + roleID + " userID:" + userID + " siteID:" + siteID);
				}
			}
		}
	}

	@Override
	public List<RoleParam> getRoles(boolean isOutsite) throws ACLException {
		ACLRole bean = new ACLRole();
		bean.setIsOutsite(isOutsite ? "1" : "0");
		List<ACLRole> roles = this.aclRoleDAO.findByWhere(bean);
		List<RoleParam> values = null;
		int s;
		if (null == roles || 0 == (s = roles.size())) {
			return values;
		}
		values = new ArrayList<RoleParam>(s);
		RoleParam param;
		for (ACLRole role : roles) {
			param = new RoleParam();
			param.setId(role.getId());
			param.setName(role.getName());
			values.add(param);
		}
		return values;
	}

	public void setAclRoleDAO(IACLRoleDAO aclRoleDAO) {
		this.aclRoleDAO = aclRoleDAO;
	}

	public void setAclPermssionDAO(IACLPermssionDAO aclPermssionDAO) {
		this.aclPermssionDAO = aclPermssionDAO;
	}
}