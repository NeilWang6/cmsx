package com.apachecms.cmsx.acl.service.resource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.util.StringUtil;
import com.apachecms.cmsx.acl.IResourceService;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.PageParam;
import com.apachecms.cmsx.acl.param.ResourceParam;
import com.apachecms.cmsx.acl.service.util.ACLConstants;
import com.apachecms.cmsx.acl.service.util.SnoGerUtil;
import com.apachecms.cmsx.dal.dao.IACLPermssionDAO;
import com.apachecms.cmsx.dal.dao.IACLResourceDAO;
import com.apachecms.cmsx.dal.dao.common.PageInfo;
import com.apachecms.cmsx.dal.dataobject.ACLResource;
import com.apachecms.cmsx.dal.dataobject.ACLUserSiteRole;

/**
 * 资源实现类,实现资源的基础操作
 * @author liuxinl.lx
 */
public class ResourceServiceImpl extends AbstractResourceService implements IResourceService {
	protected static final Log LOG = LogFactory.getLog(ResourceServiceImpl.class);
	@Autowired
	protected IACLResourceDAO  aclResourceDAO;
	@Autowired
	protected IACLPermssionDAO aclPermssionDAO;
	
	public PageParam<ResourceParam> findByRoleID(String roleID, ResourceParam param, int currentPage, int pageSize, boolean isSelect) throws ACLException {
		if (StringUtil.isEmpty((roleID))) {
            throw new ACLException("ResourceServiceImpl.findByRoleID入参存在空.");
		}
		
		ACLResource bean = null;
		if (null != param) {
			bean = new ACLResource();
			bean.setAppName(param.getAppName());
			bean.setResourceType(param.getResourceType());
		}
		
		PageInfo<ACLResource> page = null;
		try {
			if (isSelect) {
				page = this.aclResourceDAO.findResourcesByRoleID(roleID, bean, currentPage, pageSize);
			} else {
				page = this.aclResourceDAO.findAclResourcesCanApply(roleID, bean, currentPage, pageSize);
			}

		} catch (Exception e) {
			throw new ACLException("ResourceServiceImpl.findByRoleID", e);
		}
		
		// 处理返回结果
		PageParam<ResourceParam> ret = null;
		int s;
		if (null == page || 0 == (s = page.getAllRow())) {
			return ret;
		}
		ret = new PageParam<ResourceParam> ();
		List<ResourceParam> list = new ArrayList<ResourceParam> (s);
		ResourceParam temp;
		for (ACLResource res : page.getList()) {
			temp = new ResourceParam();
			temp.setId(res.getId());
			temp.setName(res.getName());
			temp.setCode(res.getResourceCode());
			temp.setParent(res.getParentId());
			temp.setResourceType(res.getResourceType());
			temp.setUrl(res.getUrl());
			temp.setDescription(res.getDescription());
			temp.setAppName(res.getAppName());
			list.add(temp);
		}
		
		ret.setList(list);
		ret.setAllRow(page.getAllRow());
		ret.setCurrentPage(page.getCurrentPage());
		ret.setPageSize(ret.getPageSize());
		ret.setTotalPage(page.getTotalPage());
		
		return ret;
	}
	
	@Override
	public void create(ResourceParam param, String userID) throws ACLException {
		String code = null, name = null, appName = null, isWhite = null, resourceType = null;
		if (null == param || StringUtil.isEmpty((code = param.getCode()))
				|| StringUtil.isEmpty(name = param.getName())
				|| StringUtil.isEmpty(appName = param.getAppName())
				|| StringUtil.isEmpty(isWhite = param.getIsWhite())
				|| StringUtil.isEmpty(resourceType = param.getResourceType())) {
            throw new ACLException("创建资源入参存在空.");
		}
		
		// 验证code是否重复
		List<ACLResource> list = this.aclResourceDAO.getResourceCountByAppNameAndCode(appName, code);
		int s;
		String tempID = null;
		if (null != list) {
			s = list.size();
			if (s > 1) {
				throw new ACLException("添加 重复的code:" + code + " appName:" + appName);
			} else if (1 == s) {
				ACLResource temp = list.get(0);
				if ("1".equals(temp.getIsDelete())) {
					throw new ACLException("添加 重复的code:" + code + " appName:" + appName);
				}
				tempID = temp.getId();
			}
		}

		ACLResource bean = new ACLResource();
		bean.setName(name);
		bean.setParentId(param.getParent());
		bean.setResourceType(resourceType);
		bean.setSort(param.getSort());
		bean.setUrl(param.getUrl());
		bean.setIsDelete(ACLConstants.EFFECTIVE);
		bean.setIsWhite(isWhite);
		bean.setAppName(appName);
		bean.setDescription(param.getDescription());
		Date now = new Date();
		bean.setGmtModified(now);
		bean.setModifyUser(userID);
		
		try {
			if (StringUtil.isEmpty(tempID)) {
				bean.setId(SnoGerUtil.getUUID());
				bean.setResourceCode(code);
				bean.setGmtCreate(now);
				bean.setCreateUser(userID);
				this.aclResourceDAO.addAclResource(bean);
			} else {
				bean.setId(tempID);
				this.aclResourceDAO.updateAclResource(bean);
			}
		} catch (Exception e) {
			throw new ACLException("ResourceServiceImpl.create", e);
		}
		
		this.clear(appName, resourceType);
	}

	@Override
	public void update(ResourceParam param, String userID) throws ACLException {
		String id = null;
		if (null == param || StringUtil.isEmpty((id = param.getId()))) {
            throw new ACLException("更新资源入参存在空.");
		}
		
		String code = null;
		if (StringUtils.isNotEmpty(code = param.getCode())) {
			String appName = param.getAppName();
			if (StringUtil.isEmpty(appName)) {
				ACLResource temp = this.aclResourceDAO.findById(id);
				appName = temp.getAppName();
			}
			// 验证code是否重复
			List<ACLResource> list = this.aclResourceDAO.getResourceCountByAppNameAndCode(appName, code);
			String tempID = list.get(0).getId();
			if (!id.equals(tempID)) {
				throw new ACLException("更新 重复的code:" + code + " appName:" + appName);
			}
		}
		
		ACLResource bean = new ACLResource();
		bean.setId(id);
		bean.setResourceCode(param.getCode());
		bean.setName(param.getName());
		bean.setParentId(param.getParent());
		bean.setResourceType(param.getResourceType());
		bean.setSort(param.getSort());
		bean.setUrl(param.getUrl());
		bean.setIsDelete(ACLConstants.EFFECTIVE);
		bean.setIsWhite(param.getIsWhite());
		bean.setAppName(param.getAppName());
		bean.setDescription(param.getDescription());
		Date now = new Date();
		bean.setGmtModified(now);
		bean.setModifyUser(userID);
		
		try {
			this.aclResourceDAO.updateAclResource(bean);
		} catch (Exception e) {
			throw new ACLException("ResourceServiceImpl.update", e);
		}
		
		this.clear(param.getAppName(), param.getResourceType());
	}

	@Override
	public void delete(String resourceID, String userID) throws ACLException {
		if (StringUtil.isEmpty((resourceID))) {
            throw new ACLException("删除资源入参存在空.");
		}
		ACLResource bean = new ACLResource();
		bean.setId(resourceID);
		bean.setIsDelete("0");
		
		try {
			this.aclResourceDAO.updateAclResource(bean);
		} catch (Exception e) {
			throw new ACLException("ResourceServiceImpl.delete", e);
		}
		
		ACLResource temp = null;
		try {
			temp = this.aclResourceDAO.findById(resourceID);
		} catch (Exception e) {
			LOG.error("ResourceServiceImpl.delete", e);
		}
		
		if (null != temp) {
			this.clear(temp.getAppName(), temp.getResourceType());
		}
	}
	
	@Override
	public ResourceParam findById(String resourceID) throws ACLException {
		if (StringUtil.isEmpty((resourceID))) {
            throw new ACLException("ResourceServiceImpl.findById查询资源入参存在空, resourceID:" + resourceID);
		}
		
		ACLResource bean = null;
		try {
			bean = this.aclResourceDAO.findById(resourceID);
		} catch (Exception e) {
			LOG.error("ResourceServiceImpl.findById", e);
		}
		
		ResourceParam param = null;
		if (null == bean) {
			return param;
		}
		
		param = new ResourceParam();
		param.setId(bean.getId());
		param.setCode(bean.getResourceCode());
		param.setName(bean.getName());
		param.setIsWhite(bean.getIsWhite());
		param.setParent(bean.getParentId());
		param.setSort(bean.getSort());
		param.setUrl(bean.getUrl());
		param.setDescription(bean.getDescription());
		param.setAppName(bean.getAppName());
		param.setResourceType(bean.getResourceType());
		return param;
	}
	

	@Override
	public PageParam<ResourceParam> findByWhere(ResourceParam param, Integer currentPage, Integer pageSize)
			throws ACLException {
		ACLResource res = new ACLResource();
		if (null != param) {
		    res.setAppName(param.getAppName());
		    res.setName(param.getName());
	        res.setUrl(param.getUrl());
	        res.setResourceCode(param.getCode());
	        res.setResourceType(param.getResourceType());
		}

		PageInfo<ACLResource> page = this.aclResourceDAO.findByWhere(res, currentPage, pageSize);
		PageParam<ResourceParam> ret = null;
		int s;
		if (null == page || 0 == (s = page.getList().size())) {
			return ret;
		}
		
		ResourceParam rp = null;
		List<ResourceParam> list = new ArrayList<ResourceParam> (s);
		for (ACLResource bean : page.getList()) {
			rp = new ResourceParam();
			rp.setId(bean.getId());
			rp.setCode(bean.getResourceCode());
			rp.setName(bean.getName());
			rp.setIsWhite(bean.getIsWhite());
			rp.setParent(bean.getParentId());
			rp.setSort(bean.getSort());
			rp.setUrl(bean.getUrl());
			rp.setDescription(bean.getDescription());
			rp.setAppName(bean.getAppName());
			list.add(rp);
		}
		
		ret = new PageParam<ResourceParam> ();
		ret.setList(list);
		ret.setCurrentPage(page.getCurrentPage());
		ret.setPageSize(page.getPageSize());
        ret.setAllRow(page.getAllRow());
        ret.setTotalPage(page.getTotalPage());
		
		return ret;
	}
	
	/**
	 * @param appName
	 * @param resourceType
	 * @return
	 */
	protected List<ACLResource> findByWhere(String appName, String resourceType) {
		ACLResource res = new ACLResource();
		res.setIsDelete(ACLConstants.EFFECTIVE);
		res.setAppName(appName);
		res.setResourceType(resourceType);
		return this.findByWhere(res);
	}
	
	/**
	 * @param appName
	 * @param resourceTypes
	 * @param isWhite
	 * @return
	 */
	protected List<ACLResource> findByWhere(String appName, String[] resourceTypes, boolean isWhite) {
		ACLResource res = new ACLResource();
		res.setIsDelete(ACLConstants.EFFECTIVE);
		res.setIsWhite(isWhite ? ACLConstants.WHITE : ACLConstants.NOTWHITE);
		if (null != resourceTypes && resourceTypes.length > 0) {
			res.setResourceTypes(Arrays.asList(resourceTypes));
		}
		res.setAppName(appName);
		return this.findByWhere(res);
	}
	
	/**
	 * @param resource
	 * @return
	 */
	protected List<ACLResource> findByWhere(ACLResource resource) {
		List<ACLResource> ret = null;
		try {
			ret = this.aclResourceDAO.findByWhere(resource);
		} catch (Exception e) {
			LOG.error("ResourceServiceImpl.findByWhere_1", e);
		}
		return ret;
	}
	
	/**
	 * 根据站点id和用户查询当前用户拥有的角色
	 * @param siteID
	 * @param userID
	 * @param isOutside
	 * @return
	 */
	protected List<ACLUserSiteRole> findRolesBySiteAndUser(List<Long> siteIDs, String userID, boolean isOutside) {
		List<ACLUserSiteRole> roles = null;
		try {
			roles = this.aclPermssionDAO.findRolesBySitesAndUser(siteIDs, userID, isOutside, ACLConstants.STATUS_GRANT);
		} catch (Exception e) {
			LOG.error("ResourceServiceImpl.findRolesBySiteAndUser_3", e);
		}
		return roles;
	}
	
	/**
	 * 查询角色对应的权限集合
	 * @param appName
	 * @param resourceType
	 * @param roleIDs
	 * @return
	 */
	protected List<ACLResource> findResoucesByRoles(String appName, String[] resourceTypes, List<String> roleIDs, boolean isSort) {
		List<ACLResource> resources = null;
		try {
			resources = this.aclResourceDAO.findResoucesByRoles(appName, resourceTypes, roleIDs);
			if (isSort && (null != resources) && resources.size() > 0) {
				Collections.sort(resources, new Comparator<ACLResource> () {
					@Override
					public int compare(ACLResource o1, ACLResource o2) {
						Long s1, s2;
						return (null == (s1 = o1.getSort()) || null == (s2 = o2.getSort())) ? 0 : (int) (s1 - s2);
					}
				});
			}
		} catch (Exception e) {
			LOG.error("ResourceServiceImpl.findResoucesByRoles_3", e);
		}
		return resources;
	}
	
	protected static final int SYSTEM_LEV = 1;
	
	/**
	 * @param appName
	 * @param userID
	 * @param siteIDs
	 * @param isOutside
	 * @param type
	 * @return
	 * @throws ACLException
	 */
	protected List<ACLResource> doListPermission(String appName, String userID, List<Long> siteIDs, boolean isOutside, int type) throws ACLException {
		// 根据站点id和用户查询当前用户拥有的角色
		List<ACLUserSiteRole> roles = this.findRolesBySiteAndUser(siteIDs, userID, isOutside);
		
		int s;
		List<ACLResource> list = null;
		if (null == roles || 0 == (s = roles.size())) {
			return list;
		}
		
		List<String> roleIds = new ArrayList<String> (s);
		Date now = new Date();
		Date expiredDate;
		// 用于判断是否存在系统管理员
		boolean isSystem = false;
		for (ACLUserSiteRole temp : roles) {
			expiredDate = temp.getExpiredDate();
			if (null != expiredDate && expiredDate.before(now)) {
				continue;
			}
			roleIds.add(temp.getRoleId());
			if (SYSTEM_LEV == temp.getLev()) {
				isSystem = true;
				break;
			}
		}
		
		// 角色过期
		if (0 == roleIds.size()) {
			return list;
		}
		
		String values[] = (0 == type) ? new String[] { ACLConstants.ACTION } : new String[] { ACLConstants.MENU, ACLConstants.URL };
		
		try {
			list = isSystem ? this.findByWhere(appName, null) : this.aclResourceDAO.findResoucesByRoles(appName, values, roleIds);
		} catch (Exception e) {
			LOG.error("ResourceServiceImpl.listMenu_3.findResoucesByRoles_3:", e);
		}
		
		return list;
	}
	
	@Override
	protected boolean hasExistRoles(List<Long> siteIDs, String userID, List<String> roleIDs) {
		int count = 0;
		try {
			count = this.aclPermssionDAO.existRolesCount(siteIDs, userID, roleIDs);
		} catch (Exception e) {
			LOG.error("ResourceServiceImpl.hasExistRoles", e);
		}
		return (count > 0);
	}
	
	public void setAclResourceDAO(IACLResourceDAO aclResourceDAO) {
		this.aclResourceDAO = aclResourceDAO;
	}

	public void setAclPermssionDAO(IACLPermssionDAO aclPermssionDAO) {
		this.aclPermssionDAO = aclPermssionDAO;
	}
}