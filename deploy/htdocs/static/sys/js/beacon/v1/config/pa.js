/**
 * ������
 * @author : yu.yuy
 * @createTime : 2012-02-27
 * @modifyTime : 2012-05-08
 */
(function($ns){
    var G = $ns.globals,
    customize = G.customize;
    $ns.config = {
        //Ĭ�ϳ�����
        samplerate : customize.samplerate || 1,
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
        siteNo : customize.siteNo || 11,
        //��־��¼������һ
        logSeverOne : G.protocol+'//dmtracking.1688.com/b.jpg',
        //��־��¼��������
        logSeverTwo : G.protocol+'//dmtracking.1688.com/c.jpg',
        //tracelog������
        tracelogSever : G.protocol+'//stat.1688.com/tracelog/click.html',
        //�����¼������
        errorSever : G.protocol+'//stat.1688.com/dw/error.html',
        //acookie���շ�����
        acookieSever : G.protocol+'//acookie.1688.com/1.gif',
        //�Ƿ�����acookie������cookie��
        isSetCookieToAcookie : customize.isSetCookieToAcookie || false,
        needDefaultCookies : [],
        isCheckLogin : false
    };
})(MAGNETO);