 /**
 * ��־ģ��
 * 1����������־�ȼ� -- "error", "warn", "info", "debug", "log"
 * 2����Firefox��ͨ��firebug����̨�����־����IE��ͨ����url�����debug=true����������־��ʾ��ҳ��ײ���
 * 3������ģʽ�Ĵ�����־������¼��draggon���ϵͳ������������
 
 * @author terence.wangt the original version's author: zhouquan.yezq
 * @date 2012-01-20
 
   jEngine��ܽ����ĵ�: http://wd.alibaba-inc.com/doc/page/work/cbu-market/common/jEngine
 */
 
!(function($){
	
	$.Logger=function(){};
	$.Logger.level=4; 	//default level
	$.Logger.setLevel=function(level){//set logger level to filter the logger , so just show the logger level you focus.
		$.Logger.level=level;
	};
   
	var prepared = false;
	var methods = [ "error", "warn", "info", "debug", "log"];//0-4 level
	var browser = {};
   
	$.extend($.Logger.prototype, {
		level:$.Logger.level,
		setEnableLevel: function(level) {
			if(level>4 || level<0) {
				this.error(['wrong level setting. level should be 0-4, the int type,you set ',level,", so stupided."].join(''));
			}
			this.level=parseInt(level);
		},
		setErrorUri: function(url) {
			$.Logger.errorUri=url; 	//dragoon url
		},
		enabled: function(lev) {
			if(lev>$.Logger.level) {
				return false;
			}
			return true;
		},
		name: function() {
			return this._name;
		},
		log: function() {
			this._log(4, arguments);
		},
		debug: function() {
			this._log(3, arguments);
		},
		info: function() {
			this._log(2, arguments);
		},
		warn: function() {
			this._log(1, arguments);
		},
		error: function() {
			this._log(0, arguments);
		},
		_handler: function(level, name, msg, moduleId){
		 
			var method=methods[level];
			var logstr=[[method+"|"].join(" | ")].concat(msg);
			   
			if(self.console && !browser.msie){
			
			   if(console.log.apply){
				  console[method].apply(console, logstr);    	  
			   }else{
				  console[console[method]?method:'log'](logstr);
			   }
			}else{
				//��IE�£����url�����debug=true������־���ڽ��������ҳ��ĵײ����������ԡ�
				if(browser.msie){
					if(/debug=true/i.test(location.search)){
						!prepared && this._prepare();	
						var msgBox = $('#DEBUG ol');
						
						var color;
						switch(method){
							case "log":{
								color="#FFFFFF";
								break;
							}
							case "debug":{
								color="#C0C0C0";
								break;
							}
							case "info":{
								color="#EBF5FF";
								break;
							}
							case "warn":{
								color="#FFFFC8";
								break;
							}
							case "error":{
								color="#FE6947";
								break;
							}
							default:{
								color="#FFFFFF";
								break;
							}
						}
						$('<li style="background-color:'+ color +';">').text('' + logstr).appendTo(msgBox);				
					} 
				}
			}
			
			//onlineģʽ����Ҫ����
			if(!DEBUG_MOD && $.Logger.errorUri){
				if(level == 0 || level == 1){
					
					var moudle = "";
					if(moduleId){
						moudle = "&module=" + moduleId;
						logstr = msg;
					}					
					(new Image()).src = $.Logger.errorUri +this._getBrowserInfo() +this._getErrorUrl() + "&level=3" + "&msg=" + encodeURIComponent(logstr) + moudle;
				}
			}
		},
	 
		_log: function(level, msg) {
			if (this.enabled(level)) {
				var msgStr 	 = msg[0];
				var moduleId = msg[1];
				this._handler(level,this.name(),msgStr, moduleId);
			}
		},
		
		//since jQuery 1.9 removed the support for $.browser, we add this function here
		parseBrowser:function(){
			
			var userAgent = navigator.userAgent.toLowerCase(); 
			browser = $.browser ? $.browser : { 
				version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1], 
				safari: /webkit/.test( userAgent ), 
				opera: /opera/.test( userAgent ), 
				msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ), 
				mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent ) 
			};
		},
		
		_getBrowserInfo:function(){
			
			var key ="&browser=";
			var value = '';
			$.each(browser, function(key, val) {
			
				if(key != 'version'){
					value = value + key + " ";
				}else{
					value = value + val;
				}
			});
			
			return key + encodeURIComponent(value);
		},
		
		_getErrorUrl:function(){
			
			var key ="&erroruri=";
			var value = window.location.href;
						
			return key + encodeURIComponent(value);
		},
	
		_prepare:function(){
			$('#DEBUG').remove();
			$(document.body).append('<div id="DEBUG" style="margin-top:10px;padding:8px;border:dashed 1px #FF7300;background-color:#EEE;color:#000;"><ol></ol></div>');
			prepared = true;
		},
		end:0
	});
   

   
	var logs={};//logs  instance container
	$.getLogger= function(name) {
       if (!logs[name]) {
          logs[name] = new $.Logger(name);
          logs[name]._name=name;
        }
        return logs[name];
	};
   
	$.logger = $.getLogger("jEngine");
	if(DEBUG_MOD){
		$.logger.setEnableLevel(4);	
	}else{
		$.logger.setEnableLevel(2);
	}
	$.logger.parseBrowser();
	
	//��ҪӦ�ö��嵽�Լ���JS�ļ�global������
	//$.logger.setErrorUri("http://110.75.196.102/page/logError?appkey=22814abc2094a727bd6a24ba1e5a8d45");  //ǰ���쳣���ϵͳ����API
	
	//try-catch ��׽�������쳣ʹ��onerror��������¼��־
	/* window.onerror = function(msg,url,line){
		
		if(!DEBUG_MOD){
			(new Image()).src = $.Logger.errorUri + $.logger._getBrowserInfo() + msg + ' |url:' +url + ' |line:'+line;
		}
		return false;
	}; */
 
})(jQuery);
