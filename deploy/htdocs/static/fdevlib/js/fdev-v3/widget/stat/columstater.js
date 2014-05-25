/**
 * FD.widget.ColumStat
 *
 * 柱状显示统计数据
 * 限制：
 * 		1、数据必须按指定格式传递给初始化方法。[['A.选项文案1',888],['B.选项文案2',300]]
 * 		2、必须包含http://style.c.aliimg.com/js/lib/fdev-v3/core/fdev-min.js
 * 		3、可能需要包含http://style.c.aliimg.com/css/fdevlib/widget/columstater.css
 *		4、输出物以html 字符串的形式添加到指定节点内，数据和html标签整合度高。
 * 调用方法：
		FD.widget.ColumStater.init('ColumStater-1',{data:[['A.选项文案1',888],['B.选项文案2',300]]});
 *
 *
 * @author 	balibell
 * @link    http://www.fdev-lib.cn/
 */

FD.widget.ColumStat = function (id,cfg){
	this.init(id,cfg);
}

/* 默认参数配置 */ 
FD.widget.ColumStat.defConfig = {	
	data : [['A.选项文案1',888],['B.选项文案2',300]],						/* 默认的统计数据 */
	clength : 130,							/* 柱状图柱体的最大长度 */
	step : 10,								/* 显示步骤，即柱体从0宽度增长到最大宽度需要的步骤数 */
	topclass: 'fillest',
	ctype : 0, // ctype 如果为0 则最长为总数，如果 ctype 为1 则最长的为最大数
	template : ['<div class="columStat"><ul>','<li class="[%topclass%]"><s>[%title%]</s><div class="[%holes0%]" style="width:0px"></div><u class="[%holes1%]">0</u><i class="[%holes2%]">0%</i></li>','</ul></div>'],
	holes : ['thecolum','thenum','therate'],
	delay : 20							/* 柱体增长的速度控制，delay 越大速度越慢 */
};


FD.widget.ColumStat.prototype = {
	init : function (id,cfg){
		this.config = FD.common.applyIf(cfg||{}, FD.widget.ColumStat.defConfig);

		if( (this.obj = FYG(id)) && YAHOO.lang.isArray(this.config.data)){
			//通过方法 calcuDataB() 初始化 dataB 数组，方法对 config.data 进行处理
			//config.data 数组为原始数据，dataB 数组为 config.data 数组派生出来的辅助数组，两者搭配实现功能
			this.dataB = this.calcuDataB();
			
			//初始状态的html 字符串，由方法genStatHTML() 生成。
			this.HTML = this.genStatHTML();
			
			//指定节点内插入初始状态下的html字符串
			this.obj.innerHTML = this.HTML;
			
			//动画展示 colum 柱体的增长
			this.showColumn();
		}
	},
	genStatHTML : function (){
		var a = this.config.data;
		var htmlStr = this.config.template[0];
		var i = 0
		while(i < a.length){
			var tmpstr = this.config.template[1].replace(/\[%title%\]/ig,a[i][0]).replace(/\[%holes0%\]/ig,this.config.holes[0]).replace(/\[%holes1%\]/ig,this.config.holes[1]).replace(/\[%holes2%\]/ig,this.config.holes[2])
			tmpstr = tmpstr.replace(/\[%topclass%\]/ig,i == this.maxColum ? this.config.topclass : '');
			htmlStr += tmpstr;
			i++;
		}
		htmlStr += this.config.template[2];
		return htmlStr;
	},
	calcuDataB : function (){
		this.totalNum = 0, this.maxNum = 0, this.maxColum = 0;
		
		var a = this.config.data,b = [],n = 0;
		for( var i=0; i< a.length; i++){
			this.totalNum += a[i][1];
			if(this.maxNum < a[i][1]){
				this.maxNum = a[i][1];
				n = i;
			}
		}
		this.maxColum = n;
		var c = this.config,m = this.maxNum,t = this.totalNum;
		for( i=0; i< a.length && t; i++){	
			var p = ( a[i][1] * c.clength );
			p = p ? m * c.step / p : 0;
			b.push([  (a[i][1] / t)*100 , p ,  a[i][1] * c.clength / (c.ctype ?  m : t )  ]);
		}
		return b;
	},
	getDataB : function (){
		return this.dataB;
	},
	showColumn : function (n){
		var a = this.config.data;
		var b = this.dataB;
		var o = this.obj;
		var cs = FYD.getElementsByClassName(this.config.holes[0],'*',this.obj);
		var ns = FYD.getElementsByClassName(this.config.holes[1],'*',o);
		var ps = FYD.getElementsByClassName(this.config.holes[2],'*',o);
		var num = n || 0;	
		var i = 0
		if( num >= this.config.step ){
			while(i < a.length){			
				cs[i].style.width = b[i][2] + 'px';
				cs[i].title = a[i][1];
				ns[i].innerHTML = a[i][1];
				ps[i].innerHTML = b[i][0].toFixed(1) + '%';
				i++;
			}
			return
		}
		
		num++;	
		i = a.length
		while( i-- > 0 ){
			if(b[i][1]<=1){
				cs[i].style.width = num*b[i][2] / this.config.step  + 'px'
			}else if( (num * b[i][1] - Math.floor(num * b[i][1])) < this.config.errorRange ){			
				cs[i].style.width =  num*b[i][2] / this.config.step  + 'px'	
				//document.getElementById('bb').innerHTML =  num*b[i][2] / step
			}
			ns[i].innerHTML = parseInt( a[i][1] * num / this.config.step )

			ps[i].innerHTML = ( b[i][0] * num / this.config.step ).toFixed(1)  + '%'
		}		
		var _this = this;
		window.setTimeout(function (){
			_this.showColumn(num);
		},this.config.delay)
	}

}
/**
 * ColumStater 的封装，创建不同的 ColumStat 对象
 */
FD.widget.ColumStater = new function(id,cfg) {
	this.init = function(id,cfg) {
		return new FD.widget.ColumStat(id,cfg);
	}	
}