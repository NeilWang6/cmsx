/**
 * 配置区
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-11-14
 * @modifyTime : 2013-04-08
 */

var Config = {
    //默认抽样率
    samplerate : Globals.customize.samplerate || 1,
    //站点编号：
    //1：国际站
    //2：中文站
    //4：阿里学院
    //5：Aliexpress
    //6：阿里金融
    //7：ITBU
    //20：内网
    siteNo : Globals.customize.siteNo || 2,
    //日志记录服务器一
    logSeverOne : pro + '//dmtracking.1688.com/b.jpg',
    //日志记录服务器二
    logSeverTwo : pro + '//dmtracking.1688.com/c.jpg',
    //tracelog服务器
    tracelogSever : pro + '//stat.1688.com/tracelog/click.html',
    //错误记录服务器
    errorSever : pro + '//stat.1688.com/dw/error.html',
    //SPM服务器
    spmServer : pro + '//stat.1688.com/spm.html',
    //acookie接收服务器
    acookieSever : pro + '//acookie.1688.com/1.gif',
    // 域名切换服务器
    changeServer: pro + '//pass.alibaba.com/read_cookie.htm',
    // 第一次切换cookie服务器
    firstUserServer: pro + '//check.china.alibaba.com/cta/cucrpc/getCookieId.jsonp',
    needDefaultCookies : ['cna','ali_apache_id'],
    isCheckLogin : true,
    isSetCookieToAcookie: true,
    is1688: /\b1688\.com$/.test(loc.hostname)
};
