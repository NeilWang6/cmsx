/*
 * @Author      Sway Deng
 * @Email       shiwei.dengsw@alibaba-inc.com
 * @Date        13-1-17 ����11:21
 * @Description ��ͨbanner���ѣ������û������������IE���°汾������xp�û������������������IE8������vista��win7�û�
 * ������������IE9���Ժ�����������µģ�
 * ʹ�÷�ʽ������ҳ����������ļ��Ͷ�Ӧ��css�ļ����ɡ�
 * ����jQuery
 * ������������ t_upgradeie_show���ع��㣩��t_upgradeie���������ʱ��㣩��t_upgradeie_cls���ر�bannerʱ��㣩
 * �����Ʒ�������м���Ʒ�ߵ��������������ҳ�����ṩ������Ӧ�Ĵ��ȫ�ֱ��������磺
 *  var TUpgradeieShow = 'work_upgradeie_show';
 *  var TUpgradeie     = 'work_upgradeie';
 *  var TUpgradeieCls  = 'work_upgradeie_cls';
 * !!cmd:compress=true
 */
;(function (win, undefined) {
    if (typeof jQuery !== 'function') return;
    var $ = jQuery;
    // ��㺯��
    function tracelog (log) {
        if (win.dmtrack) dmtrack.clickstat('http://stat.1688.com/tracelog/click.html', '?tracelog=' + log);
    }
    // version: [Number] ֻ������յ�ֵ��6��7��8
    function showTip (version) {
        var html, container, car, text, dfd, body = document.body,
            tipMap = {
                6: '�ף�������ʹ�ü�����ȫ�� IE6 �������Ϊ�����Ľ��װ�ȫ�����������������°汾��',
                7: '�ף�������ʹ�ò���ȫ�� IE7 �������Ϊ�����Ľ��װ�ȫ�����������������°汾��',
                8: '����ʹ�� IE8 �����������Ҫ��ø�����������ȫ���������飬�����������°汾��'
            };

        // ��ҳ�����Ѿ�����banner����������
        if ($('div.iepush-banner', body).length) return;

        html = ['<div class="iepush-banner">',
                    '<div class="iepush-b1">',
                        '<div class="iepush-b2">',
                            '<div class="iepush-content">',
                                '<div class="iepush-logo"></div>',
                                '<div class="iepush-car"></div>',
                                '<div class="iepush-text">',
                                    '<div class="iepush-text-inner">' + tipMap[version] + '</div>',
                                '</div>',
                            '</div>',
                            '<a class="iepush-cls" href="#" target="_self" hidefocus title="�ر�">x</a>',
                        '</div>',
                    '</div>',
                '</div>'];
        $(body).prepend(html.join(''));
        container = $('div.iepush-banner', body);
        car = $('div.iepush-car', container);
        text = $('div.iepush-text', container);

        dfd = $.Deferred();
        dfd.done(function () {
            text.animate({width: 196}, 600);
            tracelog('t_upgradeie_show');
            if (typeof win.TUpgradeieShow == 'string') tracelog(win.TUpgradeieShow);
        });

        if (version === 6) {
            dfd.resolve();
        } else {
            car.animate({
                left: (version === 7) ? '+=253' : '+=468'
            }, 1200)
            .animate({left: '-=6'}, 100)
            .animate({left: '+=3'}, 100)
            .promise()
            .done(function () {
                dfd.resolve();
            });
        }

        $('a.iepush-cls', container).click(function (ev) {
            ev.preventDefault();
            car.remove();
            text.remove();
            $('div.iepush-logo', container).remove();
            container.slideUp(400, function () {
                container.remove();
            });
        }).mousedown(function (ev) {
            tracelog('t_upgradeie_cls');
            if (typeof win.TUpgradeieCls == 'string') tracelog(win.TUpgradeieCls);
        });

        $('div.iepush-content', container).click(function (ev) {
            FE.util.goTo('http://windows.microsoft.com/zh-CN/internet-explorer/downloads/ie', '_blank');
            container.remove();
        }).mousedown(function (ev) {
            tracelog('t_upgradeie');
            if (typeof win.TUpgradeie == 'string') tracelog(win.TUpgradeie);
        });
    }

    $(function ($) {
        var version = parseInt($.browser.version),
            ua = navigator.userAgent,
            isWin7Vista = /Windows\sNT\s6\.[01];/g.test(ua); // win7 or vista
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

        if ($.browser.msie && version < 9) { // maybe 6, 7, 8
            if (version < 6) version = 6;
            if (isWin7Vista || version < 8) showTip(version);
        }
    });

})(window, undefined);