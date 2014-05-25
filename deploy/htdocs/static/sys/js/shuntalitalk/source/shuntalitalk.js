/**
 * FD.widget.ShuntAlitalk
 * @author leijun
 * @date 100914
 * @update 120203 ����tp��Ա��ţ����
 * �ͷ�ó��ͨ��������
 * ���ƣ�
 * 		1���������������°��alitalk�ľ�̬����talk(),����ʹ���°����
 * 		2���ò��㲻���ȡ��������������״̬��������ҪΪ�����Զ�����ʽ������ iconAlitalk icon-on��
 * 		3������ʱ��Ҫע����ɰ�alitalk����ļ����ԣ���Ȼ�Ѿ����г������ԣ����ǲ��ų��ٲ��ֲ��������
 * 		4��Ĭ��ȫ�ֵ�ruleId��positionId��aliTalkId�������ò������������޸ĸ��𲼵��������rel�������޸ģ��޸�ȫ�ֲ���������ڳ�ʼ��ʱ�޸�
 * 		5��ֻ��Դ�ͳó��ͨ������WebWW�����Ժ���Ҫ������Ӧ�߼�
 * ���÷�����
 *		<script src="http://style.c.aliimg.com/js/lib/fdev-v3/core/fdev-min.js"></script>
 *		<script src="http://style.c.aliimg.com/js/lib/fdev-v3/core/yui/get-min.js"></script>
 *		<script src="http://style.c.aliimg.com/js/lib/fdev-v3/widget/alitalk/alitalk-min.js"></script>
 *		<script src="http://style.c.aliimg.com/js/sys/shuntalitalk/shuntalitalk-min.js" type="text/javascript"></script>
 * 	����
 * 		<a href="#" class="alitalk-shunt" rel='{"positionId":"Top_Banner"}' target="_self">���߶�������</a>
 *		����
 *		<script type="text/javascript">
 *			var shuntAlitalk = new FD.widget.ShuntAlitalk("alitalk-shunt",{ruleId:"xxx",positionId:"yyy",aliTalkId:"zzz"});
 *		</script>
 */
 
FD.widget.ShuntAlitalk = function(container,config){
	this._init(container,config);
}

/** Ĭ������ **/
FD.widget.ShuntAlitalk.defConfig = {
	aliTalkId:'aliservice29',	// Ĭ�Ϸ���talkid
	ruleId:'ALITALK_INCALL_ROLE_CTP01',	// Ĭ�Ϸ���ruleid
	positionId:'Top_Banner',	// Ĭ�Ϸ���positionid
	attname:"rel"   //����������Ԥ�������
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
		/*������rel�����е����Զ�����������*/
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
					 * ���ؽ��������resultTypeĿǰ��Ȼֻ���������ͣ������Ժ�����չ���ܣ���ʱ��switch
					 * ���ؽ����������Ϊ��ʷԭ����ʱ������aliTalkId�ֶ��С�����
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

