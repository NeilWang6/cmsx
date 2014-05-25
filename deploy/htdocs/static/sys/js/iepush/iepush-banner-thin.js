/*
 * @Author      Sway Deng
 * @Email       shiwei.dengsw@alibaba-inc.com
 * @Date        13-4-9 ����17:21
 * @Description ������涥ͨbanner���ѣ������û������������IE���°汾������xp�û������Ҽ�⵽��ʹ��IE6��IE7�������ܹ�������IE8�������������������vista��win7�û�
 * �����������ܹ�������IE9�����������������һ�治����ȷָ��������ĳһ�汾�����Ǹ������������°汾���ر�ģ���24Сʱ��������һ�Σ���10����Զ���ʧ��
 * ʹ�÷�ʽ������ҳ����������ļ��Ͷ�Ӧ��css�ļ����ɡ�
 * @Dependencies fdev-v4
 * ������������ t_upgradeie_show���ع��㣩��t_upgradeie���������ʱ��㣩��t_upgradeie_cls���ر�bannerʱ��㣩
 * �����Ʒ�������м���Ʒ�ߵ��������������ҳ�����ṩ������Ӧ�Ĵ��ȫ�ֱ�������Ҫ��3��ȫָ���������磺
 *  window.TUpgradeieShow = 'work_upgradeie_show'; // �ع�
 *  window.TUpgradeie     = 'work_upgradeie';  // �������
 *  window.TUpgradeieCls  = 'work_upgradeie_cls'; // ����ر�����banner
 * �����ϣ���û�ֻ������ IE8 ����Ҫ��ҳ�����ṩȫ�ֱ��� TUpgradeForXP ����ֵΪ true :
 *  window.TUpgradeForXP = true;
 * !!cmd:compress=true
 */
;(function (win, undefined) {

if (typeof jQuery !== 'function') return;

var $ = jQuery,
    // ��㺯��
    tracelog = function (log) {
        if (win.dmtrack) dmtrack.clickstat('http://stat.1688.com/tracelog/click.html', '?tracelog=' + log);
    },
    // ��ʾbanner
    showTip = function () {
        var html, container, text, timer, body = document.body;
        // ��ֹҳ����ֶ���ظ�banner
        if ($('div.iepush-banner', body).length) return;

        html = ['<div class="iepush-banner">',
                    '<div class="iepush-b1">',
                        '<div class="iepush-b2">',
                            '<div class="iepush-content">',
                                '<div class="iepush-text">',
                                    '<div class="iepush-text-inner">���������������ҳ���졢����ȫ������Ͱ��Ƽ���ʹ��<strong>���°汾��IE</strong></div>',
                                '</div>',
                            '</div>',
                            '<a class="iepush-cls" href="#" target="_self" hidefocus title="�ر�"></a>',
                        '</div>',
                    '</div>',
                '</div>'];
        $(body).prepend(html.join(''));
        container = $('div.iepush-banner', body);
        text = $('div.iepush-text', container);
        // �ع���
        tracelog('t_upgradeie_show');
        if (typeof win.TUpgradeieShow == 'string') tracelog(win.TUpgradeieShow);

        $('a.iepush-cls', container).click(function (ev) {
            ev.preventDefault();
            text.remove();
            container.slideUp(400, function () {
                container.remove();
            });
            win.clearTimeout(timer);
        }).mousedown(function (ev) { // ����ر�banner�������
            tracelog('t_upgradeie_cls');
            if (typeof win.TUpgradeieCls == 'string') tracelog(win.TUpgradeieCls);
        });

        $('div.iepush-content', container).click(function (ev) {
            FE.util.goTo('http://windows.microsoft.com/zh-CN/internet-explorer/downloads/ie', '_blank');
            container.remove();
            win.clearTimeout(timer);
        }).mousedown(function (ev) { // �ɹ���������������
            tracelog('t_upgradeie');
            if (typeof win.TUpgradeie == 'string') tracelog(win.TUpgradeie);
        });

        // 10���Զ���ʧ
        // 2013-4-22��ĳ�20��
        timer = win.setTimeout(function () {
            text.remove();
            container.slideUp(400, function () {
                container.remove();
            });
            win.clearTimeout(timer);
        }, 20000);
    };

$(function ($) {
    var version = parseInt($.browser.version),
        ua = navigator.userAgent,
        isWin7Vista = /Windows\sNT\s6\.[01];/g.test(ua); // win7 or vista
    // ָ��ֻ�� XP �³�����ʾ�����仰˵��ֻ������û���������߰汾 IE8
    if (win.TUpgradeForXP === true && isWin7Vista ) {
        return;
    }
    // �����ڼ���ģʽ�µ��ж�
    if (version === 7) {
        if (ua.indexOf('Trident/6') > -1) {
            version = 10;
        } else if (ua.indexOf('Trident/5') > -1) {
            version = 9;
        } else if (ua.indexOf('Trident/4') > -1) {
            version = 8;
        }
    }

    if ($.browser.msie && ( version < 8 || (version < 9  && isWin7Vista) )) {
        $.use('util-storage', function () {
            var key = 't_upgradeie_show', // ���ش洢�� key
                STORE = $.util.storage;
            STORE.ready(function () {
                var now = $.now(),
                    latest = parseInt(STORE.getItem(key));
                if (isNaN(latest) || (now - latest) > 24*60*60*1000) {
                    showTip();
                    STORE.setItem(key, now);
                }
            });
        });
    }
});

})(window, undefined);