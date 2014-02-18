package com.apachecms.cmsx.auth.access.roles;
 
/**
 * 类AccessRole.java的实现描述：用户访问页面的角色类型 <br>
 * <strong>注：此角色只能用于页面权限判断，外部应用不能应用</strong>
 * 
 * @author zhengqinming 
 */
public enum AccessRole {
    // 高级会员
    TP,
    // 免费会员
    FREE,
    // 员工
    EMPLOYEE;

}