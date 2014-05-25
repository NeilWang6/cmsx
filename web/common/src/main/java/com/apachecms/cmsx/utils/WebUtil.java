package com.apachecms.cmsx.utils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.oro.text.perl.Perl5Util;
 

import com.alibaba.citrus.turbine.TurbineRunData;
import com.alibaba.citrus.util.ArrayUtil;
import com.alibaba.citrus.util.StringEscapeUtil;
import com.alibaba.citrus.util.StringUtil;
import com.alibaba.citrus.webx.util.WebxUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;

/**
 * 工具类 
 */
@SuppressWarnings({ "rawtypes", "unchecked" })
public class WebUtil {

    private static final String REG_EXP_SCRIPT_TO_NULL       = "s/<([^<>]*)script([^<]*)>(.*)<\\/([^<>]*)script([^<]*)>//ig";
    private static final String REG_EXP_OBJECT_TO_NULL       = "s/<object([^<]*)>(.*)<\\/object([^<]*)>//ig";
    private static final String REG_EXP_EMBED_TO_NULL        = "s/<embed([^<]*)>(.*)<\\/embed([^<]*)>//ig";
    private static final String REG_EXP_APPLET_TO_NULL       = "s/<applet([^<]*)>(.*)<\\/applet([^<]*)>//ig";
    private static final String REG_EXP_SCRIPT_TO_TXT        = "s/<([^<>]*)script([^<]*)>/ &lt;$1script$2&gt; /ig";
    private static final String REG_EXP_OBJECT_TO_TXT        = "s/<([^<>]*)object([^<]*)>/ &lt;$1object$2&gt; /ig";

    // private static final String REG_EXP_EMBED_TO_TXT =
    // "s/<([^<>]*)embed([^<]*)>/ &lt;$1embed$2&gt; /ig";
    private static final String REG_EXP_APPLET_TO_TXT        = "s/<([^<>]*)applet([^<]*)>/ &lt;$1applet$2&gt; /ig";
    private static final String REG_EXP_HTML_TAG_TO_PURETEXT = "s/<([^<>]*)([^<]*)>//isg";
    private static final String localeDateFormat             = "yyyy/MM/dd";
    private static final String REG_EXP_BRS_TO_BR            = "s/(\\n|\\r)+(&nbsp;|\\s)*(\\r|\\n)*|(\\n|\\r)*(&nbsp;|\\s)*(\\r|\\n)+/ \n /ig";

    public static int[] splitIds(String ids) {
        if (StringUtil.isBlank(ids)) {
            return null;
        }
        String[] idArray = StringUtil.split(ids, ",");
        if (ArrayUtil.isEmptyArray(idArray)) {
            return null;
        }
        int[] results = new int[idArray.length];
        for (int i = 0; i < idArray.length; i++) {
            results[i] = Integer.parseInt(idArray[i].trim());
        }
        return results;
    }

    public static long[] splitIdstolong(String ids) {
        if (StringUtil.isBlank(ids)) {
            return null;
        }
        String[] idArray = StringUtil.split(ids, ",");
        if (ArrayUtil.isEmptyArray(idArray)) {
            return null;
        }
        long[] results = new long[idArray.length];
        for (int i = 0; i < idArray.length; i++) {
            results[i] = Long.parseLong(idArray[i].trim());
        }
        return results;
    }

    public static Long[] splitIdstoLong(String ids) {
        if (StringUtil.isBlank(ids)) {
            return null;
        }
        String[] idArray = StringUtil.split(ids, ",");
        if (ArrayUtil.isEmptyArray(idArray)) {
            return null;
        }
        Long[] results = new Long[idArray.length];
        for (int i = 0; i < idArray.length; i++) {
            results[i] = Long.parseLong(idArray[i].trim());
        }
        return results;
    }

    public static Integer[] splitIdsToIntegers(String ids) {
        if (StringUtil.isBlank(ids)) {
            return null;
        }
        String[] idArray = StringUtil.split(ids, ",");
        if (ArrayUtil.isEmptyArray(idArray)) {
            return null;
        }
        Integer[] results = new Integer[idArray.length];
        for (int i = 0; i < idArray.length; i++) {
            results[i] = new Integer(idArray[i]);
        }
        return results;
    }

    public static List<Long> splitIdsToLongs(String ids) {
        if (StringUtil.isBlank(ids)) {
            return null;
        }
        String[] idArray = StringUtil.split(ids, ",");
        if (ArrayUtil.isEmptyArray(idArray)) {
            return null;
        }
        List<Long> results = new ArrayList<Long>(idArray.length);
        for (int i = 0; i < idArray.length; i++) {
            results.add(Long.parseLong(idArray[i]));
        }
        return results;
    }

    public static <T> T[] list2Array(List<T> list) {
        Object[] ids = null;
        if (null != list && !list.isEmpty()) {
            ids = new Object[list.size()];
            for (int i = 0; i < list.size(); i++) {
                ids[i] = list.get(i);
            }
        }
        return (T[]) ids;
    }

    /**
     * 将文本中多余的回车去除，如果多行回车转成一行回车
     * 
     * @param str
     * @return
     */
    public static String brs2br(String str) {
        if (str == null) {
            return "";
        }

        try {
            Perl5Util perl = new Perl5Util();

            str = perl.substitute(REG_EXP_BRS_TO_BR, str);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return str;
    }

    /**
     * 将HTML文本转化为纯文本
     * 
     * @param str
     * @return
     */
    public static String html2PureTxt(String str) {
        if (str == null) {
            return "";
        }

        try {
            Perl5Util perl = new Perl5Util();

            str = perl.substitute(REG_EXP_SCRIPT_TO_NULL, str);
            str = perl.substitute(REG_EXP_OBJECT_TO_NULL, str);
            str = perl.substitute(REG_EXP_EMBED_TO_NULL, str);
            str = perl.substitute(REG_EXP_APPLET_TO_NULL, str);
            str = perl.substitute(REG_EXP_HTML_TAG_TO_PURETEXT, str);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return str;
    }

    public static boolean isEmpty(String str) {
        return StringUtil.isEmpty(str);
    }

    public static String txtToHtm(String str) {
        if (str == null) {
            return "";
        }

        // 屏蔽script,javascript,jscript,vbscript,控制输入,暂时不过滤embed object
        str = object2txt(str);

        // 需要处理<a红红>的错误tag情况
        // 将链接做成html
        str = txt2htm(str);

        // 将回车换行转义
        str = space2html(str);
        return str;
    }

    /**
     * 将txt做成html代码,比如auto link
     * 
     * @param str
     * @return
     */
    public static String txt2htm(String str) {
        if (str == null) {
            return "";
        }

        final String s2 = "s/(^|\\s|\\n)((http|ftp|https):\\/\\/(\\S+|\\n))/ <A HREF=\"$2\" TARGET=_blank>$2<\\/A> /isg";
        final String s3 = "s/(^|\\s|\\n)(www\\.(\\S+|\\n))/ <A HREF=\"http:\\/\\/$2\" TARGET=_blank>$2<\\/A> /isg";

        // autolink
        try {
            Perl5Util perl = new Perl5Util();

            str = perl.substitute(s2, str);
            str = perl.substitute(s3, str);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return str;
    }

    /**
     * 将字符串的空格等不可见内容转化为HTML
     * 
     * @param str
     * @return
     */
    public static String space2html(String str) {
        StringBuffer buf = new StringBuffer(str.length() + 6);
        char ch = ' ';

        for (int i = 0; i < str.length(); i++) {
            ch = str.charAt(i);

            if (ch == '\n') {
                buf.append("<br>");
            } else if (ch == '\t') {
                buf.append("&nbsp;&nbsp;&nbsp;&nbsp;");
            } else {
                buf.append(ch);
            }
        }

        return buf.toString();
    }

    /**
     * 将HTML object转化为文本显示 s = single line; i = case insensitive match; g = global
     * 
     * @param str
     * @return
     */
    public static String object2txt(String str) {
        if (str == null) {
            return "";
        }

        try {
            Perl5Util perl = new Perl5Util();

            str = perl.substitute(REG_EXP_SCRIPT_TO_TXT, str);
            str = perl.substitute(REG_EXP_OBJECT_TO_TXT, str);

            // str = perl.substitute(REG_EXP_EMBED_TO_TXT, str);
            str = perl.substitute(REG_EXP_APPLET_TO_TXT, str);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return str;
    }

    /**
     * 将字符串转换成指定长度的缩略
     * 
     * @param str 要检查的字符串
     * @param maxWidth maxWidth 最大长度，不小于<code>4</code>，如果小于<code>4</code>，则看作<code>4</code>
     * @param replace 把最后一个字替换成"..."
     * @return
     */
    public static String abbreviate(String str, int maxWidth) {
        return abbreviate(str, maxWidth, "…");
    }

    /**
     * 将字符串转换成指定长度的缩略
     * 
     * @param str 要检查的字符串
     * @param maxWidth maxWidth 最大长度，不小于<code>4</code>，如果小于<code>4</code>，则看作<code>4</code>
     * @param replace 把最后一个字替换成replace
     * @return
     */
    public static String abbreviate(String str, int maxWidth, String replace) {
        if (str == null) {
            return null;
        }

        str = html2PureTxt(str);

        // 调整最大宽度
        if (maxWidth < 4) {
            maxWidth = 4;
        }

        if (str.length() <= maxWidth) {
            return str;
        }

        return str.substring(0, maxWidth - 1) + replace;
    }

    /**
     * 截取字符串
     * 
     * @param origin
     * @param begin
     * @param len
     * @return
     */
    public static String substring(String origin, int begin, int len) {
        if (origin == null) {
            return origin;
        }

        int sBegin = (begin < 0) ? 0 : begin;

        // 越出范围处理
        if ((len < 1) || (sBegin > origin.length())) {
            return "";
        }

        if ((len + sBegin) > origin.length()) {
            return origin.substring(sBegin);
        }

        char[] c = origin.toCharArray();
        StringBuffer sb = new StringBuffer();

        for (int i = sBegin, j = sBegin; i < (sBegin + (2 * len)); i++, j++) {
            if (j >= c.length) {
                break;
            }

            sb.append(c[j]);

            if (!isAscii(c[j])) {
                i++;
            }
        }

        return sb.toString();
    }

    public static boolean isAscii(char c) {
        int k = 0x80;

        return ((c / k) == 0) ? true : false;
    }

    /*
     * 隐藏IP 10.0.0.1 -> 10.0.0.*
     */
    public static String hideIP(String ip) {
        if (StringUtils.isNotEmpty(ip)) {
            int lastIndex = ip.lastIndexOf(".");

            return (ip.substring(0, lastIndex) + ".*");
        } else {
            return ip;
        }
    }

    /**
     * 得到2维数组的值
     * 
     * @param arr
     * @param i
     * @param j
     * @return
     */
    public static int get2Array(int[][] arr, int i, int j) {
        return arr[i][j];
    }

    /**
     * 得到1维数组的值
     * 
     * @param arr
     * @param i
     * @return
     */
    public static int getArray(int[] arr, int i) {
        return arr[i];
    }

    /**
     * 得到2维数组的length
     * 
     * @param arr
     * @return
     */
    public static int get2ArrayLength(int[][] arr) {
        return arr.length;
    }

    /**
     * 对date在field上加减plus,比如getDate(new Date(), "YEAR", 1)就是获得明年的这个时候
     * 
     * @param date
     * @param field
     * @param plus
     * @return
     */
    public static Date getDate(Calendar cal, String field, int plus) {
        Calendar calendar = (Calendar) cal.clone();

        if (field.equals("YEAR")) {
            calendar.add(Calendar.YEAR, plus);
        }

        if (field.equals("MONTH")) {
            calendar.add(Calendar.MONTH, plus);
        }

        return calendar.getTime();
    }

    /**
     * date1是否在dateString2表示的时间之前
     * 
     * @param date1
     * @param dateString2
     * @param format
     * @return
     */
    public static boolean before(Date date1, String dateString2, String format) {
        DateFormat formatter = new SimpleDateFormat(format);
        Date date2;

        try {
            date2 = formatter.parse(dateString2);
        } catch (ParseException e) {
            e.printStackTrace();
            date2 = new Date();
        }

        Calendar calendar1 = Calendar.getInstance();
        Calendar calendar2 = Calendar.getInstance();

        calendar1.setTime(date1);
        calendar2.setTime(date2);
        return calendar1.before(calendar2);
    }

    /**
     * 判断是否是当天
     * 
     * @param calendar1
     * @param calendar2
     * @return
     */
    public static boolean isToday(Calendar calendar1, Calendar calendar2) {
        return ((calendar1.get(Calendar.YEAR) == calendar2.get(Calendar.YEAR))
                && (calendar1.get(Calendar.MONTH) == calendar2.get(Calendar.MONTH)) && (calendar1.get(Calendar.DATE) == calendar2.get(Calendar.DATE)));
    }

    /**
     * @param date 秒
     * @param dateFormat
     * @return
     */
    public static String toLocaleString(int posted, String dateFormat) {
        long postedLong = (long) posted * 1000;
        return formatDate(postedLong, dateFormat);
    }

    public static String formatDate(Long posted, String dateFormat) {
        if (posted != null) {
            Date date = new Date(posted);
    
            if ((dateFormat == null) || dateFormat.equals("")) {
                return new SimpleDateFormat(localeDateFormat).format(date);
            } else {
                return new SimpleDateFormat(dateFormat).format(date);
            }
        }
        return "";
    }
    
    /**
     * 兼容日期形
     * @param date
     * @param dateFormat
     * @return
     */
    public static String formatDate(Date date, String dateFormat) {
        if (date == null) return "";
        if ((dateFormat == null) || dateFormat.equals("")) {
            return new SimpleDateFormat(localeDateFormat).format(date);
        } else {
            return new SimpleDateFormat(dateFormat).format(date);
        }
    }

    /**
     * 判断字符串数组是否含有某个字符串
     * 
     * @param str
     * @param searchStr
     * @return
     */
    public boolean isContain(String[] str, String searchStr) {
        List list = Arrays.asList(str);

        return list.contains(searchStr);
    }

    /**
     * 返回该年月在field的相距amount的的年月 日期字符串yyyymm
     * 
     * @param yearMonth
     * @param field year month
     * @return
     */
    public String getDate(int yearMonth, String field, int amount) {
        int year = yearMonth / 100;
        int month = yearMonth % 100;

        if ("year".equals(field)) {
            return String.valueOf(year + amount) +  alignRight(String.valueOf(month), 2, "0");
        } else if ("month".equals(field)) {
            if ((month == 12) && (amount == 1)) {
                return String.valueOf(year + 1) + "01";
            } else if ((month == 1) && (amount == -1)) {
                return String.valueOf(year - 1) + "12";
            } else {
                return String.valueOf(year) +  alignRight(String.valueOf(month + amount), 2, "0");
            }
        }

        return "";
    }
    
    private static String alignRight(String str, int size, String padStr) {
        if (str == null) {
            return null;
        }

        if ((padStr == null) || (padStr.length() == 0)) {
            padStr = " ";
        }

        int padLen = padStr.length();
        int strLen = str.length();
        int pads   = size - strLen;

        if (pads <= 0) {
            return str;
        }

        if (pads == padLen) {
            return padStr.concat(str);
        } else if (pads < padLen) {
            return padStr.substring(0, pads).concat(str);
        } else {
            char[] padding  = new char[pads];
            char[] padChars = padStr.toCharArray();

            for (int i = 0; i < pads; i++) {
                padding[i] = padChars[i % padLen];
            }

            return new String(padding).concat(str);
        }
    }


    /**
     * 字符串转化为list,通过分割符
     * 
     * @param str
     * @param searchStr
     * @return
     */
    public List getListbyArray(String str, String separatorChars) {
        if (StringUtils.isNotEmpty(str)) {
            String[] strArray = StringUtil.split(str, separatorChars);
            return Arrays.asList(strArray);
        } else {
            return new ArrayList();
        }
    }

    /**
     * base64 编码
     * 
     * @param src
     * @return
     */
    public static String encodeByBase64(String src) {
        byte[] srcB = null;

        try {
            srcB = src.getBytes("GBK");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        return Base64.encodeBase64String(srcB);
    }

    /**
     * base64 解码
     * 
     * @param src
     * @return
     */
    public static String decodeByBase64(String src) {
        byte[] srcB = Base64.decodeBase64(src);
        String str = null;

        try {
            str = new String(srcB, "GBK");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        return str;
    }

    /**
     * 格式化时间
     */
    public static String getFormatDate(Date date, String formater) {
        if (date == null) {
            return "";
        }

        if (StringUtil.isEmpty(formater)) {
            formater = "yyyy-MM-dd";
        }

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(formater);

        return simpleDateFormat.format(date);
    }

    public static int strinToint(String cat) {
        if (StringUtils.isNotBlank(cat)) {
            return Integer.parseInt(cat);
        } else {
            return -1;
        }
    }

    public static String escapeHtml(String body) {
        if (StringUtil.isEmpty(body)) {
            return body;
        }
        return StringEscapeUtil.escapeHtml(body);
    } 

    /**
     * 除以1024转化为K
     * 
     * @param isize
     * @return
     */
    public static int showImgSizeUseK(int isize) {
        return isize / 1024;
    }

    /**
     * 显示标准的图片大小
     * 
     * @param isize
     * @return
     */
    public static float showStandardDiff(int height, int width) {
        float standSize = (height * width) / 2250f;
        String sizeStr = new DecimalFormat("#.##").format(standSize);
        return new Float(sizeStr).floatValue();
    }

    /**
     * DIY类目使用
     * 
     * @param str
     * @return
     */
    public long splitIVToL(String str) {
        String strs[] = StringUtil.split(str, ":");
        if (strs != null && strs.length >= 2) {
            return Long.parseLong(strs[1]);
        }
        return 0;

    }

    public static String encodeUrl(String str, String encode) {
        String strre = null;
        try {
            strre = StringEscapeUtil.escapeURL(str, encode);
        } catch (UnsupportedEncodingException e) {

        }
        return strre;
    }

    public static Long parseIdToLong(String str) {
        try {
            return new Long(str);
        } catch (Exception e) {
            return new Long(0);
        }
    } 

    /**
     * 获取系统当前时间
     * 
     * @return
     */
    public static Date getCurrenTime() {
        Date date = DateUtil.getCurrentTime();
        return date;
    }

    public static String subcn(String str) {
        return subCnString(str, 30, 30, "...");
    }
    
    /**
     * 中文字符截取
     *
     * @param str
     * @param max
     * @param len
     * @param more
     * @return
     */
    public static String subCnString(String str, int max, int len, String more) {
        if (str != null && getNotAscLength(str) * 2 > max) {
            return substring(str, len, more);
        }
        return str;
    }
    
    /**
     * 获得字符串的中文长度,一个中文为1，一个英文为0.5
     *
     * @param in 需要截取的字符串
     * @return 长度
     */
    public static int getNotAscLength(String in) {
        if (StringUtil.isEmpty(in)) {
            return 0;
        }

        return lengthNotAsc(in);
    }
    
    private static int lengthNotAsc(String s) {
        int len = length(s);

        return len % 2 > 0 ? len / 2 + 1 : len / 2;
    }
    
    /**
     * 得到一个GBK编码字符串的字节长度,一个汉字或日韩文长度为2,英文字符长度为1
     *
     * @param String s ,需要得到长度的字符串(GBK编码)
     * @return int, 得到的字符串长度
     */
    private static int length(String s) {
        if (s == null || s.equals("")) {
            return 0;
        }
        char[] c = s.toCharArray();
        int len = 0;
        for (int i = 0; i < c.length; i++) {
            len++;
            if (!isAscii(c[i])) {
                len++;
            }
        }
        return len;
    }

    public static String subcn(String str, int len) {
        return subCnString(str, len, len, "...");
    }
    
    public static String substring(String str, int len, String more) {
        int reInt = 0;
        String reStr = "";
        if (str == null) return "";

        str = html2PureTxt(str);

        char[] tempChar = str.toCharArray();
        for (int kk = 0; (kk < tempChar.length && len > reInt); kk++) {
            String s1 = String.valueOf(tempChar[kk]);
            try {
                byte[] b = s1.getBytes("GBK");
                // 中文占2个位,英文占一个,huaiyuan.mao
                reInt += b.length;
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            reStr += tempChar[kk];
        }

        if (len == reInt || (len == reInt - 1)) {
            reStr += more;
        }
        return reStr;
    }
    
    public static String getModuleName(TurbineRunData run){
    	String modulePath = WebxUtil.getCurrentComponent(run.getRequest()).getName();
    	return modulePath;
    }

    public static String pn(TurbineRunData run) { 
        String temp = run.getTarget().substring(1);//run.getRequest().getPathInfo().substring(1, run.getRequest().getPathInfo().indexOf('.'));
        return temp.toLowerCase().replaceAll("_", "");
    }

    public static String css(TurbineRunData run) {
        String temp = run.getTarget().substring(1); //run.getRequest().getPathInfo().substring(1, run.getRequest().getPathInfo().indexOf('.'));
        return temp.toLowerCase().replaceAll("_", "").replaceAll("/", "-");
    }
 
    /**
     * 展示左则菜单使用，作为body的class使用
     * 
     * @param run
     * @return
     * @author pingchun.yupc 2013-12-30 下午02:44:10
     */
    public static String cssMenu(TurbineRunData run) {
        String temp = run.getTarget().substring(1); //run.getRequest().getPathInfo().substring(1, run.getRequest().getPathInfo().indexOf('.'));
        return temp.toLowerCase().substring(temp.lastIndexOf("/") + 1).replaceAll("_", ""); 
    }

    /**
     * 获取今天至lastTime之间的剩余天数
     * 
     * @param lastTime 结束时间(毫秒，自January 1, 1970, 00:00:00 GMT起, 如果是秒的话必须＊1000)
     * @return
     */
    public static int getRemainDays(long lastTime) {
        return getTimeIntervalDays(DateUtil.getCurrentTime(), new Date(lastTime));
    }

    /**
     * 获取天数差
     * 
     * @param firstTime　起始时间(毫秒，自January 1, 1970, 00:00:00 GMT起)
     * @param lastDate 结束时间
     * @return
     */
    public static int getTimeIntervalDays(long firstTime, Date lastDate) {
        return getTimeIntervalDays(new Date(firstTime), lastDate);
    }

    /**
     * 获取天数差
     * 
     * @param firstDate 起始日期
     * @param lastDate 结束日期
     * @return
     */
    public static int getTimeIntervalDays(Date firstDate, Date lastDate) {
        return DateUtil.getTimeIntervalDays(DateUtil.getCurrentTime(), lastDate);
    }

    /**
     * 前端JS，css缓存版本处理
     * 
     * @return
     */
    public static String getCurrentVersion() {
        return DateUtil.toLocaleString(DateUtil.getCurrentTime(), "yyyyMMdd");
    }
 

    /**
     * 将queryString的参数劈开，并将参数名与参数值放到map中
     * 
     * @param queryString
     * @param sep 分隔符号，url中是;
     * @param sym key与value连接符，符号是: example : getUrlMap("u:123;a:456;io=789",";", ":")={u=123,a=456,io=789}的map
     * @return
     */
    public static Map<String, String> splitToMap(String queryString, String sep, String sym) {
        if (StringUtils.isBlank(queryString) || StringUtils.isBlank(sep) || StringUtils.isBlank(sym)) {
            return null;
        }
        // 保持原有顺序所有用LinkedHashMap
        Map<String, String> map = new LinkedHashMap<String, String>();
        String[] paras = StringUtils.split(queryString, sep);
        for (String item : paras) {
            String[] keyToVal = StringUtils.split(item, sym);
            if (keyToVal != null) {
                if (2 == keyToVal.length) {
                    map.put(keyToVal[0], keyToVal[1]);
                } else if (1 == keyToVal.length) {
                    // 如果是-mp3;则key为空，如果mp3-则key为mp3
                    if (item.startsWith(sym)) {
                        map.put("", keyToVal[0]);
                    } else {
                        map.put(keyToVal[0], "");
                    }
                }
            }
        }
        return map;
    }

    /**
     * 格式化float类型为指定格式
     * 
     * @param number
     * @param applyPattern #######.00
     * @return 234.2f,#######.00=234.20 234.2f,#######.0=234.2
     */
    public static String formatNumberToStr(float number, String applyPattern) {
        DecimalFormat df = new DecimalFormat();
        df.applyPattern(applyPattern);
        return df.format(number);
    }

    /**
     * 格式化double类型为指定格式
     * 
     * @param number
     * @param applyPattern #######.00
     * @return 234.2d,#######.00=234.20 234.2d,#######.0=234.2
     */
    public static String formatNumberToStr(double number, String applyPattern) {
        DecimalFormat df = new DecimalFormat();
        df.applyPattern(applyPattern);
        return df.format(number);
    }

    /**
     * 格式化string类型为指定格式
     * 
     * @param number
     * @param applyPattern #######.00
     * @return 234.245,#######.00=234.20 234 #######.0=234.00
     */
    public static String formatNumberToStr(String number, String applyPattern) {
        DecimalFormat df = new DecimalFormat();
        df.applyPattern(applyPattern);
        return df.format(NumberUtils.toDouble(number));
    }

    /**
     * 解释JSON串
     * 
     * @param str
     * @return
     */
    public static Object parseJSON(String str) {
        if (StringUtils.isNotBlank(str)) {
            try {
                return JSON.parse(str);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    /**
     * 解释JSON数组串
     * 
     * @param str
     * @return
     */
    public static Object parseJSONArray(String str) {
        /*
         * 模板里的用法： #set($str='[{"aa":"a1"}, {"aa":"a2"}, {"aa":"a3"}]') #set($objs=$webUtil.parseJSONArray($str))
         * #foreach($obj in $objs) $velocityCount:$obj.aa<br/> #end
         */

        if (StringUtils.isNotBlank(str)) {
            try {
                return JSONArray.parse(str);
            } catch (Exception e) {
            }
        }
        return null;
    }


    /**
     * 对区间值进行分割
     * 
     * @param str
     * @param separatorChar
     * @return
     */
    public static String[] splitBetween(String str, String separatorChar) {
        if (StringUtils.isNotBlank(str)) {
            int i = str.indexOf(separatorChar);
            if (i != -1) {
                String begin = str.substring(0, i).trim();
                String end = str.substring(i + separatorChar.length()).trim();
                String[] values = new String[] { "", "" };
                if (StringUtils.isNotBlank(begin)) {
                    values[0] = begin;
                }
                if (StringUtils.isNotBlank(end)) {
                    values[1] = end;
                }
                return values;
            }
        }
        return null;
    }

    public static String[] splitMoney(Object money, String intValue, String decimalValue) {
        return splitMoney(money, ".", intValue, decimalValue);
    }
    
    /**
     * 分隔金额为两部分，方便前端
     * 
     * @param money
     * @param separatorChar
     * @param intValue
     * @param decimalValue
     * @return
     */
    public static String[] splitMoney(Object moneyObj, String separatorChar, String intValue, String decimalValue) {
        String[] value = new String[] { intValue, decimalValue };
        
        if (moneyObj != null) {
            String money = String.valueOf(moneyObj);
            int i = money.lastIndexOf(separatorChar);
            if (i >= 0) {
                value[0] = StringUtil.defaultIfEmpty(money.substring(0, i), intValue);
                String decimal = money.substring(i + 1);
                if (StringUtils.isNotBlank(decimal)) {
                    value[1] = decimal;
                }
            } else {
                value[0] = money;
            }
        }
        
        return value;
    }

    public static Object readObj(byte[] bos) throws IOException, ClassNotFoundException

    {

        ByteArrayInputStream bis = new ByteArrayInputStream(bos);

        ObjectInputStream ois = new ObjectInputStream(bis);

        bis.close();

        ois.close();

        return ois.readObject();

    }

    /**
     * 伙拼剩余时间格式化 HH时mm分
     * 
     * @param offShelfTime
     * @return
     */
    public static String getReminderFormatTime(Date offShelfTime) {
        String ret = "0小时0分";

        if (offShelfTime == null) {
            return ret;
        }
        Calendar nowCar = Calendar.getInstance();
        Calendar car = Calendar.getInstance();

        car.setTime(offShelfTime);
        if (nowCar.after(car)) {
            return ret;
        }
        int day = DateUtil.getTimeIntervalDays(nowCar.getTime(), offShelfTime);
        int hour = DateUtil.getTimeIntervalHours(nowCar.getTime(), offShelfTime);
        hour = 24 * day + hour;
        int minutes = DateUtil.getTimeIntervalMins(nowCar.getTime(), offShelfTime);
        if (minutes > 0) {
            minutes = minutes - 1;
        }

        ret = "%s小时%s分";
        ret = String.format(ret, hour, minutes);
        return ret;
    }

    public static Date getTestTime() {
        Calendar car = Calendar.getInstance();
        car.add(Calendar.HOUR_OF_DAY, 12);
        car.add(Calendar.MINUTE, 15);
        return car.getTime();
    }

    /**
     * object类型转BigDecimal类型
     * 
     * @param v1 实际值
     * @param scale 保留小数位数
     * @return
     */
    public static BigDecimal formatNumber(Object v1, String scale) {
        String str = String.valueOf(v1);
        if (str == null || "null".equals(str) || StringUtils.isBlank(str)) {
            return new BigDecimal(0);
        } else {
            BigDecimal b = new BigDecimal(str);
            BigDecimal one = new BigDecimal("1");

            if (StringUtils.isNotBlank(scale) && org.apache.commons.lang.math.NumberUtils.isNumber(scale)) {
                return b.divide(one, Integer.valueOf(scale), BigDecimal.ROUND_HALF_UP);
            } else {
                return b.divide(one, 0, BigDecimal.ROUND_HALF_UP);
            }
            // return new BigDecimal(v1);
        }
    }
    
    /**
     * object类型转BigDecimal类型
     * 
     * @param v1 实际值
     * @param scale 保留小数位数
     * @return
     */
    public static BigDecimal formatNumber(Object v1, Integer scale) {
        String str = String.valueOf(v1);
        String scale1= String.valueOf(scale);
        if (str == null || "null".equals(str) || StringUtils.isBlank(str)) {
            return new BigDecimal(0);
        } else {
            BigDecimal b = new BigDecimal(str);
            BigDecimal one = new BigDecimal("1");

            if (StringUtils.isNotBlank(scale1) && org.apache.commons.lang.math.NumberUtils.isNumber(scale1)) {
                return b.divide(one, Integer.valueOf(scale), BigDecimal.ROUND_HALF_UP);
            } else {
                return b.divide(one, 0, BigDecimal.ROUND_HALF_UP);
            }
            // return new BigDecimal(v1);
        }
    }
    
}
