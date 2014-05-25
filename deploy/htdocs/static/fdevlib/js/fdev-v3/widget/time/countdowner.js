/**
 * FD.widget.CountDown
 *
 * ����ʱ��
 * ���ƣ�
 * 		1��������ֹʱ�䣬��С����1�뵹��ʱ
		2���������js/core/fdev-min.js�ļ��� js/core/yui/animation-min.js �ļ���ѡ�������ò���hasAnim ��Ϊʹ�ö���Ч��ʱ
		3�����ʹ��ͼƬ���֣�����ѡ�������ʽ�ļ� http://style.c.aliimg.com/css/fdevlib/widget/countdown.css
		4�����ʹ��ͼƬģ�����֣������˽�����ص�html �ṹ���� <p class="num0"></p> ��Ȼ��ǰ׺num ��ͨ�����ò����滻
 * 		5��չʾ�졢ʱ�䡢���ӡ���������ò�ͬ��div ���֣�html ����ṹ����������������ӱ�д��
			<div id="cd-1" class="countDown">
				<div class="cd-day">
					2
				</div>
				<div class="cd-hour">
					5
				</div>
				<div class="cd-minute">
					23
				</div>
				<div class="cd-second">
					<q class="num1"><p></p></q><q class="num4"><p></p></q>  <!-- ��ʹ��ͼƬ��ʾ����ʱ ��ͬ 14 -->
				</div>
			</div>

 * ���÷�����
		FD.widget.CountDowner.init('cd-1',{countUp:0,outputType:0,nowTime:new Date(),desTime:new Date('2010','4','31','16','0','0'),cdStep:1});
 *
 * @author 	balibell
 * @link    http://www.fdev-lib.cn/
 */

FD.widget.CountDown = function (id,cfg){	
	this.init(id,cfg);
}
/* Ĭ�ϲ������� */ 
FD.widget.CountDown.defConfig = {
	countUp : 0, //countUp ��Ϊ0 ʱ��������ʱ����Ϊ1 ��������ʱ
	classOfConts : ['cd-year','cd-month','cd-day','cd-hour','cd-minute','cd-second'], //��Ӧhtml �������className �졢Сʱ�����ӡ���
	topBound : 2, //����ǵ���ʱcountUp==0 ��topBound��ʾ���ʱ�����ߵ�λ 5-��; 4-����; 3-Сʱ; 2-��; 1-��; 0-��
	numClassPrefix : 'num', //��outputType ��Ϊ1 ��ʹ��ͼƬ����ʱ����Ϊ className ��ǰ׺
	outputType : 0, //������ָ�ʽ��0- ������  1-ͼƬģ�������	
	nowTime : new Date(), //��ǰʱ�䣬CountDown��ֻ��Ҫ�ڳ�ʼ��ʱ������ȷ�ĵ�ǰʱ�伴�ɣ��ڲ�����һ��date���� ���ʱ��ͬ������ˣ�����Ҫ����ȡʱ��
	desTime : new Date('2010','2','8','0','0','0'), //Ŀ��ʱ��
	cdStep : 1 //����������ʱ�䲽��������Ϊ1 ��ÿ��1�� ����һ��
};


FD.widget.CountDown.prototype = {
	Status : 1,
	DValue : 0,
	DValueArr : [0,0,0,0,0,0],  //[��ֵ�꣬��ֵ�£���ֵ��������ֵСʱ������ֵ����������ֵ����]
	init: function (id,cfg){
		if(FYG(id)){
			this.config = FD.common.applyIf(cfg||{}, FD.widget.CountDown.defConfig);
			this.obj = FYG(id);
			this.run();
		}
	},
	run : function (t){
		//tΪ ���ϴ�����run ������ʱ���������t���� this.config.nowTime ͬ�����������û�д���t ���t ��ֵ�������´δ��ݸ�run ����
		if(t){ //t �ĵ�λΪ ��
			this.config.nowTime = new Date(this.config.nowTime.getTime() + t);
		}else{
			var t  = this.config.cdStep * 1000;
		}

		this.calcDValue();  //�����ֵ��Ӧ�ĺ���������װ�� this.DValue

		this.calcDValueArr();  //���ݲ�ֵ��Ӧ�ĺ����� this.DValue �����Ӧ��������Сʱ������������������װ������ this.DValueArr		

		//A ������㣬��ֹͣ��ʱ ���·����� B ��Ӧ
		if(this.DValue <=0 ){
			this.Status = 0;
			this.DValue = 0;
			this.DValueArr = [0,0,0,0,0,0];
		}

		var c = this.config.classOfConts; // classOfConts ����
		var r = this.DValueArr;

		this.setInnerHTML(c[0],r[0],4);  //������
		this.setInnerHTML(c[1],r[1]);  //������
		this.setInnerHTML(c[2],r[2]);  //��������
		this.setInnerHTML(c[3],r[3]);  //����Сʱ��
		this.setInnerHTML(c[4],r[4]);  //���������
		this.setInnerHTML(c[5],r[5]);  //��������
		
		//B ������㣬��ֹͣ��ʱ
		if(!this.Status){
			return;
		}
		
		var _this = this;
		window.setTimeout(function (){
			_this.run(t);
		},t)
	},
	calcDValue : function (){
		if(this.config.countUp == 1){ //���������ʱ
			
			this.DValue = this.config.nowTime.getTime() - this.config.nowTime.getTimezoneOffset() * 60000;
			
		}else{ //����ǵ���ʱ
			this.DValue = this.config.desTime.getTime() - this.config.nowTime.getTime();
		}
	},
	calcDValueArr : function (){
		var d = new Date(this.DValue);
		var a = this.DValueArr;
		var b = this.config.topBound;

		var f = [d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()-1,d.getUTCHours(),d.getUTCMinutes(),d.getUTCSeconds()];
		var t = [null,null,86400000,3600000,60000,1000]
		if(this.config.countUp || !b){
			a[0] = f[0]
			a[1] = f[1] + 1;
			a[2] = f[2] + 1;
			a[3] = f[3];
			a[4] = f[4];
			a[5] = f[5];
		}else{
			var i = a.length;
			while( i-- > 0 ){
				if(b==i && i!=1){
					a[i] = parseInt(this.DValue/t[i]);
					break;
				}else if(b==i && i==1){
					a[i] = f[1] + 12 * (f[0]-1970);
					break;
				}else{
					a[i] = f[i];
				}
				
			}
			//a[2] = parseInt(this.DValue / 86400000);
		}
		
	},
	getNumStr : function (clsa){
		var r = '';
		for(var i=0; i<clsa.length; i++){
			r += '<q class="cd-q'+i+'"><p class="'+clsa[i]+'">'+clsa[i]+'</p></q>';
		}
		return r;
	},
	genClassArr : function (str){
		var ca = str.replace(/(\d)/ig,','+this.config.numClassPrefix+'$1');
		ca = ca.split(',');
		ca = ca.slice(1);
		return ca;
	},
	doAnim : function (conta,clsa){


		

	},
	setInnerHTML : function (selector,str,lev){
		var s,lev = lev || 2;

		if((s = FYD.getElementsByClassName(selector,'*',this.obj)) && s.length){
			var obj = s[0];
			str = str + '';
			while( str.length < lev ){
				str = '0' + str;
			}
			if(this.config.outputType){
				if(this.config.effect && obj.innerHTML.match(/<q[^>]*>/ig)){
					this.doAnim(obj,this.genClassArr(str));
				}else{
					obj.innerHTML = this.getNumStr(this.genClassArr(str));
				}
			}else{
				obj.innerHTML = str;
			}
		}
	}
}

/**
 * �� scroll Ч����CountDowner 
 */
FD.widget.CountDownScroll = function(id,cfg){
	this.init(id,cfg);
}
YAHOO.extend(FD.widget.CountDownScroll, FD.widget.CountDown, {
	doAnim: function(conta,clsa) {
		var aq = conta.getElementsByTagName('q');
		var i = aq.length;
		while( i-->0 ){
			var ap = aq[i].getElementsByTagName('p');
			if( ap.length && clsa[i] && clsa[i] != ap[0].className){
				if(ap.length == 1){
					var nxtp = document.createElement('p');
					aq[i].appendChild(nxtp);
				}else{
					var nxtp = ap[1];
				}
				nxtp.className = clsa[i];
	
				var args = { scroll: {to:[0, ap[0].offsetHeight]} };
				var anim = new FYU.Scroll(aq[i],args,.5);
				anim.onComplete.unsubscribeAll();
				anim.onComplete.subscribe(function(a,b,o){
					o.appendChild(FYD.getFirstChild(o));
					o.scrollTop = 0;
				},aq[i]);
				anim.animate();
			}
		}
		
	}
});	

/**
 * CountDowner �ķ�װ��������ͬ�� CountDown ����
 */
FD.widget.CountDowner = new function() {
	this.init = function(id,cfg) {
		if(FYG(id)){
			if(cfg.effect == 'scroll'){
				return new FD.widget.CountDownScroll(id,cfg);
			}else{
				return new FD.widget.CountDown(id,cfg);
			}
		}
	}	
}

