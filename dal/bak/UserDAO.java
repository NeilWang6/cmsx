package com.apachecms.cmsx.dal.dao;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.apachecms.cmsx.dal.dataobject.CmsUser;

@SuppressWarnings("rawtypes")
public interface UserDAO { 

    // DCMS_QUERY_USER_ROLE
    public Long queryUserRoleTest(String userId, Long roleId);

    // DCMS_QUERY_USER_SITE_TEST
    public Long queryUserSiteTest(String userId, Long siteId);
  
    public List<Map<String, Object>> queryPermissionRole(List<Long> roleList);
    /**
     * 查询用户订制的类目
     * 
     * @param userId
     * @return
     * @author pingchun.yupc 2011-8-16 下午02:20:54
     */
    public List<Map<String, Object>> queryDcmsUserSiteByUser(String userId);

    /**
     * 查询用户列表
     * 
     * @param userId
     * @param roleId
     * @param siteList
     * @return
     * @author pingchun.yupc 2011-8-15 下午07:07:32
     */
    public List<CmsUser> getDcmsUserList(String userId, String roleId, List<String> depList,List<Long> siteList, Integer offset,
                                         Integer length);
    /**
     * 通过类目ID获得其所有父类目
     * 
     * @param siteId
     * @return
     * @author pingchun.yupc 2011-9-7 下午07:51:09
     */
    public List<Map<String, Object>> queryUserParentSiteBySite(Long siteId);
    
    /**
     * 通过用户ID和部门获得类目
     * 
     * @param userId
     * @param depId
     * @return
     * @author pingchun.yupc 2011-9-7 下午07:33:38
     */
    public List<Long> queryDcmsUserSiteByUserAndDepId(String userId, String depId);
    /**
     * 通过部门获得用户归属类目
     * 
     * @param depId
     * @return
     * @author pingchun.yupc 2011-9-8 上午10:25:46
     */
    public List<Long> queryDcmsUserSiteByDepId(String depId);

    /**
     * 添加用户与角色关系
     * 
     * @param userRole
     * @author pingchun.yupc 2011-8-15 下午07:38:58
     */
    void addDcmsUserRole(final List<Map<String, Object>> userRole);

    /**
     * 统计用户总数
     * 
     * @param userId
     * @param roleId
     * @param siteList
     * @return
     * @author pingchun.yupc 2011-8-18 下午01:30:57
     */
    public Integer countDcmsUserList(String userId, String roleId, List<String> depList,List<Long> siteList);

    /**
     * 查询所拥有有类目
     * 
     * @param userId
     * @return
     * @author pingchun.yupc 2011-8-16 下午02:20:54
     */
    List<Map<String, Object>> queryDcmsUserSite(String userId);

    /**
     * 查询用户拥有有类目
     * 
     * @param userId
     * @return
     * @author pingchun.yupc 2011-8-16 下午02:20:54
     */
    public List<Map<String, Object>> queryDcmsUserSite(String userId, String depId);

    /**
     * 系统管理员查看类目
     * 
     * @param parentId
     * @return
     * @author pingchun.yupc 2011-8-17 上午10:54:55
     */
    public List<Map<String, Object>> queryDcmsUserSiteAdmin(Long parentId);

    /**
     * 保存用户与类目关系
     * 
     * @param uSiteList
     * @author pingchun.yupc 2011-8-16 下午02:18:51
     */
    void saveDcmsUserSite(final List<Map<String, Object>> uSiteList);

    /**
     * 查询部门对应的类目
     * 
     * @param depId
     * @return
     * @author pingchun.yupc 2011-8-17 上午08:53:16
     */
    List<Map<String, Object>> queryDepSite(List<String> depList);

    public void addUser(CmsUser user);

    public void modifyUser(CmsUser user);

    public CmsUser getUser(String userName);

	public List searchUser(String userName, String roleName, Integer offset, Integer length);

    public Integer countSearchUser(String userName, String roleName);

    public List searchAllUser(String userName, String roleName, Integer offset, Integer length);

    public Integer countSearchAllUser(String userName, String roleName);

    // 编辑人
    public List searchPermisionsUsers(List pls);

    public boolean isUserExist(String username);

    public CmsUser validate(String username, String password);

    public void batchModifiedUserRole(String[] userIds, String role);

    public void ModifyUserRole(String userName, String role);

    public List<String> getAllUserId();

    /**
     * 根据groupId获取分组负责人 add by jiankai
     * 
     * @param groupId
     * @return
     */
    public List<String> getPositionUsersByGroupId(Long groupId);

    /**
     * 根据输入的条件，查询出所以符合条件的用户
     * 
     * @param userInfo
     * @param roleName
     * @param groupId
     * @param offset
     * @param amount
     * @return
     */
    public List<CmsUser> getUserList(String userInfo, List<String> rolenamelist, String roleName, String inRole,
                                     Long groupId, Integer offset, Integer amount);

    /**
     * 根据输入的条件，计算出用户的数量
     * 
     * @param userInfo
     * @param roleName
     * @param groupId
     * @return
     */
    public Integer countUserByCondition(String userInfo, List<String> rolenamelist, String roleName, String inRole,
                                        Long groupId);

    public List getUserWithGroupInfo(List<String> idlist);

    public List<String> getUserByRole(String role);

    /**
     * 根据指定的siteid以及resouceType,返回相应类目的负责人id
     * 
     * @param userInfo
     * @param roleName
     * @param groupId
     * @return
     */
    public List<String> getPrincipleByCatalogIdAndResourceType(String siteId, String resourceType);
 

    public List<CmsUser> getAllUserList(); 

    /**
     * 分页查询用户数据
     * 
     * @param offset
     * @param length
     * @return
     */
    public List<CmsUser> iterateUsers(Integer offset, Integer length);

    /**
     * 根据用户ID删除用户
     * 
     * @param userId
     * @return
     */
    public boolean deleteUserByUserId(String userId);

    /**
     * 根据部门ID查询用户
     * 
     * @param depId
     * @return
     */
    public List<CmsUser> selectUserByDepId(String depId);

    /**
     * 根据角色查询用户ID
     * 
     * @param roleIds
     * @return
     */
    public List<CmsUser> selectUserByRoldIds(Collection<Long> roleIds);
    
    /**
     * 根据老的角色id转换新的角色id
     * @param userID
     * @return
     */
    public String getAclRoleIDByOldRoleID(String userID);
    
    /**
     * 根据老的角色id转换新的角色id
     * @param roleID
     * @return
     */
    public String getAclRoleIDByOldRoleID(Long roleID);
}