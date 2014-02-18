package com.apachecms.cmsx.utils;

import java.util.ArrayList;
import java.util.List;

/**
 * 类StringSplitUtil.java的实现描述：增量split
 * 
 * @author chao.qianc 2011-12-8 下午05:48:23
 */
public class StringSplitUtil {

    /**
     * 将字符串按指定字符增量分割
     * <p>
     * 分隔符不会出现在目标数组中，连续的分隔符就被看作一个。如果字符串为<code>null</code>，则返回<code>null</code>。
     * 
     * <pre>
     * StringUtil.split(null, *)         = null
     * StringUtil.split("", *)           = []
     * StringUtil.split("a.b.c", '.')    = ["a", "a.b", "a.b.c"]
     * StringUtil.split("a..b.c", '.')    = ["a", "a..b", "a..b.c"] //这种情况需要注意
     * </pre>
     * 
     * </p>
     * 
     * @param str 要分割的字符串
     * @param separatorChar 分隔符
     * @return 分割后的字符串数组，如果原字符串为<code>null</code>，则返回<code>null</code>
     */
    public static List<String> split(String str, char separatorChar) {
        if (str == null) {
            return null;
        }

        int length = str.length();

        if (length == 0) {
            return new ArrayList<String>();
        }

        List<String> list = new ArrayList<String>();
        int i = 0;
        boolean match = false;

        while (i < length) {
            if (str.charAt(i) == separatorChar) {
                if (match) {
                    list.add(str.substring(0, i));
                    match = false;
                }
                i++;
                continue;
            }

            match = true;
            i++;
        }
        list.add(str);

        return list;
    }
}
