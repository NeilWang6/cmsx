package com.apachecms.cmsx.auth.utils;

import org.apache.commons.lang.StringUtils;

import com.apachecms.cmsx.common.security.BaseDesSecurity;

public class AuthzSecurityUtil {

    private static final String    LOGIN_ID_SECRET_KEY = "mad%g=-.a43c9elj";
    private static BaseDesSecurity des                 = new BaseDesSecurity();

    public static String encodeForLoginId(String text) {
        String code = des.encode(text, LOGIN_ID_SECRET_KEY);
        if (!StringUtils.isEmpty(code) && code.length() > 10) {
            return code.substring(0, 10);
        }
        return code;
    }
}