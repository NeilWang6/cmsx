/**
 * ������
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-11-14
 * @modifyTime : 2013-04-08
 */

var Config = {
    //Ĭ�ϳ�����
    samplerate : Globals.customize.samplerate || 1,
    //վ���ţ�
    //1������վ
    //2������վ
    //4������ѧԺ
    //5��Aliexpress
    //6���������
    //7��ITBU
    //20������
    siteNo : Globals.customize.siteNo || 2,
    //��־��¼������һ
    logSeverOne : pro + '//dmtracking.1688.com/b.jpg',
    //��־��¼��������
    logSeverTwo : pro + '//dmtracking.1688.com/c.jpg',
    //tracelog������
    tracelogSever : pro + '//stat.1688.com/tracelog/click.html',
    //�����¼������
    errorSever : pro + '//stat.1688.com/dw/error.html',
    //SPM������
    spmServer : pro + '//stat.1688.com/spm.html',
    //acookie���շ�����
    acookieSever : pro + '//acookie.1688.com/1.gif',
    // �����л�������
    changeServer: pro + '//pass.alibaba.com/read_cookie.htm',
    // ��һ���л�cookie������
    firstUserServer: pro + '//check.china.alibaba.com/cta/cucrpc/getCookieId.jsonp',
    needDefaultCookies : ['cna','ali_apache_id'],
    isCheckLogin : true,
    isSetCookieToAcookie: true,
    is1688: /\b1688\.com$/.test(loc.hostname)
};
