package com.apachecms.cmsx.acl;

import java.util.List;

import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.ApplyParam;
import com.apachecms.cmsx.acl.param.RoleParam;

/**
 * 申请角色接口
 * <pre>IApplyService</pre>
 * @author lx
 */
public interface IApplyService {
	/**
	 * 用户在当前站点下还能申请的角色
	 * @param siteID
	 * @param userID
	 * @param isOutsite
	 * @return
	 * @throws ACLException
	 */
	List<RoleParam> canApplyRoles(Long siteID, String userID, boolean isOutsite) throws ACLException;

	/**
	 * 申请某站点下的角色
	 * 1.查询
	 * @param param
	 * @throws ACLException
	 */
	void applyRoles2User(ApplyParam param) throws ACLException;
	
	/**
	 * 查询当前用户可以申请的角色
	 * @param isOutsite 0:站内 1站外
	 * @return
	 */
	List<RoleParam> getRoles(boolean isOutsite) throws ACLException;
}