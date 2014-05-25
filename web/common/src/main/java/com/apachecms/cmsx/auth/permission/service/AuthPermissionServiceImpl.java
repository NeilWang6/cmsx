package com.apachecms.cmsx.auth.permission.service;


import org.springframework.beans.factory.InitializingBean;
import org.springframework.util.Assert;

import com.apachecms.cmsx.auth.permission.objs.URLAccessObject;

/**
 * 权限验证service实现类 usage:根据角色判断用户是否有权限访问
 * 
 * @author chao.qianc 2011-12-1 下午02:26:43
 */
public class AuthPermissionServiceImpl implements AuthPermissionService, InitializingBean {

    /**
     * 默认访问应用都需要登录，除了那几个不需要登录的页面<br>
     */
    private boolean         denyAccess = false;

    /** 在urlProtectd里面，默认所有页面都是需要登录访问的，只有URL配置了对应的角色，才可以访问该url */
    private URLAccessObject urlProtected;
    /** 不需要保护的URL */
    private URLAccessObject urlNotProtected;

    @Override
    public boolean havePermission(String urlEscaped, String role) {
        Assert.hasText(urlEscaped, "accessName can not be empty");
        if (denyAccess) {
            if (role != null || role == null && urlNotProtected != null
                && urlNotProtected.canAccessForUrlNotProtected(urlEscaped)) {
                return true;
            } else {
                return false;
            }
        } else {
            if (urlProtected != null && urlProtected.canAccessForUrlProtected(urlEscaped, role)) {
                return true;
            } else {
                return false;
            }
        }
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        Assert.state(urlProtected == null || urlNotProtected == null,
                     "urlProtected and urlNotProtected can not both exist");
    }

    public void setDenyAccess(boolean denyAccess) {
        this.denyAccess = denyAccess;
    }

    public void setUrlProtected(URLAccessObject urlProtected) {
        this.urlProtected = urlProtected;
    }

    public void setUrlNotProtected(URLAccessObject urlNotProtected) {
        this.urlNotProtected = urlNotProtected;
    }

}
