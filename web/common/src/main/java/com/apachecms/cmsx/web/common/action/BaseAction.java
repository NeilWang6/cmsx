package com.apachecms.cmsx.web.common.action;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;
 
public class BaseAction {
	protected static String SUCCESS = "success";
    protected static String FAIL    = "fail";
    protected static String JSON_KEY = "json";
    
    protected String retJson(Object user, String code, String message) {
        JSONObject retJson = new JSONObject();
        retJson.element("data", user);
        retJson.put("status", code);
        retJson.put("msg", message);
        return retJson.toString();
    }
    
    public static String retJson(Object user, String code, String message, String callback) {
        JSONObject retJson = new JSONObject();
        retJson.element("data", user);
        retJson.put("status", code);
        retJson.put("msg", message);
        if (null != callback && !"".equals(callback.trim())) {
            return callback + "(" + retJson.toString() + ")";
        }
        return retJson.toString();
    }
    
    public static void printStream(HttpServletResponse response, String str) {
        // response.setContentType("text/xml; charset=utf-8");
        PrintWriter out = null;
        try {

            out = response.getWriter();
            out.write(str);
            out.flush();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (null != out) {
                out.close();
            }
        }
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
}
