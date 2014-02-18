package com.apachecms.cmsx.web.common.util;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.apachecms.cmsx.common.AuthToken;
import com.apachecms.cmsx.common.SessionConstant;


public class CommonUtil implements SessionConstant{

	public static Date getNowDate() {
		return new Date();
	}

	public static String getIpAddr(HttpServletRequest request) {
		String ip = request.getHeader("x-forwarded-for");
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}
		return ip;
	}
	
	/**
	 * 从sesion中获取登录账号
	 * @param request
	 * @return
	 */
	public static AuthToken getAuthToken(HttpServletRequest request){
		HttpSession session = request.getSession();
		AuthToken authToken = new AuthToken();
		authToken.setUserId((String)session.getAttribute(SESSION_KEY_USER_ID));
		authToken.setUserRoles((List<Long>)session.getAttribute(SESSION_KEY_USER_ROLES));
		authToken.setResCodes((List<String>)session.getAttribute(SESSION_KEY_RES_CODES));
		authToken.setIp(getIpAddr(request));
		return authToken;
	}
}
