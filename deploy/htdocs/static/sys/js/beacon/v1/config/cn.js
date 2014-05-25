/**
 * 配置区
 * @author : yu.yuy
 * @createTime : 2011-11-14
 * @modifyTime : 2012-05-08
 */
(function($ns){
    var G = $ns.globals
      , customize = G.customize;

    $ns.config = {
        //默认抽样率
        samplerate : customize.samplerate || 1,
        //站点编号：
        //1：国际站
        //2：中文站
        //4：阿里学院
        //5：Aliexpress
        //6：阿里金融
        //7：ITBU
        //20：内网
        siteNo : customize.siteNo || 2,
        //日志记录服务器一
        logSeverOne : G.protocol + '//dmtracking.1688.com/b.jpg',
        //日志记录服务器二
        logSeverTwo : G.protocol + '//dmtracking.1688.com/c.jpg',
        //tracelog服务器
        tracelogSever : G.protocol + '//stat.1688.com/tracelog/click.html',
        //错误记录服务器
        errorSever : G.protocol + '//stat.1688.com/dw/error.html',
        //SPM服务器
        spmServer : G.protocol + '//stat.1688.com/spm.html',
        //acookie接收服务器
        acookieSever : G.protocol + '//acookie.1688.com/1.gif',
        // 域名切换服务器
        changeServer: G.protocol + '//pass.1688.com/read_cookie.htm',
        //是否种入acookie（集团cookie）
        isSetCookieToAcookie : customize.isSetCookieToAcookie || true,
        needDefaultCookies : ['cna','ali_apache_id'],
        isCheckLogin : true,
        is1688: /1688.c(om|n)/ig.test(G.doc.location.host)
    };
})(MAGNETO);