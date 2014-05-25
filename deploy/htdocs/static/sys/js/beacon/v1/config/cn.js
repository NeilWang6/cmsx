/**
 * ������
 * @author : yu.yuy
 * @createTime : 2011-11-14
 * @modifyTime : 2012-05-08
 */
(function($ns){
    var G = $ns.globals
      , customize = G.customize;

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
        //20������
        siteNo : customize.siteNo || 2,
        //��־��¼������һ
        logSeverOne : G.protocol + '//dmtracking.1688.com/b.jpg',
        //��־��¼��������
        logSeverTwo : G.protocol + '//dmtracking.1688.com/c.jpg',
        //tracelog������
        tracelogSever : G.protocol + '//stat.1688.com/tracelog/click.html',
        //�����¼������
        errorSever : G.protocol + '//stat.1688.com/dw/error.html',
        //SPM������
        spmServer : G.protocol + '//stat.1688.com/spm.html',
        //acookie���շ�����
        acookieSever : G.protocol + '//acookie.1688.com/1.gif',
        // �����л�������
        changeServer: G.protocol + '//pass.1688.com/read_cookie.htm',
        //�Ƿ�����acookie������cookie��
        isSetCookieToAcookie : customize.isSetCookieToAcookie || true,
        needDefaultCookies : ['cna','ali_apache_id'],
        isCheckLogin : true,
        is1688: /1688.c(om|n)/ig.test(G.doc.location.host)
    };
})(MAGNETO);