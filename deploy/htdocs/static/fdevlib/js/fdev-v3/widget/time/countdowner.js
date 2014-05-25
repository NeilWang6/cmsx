/**
 * FD.widget.CountDown
 *
 * 倒计时类
 * 限制：
 * 		1、给定终止时间，最小步长1秒倒计时
		2、必须包含js/core/fdev-min.js文件， js/core/yui/animation-min.js 文件可选，当配置参数hasAnim 设为使用动画效果时
		3、如果使用图片数字，可以选择包含样式文件 http://style.c.aliimg.com/css/fdevlib/widget/countdown.css
		4、如果使用图片模拟数字，必须了解其相关的html 结构例如 <p class="num0"></p> 当然，前缀num 可通过配置参数替换
 * 		5、展示天、时间、分钟、秒的区域用不同的div 区分，html 代码结构必须依照下面的例子编写：
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
					<q class="num1"><p></p></q><q class="num4"><p></p></q>  <!-- 当使用图片表示数字时 等同 14 -->
				</div>
			</div>

 * 调用方法：
		FD.widget.CountDowner.init('cd-1',{countUp:0,outputType:0,nowTime:new Date(),desTime:new Date('2010','4','31','16','0','0'),cdStep:1});
 *
 * @author 	balibell
 * @link    http://www.fdev-lib.cn/
 */

FD.widget.CountDown = function (id,cfg){	
	this.init(id,cfg);
}
/* 默认参数配置 */ 
FD.widget.CountDown.defConfig = {
	countUp : 0, //countUp 设为0 时，即倒计时，设为1 则正常计时
	classOfConts : ['cd-year','cd-month','cd-day','cd-hour','cd-minute','cd-second'], //对应html 相关区域className 天、小时、分钟、秒
	topBound : 2, //如果是倒计时countUp==0 ，topBound表示输出时间的最高单位 5-秒; 4-分钟; 3-小时; 2-天; 1-月; 0-年
	numClassPrefix : 'num', //当outputType 设为1 即使用图片数字时候作为 className 的前缀
	outputType : 0, //输出数字格式，0- 纯数字  1-图片模拟的数字	
	nowTime : new Date(), //当前时间，CountDown类只需要在初始化时传入正确的当前时间即可，内部会有一个date对象 与该时间同步，因此，不需要反复取时间
	desTime : new Date('2010','2','8','0','0','0'), //目标时间
	cdStep : 1 //数字跳动的时间步长，设置为1 则每隔1秒 跳动一次
};


FD.widget.CountDown.prototype = {
	Status : 1,
	DValue : 0,
	DValueArr : [0,0,0,0,0,0],  //[差值年，差值月，差值天数，差值小时数，差值分钟数，差值秒数]
	init: function (id,cfg){
		if(FYG(id)){
			this.config = FD.common.applyIf(cfg||{}, FD.widget.CountDown.defConfig);
			this.obj = FYG(id);
			this.run();
		}
	},
	run : function (t){
		//t为 与上次运行run 函数的时间差，如果传入t，则 this.config.nowTime 同步增长，如果没有传入t 则给t 赋值，用于下次传递给run 函数
		if(t){ //t 的单位为 秒
			this.config.nowTime = new Date(this.config.nowTime.getTime() + t);
		}else{
			var t  = this.config.cdStep * 1000;
		}

		this.calcDValue();  //计算差值对应的毫秒数，并装入 this.DValue

		this.calcDValueArr();  //根据差值对应的毫秒数 this.DValue 计算对应的天数、小时数、分钟数、秒数，装入数组 this.DValueArr		

		//A 如果到点，则停止计时 与下方代码 B 呼应
		if(this.DValue <=0 ){
			this.Status = 0;
			this.DValue = 0;
			this.DValueArr = [0,0,0,0,0,0];
		}

		var c = this.config.classOfConts; // classOfConts 数组
		var r = this.DValueArr;

		this.setInnerHTML(c[0],r[0],4);  //分配年
		this.setInnerHTML(c[1],r[1]);  //分配月
		this.setInnerHTML(c[2],r[2]);  //分配天数
		this.setInnerHTML(c[3],r[3]);  //分配小时数
		this.setInnerHTML(c[4],r[4]);  //分配分钟数
		this.setInnerHTML(c[5],r[5]);  //分配秒数
		
		//B 如果到点，则停止计时
		if(!this.Status){
			return;
		}
		
		var _this = this;
		window.setTimeout(function (){
			_this.run(t);
		},t)
	},
	calcDValue : function (){
		if(this.config.countUp == 1){ //如果是正计时
			
			this.DValue = this.config.nowTime.getTime() - this.config.nowTime.getTimezoneOffset() * 60000;
			
		}else{ //如果是倒计时
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
 * 带 scroll 效果的CountDowner 
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
 * CountDowner 的封装，创建不同的 CountDown 对象
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

