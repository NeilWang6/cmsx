package com.apachecms.cmsx.auth.cookie;


import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 类IsLoginCookieProcess.java的实现描述：用来记录会员是否登录的cookie，这个cookie只准UI调用，其他不准调用
 *  
 */
public class IsLoginCookieProcess {

    // 用于前端展示当前会员是否登录，接下来将由下面这个cookie来替换，待删除
    private static String COOKIE_NAME          = "__cn_logon__";
    // 用于前端展示当前登录会员的id
    private static String COOKIE_LOGON_ID_NAME = "__cn_logon_id__";
    private static String COOKIE_DOMAIN        = ".java-cms.com"; 
    private static String COOKIE_PATH          = "/";

    /**
     * 写前端使用的cookie
     * 
     * @param reponse
     * @param cookieValue
     * @param loginId
     */
    public static void writeCookie(HttpServletRequest request, HttpServletResponse reponse, boolean cookieValue,
                                   String loginId) {

        Cookie cookie = new Cookie(COOKIE_NAME, Boolean.toString(cookieValue));
        setCookieDomain(cookie, request);
        cookie.setPath(COOKIE_PATH);
        reponse.addCookie(cookie);

        Cookie logonCookie = new Cookie(COOKIE_LOGON_ID_NAME, loginId);
        setCookieDomain(logonCookie, request);
        logonCookie.setPath(COOKIE_PATH);
        reponse.addCookie(logonCookie);
    }

    /**
     *  按照request确定Cookie的domain
     * 
     * @param cookie
     */
    private static void setCookieDomain(Cookie cookie, HttpServletRequest request) {
        //String requestDomain = request.getHeader("host");
        /*if (StringUtils.indexOf(requestDomain, COOKIE_DOMAIN) != -1) {
            cookie.setDomain(COOKIE_DOMAIN);
        } else {
            cookie.setDomain(COOKIE_DOMAIN);
        }*/
        cookie.setDomain(COOKIE_DOMAIN);
    }
}
