package com.apachecms.cmsx.auth.permission.objs;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.util.Assert;

import com.apachecms.cmsx.auth.access.permission.constants.PermissionConstant;
import com.apachecms.cmsx.utils.StringSplitUtil;

/**
 * 类URLAccessObject.java的实现描述：存储URL以及对应的访问用户
 * 
 * @author chao.qianc 2011-12-2 下午01:40:44
 */
public class URLAccessObject {

    private Map<String, Set<String>> urlAccessObj;

    /**
     * 判断urlEscaped能不能访问 判断规则如下：<br>
     * 如一个a.b.c.d的请求<br>
     * 那先会判断a,有否限权，如有，则进行判断，并直接返回<br>
     * 再判断a.b是否有全，如有，则进行判断，并直接返回，以此类推<br>
     * 
     * @param urlEscaped
     * @param role 如果用户登录了，role就不能为空，否则为空
     * @return
     */
    public boolean canAccessForUrlProtected(String urlEscaped, String role) {
        Assert.hasText(urlEscaped);
        List<String> urls = StringSplitUtil.split(urlEscaped, PermissionConstant.DELIM);
        for (String url : urls) {
            if (urlAccessObj.containsKey(url)) {
                Set<String> roles = urlAccessObj.get(url);
                if (role != null && roles != null && roles.contains(role)) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        return true;
    }

    public URLAccessObject(){
        this.urlAccessObj = new HashMap<String, Set<String>>();
    }

    public void addUrlType(String urlEscaped, Set<String> roles) {
        Assert.notNull(urlEscaped);
        urlAccessObj.put(urlEscaped, roles);
    }

    /**
     * 判断url 是否是不保护的。判断规则如下： 若访问url为a.b.c,<br>
     * 若配置了a，则返回 true，否则继续判断<br>
     * 若配置了a.b 则返回true，否则继续判断<br>
     * 若配置了a.b.c 则返回true，否则继续判断<br>
     * 
     * @return 如果可以访问，返回true，不可以则返回false
     */
    /**
     * @param urlEscaped
     * @return
     */
    public boolean canAccessForUrlNotProtected(String urlEscaped) {
        Assert.hasText(urlEscaped);
        List<String> urls = StringSplitUtil.split(urlEscaped, PermissionConstant.DELIM);
        for (String url : urls) {
            if (urlAccessObj != null && urlAccessObj.containsKey(url)) {
                return true;
            }
        }
        return false;
    }
}
