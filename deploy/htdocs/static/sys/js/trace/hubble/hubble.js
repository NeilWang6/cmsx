/**
* FD.widget.Hubble
*
* 哈勃页面监控-客户端布点
* 限制：
* 		1、Valid需要YUI库支持
* 调用方法：
* 		在页面最顶部声明
*       <script>window.g_config={appId:6};g_hb_monitor_st=+new Date;</script> 
*		
*       在页面最底部
*       <script>new FD.widget.Hubble(window.g_config)</script>
*
* @author 	chuangui.xiecg@alibaba-inc.com
* @link    http://www.fdev-lib.cn/
* @version 1.0  
*/
(function(w){
				
	var ua = navigator.userAgent, win = window, doc = document,
    DOM = FYD, Event = FYE,
    startTime = 0, // 页头处的布点时间
    endTime = 0,   // 页尾处的布点时间
    sections = [], // 监控区域
    sectionMaxImgLoadTime = 0, // 监控区域中，最慢的图片加载完成时间点
	
	// 获取操作系统信息
	OSInfo = (function(){
		var token = [
            // 顺序无关，根据占用率排列
            ['Windows NT 5.1', 'WinXP'],
            ['Windows NT 6.0', 'WinVista'],
            ['Windows NT 6.1', 'Win7'],
            ['Windows NT 5.2', 'Win2003'],
            ['Windows NT 5.0', 'Win2000'],
            ['Macintosh', 'Macintosh'],
            ['Windows', 'WinOther'],
            ['Ubuntu', 'Ubuntu'],
            ['Linux', 'Linux']
        ], ret = 'Other';

		for(var i=0;i<token.length;i++){
			 if (ua.indexOf(token[i][0]) != -1) {
				ret = token[i][1];
				break;
			 }
		}
		
        return ret;
		
	})(),
	
	// 考虑到哈勃监控系统页面布点是基于KISSY的框架写的,FDEV.lang.ua所提供数据还还无法满足本次的要求,所以独自封装了UA的数据,代码来源于KISSY
	UA = (function(){
		var ua = navigator.userAgent,
	        EMPTY = '', MOBILE = 'mobile',
	        core = EMPTY, shell = EMPTY, m,
	        o = {
	            // browser core type
	            //webkit: 0,
	            //trident: 0,
	            //gecko: 0,
	            //presto: 0,
	
	            // browser type
	            //chrome: 0,
	            //safari: 0,
	            //firefox: 0,
	            //ie: 0,
	            //opera: 0
	
	            //mobile: '',
	            //core: '',
	            //shell: ''
	        },
	        numberify = function(s) {
	            var c = 0;
	            // convert '1.2.3.4' to 1.234
	            return parseFloat(s.replace(/\./g, function() {
	                return (c++ === 0) ? '.' : '';
	            }));
	        };
	
	    // WebKit
	    if ((m = ua.match(/AppleWebKit\/([\d.]*)/)) && m[1]) {
	        o[core = 'webkit'] = numberify(m[1]);
	
	        // Chrome
	        if ((m = ua.match(/Chrome\/([\d.]*)/)) && m[1]) {
	            o[shell = 'chrome'] = numberify(m[1]);
	        }
	        // Safari
	        else if ((m = ua.match(/\/([\d.]*) Safari/)) && m[1]) {
	            o[shell = 'safari'] = numberify(m[1]);
	        }
	
	        // Apple Mobile
	        if (/ Mobile\//.test(ua)) {
	            o[MOBILE] = 'apple'; // iPad, iPhone or iPod Touch
	        }
	        // Other WebKit Mobile Browsers
	        else if ((m = ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/))) {
	            o[MOBILE] = m[0].toLowerCase(); // Nokia N-series, Android, webOS, ex: NokiaN95
	        }
	    }
	    // NOT WebKit
	    else {
	        // Presto
	        // ref: http://www.useragentstring.com/pages/useragentstring.php
	        if ((m = ua.match(/Presto\/([\d.]*)/)) && m[1]) {
	            o[core = 'presto'] = numberify(m[1]);
	            
	            // Opera
	            if ((m = ua.match(/Opera\/([\d.]*)/)) && m[1]) {
	                o[shell = 'opera'] = numberify(m[1]); // Opera detected, look for revision
	
	                if ((m = ua.match(/Opera\/.* Version\/([\d.]*)/)) && m[1]) {
	                    o[shell] = numberify(m[1]);
	                }
	
	                // Opera Mini
	                if ((m = ua.match(/Opera Mini[^;]*/)) && m) {
	                    o[MOBILE] = m[0].toLowerCase(); // ex: Opera Mini/2.0.4509/1316
	                }
	                // Opera Mobile
	                // ex: Opera/9.80 (Windows NT 6.1; Opera Mobi/49; U; en) Presto/2.4.18 Version/10.00
	                // issue: 由于 Opera Mobile 有 Version/ 字段，可能会与 Opera 混淆，同时对于 Opera Mobile 的版本号也比较混乱
	                else if ((m = ua.match(/Opera Mobi[^;]*/)) && m){
	                    o[MOBILE] = m[0];
	                }
	            }
	            
	        // NOT WebKit or Presto
	        } else {
	            // MSIE
	            if ((m = ua.match(/MSIE\s([^;]*)/)) && m[1]) {
	                o[core = 'trident'] = 0.1; // Trident detected, look for revision
	                // 注意：
	                // o.shell = ie, 表示外壳是 ie
	                // 但 o.ie = 7, 并不代表外壳是 ie7, 还有可能是 ie8 的兼容模式
	                // 对于 ie8 的兼容模式，还要通过 documentMode 去判断。但此处不能让 o.ie = 8, 否则
	                // 很多脚本判断会失误。因为 ie8 的兼容模式表现行为和 ie7 相同，而不是和 ie8 相同
	                o[shell = 'ie'] = numberify(m[1]);
	
	                // Get the Trident's accurate version
	                if ((m = ua.match(/Trident\/([\d.]*)/)) && m[1]) {
	                    o[core] = numberify(m[1]);
	                }
	
	            // NOT WebKit, Presto or IE
	            } else {
	                // Gecko
	                if ((m = ua.match(/Gecko/))) {
	                    o[core = 'gecko'] = 0.1; // Gecko detected, look for revision
	                    if ((m = ua.match(/rv:([\d.]*)/)) && m[1]) {
	                        o[core] = numberify(m[1]);
	                    }
	
	                    // Firefox
	                    if ((m = ua.match(/Firefox\/([\d.]*)/)) && m[1]) {
	                        o[shell = 'firefox'] = numberify(m[1]);
	                    }
	                }
	            }
	        }
	    }
	
	    o.core = core;
	    o.shell = shell;
	    o._numberify = numberify;
	    return o;
	
	})(),
	
	UA_EXTRA = (function(UA){
		var ua = navigator.userAgent,
	        m, external, shell,
	        o = { },
	        numberify = UA._numberify;
	
	    /**
	     * 说明：
	     * @子涯总结的各国产浏览器的判断依据: http://spreadsheets0.google.com/ccc?key=tluod2VGe60_ceDrAaMrfMw&hl=zh_CN#gid=0
	     * 根据 CNZZ 2009 年度浏览器占用率报告，优化了判断顺序：http://www.tanmi360.com/post/230.htm
	     * 如果检测出浏览器，但是具体版本号未知用 0.1 作为标识
	     * 世界之窗 & 360 浏览器，在 3.x 以下的版本都无法通过 UA 或者特性检测进行判断，所以目前只要检测到 UA 关键字就认为起版本号为 3
	     */
	
	    // 360Browser
	    if (m = ua.match(/360SE/)) {
	        o[shell = 'se360'] = 3; // issue: 360Browser 2.x cannot be recognised, so if recognised default set verstion number to 3
	    }
	    // Maxthon
	    else if ((m = ua.match(/Maxthon/)) && (external = window.external)) {
	        // issue: Maxthon 3.x in IE-Core cannot be recognised and it doesn't have exact version number
	        // but other maxthon versions all have exact version number
	        shell = 'maxthon';
	        try {
	            o[shell] = numberify(external['max_version']);
	        } catch(ex) {
	            o[shell] = 0.1;
	        }
	    }
	    // TT
	    else if (m = ua.match(/TencentTraveler\s([\d.]*)/)) {
	        o[shell = 'tt'] = m[1] ? numberify(m[1]) : 0.1;
	    }
	    // TheWorld
	    else if (m = ua.match(/TheWorld/)) {
	        o[shell = 'theworld'] = 3; // issue: TheWorld 2.x cannot be recognised, so if recognised default set verstion number to 3
	    }
	    // Sougou
	    else if (m = ua.match(/SE\s([\d.]*)/)) {
	        o[shell = 'sougou'] = m[1] ? numberify(m[1]) : 0.1;
	    }
	
	    // If the browser has shell(no matter IE-core or Webkit-core or others), set the shell key
	    shell && (o.shell = shell);
		
		return o;
		
	})(UA);
	
	UA = FDEV.lang.merge(UA,UA_EXTRA);
	
	
	// 获取浏览器信息
	browserInfo= (function(){
		var key = UA.shell, ie, trident, ret;
		
		if ('ie' === key && (ie = UA[key])) {
            // IE需要考虑兼容性模式问题，采取shell版本号+core版本号一起判断兼容性模式版本
            trident = UA['trident'];
            switch (trident) {
                case 4.0:
                    ret = 'MSIE8';
                    break;
                case 5.0:
                    ret = 'MSIE9';
                    break;
                default:
                    ret = 'MSIE' + ie;
                    break;
            }
        } else {
            ret = key ? capitalize(key) : 'Other';
        }
        return ret;
		
	})(),
	
	// 获取浏览器内核信息
	
	browserCoreInfo = (function(){
		var core = UA.core, v;
        if ('trident' === core && (v = UA[core])) {
            return 'Trident' + v;
        }
        return capitalize(core) || 'Other';
	})(),
	
	// 获取屏幕分辨率
	
	screenInfo = (function(){
		var screen = win.screen;
		return screen ? screen.width + 'x' + screen.height : '';
	})();
	
	
	
	/**
     * 将单词转换为首字母大写
     */
    function capitalize(str) {
        return !str ? str : str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase();
    }
	
	
	var Hubble=function(el,opt){
		var that = this;
		if(!(this instanceof arguments.callee)){
			return new arguments.callee(el,opt);
		}
		this.init.apply(this,arguments);
	};
	
	Hubble.prototype={
		init:function(cfg){
			var config = cfg || {},
                apiUrl = config['apiUrl'] || 'http://igw.monitor.taobao.com/monitor-gw/receive.do',
                pageId = 'appId' in config ? config['appId'] : 0,
                sampleRate = 'sampleRate' in config ? config['sampleRate'] : 10000;
		
            // 无 pageId 时，不运行
            if (!pageId) return;

            // 抽样：取 0 为幸运值
			if (parseInt(Math.random() * sampleRate)) return;

            startTime = win['g_hb_monitor_st']; // 读取页头处的布点时间
            if (!startTime) return; // 有起始布点值时，才继续

            endTime = +new Date; // 读取页尾处的布点时间 注：此处近似为该脚本运行到此处的时间
            sections = config['sections'] || [];
            sectionMaxImgLoadTime = endTime;

            // monitor sections
            if (sections.length > 0) {
                // TODO: 支持多个 section 的监控
                this.monitorSection(sections[0]);
            }

            // onload event
            Event.on(win, 'load', function() {
                this.sendData(+new Date, apiUrl, pageId);
            }, this,true);
		},
		/**
         * 监控页面区域的加载时间
         */
        monitorSection: function(id) {
            var images = DOM.query('#' + id + ' img');
            if (!images || !images.length) return;

            Event.on(images, 'load', function() {
                var currTime = +new Date;
                if (currTime > sectionMaxImgLoadTime) {
                    sectionMaxImgLoadTime = currTime;
                }
            });
        },

        /**
         * 发送数据
         */
        sendData: function(onLoadTime, apiUrl, pageId) {
            var results = [
                apiUrl,
                '?page_id=', pageId,
                '&os=', OSInfo, // operation system
                '&bt=', browserInfo, // browser type
                '&bct=', browserCoreInfo, // browser core type
                '&scr=', screenInfo, // screen info
                '&fl=', (onLoadTime - startTime), // full load time
                '&dl=', (endTime - startTime) // dom load time
            ];

            if (sections.length > 0) {
                results.push('&sl=' + (sectionMaxImgLoadTime - endTime)); // section load time
            }
			// 考虑对页面YSLOW的影响,做了延迟打点处理
			setTimeout(function(){
				new Image().src = results.join('');
			},1000);
        }
	};
	
	w.Hubble = Hubble;
	
})(FD.widget);