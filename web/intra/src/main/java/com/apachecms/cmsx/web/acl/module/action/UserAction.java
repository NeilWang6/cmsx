package com.apachecms.cmsx.web.acl.module.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.service.form.Group;
import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.TurbineRunData;
import com.alibaba.citrus.turbine.dataresolver.FormGroup;
import com.alibaba.citrus.turbine.dataresolver.Param;
import com.alibaba.citrus.util.Paginator;
import com.alibaba.citrus.util.StringUtil;
import com.alibaba.citrus.webx.WebxException;
import com.apachecms.cmsx.acl.IUserService;
import com.apachecms.cmsx.acl.param.UserParam;
import com.apachecms.cmsx.common.AuthToken;
import com.apachecms.cmsx.dal.dao.common.PageInfo;
import com.apachecms.cmsx.dal.dataobject.CmsUser;
import com.apachecms.cmsx.web.common.action.BaseAction;
import com.apachecms.cmsx.web.common.util.CommonUtil;

public class UserAction extends BaseAction {
	private static final Log LOG = LogFactory.getLog(UserAction.class);

	private static final int PAGE_SIZE = 15;
	@Autowired
	private IUserService userService;

	/**
	 *  
	 * @param rundata
	 * @param context
	 * @throws WebxException
	 */

	public void doUserList(TurbineRunData rundata, Context context, @Param("name") String name, @Param("status") String status) throws WebxException { 
		Integer currentPage = rundata.getParameters().getInt("page", 1);
		Integer pageSize = rundata.getParameters().getInt("pageSize", PAGE_SIZE);
		if (pageSize.intValue() <= 0) {
			pageSize = PAGE_SIZE;
		}
		Paginator paginator = new Paginator(PAGE_SIZE);
		paginator.setPage(currentPage); 
		try {
			UserParam param = new UserParam(); 
			param.setUserId(name);
			param.setFullName(name);
			param.setStatus(status);
			 
			PageInfo<CmsUser> data = userService.findByWhere(param, currentPage, pageSize);
			int count = 0;
			List list = new ArrayList();
			if (data != null) {
				count = data.getAllRow();
				list = data.getList();
			}
			paginator.setItems(count);
			context.put("list", list);
			context.put("paginator", paginator);
			context.put("name", name); 
			context.put("status", status);
		} catch (Exception e) {
			LOG.error("system error", e);
			rundata.setRedirectTarget("error.vm");
		}
	}

//	/**
//	 * 角色赋予权限
//	 * 
//	 * @param rundata
//	 * @param context
//	 * @throws WebxException
//	 */
//	public void doGetUser2Role(TurbineRunData rundata, Context context) throws WebxException {
//
//		String roleId = rundata.getParameters().getString("roleId");
//		if (StringUtil.isBlank(roleId)) {
//			return;
//		}
//		String resourceType = rundata.getParameters().getString("resourceType");
//		String name = rundata.getParameters().getString("name");
//		String appName = rundata.getParameters().getString("appName");
//		// 已选择/未选择
//		boolean isSelect = rundata.getParameters().getBoolean("isSelect", true);
//
//		Integer currentPage = rundata.getParameters().getInt("page", 1);
//		// 1,根据角色id获取已经赋予的资源ids
//
//		Paginator paginator = new Paginator(PAGE_SIZE);
//		paginator.setPage(currentPage);
//
//		context.put("resourceType", resourceType);
//
//		try {
//			// 调用接口 resourceService,已经改成选中和未选中的的分页查询了
//			UserParam resourceParam = new UserParam();
//			resourceParam.setName(name);
//			resourceParam.setAppName(appName);
//			resourceParam.setResourceType(resourceType);
//
//			PageParam<UserParam> pList = userService.findByRoleID(roleId, resourceParam, currentPage, PAGE_SIZE, isSelect);
//			Integer count = 0;
//			List list = new ArrayList();
//			if (pList != null) {
//				count = pList.getAllRow();
//				list = pList.getList();
//			}
//
//			// 角色信息放里面
//			RoleParam role = roleService.getRoleByID(roleId);
//
//			// 设置数据
//			paginator.setItems(Integer.parseInt(count.toString()));
//			context.put("list", list);
//			context.put("paginator", paginator);
//			context.put("name", name);
//			context.put("resourceType", resourceType);
//			context.put("appName", appName);
//			//
//			context.put("role", role);
//			context.put("isSelect", isSelect);
//			context.put("roleId", roleId);
//
//		} catch (Exception e) {
//			LOG.error("system error", e);
//			rundata.setRedirectTarget("error.vm");
//		}
//
//	}

	public void doSaveOrUpdateUser(TurbineRunData rundata, Context context,@FormGroup("userParam") Group group) throws WebxException {
		AuthToken authToken = CommonUtil.getAuthToken(rundata.getRequest());
		 
		try { 
			UserParam data = new UserParam();
			group.setProperties(data); 

			if (StringUtil.isBlank(data.getId())) {
				userService.create(data, authToken.getUserId());
			} else {
				userService.update(data, authToken.getUserId());
			}
			context.put("json", retJson(data.getId(), SUCCESS, ""));
		} catch (Exception e) {
			LOG.error(e.getMessage(), e);
			context.put("msg", e.getMessage());
			context.put("json", retJson(null, FAIL, e.getMessage()));
		}
	}

	/**
	 * 删除角色, 跟新状态
	 * 
	 * @param rundata
	 * @param context
	 * @throws WebxException
	 */
	public void doDelUser(TurbineRunData rundata, Context context) throws WebxException {
		AuthToken authToken = CommonUtil.getAuthToken(rundata.getRequest());
		String id = rundata.getParameters().getString("id", "");
		if (StringUtil.isBlank(id)) {
			return;
		}
		try {
			userService.delete(id, authToken.getUserId());
			context.put("json", retJson(null, SUCCESS, ""));
		} catch (Exception e) {
			LOG.error(e.getMessage(), e);
			context.put("json", retJson(null, FAIL, e.getMessage()));
		}
	}

//	public void doOperateRoleResource(TurbineRunData rundata, Context context) throws WebxException {
//		AuthToken authToken = CommonUtil.getAuthToken(rundata.getRequest());
//		String roleId = rundata.getParameters().getString("roleId", "");
//		String operateType = rundata.getParameters().getString("operateType");
//		String userIds = rundata.getParameters().getString("userIds");
//		String userId = authToken.getUserId();
//
//		if (StringUtil.isBlank(roleId) || StringUtil.isBlank(operateType) || StringUtil.isBlank(userIds)) {
//			return;
//		}
//		try {
//			String[] users = userIds.replaceAll("，", ",").split(",");
//			List userList = CollectionUtil.createArrayList(users);
//			if ("del".equals(operateType)) {
//				grantService.delUsers2Role(roleId, userList);
//			} else if ("add".equals(operateType)) {
//				grantService.addUsers2Role(roleId, userList, userId);
//			}
//			context.put("json", retJson(null, SUCCESS, ""));
//		} catch (Exception e) {
//			LOG.error(e.getMessage(), e);
//			throw new WebxException("system error", e);
//		}
//	}
}
