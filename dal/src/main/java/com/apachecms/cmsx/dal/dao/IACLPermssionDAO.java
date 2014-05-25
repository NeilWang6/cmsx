package com.apachecms.cmsx.dal.dao;

import java.util.List;
import java.util.Map;

import com.apachecms.cmsx.dal.dao.common.PageInfo;
import com.apachecms.cmsx.dal.dataobject.ACLRoleResources;
import com.apachecms.cmsx.dal.dataobject.ACLUserSiteRole;

/**
 * <pre>IACLPermssionDAO</pre>
 * @author liuxinl.lx
 */
public interface IACLPermssionDAO {
	
	/**
	 * 授权
	 * @param bean
	 * @return
	 */
	public Object addAclRoleResources(ACLRoleResources bean);
	
	/**
	 * 回收
	 * @param id
	 * @return
	 */
	public int delAclRoleResources(String id);
	
	/**
	 * 回收
	 * @param roleID
	 * @param permission
	 * @return
	 */
	public int delAclRoleResources(String roleID, String permission);

	/**
	 * 添加
	 * @param bean
	 * @return
	 */
    public Object addAclUserSiteRole(ACLUserSiteRole bean);
    
    /**
     * 更新
     * @param bean
     * @return
     */
    public int updateAclUserSiteRole(ACLUserSiteRole bean);
    
    /**
     * 查询当前用户在当前站前下拥有的角色
     * @param siteID
     * @param userID
     * @return
     */
    public List<ACLUserSiteRole> findRolesBySiteAndUser(long siteID, String userID, boolean isOutSite, String status);
    
    /**
     * 查询当前用户在当前站前下拥有的角色
     * @param siteID
     * @param userID
     * @param isOutSite
     * @param status
     * @return
     */
    public List<ACLUserSiteRole> findRolesBySitesAndUser(List<Long> siteIDs, String userID, boolean isOutSite, String status);
    
    /**
     * 查询当前用户在当前站前下拥有的角色    
     * @param siteID
     * @param status
     * @param startDate
     * @param endDate
     * @return
     */
    public PageInfo<ACLUserSiteRole> findRolesBySite(Map<String, Object> values);
    
    /**
     * 根据申请的pk查询申请人的siteID和用户名userID
     * @param ids
     * @return
     */
    public List<ACLUserSiteRole> findUserIDandSiteIDByIDs(List<String> ids);
    
    /**
     * 用户在当前站点下是否拥有角色的个数
     * @param siteID
     * @param userID
     * @param roleIDs
     * @return
     */
    public int existRolesCount(List<Long> siteIDs, String userID, List<String> roleIDs);
}