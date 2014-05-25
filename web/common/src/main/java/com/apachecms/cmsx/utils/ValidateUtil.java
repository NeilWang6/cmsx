package com.apachecms.cmsx.utils;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.oro.text.regex.MalformedPatternException;
import org.apache.oro.text.regex.Pattern;
import org.apache.oro.text.regex.Perl5Compiler;
import org.apache.oro.text.regex.Perl5Matcher;

import com.alibaba.citrus.service.requestcontext.rundata.RunData;
import com.alibaba.citrus.turbine.TurbineRunData;
import com.alibaba.citrus.util.StringUtil;

public class ValidateUtil {
	   // callback和var输入值限定正则表达式
    private static final String regex = "^[a-zA-Z]{1}[a-zA-Z0-9._]{0,49}$";

    private static Pattern      pattern;

    private static Log       log   = LogFactory.getLog(ValidateUtil.class);

    static {
        try {
            pattern = new Perl5Compiler().compile(regex, Perl5Compiler.READ_ONLY_MASK);
        } catch (MalformedPatternException e) {
            throw new RuntimeException("AbstractNoTemplateVavle pattern compile error ! ", e);
        }
    }

    /**
     * 验证callback串
     * 
     * @param input
     * @return
     */
    public static boolean checkJsonVarAndCallBackName(String input) {
        if (StringUtil.isBlank(input) || pattern == null || !(new Perl5Matcher()).matches(input, pattern)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 输出JSONP
     * 
     * @param rundata
     * @param callback
     * @param model
     */
    public static void outputJSONP(TurbineRunData rundata, String callback, Map model) {
        try {
            rundata.setLayoutEnabled(false);
            rundata.setLayout(null); 
            if (checkJsonVarAndCallBackName(callback)) {
                StringBuffer sb = new StringBuffer(callback);
                sb.append("(");
                sb.append(JSON.toJSONString(model));
                sb.append(")");
                HttpServletResponse response = rundata.getResponse();
                response.setHeader("Content-Type", "text/javascript");
                response.getWriter().print(sb.toString());
            } else {
                HttpServletResponse response = rundata.getResponse();
                response.setHeader("Content-Type", "text/javascript");
                response.getWriter().print("");
            }
        } catch (IOException e) {
            log.error(e);
        }
    }

    /**
     * 输出JSON串
     * 
     * @param rundata
     * @param model
     */
    public static void outputJSON(TurbineRunData rundata, Map model) {
        try {
        	rundata.setLayoutEnabled(false);
            HttpServletResponse response = rundata.getResponse();
            response.getWriter().print(JSON.toJSONString(model));
        } catch (IOException e) {
            log.error(e);
        }
    }

    /**
     * 禁用chrome浏览器XSS检查
     * 
     * @param rundata
     */
    public static void disableXSSCheck(RunData rundata) {
        rundata.getResponse().setHeader("X-XSS-protection", "0");
    }
}
