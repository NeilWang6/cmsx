/*
 * @Author      Sway Deng
 * @Email       shiwei.dengsw@alibaba-inc.com
 * @Date        13-4-9 上午17:21
 * @Description 轻量简版顶通banner提醒，提醒用户升级浏览器到IE最新版本。若是xp用户，并且检测到在使用IE6或IE7，由于能够升级到IE8，则会提醒升级；若是vista和win7用户
 * ，由于至少能够升级到IE9，则会提醒升级。这一版不再明确指定升级到某一版本，而是告诉升级到最新版本。特别的，它24小时内最多出现一次，且10秒后自动消失。
 * 使用方式就是在页面上引入该文件和对应的css文件即可。
 * @Dependencies fdev-v4
 * 三个打点参数： t_upgradeie_show（曝光打点）、t_upgradeie（点击升级时打点）、t_upgradeie_cls（关闭banner时打点）
 * 如果产品线想自行监测产品线的数据情况，须在页面上提供三个对应的打点全局变量（不要求3个全指定），形如：
 *  window.TUpgradeieShow = 'work_upgradeie_show'; // 曝光
 *  window.TUpgradeie     = 'work_upgradeie';  // 点击升级
 *  window.TUpgradeieCls  = 'work_upgradeie_cls'; // 点击关闭提醒banner
 * 如果仅希望用户只升级到 IE8 ，需要在页面上提供全局变量 TUpgradeForXP ，且值为 true :
 *  window.TUpgradeForXP = true;
 * !!cmd:compress=true
 */
;(function (win, undefined) {

if (typeof jQuery !== 'function') return;

var $ = jQuery,
    // 打点函数
    tracelog = function (log) {
        if (win.dmtrack) dmtrack.clickstat('http://stat.1688.com/tracelog/click.html', '?tracelog=' + log);
    },
    // 显示banner
    showTip = function () {
        var html, container, text, timer, body = document.body;
        // 防止页面出现多个重复banner
        if ($('div.iepush-banner', body).length) return;

        html = ['<div class="iepush-banner">',
                    '<div class="iepush-b1">',
                        '<div class="iepush-b2">',
                            '<div class="iepush-content">',
                                '<div class="iepush-text">',
                                    '<div class="iepush-text-inner">升级浏览器，看网页更快、更安全，阿里巴巴推荐您使用<strong>最新版本的IE</strong></div>',
                                '</div>',
                            '</div>',
                            '<a class="iepush-cls" href="#" target="_self" hidefocus title="关闭"></a>',
                        '</div>',
                    '</div>',
                '</div>'];
        $(body).prepend(html.join(''));
        container = $('div.iepush-banner', body);
        text = $('div.iepush-text', container);
        // 曝光打点
        tracelog('t_upgradeie_show');
        if (typeof win.TUpgradeieShow == 'string') tracelog(win.TUpgradeieShow);

        $('a.iepush-cls', container).click(function (ev) {
            ev.preventDefault();
            text.remove();
            container.slideUp(400, function () {
                container.remove();
            });
            win.clearTimeout(timer);
        }).mousedown(function (ev) { // 点击关闭banner动作打点
            tracelog('t_upgradeie_cls');
            if (typeof win.TUpgradeieCls == 'string') tracelog(win.TUpgradeieCls);
        });

        $('div.iepush-content', container).click(function (ev) {
            FE.util.goTo('http://windows.microsoft.com/zh-CN/internet-explorer/downloads/ie', '_blank');
            container.remove();
            win.clearTimeout(timer);
        }).mousedown(function (ev) { // 成功点击升级动作打点
            tracelog('t_upgradeie');
            if (typeof win.TUpgradeie == 'string') tracelog(win.TUpgradeie);
        });

        // 10秒自动消失
        // 2013-4-22后改成20秒
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
    // 指定只在 XP 下出现显示，换句话说，只会帮助用户升级到最高版本 IE8
    if (win.TUpgradeForXP === true && isWin7Vista ) {
        return;
    }
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

    if ($.browser.msie && ( version < 8 || (version < 9  && isWin7Vista) )) {
        $.use('util-storage', function () {
            var key = 't_upgradeie_show', // 本地存储的 key
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