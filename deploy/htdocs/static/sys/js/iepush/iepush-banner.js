/*
 * @Author      Sway Deng
 * @Email       shiwei.dengsw@alibaba-inc.com
 * @Date        13-1-17 上午11:21
 * @Description 顶通banner提醒，提醒用户升级浏览器到IE最新版本，若是xp用户，会提醒升级到最高IE8，若是vista和win7用户
 * 则提醒升级到IE9（以后会升级到更新的）
 * 使用方式就是在页面上引入该文件和对应的css文件即可。
 * 依赖jQuery
 * 三个打点参数： t_upgradeie_show（曝光打点）、t_upgradeie（点击升级时打点）、t_upgradeie_cls（关闭banner时打点）
 * 如果产品线想自行监测产品线的数据情况，需在页面上提供三个对应的打点全局变量，形如：
 *  var TUpgradeieShow = 'work_upgradeie_show';
 *  var TUpgradeie     = 'work_upgradeie';
 *  var TUpgradeieCls  = 'work_upgradeie_cls';
 * !!cmd:compress=true
 */
;(function (win, undefined) {
    if (typeof jQuery !== 'function') return;
    var $ = jQuery;
    // 打点函数
    function tracelog (log) {
        if (win.dmtrack) dmtrack.clickstat('http://stat.1688.com/tracelog/click.html', '?tracelog=' + log);
    }
    // version: [Number] 只允许接收的值是6、7、8
    function showTip (version) {
        var html, container, car, text, dfd, body = document.body,
            tipMap = {
                6: '亲，您正在使用极不安全的 IE6 浏览器。为了您的交易安全，请立即升级到最新版本！',
                7: '亲，您正在使用不安全的 IE7 浏览器。为了您的交易安全，请立即升级到最新版本！',
                8: '还在使用 IE8 浏览器上网？要获得更加流畅、安全的网络体验，请升级到最新版本！'
            };

        // 若页面上已经存在banner，则不再生成
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
                            '<a class="iepush-cls" href="#" target="_self" hidefocus title="关闭">x</a>',
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
        // 修正在兼容模式下的判断
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