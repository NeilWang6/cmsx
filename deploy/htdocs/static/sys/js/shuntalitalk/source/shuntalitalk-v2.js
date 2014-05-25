/**
 * FD.widget.ShuntAlitalk
 * @author leijun
 * @date 100914
 * 客服贸易通分流布点
 * @version 1.1 
 * @update 120203 新增tp会员阿牛助手
 * 优化： 
 *			1、减少了页面布点js依赖数量
 *			2、优化了原本组件极度依赖最新版alitalk组件静态方法talk的情况，现在组件支持老版本alitalk了
 *			3、提供了alitalk配置项，现只支持remote,autoLogin
 *			4、鼠标经过触发点时才会向服务器发送请求
 * 限制：
 * 		1、该组件布点成本较高，不赞成由需求方独立完成，如有此情况，出现问题，前端概不负责
 * 		2、为兼容老版本和html5标准，开放配置获取特定用来埋设数据的目标属性，赞成使用data-shunt等html5属性
 * 		3、布点时需要注意与旧版alitalk组件的兼容性，虽然已经进行初步测试，但是不排除少部分不兼容情况
 * 调用方法：
 *		<script src="http://style.c.aliimg.com/js/lib/fdev-v3/core/fdev-min.js"></script>
 *		<script src="http://style.c.aliimg.com/js/lib/fdev-v3/core/yui/get-min.js"></script>
 *		<script src="http://style.c.aliimg.com/js/sys/shuntalitalk/shuntalitalk-v2.js" type="text/javascript"></script>
 * 	……
 * 		<a href="javascript:;" class="alitalk-shunt" data-shunt="{positionId:'Top_Banner'}" target="_self">在线订购申请</a>
 *		……
 *		<script type="text/javascript">
 *			var shuntAlitalk = new FD.widget.ShuntAlitalk("alitalk-shunt",{attname:"data-shunt"});
 *		</script>
 *  备注：
 * 		由方法中可以观察出，组件获取配置参数有三种方式，第一层是组件默认，第二层是初始化节点组，第三层是单个触发点自定义属性，第三层优先级最高
 */
 
 FD.widget.ShuntAlitalk = function(container,config){
	this._init(container,config);
}

/** 默认配置 **/
FD.widget.ShuntAlitalk.defConfig = {
	aliTalkId:'aliservice29',	// 默认分流失败分支talkid
	ruleId:'ALITALK_INCALL_ROLE_CTP01',	// 默认分流ruleid
	positionId:'Top_Banner',	// 默认分流positionid
	attname:"rel",   //触发点数据预埋的属性
	lock:true,			//是否只发送一次成功的返回talkid的请求
	lockclass:"shunt-lock", //防止多次发送请求的添加class标识
	remote:false,   //默认使用alitalk的不获取在线状态的模式（如需新增其它alitalk组件配置参数，请联系我）
	autoLogin:false //未登录自动登录
}

FD.widget.ShuntAlitalk.prototype = {
	_init : function(container,config){
		var t=this;
		t.container = FYD.getElementsByClassName(container);
		t.config = FD.common.applyIf(config ||{}, FD.widget.ShuntAlitalk.defConfig);
		t.classfocus=container;
		FYE.on(t.container ,"mouseover",t._overHandler,t, true);
		(t.container).forEach(function(el){
			var d=FD.common.parse(FYD.getAttribute(el,t.config.attname));
			t._setTalkId(el,d);
		});
	},
	_overHandler : function(e){
		FYE.preventDefault(e); 
		var t=this,el = FYE.getTarget(e);
		if(!FYD.hasClass(el,t.classfocus)){el=FYD.getAncestorByClassName(el,t.classfocus);}
		var d=FD.common.parse(FYD.getAttribute(el,t.config.attname));/*触发点获取的属性对象将重载config*/
		t.config = FD.common.applyIf(d ||{}, t.config);
		if(!FYD.hasClass(el,t.config.lockclass)){
			t._requestHandler(el);
		}
	},
	_requestHandler : function(el){
		var t=this,param={}; 
		param.memberId=t._getLoginid();	
		param.ruleId=t.config.ruleId;
		param.positionId=t.config.positionId; 
		var configs={
			onCallback: function(o) {
				if(o.success){
					/*
					 * 返回结果的类型resultType目前虽然只有两种类型，但是以后有扩展可能，暂时用switch
					 * 返回结果的数据因为历史原因，暂时保存在aliTalkId字段中。。。
					*/
					switch(o.resultType){
						case 'aliYUrl':
							FD.common.goTo(o.aliTalkId,'_blank');
							break;
						case 'alitalkId':
						default :
							if(t.config.lock){
								FYD.addClass(el,t.config.lockclass);
							}
							t._setTalkId(el,o);
							t._shuntTalk(el);
							break;
					}
				}else{
					t._setTalkId(el,o);
					t._shuntTalk(el);
				}
			},
			onTimeout: function(o){
				t._shuntTalk(el);
			}
		};  
		var req=FD.common.request('jsonp','http://athena.1688.com/athena/aliTalkInCall.json',configs,param);
	},
	_setTalkId : function(el,talkobj){
		var t=this,talkid=talkobj.aliTalkId||t.config.aliTalkId;
		FYD.setAttribute(el,"alitalk","{id:'"+talkid+"'}");
	},
	_shuntTalk : function(el){
		var t=this;
		if (typeof FD.widget.Alitalk === 'undefined'){
			var configs = {
				onSuccess: function(o){new FD.widget.Alitalk(el,{remote:t.config.remote,autoLogin:t.config.autoLogin});}
			};
			var req=FD.common.request('jsonp','http://style.c.aliimg.com/js/lib/fdev-v3/widget/alitalk/alitalk-min.js',configs);
		} else {
			new FD.widget.Alitalk(el,{remote:t.config.remote,autoLogin:t.config.autoLogin});  
		}
	},
	_getCookie : function(name){
		var v = document.cookie.match('(?:^|;)\\s*'+name+'=([^;]*)');
		return v ? unescape(v[1]) : '';
	},
	_getLoginid: function(){
		return (this._getCookie('__cn_logon__') && this._getCookie('__cn_logon__')==='true') ? this._getCookie('__last_loginid__') : "";
	}
}

