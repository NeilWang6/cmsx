package com.apachecms.cmsx.auth.permission.service;

/**
 * 类PermissionService.java的实现描述：判断是否有权限访问<br>
 * 每一次页面请求都会把它转化成一个screen，action，以此判断当前请求是否有权限
 *
 * @author zhengqinming
 *
 */
public interface PermissionService {

    /**
     * 判断用户是否有权限访问
     * 
     * @param urlEscaped 访问的请求，如offer.sceen.manager,offer.action.post
     * @param role 用户角色，现在有FREE，TP，EMPLOYER，如果未登录，则传递null值
     * @return true 可以访问页面，false不可以访问页面
     */
    public boolean havePermission(String urlEscaped, String role);
}
