/**
* FD.widget.Hubble
*
* ����ҳ����-�ͻ��˲���
* ���ƣ�
* 		1��Valid��ҪYUI��֧��
* ���÷�����
* 		��ҳ���������
*       <script>window.g_config={appId:6};g_hb_monitor_st=+new Date;</script> 
*		
*       ��ҳ����ײ�
*       <script>new FD.widget.Hubble(window.g_config)</script>
*
* @author 	chuangui.xiecg@alibaba-inc.com
* @link    http://www.fdev-lib.cn/
* @version 1.0  
*/
(function(w){
				
	var ua = navigator.userAgent, win = window, doc = document,
    DOM = FYD, Event = FYE,
    startTime = 0, // ҳͷ���Ĳ���ʱ��
    endTime = 0,   // ҳβ���Ĳ���ʱ��
    sections = [], // �������
    sectionMaxImgLoadTime = 0, // ��������У�������ͼƬ�������ʱ���
	
	// ��ȡ����ϵͳ��Ϣ
	OSInfo = (function(){
		var token = [
            // ˳���޹أ�����ռ��������
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
	
	// ���ǵ��������ϵͳҳ�沼���ǻ���KISSY�Ŀ��д��,FDEV.lang.ua���ṩ���ݻ����޷����㱾�ε�Ҫ��,���Զ��Է�װ��UA������,������Դ��KISSY
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
	                // issue: ���� Opera Mobile �� Version/ �ֶΣ����ܻ��� Opera ������ͬʱ���� Opera Mobile �İ汾��Ҳ�Ƚϻ���
	                else if ((m = ua.match(/Opera Mobi[^;]*/)) && m){
	                    o[MOBILE] = m[0];
	                }
	            }
	            
	        // NOT WebKit or Presto
	        } else {
	            // MSIE
	            if ((m = ua.match(/MSIE\s([^;]*)/)) && m[1]) {
	                o[core = 'trident'] = 0.1; // Trident detected, look for revision
	                // ע�⣺
	                // o.shell = ie, ��ʾ����� ie
	                // �� o.ie = 7, ������������� ie7, ���п����� ie8 �ļ���ģʽ
	                // ���� ie8 �ļ���ģʽ����Ҫͨ�� documentMode ȥ�жϡ����˴������� o.ie = 8, ����
	                // �ܶ�ű��жϻ�ʧ����Ϊ ie8 �ļ���ģʽ������Ϊ�� ie7 ��ͬ�������Ǻ� ie8 ��ͬ
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
	     * ˵����
	     * @�����ܽ�ĸ�������������ж�����: http://spreadsheets0.google.com/ccc?key=tluod2VGe60_ceDrAaMrfMw&hl=zh_CN#gid=0
	     * ���� CNZZ 2009 ��������ռ���ʱ��棬�Ż����ж�˳��http://www.tanmi360.com/post/230.htm
	     * �����������������Ǿ���汾��δ֪�� 0.1 ��Ϊ��ʶ
	     * ����֮�� & 360 ��������� 3.x ���µİ汾���޷�ͨ�� UA �������Լ������жϣ�����ĿǰֻҪ��⵽ UA �ؼ��־���Ϊ��汾��Ϊ 3
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
	
	
	// ��ȡ�������Ϣ
	browserInfo= (function(){
		var key = UA.shell, ie, trident, ret;
		
		if ('ie' === key && (ie = UA[key])) {
            // IE��Ҫ���Ǽ�����ģʽ���⣬��ȡshell�汾��+core�汾��һ���жϼ�����ģʽ�汾
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
	
	// ��ȡ������ں���Ϣ
	
	browserCoreInfo = (function(){
		var core = UA.core, v;
        if ('trident' === core && (v = UA[core])) {
            return 'Trident' + v;
        }
        return capitalize(core) || 'Other';
	})(),
	
	// ��ȡ��Ļ�ֱ���
	
	screenInfo = (function(){
		var screen = win.screen;
		return screen ? screen.width + 'x' + screen.height : '';
	})();
	
	
	
	/**
     * ������ת��Ϊ����ĸ��д
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
		
            // �� pageId ʱ��������
            if (!pageId) return;

            // ������ȡ 0 Ϊ����ֵ
			if (parseInt(Math.random() * sampleRate)) return;

            startTime = win['g_hb_monitor_st']; // ��ȡҳͷ���Ĳ���ʱ��
            if (!startTime) return; // ����ʼ����ֵʱ���ż���

            endTime = +new Date; // ��ȡҳβ���Ĳ���ʱ�� ע���˴�����Ϊ�ýű����е��˴���ʱ��
            sections = config['sections'] || [];
            sectionMaxImgLoadTime = endTime;

            // monitor sections
            if (sections.length > 0) {
                // TODO: ֧�ֶ�� section �ļ��
                this.monitorSection(sections[0]);
            }

            // onload event
            Event.on(win, 'load', function() {
                this.sendData(+new Date, apiUrl, pageId);
            }, this,true);
		},
		/**
         * ���ҳ������ļ���ʱ��
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
         * ��������
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
			// ���Ƕ�ҳ��YSLOW��Ӱ��,�����ӳٴ�㴦��
			setTimeout(function(){
				new Image().src = results.join('');
			},1000);
        }
	};
	
	w.Hubble = Hubble;
	
})(FD.widget);