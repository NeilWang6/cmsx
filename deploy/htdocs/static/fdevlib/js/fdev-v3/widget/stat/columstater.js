/**
 * FD.widget.ColumStat
 *
 * ��״��ʾͳ������
 * ���ƣ�
 * 		1�����ݱ��밴ָ����ʽ���ݸ���ʼ��������[['A.ѡ���İ�1',888],['B.ѡ���İ�2',300]]
 * 		2���������http://style.c.aliimg.com/js/lib/fdev-v3/core/fdev-min.js
 * 		3��������Ҫ����http://style.c.aliimg.com/css/fdevlib/widget/columstater.css
 *		4���������html �ַ�������ʽ��ӵ�ָ���ڵ��ڣ����ݺ�html��ǩ���϶ȸߡ�
 * ���÷�����
		FD.widget.ColumStater.init('ColumStater-1',{data:[['A.ѡ���İ�1',888],['B.ѡ���İ�2',300]]});
 *
 *
 * @author 	balibell
 * @link    http://www.fdev-lib.cn/
 */

FD.widget.ColumStat = function (id,cfg){
	this.init(id,cfg);
}

/* Ĭ�ϲ������� */ 
FD.widget.ColumStat.defConfig = {	
	data : [['A.ѡ���İ�1',888],['B.ѡ���İ�2',300]],						/* Ĭ�ϵ�ͳ������ */
	clength : 130,							/* ��״ͼ�������󳤶� */
	step : 10,								/* ��ʾ���裬�������0����������������Ҫ�Ĳ����� */
	topclass: 'fillest',
	ctype : 0, // ctype ���Ϊ0 ���Ϊ��������� ctype Ϊ1 �����Ϊ�����
	template : ['<div class="columStat"><ul>','<li class="[%topclass%]"><s>[%title%]</s><div class="[%holes0%]" style="width:0px"></div><u class="[%holes1%]">0</u><i class="[%holes2%]">0%</i></li>','</ul></div>'],
	holes : ['thecolum','thenum','therate'],
	delay : 20							/* �����������ٶȿ��ƣ�delay Խ���ٶ�Խ�� */
};


FD.widget.ColumStat.prototype = {
	init : function (id,cfg){
		this.config = FD.common.applyIf(cfg||{}, FD.widget.ColumStat.defConfig);

		if( (this.obj = FYG(id)) && YAHOO.lang.isArray(this.config.data)){
			//ͨ������ calcuDataB() ��ʼ�� dataB ���飬������ config.data ���д���
			//config.data ����Ϊԭʼ���ݣ�dataB ����Ϊ config.data �������������ĸ������飬���ߴ���ʵ�ֹ���
			this.dataB = this.calcuDataB();
			
			//��ʼ״̬��html �ַ������ɷ���genStatHTML() ���ɡ�
			this.HTML = this.genStatHTML();
			
			//ָ���ڵ��ڲ����ʼ״̬�µ�html�ַ���
			this.obj.innerHTML = this.HTML;
			
			//����չʾ colum ���������
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
 * ColumStater �ķ�װ��������ͬ�� ColumStat ����
 */
FD.widget.ColumStater = new function(id,cfg) {
	this.init = function(id,cfg) {
		return new FD.widget.ColumStat(id,cfg);
	}	
}