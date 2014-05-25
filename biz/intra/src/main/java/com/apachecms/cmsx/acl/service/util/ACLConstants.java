package com.apachecms.cmsx.acl.service.util;

/**
 * ACL常量
 * @author liuxinl.lx
 */
public class ACLConstants {
	public static final int DEFAULT_TIMEOUT             = 10 * 60;
	
	public static final String DCMS                     = "dcms";
	public static final String DCMSUP                   = DCMS.toUpperCase();

	// tair临时缓存
    public static final String _MENU_TEMP_CACHE         = "_MENU_TEMP_CACHE";
    
    public static final String _ROLE_RES_CHANGE_SET     = "_ROLE_RES_CHANGE_SET";
    // 操作临时缓存
    public static final String _PERMISSION_TEMP_CACHE   = "_PERMISSION_TEMP_CACHE";
		
	// tair永久缓存
    public static final String _RESOURCE_WHITE          = "_RESOURCE_WHITE";
    public static final String _ACTION_RESOURCE_GENERAL = "_ACTION_RESOURCE_GENERAL";
    public static final String _URL_RESOURCE_GENERAL    = "_URL_RESOURCE_GENERAL";
    public static final String _MENU_RESOURCE_TREE      = "_MENU_RESOURCE_TREE";
    public static final String _OPERATE_RESOURCE        = "_OPERATE_RESOURCE";
		
    public static final String WHITE                    = "1";
    public static final String NOTWHITE                 = "0";
    public static final String EFFECTIVE                = "1";
    public static final String MENU                     = "menu";
    public static final String URL                      = "url";
    public static final String ACTION                   = "action";
    
    public static final String STATUS_GRANT             = "1";
    
    public static final String SPOT                     = ".";
    
    public static final String LEFT_SLASH               = "/";
}