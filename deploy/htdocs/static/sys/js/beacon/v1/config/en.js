/**
 * ������
 * @author : yu.yuy
 * @createTime : 2011-11-14
 * @modifyTime : 2012-05-08
 */
(function($ns){
    var G = $ns.globals;
    $ns.config = {
        //Ĭ�ϳ�����
        samplerate : 1,
        //վ���ţ�
        //1������վ
        //2������վ
        //4������ѧԺ
        //5��Aliexpress
        //6���������
        //7��ITBU
        //20������
        siteNo : 1,
        //��־��¼������һ
        logSeverOne : G.protocol+'//dmtracking2.alibaba.com/b.jpg',
        //��־��¼��������
        logSeverTwo : G.protocol+'//dmtracking2.alibaba.com/c.jpg',
        //tracelog������
        tracelogSever : G.protocol+'//stat.1688.com/tracelog/click.html',
        //�����¼������
        errorSever : G.protocol+'//stat.1688.com/dw/error.html',
        //acookie���շ�����
        acookieSever : G.protocol+'//acookie.1688.com/1.gif',
        //�Ƿ�����acookie������cookie��
        isSetCookieToAcookie : false,
        //�Ƿ��ȡacookie������cookie��
        isGetCookieFromAcookie : false,
        isGetApacheId : true,
        isCheckLogin : false
    };
})(MAGNETO);