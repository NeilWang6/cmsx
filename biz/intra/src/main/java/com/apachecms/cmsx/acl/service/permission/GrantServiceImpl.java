package com.apachecms.cmsx.acl.service.permission;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.util.StringUtil;
import com.apachecms.cmsx.acl.IGrantService;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.ApplyRoleParam;
import com.apachecms.cmsx.acl.param.PageParam;
import com.apachecms.cmsx.acl.service.cache.CacheValue;
import com.apachecms.cmsx.acl.service.permission.support.OtherPermissionService;
import com.apachecms.cmsx.acl.service.util.ACLConstants;
import com.apachecms.cmsx.acl.service.util.SnoGerUtil;
import com.apachecms.cmsx.dal.dao.IACLPermssionDAO;
import com.apachecms.cmsx.dal.dao.common.PageInfo;
import com.apachecms.cmsx.dal.dataobject.ACLRoleResources;
import com.apachecms.cmsx.dal.dataobject.ACLUserSiteRole;

@Resource(name="grantService")
public class GrantServiceImpl implements IGrantService {
	private static final Log LOG = LogFactory.getLog(GrantServiceImpl.class);
	@Autowired
	private IACLPermssionDAO   aclPermssionDAO;
//	private TairManagerService tairManagerService;

	@Override
	public PageParam<ApplyRoleParam> getApplyRoles(Long siteID, String userID, Boolean isHandle, Integer currentPage, String start, String end)
			throws ACLException {
		if (null == siteID || null == userID || 0 == userID.length()) {
			throw new ACLException("参数存在空.");
		}
		
		Date startDate = null;
		if (StringUtils.isNotEmpty(start)) {
			start     = start.trim() + " 00:00:00";
			startDate = getDate(start);
		}
		
		Date endDate   = null;
		if (StringUtils.isNotEmpty(end)) {
			end       = end.trim()   + " 23:59:59";
			endDate   = getDate(end);
		}
		
		Map<String, Object> values = new HashMap<String, Object> ();
		List<Long> sites = new ArrayList<Long> (1);
		sites.add(siteID);
//		sites.add(-1L);
		values.put("siteIDs", sites);
		
		values.put("startDate", startDate);
		values.put("endDate", endDate);
		if (null != isHandle) {
			if (isHandle) {
				List<String> list = new ArrayList<String> (2);
				list.add("-1");
				list.add("1");
				values.put("statusList", list);
			} else {
				values.put("status", "0");
			}
		}
		values.put("isDelete", "1");
		values.put("currentPage", currentPage);
		
		PageInfo<ACLUserSiteRole> pageInfo = this.aclPermssionDAO.findRolesBySite(values);
		PageParam<ApplyRoleParam> ret = null;
		int s;
		if (null == pageInfo || 0 == (s = pageInfo.getList().size())) {
			return ret;
		}
		List<ApplyRoleParam> list = new ArrayList<ApplyRoleParam> (s);
        ApplyRoleParam param = null;
		for (ACLUserSiteRole temp : pageInfo.getList()) {
			param = new ApplyRoleParam();
			param.setId(temp.getId());
			param.setUserID(temp.getUserId());
			param.setRoleID(temp.getRoleId());
			param.setRoleName(temp.getRoleName());
			param.setStatus(temp.getStatus());
			param.setGmtGreate(temp.getGmtGreate());
			param.setGmtModified(temp.getGmtModified());
			param.setMessage(temp.getMessage());
			list.add(param);
		}
		
		ret = new PageParam<ApplyRoleParam> ();
		ret.setList(list);
		ret.setCurrentPage(pageInfo.getCurrentPage());
		ret.setPageSize(pageInfo.getPageSize());
        ret.setAllRow(pageInfo.getAllRow());
        ret.setTotalPage(pageInfo.getTotalPage());
		return ret;
	}
	

	@Override
	public void addRoles2User(String[] ids, String status, String msg, String userID, String appName) throws ACLException {
		if (null == ids || 0 == ids.length || StringUtil.isEmpty(status) || StringUtil.isEmpty(msg) || StringUtil.isEmpty(appName)) {
			throw new ACLException("审核权限入参存在空.");
		}

		Date now = new Date();
		ACLUserSiteRole bean = null;
		for (String id : ids) {
			bean = new ACLUserSiteRole();
			bean.setId(id);
			bean.setGmtModified(now);
			bean.setModifyUser(userID);
			bean.setStatus(status);
			bean.setMessage(msg);

			try {
				this.aclPermssionDAO.updateAclUserSiteRole(bean);
			} catch (Exception e) {
				throw new ACLException("授权失败 id:" + id + " userID:" + userID, e);
			}
			
			// 清除掉当前站点申请人的权限缓存
			this.clearRoles2User(ids, appName);
		}
	}
	
	/**
	 * 清除掉当前站点申请人的权限缓存
	 * @param ids
	 * @param siteID
	 * @throws ACLException
	 */
	public void clearRoles2User(String[] ids, String appName) {
		int s = ids.length;
		
		// 根据申请的pk查询申请人的siteID和用户名userID
		List<String> params = new ArrayList<String> (s);
		for (int i = 0; i < s; i++) {
			params.add(ids[i]);
		}
		
		List<ACLUserSiteRole> values = this.aclPermssionDAO.findUserIDandSiteIDByIDs(params);
		s = 0;
		if (null == values || 0 == (s = values.size())) {
			LOG.warn("clearRoles2User is null .");
			return;
		}
		
		appName = appName.trim().toUpperCase();
		
		String key;
		Long siteID;
		String userID;
		ACLUserSiteRole temp;
		for (int i = 0; i < s; i++) {
			temp   = values.get(i);
			siteID = temp.getSiteId();
			userID = temp.getUserId();
			
			// 用户对应的角色临时缓存清除
			key = appName + PermissionServiceImpl._SITE_ + siteID + PermissionServiceImpl._ROLES_ + userID;
			this.doClear(key);
			
			// 非管理员角色验证权限临时缓存清除
			key = appName + OtherPermissionService._SITE_ + siteID + OtherPermissionService._ROLES_RESOURCES_ + userID;
			this.doClear(key);
			
			// 菜单权限临时缓存清除
			key = appName + "_" + siteID + "_" + userID + ACLConstants._MENU_TEMP_CACHE;
			this.doClear(key);
			
			// 操作权限临时缓存清除
			key = appName + "_" + siteID + "_" + userID + ACLConstants._PERMISSION_TEMP_CACHE;
			this.doClear(key);
			
			// 菜单临时缓存清除
			key = appName + "_" + siteID + "_" + userID + ACLConstants._MENU_RESOURCE_TREE;
			this.doClear(key);
		}
	}
	
	/**
	 * @param key
	 */
	private void doClear(String key) {
		try {
//			this.tairManagerService.remove(key);
		} catch (Exception e) {
			LOG.error("GrantServiceImpl.doClear.Exception, key:" + key);
		}
	}

	@Override
	public void delRoles2User(String[] ids, String userID) throws ACLException {
		if (null == ids || 0 == ids.length) {
			throw new ACLException("GrantServiceImpl.delRoles2User参数存在空.");
		}
		Date now = new Date();
		ACLUserSiteRole bean = null;
		for (String id : ids) {
			bean = new ACLUserSiteRole();
			bean.setId(id);
			bean.setGmtModified(now);
			bean.setModifyUser(userID);
			bean.setStatus("-1");
			
			try {
				this.aclPermssionDAO.updateAclUserSiteRole(bean);
			} catch (Exception e) {
				throw new ACLException("移除权限失败 id:" + id + " userID:" + userID, e);
			}
		}
	}
	
	static final String FORMAT = "yyyy-MM-dd hh:mm:ss";
	static final SimpleDateFormat sdf = new SimpleDateFormat(FORMAT);
	
	private static Date getDate(String date) {
		try {
			return sdf.parse(date);
		} catch (ParseException e) {
			return null;
		}
	}
	
	@Override
	public void addRoles2User(String user, List<String> roles, Long siteID) throws ACLException {
		// 目前没实现,暂时不需要这个方法
	}

	@Override
	public void delRoles2User(String user, long siteID, List<String> roles) throws ACLException {
		// 目前没实现,暂时不需要这个方法
	}
	
	private static final String APP_NAME    = "dcms";
	private static final String APP_NAME_UP = APP_NAME.toUpperCase();
	
	
	@SuppressWarnings("unchecked")
	private void addCache(String roleID) {
		String key = APP_NAME_UP + ACLConstants._ROLE_RES_CHANGE_SET;
		HashMap<String, CacheValue<String>> map = null; //(HashMap<String, CacheValue<String>>) this.tairManagerService.get(key);
		if (null == map) {
			map = new HashMap<String, CacheValue<String>> ();
		}
		CacheValue<String> value = new CacheValue<String> ();
		value.setTime(DateUtils.addSeconds(new Date(), ACLConstants.DEFAULT_TIMEOUT));
		value.setVal(roleID);
		map.put(roleID, value);
//		this.tairManagerService.put(key, map, ACLConstants.DEFAULT_TIMEOUT);
	}

	@Override
	public void addPermissions2Role(String roleID, List<String> permissions, String userID) throws ACLException {
		if (null == roleID || null == permissions || 0 == (permissions.size())) {
			throw new ACLException("GrantServiceImpl.addPermissions2Role_3 入参存在空, roleID:" + roleID + ", permissions:" + permissions + ", userID:" + userID);
		}
		
		ACLRoleResources roleResources;
		Date now = new Date();
		for (String resourceCode : permissions) {
			roleResources = new ACLRoleResources();
			roleResources.setId(SnoGerUtil.getUUID());
			roleResources.setResourceCode(resourceCode);
			roleResources.setRoleId(roleID);
			roleResources.setGmtCreate(now);
			roleResources.setGmtModified(now);
			roleResources.setCreateUser(userID);
			roleResources.setModifyUser(userID);
			try {
				this.aclPermssionDAO.addAclRoleResources(roleResources);
			} catch (Exception e) {
				throw new ACLException("授权失败 roleID:" + roleID + " resourceCode:" + resourceCode + " userID:" + userID, e);
			}
		}
		
		try {
			this.addCache(roleID);
		} catch (Exception e) {
		}
	}
	
	@Override
	public void delPermissions2Role(String[] ids) throws ACLException {
		if (null == ids || 0 == ids.length) {
			throw new ACLException("GrantServiceImpl.delPermissions2Role入参存在空.");
		}
		
		for (String id : ids) {
			try {
				this.aclPermssionDAO.delAclRoleResources(id);
			} catch (Exception e) {
				throw new ACLException("取消权限失败 id:" + id, e);
			}
		}
		
	}

	@Override
	public void delPermissions2Role(String roleID, List<String> permissions)
			throws ACLException {
		if (null == roleID || null == permissions || 0 == (permissions.size())) {
			throw new ACLException("GrantServiceImpl.delPermissions2Role入参存在空.");
		}
		
		for (String permission : permissions) {
			try {
				this.aclPermssionDAO.delAclRoleResources(roleID, permission);
			} catch (Exception e) {
				throw new ACLException("取消权限失败 roleID:" + roleID + " permission:" + permission, e);
			}
		}
		
		try {
			this.addCache(roleID);
		} catch (Exception e) {
		}
	}

	public void setAclPermssionDAO(IACLPermssionDAO aclPermssionDAO) {
		this.aclPermssionDAO = aclPermssionDAO;
	}


//	public void setTairManagerService(TairManagerService tairManagerService) {
//		this.tairManagerService = tairManagerService;
//	}
}