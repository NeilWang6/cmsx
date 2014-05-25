/**
 * 配置区
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-11-14
 * @modifyTime : 2013-04-08
 */
 
var M_config = Manifold.config = {
    //默认抽样率
    samplerate : 1,
    //站点编号：
    //1：国际站
    //2：中文站
    //4：阿里学院
    //5：Aliexpress
    //6：阿里金融
    //7：ITBU
    //20：内网
    siteNo : 1,
    //日志记录服务器一
    logSeverOne : pro + '//dmtracking2.alibaba.com/b.jpg',
    //日志记录服务器二
    logSeverTwo : pro + '//dmtracking2.alibaba.com/c.jpg',
    //tracelog服务器
    tracelogSever : pro + '//stat.1688.com/tracelog/click.html',
    //错误记录服务器
    errorSever : pro + '//stat.1688.com/dw/error.html',
    //acookie接收服务器
    acookieSever : pro + '//acookie.1688.com/1.gif',
    //是否种入acookie（集团cookie）
    isSetCookieToAcookie : false,
    //是否读取acookie（集团cookie）
    isGetCookieFromAcookie : false,
    isGetApacheId : true,
    isCheckLogin : false
};