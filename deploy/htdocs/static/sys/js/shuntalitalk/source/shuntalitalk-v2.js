/**
 * FD.widget.ShuntAlitalk
 * @author leijun
 * @date 100914
 * �ͷ�ó��ͨ��������
 * @version 1.1 
 * @update 120203 ����tp��Ա��ţ����
 * �Ż��� 
 *			1��������ҳ�沼��js��������
 *			2���Ż���ԭ����������������°�alitalk�����̬����talk��������������֧���ϰ汾alitalk��
 *			3���ṩ��alitalk�������ֻ֧��remote,autoLogin
 *			4����꾭��������ʱ�Ż����������������
 * ���ƣ�
 * 		1�����������ɱ��ϸߣ����޳������󷽶�����ɣ����д�������������⣬ǰ�˸Ų�����
 * 		2��Ϊ�����ϰ汾��html5��׼���������û�ȡ�ض������������ݵ�Ŀ�����ԣ��޳�ʹ��data-shunt��html5����
 * 		3������ʱ��Ҫע����ɰ�alitalk����ļ����ԣ���Ȼ�Ѿ����г������ԣ����ǲ��ų��ٲ��ֲ��������
 * ���÷�����
 *		<script src="http://style.c.aliimg.com/js/lib/fdev-v3/core/fdev-min.js"></script>
 *		<script src="http://style.c.aliimg.com/js/lib/fdev-v3/core/yui/get-min.js"></script>
 *		<script src="http://style.c.aliimg.com/js/sys/shuntalitalk/shuntalitalk-v2.js" type="text/javascript"></script>
 * 	����
 * 		<a href="javascript:;" class="alitalk-shunt" data-shunt="{positionId:'Top_Banner'}" target="_self">���߶�������</a>
 *		����
 *		<script type="text/javascript">
 *			var shuntAlitalk = new FD.widget.ShuntAlitalk("alitalk-shunt",{attname:"data-shunt"});
 *		</script>
 *  ��ע��
 * 		�ɷ����п��Թ۲���������ȡ���ò��������ַ�ʽ����һ�������Ĭ�ϣ��ڶ����ǳ�ʼ���ڵ��飬�������ǵ����������Զ������ԣ����������ȼ����
 */
 
 FD.widget.ShuntAlitalk = function(container,config){
	this._init(container,config);
}

/** Ĭ������ **/
FD.widget.ShuntAlitalk.defConfig = {
	aliTalkId:'aliservice29',	// Ĭ�Ϸ���ʧ�ܷ�֧talkid
	ruleId:'ALITALK_INCALL_ROLE_CTP01',	// Ĭ�Ϸ���ruleid
	positionId:'Top_Banner',	// Ĭ�Ϸ���positionid
	attname:"rel",   //����������Ԥ�������
	lock:true,			//�Ƿ�ֻ����һ�γɹ��ķ���talkid������
	lockclass:"shunt-lock", //��ֹ��η�����������class��ʶ
	remote:false,   //Ĭ��ʹ��alitalk�Ĳ���ȡ����״̬��ģʽ��������������alitalk������ò���������ϵ�ң�
	autoLogin:false //δ��¼�Զ���¼
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
		var d=FD.common.parse(FYD.getAttribute(el,t.config.attname));/*�������ȡ�����Զ�������config*/
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
					 * ���ؽ��������resultTypeĿǰ��Ȼֻ���������ͣ������Ժ�����չ���ܣ���ʱ��switch
					 * ���ؽ����������Ϊ��ʷԭ����ʱ������aliTalkId�ֶ��С�����
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

