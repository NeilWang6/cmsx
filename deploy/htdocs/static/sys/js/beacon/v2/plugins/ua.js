/**
 * 抓取用户客户端信息
 * @author : yu.yuy
 * @createTime : 2011-11-14
 * @modifyTime : 2012-05-08
 */

var UA = Manifold.UA = (function(){
    var engine = {
        trident : 0,
        webkit : 0,
        gecko : 0,
        presto : 0,
        khtml : 0,

        name : 'other',
        ver : null
    },
    browser = {
        ie : 0,
        firefox : 0,
        chrome : 0,
        safari : 0,
        opera : 0,
        konq : 0,

        name : 'other',
        ver : null
    },
    extraBrowser = {
        name : '',
        ver : null
    },
    system = {
        win : false,
        mac : false,
        x11 : false,

        name : 'other'
    },
    mobile = 'other',
    navigator = win.navigator,
    ua = navigator.userAgent,
    platform = navigator.platform,
    match,
    external,
    numberify = function(s) {
        var c = 0;
        // convert '1.2.3.4' to 1.234
        return parseFloat(s.replace(/\./g, function() {
            return (c++ === 0) ? '.' : '';
        }));
    };

    if (win.opera){
        engine.ver = browser.ver = numberify(win.opera.version());
        engine.presto = browser.opera = parseFloat(engine.ver);
        engine.name = 'presto';
        browser.name = 'opera';
    } else if (/AppleWebKit\/(\S+)/.test(ua)){
        engine.ver = numberify(RegExp["$1"]);
        engine.webkit = engine.ver;
        engine.name = 'webkit';

        //figure out if it's Chrome or Safari
        if (/Chrome\/(\S+)/.test(ua)){
            browser.ver = numberify(RegExp["$1"]);
            browser.chrome = browser.ver;
            browser.name = 'chrome';
        } else if (/Version\/(\S+)/.test(ua)){
            browser.ver = numberify(RegExp["$1"]);
            browser.safari = browser.ver;
            browser.name = 'safari';
        } else {
            //approximate version
            var safariVersion = 1;
            if (engine.webkit < 100){
                safariVersion = 1;
            } else if (engine.webkit < 312){
                safariVersion = 1.2;
            } else if (engine.webkit < 412){
                safariVersion = 1.3;
            } else {
                safariVersion = 2;
            }

            browser.safari = browser.ver = safariVersion;
            browser.name = 'safari';
        }
    } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)){
        engine.ver = browser.ver = numberify(RegExp["$1"]);
        engine.khtml = browser.konq = engine.ver;
        engine.name = 'khtml';
        browser.name = 'konq';
    } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)){
        engine.ver = numberify(RegExp["$1"]);
        engine.gecko = engine.ver;
        engine.name = 'gecko';

        //determine if it's Firefox
        if (/Firefox\/(\S+)/.test(ua)){
            browser.ver = numberify(RegExp["$1"]);
            browser.firefox = browser.ver;
            browser.name = 'firefox';
        }
    } else if (/IE ([^;]+)/.test(ua)){
        engine.ver = browser.ver = numberify(RegExp["$1"]);
        engine.trident = browser.ie = engine.ver;
        engine.name = 'trident';
        browser.name = 'ie';
    }

    extraBrowser.name = browser.name;
    extraBrowser.ver = browser.ver;

    // 360Browser
    if (match = ua.match(/360SE/)) {
        extraBrowser.name = 'se360';
        extraBrowser.ver = 3; // issue: 360Browser 2.x cannot be recognised, so if recognised default set verstion number to 3
    }
    // Maxthon
    else if ((match = ua.match(/Maxthon/)) && (external = WIN.external)) {
        // issue: Maxthon 3.x in IE-Core cannot be recognised and it doesn't have exact version number
        // but other maxthon versions all have exact version number
        extraBrowser.name = 'maxthon';
        try {
            extraBrowser.ver = numberify(external['max_version']);
        } catch(ex) {
            extraBrowser.ver = 0.1;
        }
    }
    // TT
    else if (match = ua.match(/TencentTraveler\s([\d.]*)/)) {
        extraBrowser.name = 'tt';
        extraBrowser.ver = numberify(match[1]) || 0.1;
    }
    // TheWorld
    else if (match = ua.match(/TheWorld/)) {
        extraBrowser.name = 'theworld';
        extraBrowser.ver = 3;
    }
    // Sougou
    else if (match = ua.match(/SE\s([\d.]*)/)) {
        extraBrowser.name = 'sougou';
        extraBrowser.ver = numberify(match[1]) || 0.1;
    }

    system.win = platform.indexOf("Win") == 0;
    system.mac = platform.indexOf("Mac") == 0;
    system.x11 = (platform == "X11") || (platform.indexOf("Linux") == 0);

    if (system.win){
        if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
            if (RegExp["$1"] == "NT"){
                switch(RegExp["$2"]){
                    case "5.0":
                        system.win = "2000";
                        break;
                    case "5.1":
                        system.win = "XP";
                        break;
                    case "6.0":
                        system.win = "Vista";
                        break;
                    case "6.1":
                        system.win = "7";
                        break;
                    case "6.3":
                        system.win = "8";
                        break;
                    default:
                        system.win = "NT";
                        break;
                }
            } else if (RegExp["$1"] == "9x"){
                system.win = "ME";
            } else {
                system.win = RegExp["$1"];
            }
        }
        system.name = 'windows' + system.win;
    }
    if (system.mac) {
        system.name = 'mac';
    }
    if (system.x11) {
        system.name = 'x11';
    }

    if (system.win == "CE") {
        mobile = 'windows mobile';
    }
    // Apple Mobile
    else if (/ Mobile\//.test(ua)) {
        mobile = 'apple'; // iPad, iPhone or iPod Touch
    }
    // Other WebKit Mobile Browsers
    else if ((match = ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/))) {
        mobile = match[0].toLowerCase(); // Nokia N-series, Android, webOS, ex: NokiaN95
    }

    return {
        //浏览器引擎类型
        engine : engine,
        //浏览器类型
        browser : browser,
        //国产浏览器
        extraBrowser : extraBrowser,
        //操作系统信息
        system : system,
        //移动设备类型
        mobile : mobile,
        //分辨率
        resolution : win.screen.width+'*' + win.screen.height,
        //浏览器语言
        language : navigator.language || navigator.browserLanguage
    }
}());
