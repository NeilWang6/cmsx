/**
 * 配置区
 * @author : yu.yuy
 * @createTime : 2012-02-27
 * @modifyTime : 2012-05-08
 */
var M_config = Manifold.config = {
    //默认抽样率
    samplerate : M_globals.customize.samplerate || 1,
    //站点编号：
    //1：国际站
    //2：中文站
    //4：阿里学院
    //5：Aliexpress
    //6：阿里金融
    //7：ITBU
    //10: 傻瓜数据平台
    //11：PowerAnalytics
    //20：内网
    siteNo : M_globals.customize.siteNo || 11,
    //日志记录服务器一
    logSeverOne : pro + '//dmtracking.1688.com/b.jpg',
    //日志记录服务器二
    logSeverTwo : pro + '//dmtracking.1688.com/c.jpg',
    //tracelog服务器
    tracelogSever : pro + '//stat.1688.com/tracelog/click.html',
    //错误记录服务器
    errorSever : pro + '//stat.1688.com/dw/error.html',
    //acookie接收服务器
    acookieSever : pro + '//acookie.1688.com/1.gif',
    //是否种入acookie（集团cookie）
    isSetCookieToAcookie : M_globals.customize.isSetCookieToAcookie || false,
    needDefaultCookies : [],
    isCheckLogin : false
};