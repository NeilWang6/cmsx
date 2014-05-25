package com.apachecms.cmsx.web.acl.module.action;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.TurbineRunData;
import com.alibaba.citrus.util.CollectionUtil;
import com.alibaba.citrus.util.Paginator;
import com.alibaba.citrus.util.StringUtil;
import com.alibaba.citrus.webx.WebxException;
import com.apachecms.cmsx.acl.IGrantService;
import com.apachecms.cmsx.acl.IRoleService;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.PageParam;
import com.apachecms.cmsx.acl.param.ResourceParam;
import com.apachecms.cmsx.acl.param.RoleParam;
import com.apachecms.cmsx.acl.service.permission.IDcmsPermissionService;
import com.apachecms.cmsx.acl.service.resource.IDcmsResourceService;
import com.apachecms.cmsx.common.AuthToken;
import com.apachecms.cmsx.web.common.action.BaseAction;
import com.apachecms.cmsx.web.common.util.CommonUtil;

/**
 * 类NewPermissionManagerAction.java的实现描述：新版权限管理:包括url管理，菜单管理，action管理
 * 
 * @author xiaoquan
 */
public class AclPermissionAction extends BaseAction{

    private static final Log LOG = LogFactory.getLog(AclPermissionAction.class);

    private static final int    PAGE_SIZE = 15;
    @Autowired
    private IDcmsResourceService dcmsResourceService;
    @Autowired
    private IGrantService grantService;
    @Autowired
    private IRoleService roleService;
  
    @Autowired 
    private IDcmsPermissionService permissionService;
    
    private static final String PERMISSIONPARAM = "permission_param";
  
    
	/**
     * 后台维护使用,权限列表
     * 
     * @param rundata
     * @param context
     * @throws WebxException
     */

    public void doPermissionList(TurbineRunData rundata, Context context) throws WebxException {
        
        // 这个字段保留，url,menu,action, 
        String resourceType = rundata.getParameters().getString("resourceType");
        String name = rundata.getParameters().getString("name");
        String appName = rundata.getParameters().getString("appName");
        Integer currentPage = rundata.getParameters().getInt("page", 1);
        Integer pageSize = rundata.getParameters().getInt("pageSize",PAGE_SIZE);
        if(pageSize.intValue()<=0){
        	pageSize = PAGE_SIZE;
        }
        Paginator paginator = new Paginator(PAGE_SIZE);
        paginator.setPage(currentPage);
        // Integer offset = (page - 1) * PAGE_SIZE; 
        
        //FIXME 请补充下面的查询逻辑，根据type类型查询：url列表，菜单树形结构，action列表
        
        //FIXME 以下数据时模拟，请按正常逻辑填写
        try {
            ResourceParam param=new ResourceParam();
           
            param.setResourceType(resourceType);
            param.setName(name);
            param.setAppName(appName);
            param.setCode(null);
            //
            PageParam<ResourceParam> data= dcmsResourceService.findByWhere(param, currentPage, pageSize); 
            int count = 0;
            List list = new ArrayList();
            if(data!=null){
                count = data.getAllRow();
                list = data.getList();
            } 
            paginator.setItems(count);
            context.put("list", list);
            context.put("paginator", paginator);
            context.put("name", name);
            context.put("resourceType", resourceType);
            context.put("appName", appName);
        } catch (ACLException e) {
        	LOG.error("AclPermissionAO.doGetPermissionList.ACLException", e); 
            rundata.setRedirectTarget("error.vm");
        } catch (Exception e) {
        	LOG.error("AclPermissionAO.doGetPermissionList.Exception", e); 
            rundata.setRedirectTarget("error.vm");
        } 
    }
    /**
     * 角色赋予权限
     * @param rundata
     * @param context
     * @throws WebxException
     */
    public void doGetPermission2Role(TurbineRunData rundata, Context context) throws WebxException {
    	
        String roleId = rundata.getParameters().getString("roleId");
        if(StringUtil.isBlank(roleId)){
            return;
        }
        String resourceType = rundata.getParameters().getString("resourceType");
        String name = rundata.getParameters().getString("name");
        String appName = rundata.getParameters().getString("appName");
        //已选择/未选择
        boolean isSelect = rundata.getParameters().getBoolean("isSelect",true);
        
        Integer currentPage = rundata.getParameters().getInt("page", 1);
        //1,根据角色id获取已经赋予的资源ids
        
        Paginator paginator = new Paginator(PAGE_SIZE);
        paginator.setPage(currentPage);
                
        context.put("resourceType", resourceType);
        
        try { 
            //调用接口 resourceService,已经改成选中和未选中的的分页查询了
            ResourceParam resourceParam=new ResourceParam();
            resourceParam.setName(name);
            resourceParam.setAppName(appName);
            resourceParam.setResourceType(resourceType);
            
            PageParam<ResourceParam> pList=dcmsResourceService.findByRoleID(roleId, resourceParam, currentPage, PAGE_SIZE, isSelect);
            Integer count = 0;
            List list = new ArrayList();
            if(pList!=null){
                count = pList.getAllRow();
                list = pList.getList();
            }
            
            //角色信息放里面
            RoleParam role= roleService.getRoleByID(roleId); 
             
            // 设置数据
            paginator.setItems(Integer.parseInt(count.toString()));
            context.put("list", list);
            context.put("paginator", paginator);
            context.put("name", name);
            context.put("resourceType", resourceType);
            context.put("appName", appName);
            //
            context.put("role",  role );
            context.put("isSelect", isSelect);
            context.put("roleId", roleId);
            
        } catch (ACLException e) {
        	LOG.error("AclPermissionAO.doGetRolePermissions.ACLException", e);
            rundata.setRedirectTarget("error.vm"); 
        } catch (Exception e) {
        	LOG.error("AclPermissionAO.doGetRolePermissions.Exception", e);
            rundata.setRedirectTarget("error.vm");
        }
         
        
    }

    public void doSaveOrUpdatePermission(TurbineRunData rundata, Context context) throws WebxException {
    	AuthToken authToken = CommonUtil.getAuthToken(rundata.getRequest());
        String id = rundata.getParameters().getString("id");
        String resourceType = rundata.getParameters().getString("resourceType");
        String appName = rundata.getParameters().getString("appName");
        String code = rundata.getParameters().getString("code");
        String url = rundata.getParameters().getString("url");
        String description = rundata.getParameters().getString("description");
        String isWhite = rundata.getParameters().getString("isWhite");
        String name = rundata.getParameters().getString("name"); 
        
        //FIXME 调用接口
        try {
            
            ResourceParam data=new ResourceParam();
            data.setId(id);
            data.setResourceType(resourceType);
            data.setAppName(appName);
            data.setCode( code);
            data.setUrl(url);
            data.setDescription(description);
            data.setIsWhite(isWhite); 
            data.setName(name); 
            
            if(StringUtil.isBlank(data.getId())){
            	dcmsResourceService.create(data, authToken.getUserId());
            }else{
            	dcmsResourceService.update(data, authToken.getUserId());
            } 
            context.put("json", retJson(data.getId(), SUCCESS, ""));
        } catch (ACLException e) { 
            context.put("msg", e.getMessage());
            context.put("json", retJson(null, FAIL, e.getMessage()));
            LOG.error("AclPermissionAO.doSaveOrUpdatePermission.ACLException", e); 
        } catch (Exception e) { 
            context.put("msg", e.getMessage());
            context.put("json", retJson(null, FAIL, e.getMessage()));
            LOG.error("AclPermissionAO.doSaveOrUpdatePermission.Exception", e);
        }
    }

    /**
     * 删除角色, 跟新状态
     * 
     * @param rundata
     * @param context
     * @throws WebxException
     */
    public void doDelResource(TurbineRunData rundata, Context context) throws WebxException {
    	AuthToken authToken = CommonUtil.getAuthToken(rundata.getRequest());
        String id = rundata.getParameters().getString("id", "");
        if (StringUtil.isBlank(id)) { 
            return;
        }
        try {   
        	dcmsResourceService.delete(id, authToken.getUserId());
        	context.put("json", retJson(null, SUCCESS, ""));
        } catch (ACLException e) {
            LOG.error("AclPermissionAO.doSaveOrUpdatePermission.ACLException", e);
            context.put("json", retJson(null, FAIL, ""));
        } catch (Exception e) {
        	LOG.error("AclPermissionAO.doSaveOrUpdatePermission.Exception", e);
        	throw new WebxException("ACLRoleAction.doDelRole:", e);
        }
    }
    
    public void doOperateRoleResource(TurbineRunData rundata, Context context) throws WebxException {
    	AuthToken authToken = CommonUtil.getAuthToken(rundata.getRequest());
        String roleId = rundata.getParameters().getString("roleId", "");
        String operateType = rundata.getParameters().getString("operateType");
        String permissionIds = rundata.getParameters().getString("permissionIds");
        String userId =authToken.getUserId();
        
        if (StringUtil.isBlank(roleId) ||StringUtil.isBlank(operateType) ||StringUtil.isBlank(permissionIds) ) {
            return;
        }
        try { 
            String[] permissions=permissionIds.replaceAll("，", ",").split(",");           
            List permissionList=CollectionUtil.createArrayList(permissions);
            if("del".equals(operateType)){
                grantService.delPermissions2Role(roleId, permissionList);
            }else if("add".equals(operateType)){
                grantService.addPermissions2Role(roleId, permissionList, userId);       
            }         
            context.put("json", retJson(null, SUCCESS, ""));
        } catch (ACLException e) {
            LOG.error("AclPermissionAO.doOperateRolePermission.ACLException", e);
            context.put("json", retJson(null, FAIL, ""));
        } catch (Exception e) {
        	LOG.error("AclPermissionAO.doOperateRolePermission.Exception", e);
        	throw new WebxException("AclPermissionAO.doOperateRolePermission:", e);
        }
    }
}
