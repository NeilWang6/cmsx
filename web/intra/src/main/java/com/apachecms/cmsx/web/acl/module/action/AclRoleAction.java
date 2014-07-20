package com.apachecms.cmsx.web.acl.module.action;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.dataresolver.Param;
import com.alibaba.citrus.webx.WebxException;
import com.apachecms.cmsx.acl.IRoleService;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.PageParam;
import com.apachecms.cmsx.acl.param.ResourceParam;
import com.apachecms.cmsx.acl.param.RoleParam;
import com.apachecms.cmsx.acl.service.resource.IDcmsResourceService;
import com.apachecms.cmsx.common.SessionConstant;
import com.apachecms.cmsx.web.common.action.BaseAction;

public class AclRoleAction extends BaseAction{
	private static final Log LOG = LogFactory.getLog(AclRoleAction.class);
	@Autowired
	private IRoleService roleService;
	@Autowired
	private IDcmsResourceService dcmsResourceService;
	/**
	 * 根据id查询角色
	 * @param rundata
	 * @param context
	 * @throws WebxException
	 */
	public void doGetRoleByID(@Param("id") String id, HttpSession session, Context context) throws WebxException { 
		try {
			RoleParam param = this.roleService.getRoleByID(id);
			if (null != param) {
				context.put("role", param);
			} 
		} catch (ACLException e) {
			LOG.error("ACLRoleAO.doGetRoleByID.ACLException", e);

		} catch (Exception e) {
			LOG.error("ACLRoleAO.doGetRoleByID.Exception", e);
		}
	}
	
	/**
	 * 查询全部角色
	 * @param rundata
	 * @param context
	 * @throws WebxException
	 */
	public void doGetAllRoles(HttpSession session, Context context) throws WebxException {
		try {
			List<RoleParam> roles = this.roleService.getAllRoles();
			if (null != roles && roles.size() > 0) {
				context.put("list", roles);
			} 
		} catch (Exception e) {
			LOG.error("ACLRoleAO.doGetAllRoles.Exception", e);
		}
	}
	
	/**
	 * 添加角色
	 * @param rundata
	 * @param context
	 * @throws WebxException
	 */
	public void doCreateRole(@Param("lev") Long lev, @Param("name") String name, @Param("isOutsite") String isOutsite, 
			@Param("description") String description, HttpSession session, Context context) throws WebxException {
		String userId = (String)session.getAttribute(SessionConstant.SESSION_KEY_USER_ID); 
		
		RoleParam param = new RoleParam();
		param.setName(name);
		param.setLev(lev);
		param.setIsOutsite(isOutsite);
		param.setDescription(description);
		try {
			this.roleService.createRole(param, userId); 
			context.put("json", retJson(null, SUCCESS, ""));
		} catch (ACLException e) {
			LOG.error("ACLRoleAO.doCreateRole.ACLException", e);
			context.put("json", retJson(null, FAIL, ""));
		} catch (Exception e) {
			LOG.error("ACLRoleAO.doCreateRole.Exception", e);
			context.put("json", retJson(null, FAIL, ""));
		}
	}
	
	/**
	 * 修改角色
	 * @param rundata
	 * @param context
	 * @throws WebxException
	 */
	public void doUpdateRole(@Param("userId") String userId, @Param("id") String id, @Param("lev") Long lev, @Param("name") String name,
			@Param("isOutsite") String isOutsite, @Param("description") String description, HttpSession session, Context context) throws WebxException {
		RoleParam param = new RoleParam();
		param.setId(id);
		param.setName(name);
		param.setLev(lev);
		param.setIsOutsite(isOutsite);
		param.setDescription(description);
		try {
			this.roleService.updateRole(param, userId);
			context.put("json", retJson(null, SUCCESS, ""));
		} catch (ACLException e) {
			LOG.error("ACLRoleAO.doUpdateRole.ACLException", e);
			context.put("json", retJson(null, FAIL, ""));
		} catch (Exception e) {
			LOG.error("ACLRoleAO.doUpdateRole.Exception", e);
			context.put("json", retJson(null, FAIL, ""));
		}
	}
	
	/**
	 * 删除角色, 跟新状态
	 * @param rundata
	 * @param context
	 * @throws WebxException
	 */
	public void doDelRole(@Param("id") String id, HttpSession session, Context context) throws WebxException {
		try {
		     //删除角色前，需要做判断，角色下面不能关联权限
		     PageParam<ResourceParam> r = dcmsResourceService.findByRoleID(id, new ResourceParam(), 1, 1, true);
		     if(r!=null  && r.getAllRow()>0){
		    	 context.put("json", retJson(null, FAIL, ""));
		     }
		     
			 this.roleService.delRole(id);
			 context.put("json", retJson(null, SUCCESS, ""));
		} catch (ACLException e) {
			LOG.error("ACLRoleAO.doDelRole.ACLException", e);
			context.put("json", retJson(null, FAIL, ""));
		} catch (Exception e) {
			LOG.error("ACLRoleAO.doDelRole.Exception", e);
			context.put("json", retJson(null, FAIL, ""));
		}
	}
}
