/**
 * ������
 * @author : yu.yuy
 * @createTime : 2012-02-27
 * @modifyTime : 2012-05-08
 */
var M_config = Manifold.config = {
    //Ĭ�ϳ�����
    samplerate : M_globals.customize.samplerate || 1,
    //վ���ţ�
    //1������վ
    //2������վ
    //4������ѧԺ
    //5��Aliexpress
    //6���������
    //7��ITBU
    //10: ɵ������ƽ̨
    //11��PowerAnalytics
    //20������
    siteNo : M_globals.customize.siteNo || 11,
    //��־��¼������һ
    logSeverOne : pro + '//dmtracking.1688.com/b.jpg',
    //��־��¼��������
    logSeverTwo : pro + '//dmtracking.1688.com/c.jpg',
    //tracelog������
    tracelogSever : pro + '//stat.1688.com/tracelog/click.html',
    //�����¼������
    errorSever : pro + '//stat.1688.com/dw/error.html',
    //acookie���շ�����
    acookieSever : pro + '//acookie.1688.com/1.gif',
    //�Ƿ�����acookie������cookie��
    isSetCookieToAcookie : M_globals.customize.isSetCookieToAcookie || false,
    needDefaultCookies : [],
    isCheckLogin : false
};