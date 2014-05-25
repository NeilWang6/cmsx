('monitor' in FE.sys) || (function($, SYS,win){

	var ua = navigator.userAgent.toLowerCase(),
		appNum = {'appNum':window['AA_APP_NUM'] ||''},
		pageId = {'pageId':window['AA_PAGE_ID'] || ''},
		sendRate = win['AA_SAMPLE_RATE'] ? win['AA_SAMPLE_RATE'] : 0.01,
		pageSeed = {'pageSeed':$.now()},
		d_browser_name = 'navName',
		d_browser_ver = 'navVer',
		apiBase = 'monitor-ex.china.alibaba.com/monitor-ex/browser.servlet',
		DOMReadyTimeStamp = -1,
		analyticsURLByGet = apiBase+'?method=common',
		errorPostAction = apiBase+'?method=error',
		moduleDataURL = apiBase+'?method=element',
		oScreen = {
			'screenH': screen.height,
			'screenW': screen.width,
			'colorDepth': screen.colorDepth,
			'visibleW': screen.availWidth,
			'visibleH': screen.availHeight
		},
		oBrowser = _getBrowserInfo(ua),
		oOS = _getOSInfo(ua),
		sFlashVersion = _getFlashVersion(),
		bSupportJava = navigator.javaEnabled(),
		customDataList = [],
		loadTime = -1,			//从接收到文档到window.onload的时间
		networkTime  = -1,		//网速测试的时间，请求一个空地址计算 
		responseTime = -1,		//请求的response时间。类似爬虫的获取时间。不含dom解析时间，高级浏览器。
		timingStr = '-1',		//window.performance.timing里的一些数据，高级浏览器。
		dnsTime =-1,			//DNS服务器解析时间
		connectTime = -1,		//包括浏览器与WEB服务器初始连接花费时间
		firstByteTime = -1,		//指WEB服务器response 到浏览器的first byte时间
		contentDownloadTime = -1,	//指html文档的下载时间
		startRenderTime = -1,	//页面头部时间戳-response end;
		domReadyTime = -1,		//Dom ready时间-start render时间
		initScreenTime = -1;	//首屏打点时间-start render时间
	
	
	function formatData(data){
		var tmp = {}
		if($.type(data)=='object'){		
			for(var item in data){			
				if($.type(data[item])=='object' || $.type(data[item])=='array'){
					var obj = formatData(data[item]);
					for(var subItem in obj){
						//server application may confuse reading '-1' value
						if(obj[subItem]==-1 || obj[subItem]=='-1')continue;
						tmp[subItem]=obj[subItem];
					}				
				}else{
					tmp[item]=data[item];
				}
			}
		}
		if ($.type(data)=='array'){
			
			for (var i = data.length - 1; i >= 0; i--){
				var arrItemTmp = formatData(data[i]);
				for(var item in arrItemTmp){
					if((arrItemTmp[item]==-1) || (arrItemTmp[item]=='-1'))continue;
					tmp[item]=arrItemTmp[item];				
				}
			};
		}
		return tmp;
	}
	function _getBaseInfo(){
		var dataArray=[];
		dataArray.push(appNum);
		dataArray.push(pageId);
		dataArray.push(pageSeed);
		dataArray.push({'session':''});
		return dataArray;

	}
	/**
	 * 输入ua字符串和匹配列表，返回名字和版本
	 * @param {Object} ua 浏览器ua字段(小写)
	 * @param {Array} matchList 匹配列表，例如['chrome','firefox']
	 * @return {Object} {'name':'chrome','version':'11.x.x.x'}
	 */
	function _getUAInfo(ua,matchList,bTestVersion){
		var match = ua.match(new RegExp('('+matchList.join('|')+')'));
		var verMatch = ua.match(new RegExp('('+matchList.join('|')+')'+'[\\s\\/]([\\w\\d\\.]*)?'));
		var verMatch2 = ua.match(/(version)[\s\/]([\w\d\.]*)?/);
		var verMatchResult = verMatch?verMatch[2]:undefined;
		return {
			'name':match?match[0]:undefined,
			'version':((bTestVersion && verMatch2)?(verMatch2[2]):verMatchResult)
		}
	}
	
	function _getBrowserInfo(){
		var oBrowser = {};
		var is360 = false;
		
		var map = {
			'360se':'360',
			'360chrome':'360',
			' se':'sogou',
			'tencenttraveler':'tt',
			'maxthon':'max',
			'theworld':'theworld',
			'ucweb':'ucweb',
			'greenbrowser':'green',
			'opera':'opera',
			'ie':'ie',
			'firefox':'firefox',
			'chrome':'chrome',
			'safari':'safari'				
		}
		var UAInfo;
		function setUAInfo(uaInfo){
			var name=uaInfo['name'];
			if(!oBrowser[d_browser_name])oBrowser[d_browser_name]=map[name]?map[name]:name;
			if(!oBrowser[d_browser_ver])oBrowser[d_browser_ver]=uaInfo['version'];				
		}
		UAInfo = _getUAInfo(ua,["360se","360chrome","\\sse","tencenttraveler","maxthon","theworld","ucweb","greenbrowser"],true);
		setUAInfo(UAInfo);
		
		//360 special process
		if(!oBrowser[d_browser_name]){
			try{
				if(window.external.twGetRunPath){
					var r=external.twGetRunPath();
					if(r&&r.toLowerCase().indexOf('360se')>-1){
						oBrowser[d_browser_name]='360';
					}
				}
			}catch(ex){}				
		}				
		//对于国产浏览器的ie内核，使用ie的版本号
		if(UAInfo['name']){
			UAInfo = _getUAInfo(ua,["msie","chrome","safari"],true);
			if(UAInfo['version']){oBrowser[d_browser_ver] = UAInfo['version'];}
		}				


		if (!oBrowser[d_browser_name] || !oBrowser[d_browser_ver]) {
			UAInfo = _getUAInfo(ua, ["opera", "ie", "firefox", "chrome", "safari"], true);
			setUAInfo(UAInfo);
		}
		
		if(!oBrowser[d_browser_name]){				
			oBrowser[d_browser_name]='unknown';								
		}

		if(!oBrowser[d_browser_ver]){
			oBrowser[d_browser_ver] = 'unknown'
		}
	
		var coreMatch=ua.match(/webkit|ie|presto|gecko/);
		if(coreMatch){
			oBrowser['navEngine']=coreMatch[0];
		}else{
			oBrowser['navEngine']='unknown';
		}			

		oBrowser['lang'] = (navigator['browserLanguage'] || navigator['language']).toLowerCase();
		return oBrowser;
	}
	
	/**
     * 获取操作系统信息
     */
	function _getOSInfo(ua) {
		var oOS = {
			'osVer':undefined,
			'osName':undefined,
			'device':undefined
		};
		var oResult = _getUAInfo(ua,['ipad','iphone','ipod','iphone os'])//,'webos','palmos','android','symbian','blackberry']);
		if(oResult['name']){
			oOS['osName']='ios';
			oOS['device']=oResult['name'];
			var verResult = _getUAInfo(ua,['ios','iphone os','os']);
			if(verResult['version']){
				oOS['osVer']=verResult['version'].replace(/_/g,'.');
			}
			
		}
		
		function setOOS(oOS){
			
			
		}		
		var result;
		if(!oOS['osName'])
		{
			result=ua.match(/(webos|palmos|android|symbian|blackberry)/);
			if(result){
				oOS['osName']=result[0];
				oOS['device']='mobile';
				var verMatch = ua.match(/(webos|palmos|android|symbian|symbian os|symbianos|blackberry)[\s\/]([\w\d\.]*)?/)||['unknown'];
				oOS['osVer']=verMatch[2]?verMatch[2]:verMatch[0];
			}else{
				var winmatch = ua.match(/(win).*?(\bce\b|phone|palm|ppc|mobile)/);
				if(winmatch && winmatch.length>2){
					result ='winphone';
					oOS['osName']=result;
					oOS['device']='mobile';
					var versionMatch = ua.match(/(windows phone.*?)[);]/);
					oOS['osVer']=versionMatch?versionMatch[1].replace(/[^0-9\. ]/g,''):'unknown';
				}
			}
			
		}

		if(!oOS['osName']){
			//var s = navigator.oscpu || navigator.appVersion;
			result=ua.match(/(windows nt|linux|macintosh|mac_powerpc|mac os x)/);
			if(result){
				var osMap = {
					'windows nt':['win','pc'],
					'linux':['linux','pc'],
					'macintosh':['mac','mac'],
					'mac_powerpc':['mac','mac'],
					'mac os x':['mac','mac']
				}
				oOS['osName']=osMap[result[0]][0];
				oOS['device']=osMap[result[0]][1];
				var verMatch = ua.match(/(windows nt|intel mac os x)[\s\/]([\w\d\.\_]*)?/);
				if(verMatch){
					oOS['osVer'] = verMatch[2].replace(/_/g,'.');
				}
			}            				
		}
		for(var item in oOS){
			if(!oOS[item])oOS[item]='unknown';
		}
		return oOS;
	}
	
	/**
	 * 获取flash版本信息
	 */
	function _getFlashVersion(){
		var ver, SF = 'ShockwaveFlash';
		if (navigator.plugins && navigator.mimeTypes.length) {
			ver = (navigator.plugins['Shockwave Flash'] || 0).description;
		}
		else 
			if (window.ActiveXObject) {
				try {
					ver = new ActiveXObject(SF + '.' + SF)['GetVariable']('$version');
				} 
				catch (ex) {
				}
			}
		if (!ver) 
			return;
		var version=ver.match(/(\d)+/g).splice(0, 3);
		if (version) {
			version[2] = 'rc' + version[2];
			return version.join('.');
		}			
		return;
	}
	
	
	function _sendDataByPost(customObj,url){
		var iframeStandardId = 'mo-hidden-iframe';
		var ac = ('https:' == document.location.protocol ? 'https://' : 'http://')  + (url || errorPostAction);
		var iframeId = iframeStandardId;
		iframeId = _createHiddedIframe();
		var formEl = $('<form/>').css('display','none').attr('target',iframeId).attr('method','POST').attr('action',ac);
		
		var data = formatData([customObj,_getBaseInfo()]);
		for (var i in data) {
			var tempEl = $('<input/>').attr('type','hidden').attr('name',i).val(data[i]).appendTo(formEl);
		}
		var submitEl = $('<input/>').attr('type','submit').val('Submit').appendTo(formEl);
		formEl.appendTo($('body'));
		formEl.trigger('submit');
		/**
		 * 创建隐藏ifamre用于表达的提交
		 */
		function _createHiddedIframe() {
			var _self = this;
			var iframeWrapper = document.createElement('div');
			for (var i = 0; i < 10; i++) {
				if (document.getElementById(iframeId)) {
					iframeId = iframeStandardId + $.now();
				}
				else {
					break;
				}
			}
			iframeWrapper.innerHTML = '<iframe width="0" height="0" id="' +
					iframeId +
					'"name="' +
					iframeId +
					'" frameBorder="0" style="top: -100%; position: absolute;"></iframe>';
			document.body.appendChild(iframeWrapper);
			return iframeId;
		}
	};
	
	/**
	 * 用get方式传送数据，参数为json数组
	 * @param {array} customObjList
	 */
	function _sendDataByGet(customObj,url){
		console.log(customObj);
		var data = formatData([customObj,_getBaseInfo()]) ;			
		if(!data){return;}
		var paramList = [];
		var pushInto = function(obj){for(j in obj){}}
		if(Object.prototype.toString.call(data)==='[object Object]'){
			for (j in data) {
				paramList.push(j + '=' + data[j]);
			}				
		}
		if(Object.prototype.toString.call(data)==='[object Array]'){
			for(var list=data;list!=false;list.shift()){
				var curData = list[0];
				for(var j in curData){						
					paramList.push(j + '=' + curData[j]);
				}
			}
		}
		
		var tempImage = new Image();
		tempImage.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + (url||analyticsURLByGet) + '&' + paramList.join('&');
	}
	
	var isSendFlag = false;
	
	function sendAnalyticsData() {
			
		if (!isSendFlag) {
			isSendFlag = true;
			var aData = [];
			aData.push(oScreen);
			aData.push(oBrowser);
			aData.push(oOS);
			aData.push({'loadTime':loadTime.toString()});
			aData.push({'networkTime':networkTime.toString()});
			aData.push({'responseTime':responseTime.toString()});
			//aData.push({'timingStr':timingStr.toString()});
			aData.push({'dnsTime':dnsTime.toString()});
			aData.push({'connectTime':connectTime.toString()});
			aData.push({'firstByteTime':firstByteTime.toString()});
			aData.push({'contentDownloadTime':contentDownloadTime.toString()});
			aData.push({'startRenderTime':startRenderTime.toString()});
			aData.push({'domReadyTime':domReadyTime.toString()});
			aData.push({'initScreenTime':initScreenTime.toString()});
			//aData.push(oMobileDevice);
			aData.push({'flashVer':sFlashVersion});
			aData.push({'javaEnabled':bSupportJava});
			_sendDataByGet(aData, analyticsURLByGet);
		}
	}
	
	function _onLoad(e){
	
		var _endTimeStamp = new Date();
		if(DOMReadyTimeStamp<0){
			DOMReadyTimeStamp = _endTimeStamp;
		}
		//高级浏览器使用window.performance获取时间。
		if(window['performance'] && window['performance']['timing']){
			var timing =  window['performance']['timing'];
			if(timing['navigationStart'] > 0){
				responseTime = timing['responseEnd'] - timing['navigationStart'];
			}
			dnsTime =timing['domainLookupEnd']-timing['domainLookupStart']; 			
			connectTime = timing['connectEnd']-timing['connectStart'];		
			firstByteTime = timing['responseStart']-timing['requestStart'];
			contentDownloadTime =  timing['responseEnd']-timing['responseStart'];	
					
			if(window['AA_INIT_SCREEN_TIMING']){
				initScreenTime = window['AA_INIT_SCREEN_TIMING']-window['AA_RENDER_START_TIMING'];
			}
			
			
			
			if(window['AA_RENDER_START_TIMING']){
				//As to different implementation of browsers,some start render after responseEnd,
				//some before responseEnd, so we cal time from responseStart
				startRenderTime = window['AA_RENDER_START_TIMING']-timing['responseStart'];					
			}
			
		}
		
		if(window['AA_RENDER_START_TIMING']){
			domReadyTime = DOMReadyTimeStamp - window['AA_RENDER_START_TIMING'];				
			loadTime = _endTimeStamp - window['AA_RENDER_START_TIMING'];
		}
		
		//发送统计
		setTimeout(function(){
			sendAnalyticsData();
		},500);
	}
	function postErrorMsgData(data) {
		_sendDataByPost(data,errorPostAction);
	}
	
	var monitor = function(){
		
		//过滤掉爬虫
		if(new RegExp('googlebot|bingbot|yahoo').test(ua))return;
		
		$(function(){
			DOMReadyTimeStamp = $.now();
		});
		if(appNum||pageId){
		
			$(win).bind('load',_onLoad);
			
			//绑定window的onerror事件
			if (!window.onerror) {
				window.onerror = function (msg, fileName, num) {
					postErrorMsgData({
						'method':'error',
						'errMsg': msg,
						'errFileName':fileName,
						'errLineNum':num || -1,
						'errUrl':location.href
					});
					//return true;
				};
			}
		}
		return {};
	}

	SYS.monitor = monitor();
	
	
})(jQuery, FE.sys,window);