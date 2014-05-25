/**
 * FD.widget.ShuntAlitalk
 * @author leijun
 * @date 100914
 * @update 120203 新增tp会员阿牛助手
 * 客服贸易通分流布点
 * 限制：
 * 		1、布点依赖于最新版的alitalk的静态方法talk(),必须使用新版组件
 * 		2、该布点不会获取布点旺旺的在线状态，所以需要为布点自定义样式，比如 iconAlitalk icon-on等
 * 		3、布点时需要注意与旧版alitalk组件的兼容性，虽然已经进行初步测试，但是不排除少部分不兼容情况
 * 		4、默认全局的ruleId、positionId、aliTalkId已在配置参数中声明，修改个别布点参数请在rel属性中修改，修改全局布点参数请在初始化时修改
 * 		5、只针对传统贸易通开发，WebWW上线以后，需要开发响应逻辑
 * 调用方法：
 *		<script src="http://style.c.aliimg.com/js/lib/fdev-v3/core/fdev-min.js"></script>
 *		<script src="http://style.c.aliimg.com/js/lib/fdev-v3/core/yui/get-min.js"></script>
 *		<script src="http://style.c.aliimg.com/js/lib/fdev-v3/widget/alitalk/alitalk-min.js"></script>
 *		<script src="http://style.c.aliimg.com/js/sys/shuntalitalk/shuntalitalk-min.js" type="text/javascript"></script>
 * 	……
 * 		<a href="#" class="alitalk-shunt" rel='{"positionId":"Top_Banner"}' target="_self">在线订购申请</a>
 *		……
 *		<script type="text/javascript">
 *			var shuntAlitalk = new FD.widget.ShuntAlitalk("alitalk-shunt",{ruleId:"xxx",positionId:"yyy",aliTalkId:"zzz"});
 *		</script>
 */
 
FD.widget.ShuntAlitalk = function(container,config){
	this._init(container,config);
}

/** 默认配置 **/
FD.widget.ShuntAlitalk.defConfig = {
	aliTalkId:'aliservice29',	// 默认分流talkid
	ruleId:'ALITALK_INCALL_ROLE_CTP01',	// 默认分流ruleid
	positionId:'Top_Banner',	// 默认分流positionid
	attname:"rel"   //触发点数据预埋的属性
}

FD.widget.ShuntAlitalk.prototype = {
	_init : function(container,config){
		this.container = FYD.getElementsByClassName(container);
		this.config = FD.common.applyIf(config ||{}, FD.widget.ShuntAlitalk.defConfig);
		this.clicklock=false;
		this.classfocus=container;
		FYE.on(this.container ,"click",this._clickHandler,this, true);
	},
	_clickHandler : function(e,container){
		if(this.clicklock) return;
		this.clicklock=true;
		FYE.preventDefault(e); 
		var obj = FYE.getTarget(e);
			if(!FYD.hasClass(obj,this.classfocus)){
			obj=FYD.getAncestorByClassName(obj,this.classfocus);
		}
		/*触发点rel属性中的属性对象将重载属性*/
		var defaultJsn=FD.common.parse(FYD.getAttribute(obj,this.config.attname));
		
		this.config = FD.common.applyIf(defaultJsn ||{}, this.config);
		
		this._requestHandler();
	},
	_requestHandler : function(){
		var param={};  
		param.memberId=this._getLoginid();	
		param.ruleId=this.config.ruleId;
		param.positionId=this.config.positionId; 
		
		var talkObjId={};
		talkObjId.id=this.config.aliTalkId;
		var _this=this;
		var configs={
			onCallback: function(o) {
				_this.clicklock=false;
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
							talkObjId.id = o.aliTalkId;
							FD.widget.Alitalk.talk(talkObjId);  
							break;
					}
				}else{
					FD.widget.Alitalk.talk(talkObjId);  
				}
			},
			onTimeout: function(o) {
				_this.clicklock=false;
				FD.widget.Alitalk.talk(talkObjId);  
			}
		};  
		var transaction=FD.common.request('jsonp','http://athena.1688.com/athena/aliTalkInCall.json',configs,param);
	},
	_getCookie : function(name){
		var v = document.cookie.match('(?:^|;)\\s*'+name+'=([^;]*)');
		return v ? unescape(v[1]) : '';
	},
	_getLoginid: function(){
		return (this._getCookie('__cn_logon__') && this._getCookie('__cn_logon__')==='true') ? this._getCookie('__last_loginid__') : "";
	}
}

