/**
 * FD.widget.SidePoper
 *
 * 边界浮出类
 * 限制：
 * 		1、此类对象限于viewport边界附近的浮出和隐去
 * 		2、必须包含js/core/fdev.js(不依赖js/core/yui/animation.js)
 * 		3、如果未提供必要的css设置（触点样式）则还需要包含css/widget/sidepoper.css文件
 * 调用方法：
		FD.widget.SidePoper.init('SidePop-1','http://blog.1688.com/misc/pop/searchPop.html?keywords=mp3',{dockSide:0,baseline:1,bias:300,expandDir:0,initWidth:353,initHeight:280,remainArea:26});
		FD.widget.SidePoper.init('SidePop-2','<div>...</div>',{dockSide:0,baseline:1,bias:300,expandDir:0,initWidth:353,initHeight:280,remainArea:26});
 *
 *
 * @author 	balibell
 * @link    http://www.fdev-lib.cn/
 */

FD.widget.SidePop = function (id,cont,cfg){	
	this.init(id,cont,cfg);
}

/* 默认参数配置 */ 
FD.widget.SidePop.defConfig = {
	position : null,				/* 对象的位置，默认 insertBefore 的方式插入到body 的下面 */
	originWidth : null,						/* 对象区域完全宽度 */
	originHeight : null,					/* 对象区域完全高度 */
	initWidth : null,						/* 对象区域初始宽度 */
	initHeight : null,						/* 对象区域初始高度 */
	remainArea : 32,						/* 收起后，保留的区域宽度 */
	initTop : null,							/* 对象初始的top值 默认为null值情况下，如果baseline==1 则浮出对象从底部弹出*/
	btnset : 3,								/* 设置功能按钮 0-无 1-有关闭功能 2-有展开缩小功能 3-有前面两个功能*/
	scroll : 1,								/* 是否跟随滚动轴滚动  0-否   1 常规的滚动跟随  2 先隐藏，滚动结束后显示*/
	hideTime : .2,							/* 当scroll 设置为2 时，浮窗的隐藏或显示动画的过程时间 */
	initExe : 0,							/* 初始化完毕执行的方法 0-不执行任何方法 1-执行maxIt() 2-执行minIt() 3-执行close()*/
	exeDelay : 0,							/* 初始化完毕执行的方法 延迟执行 ms为单位*/
	doAfterClose : null,					/* 关闭后执行 */
	dockSide : 1,							/* 停靠方向 0-左边停靠  >1-右边停靠*/
	departure : 0,							/* 偏离停靠边的距离 值为center时 居中*/
	baseline : 0,							/* 0:上基线-viewport上边界；1:下基线-viewport下边界；2:上基线，原位置顶部之下开始随滚动轴滚动；3:上基线，原位置顶部之上开始随滚动轴滚动 */
	popregion : 300,
	isFixed : 0,							/* 是否使用position:fixed 属性*/
	bias :0,								/* 偏离基线的距离 值为middle时 居中*/	
	expandDir : 0,							/* 展开方向 0-上下 1-左右*/
	expandSpeed : 0.1,						/* 展开或隐去的速度 */
	floatSpeed : 0.2,						/* 滚动跟随的速度 */
	defaultShell : 0,						/* 0-无外框 1-使用默认的外框 */
	shellBlank : 8,							/* 当defaultShell 生效时，此参数表示外框和内容间非展开方向上的留白 */
	zIndex : 1000							/* 浮出层zindex */
};


//SidePop类 purge 函数，可根据对象id purge 对象或，全部 purge 
FD.widget.SidePop.purge = function (id){
	//实例化该类的purge 对象
	var p = new FD.widget.SidePop('sidePop-purge','',{});
	var i = p.registry.length;
	while( i-- > 0 ){
		if(id && p.registry[i].obj.id == id ){ //如果根据id 查找到相应对象
			p.registry[i].close(); //目标对象关闭
			p.close();	//purge 对象关闭
			
			p.registry.pop(); //对象注册数组弹出 purge 对象
			p.registry[i] = p.registry[p.registry.length-1]; //目标对象置换到对象注册数组尾部
			p.registry.pop();//弹出目标对象
			return;
		}else if(!id){
			p.registry[i].close(); //如果没有传入特定id，循环关闭所有对象
		}
	}	
	p.close();//purge 对象关闭
	if( id && i == 0 ){					
		p.registry.pop(); //有传入id，但未寻获与id对应的对象，则执行 对象注册数组弹出 purge 对象
	}else{
		p.registry = []; //未传入id，清空对象注册数组。 还有一种情况，传入了id，并且寻找到对象，在之上 return 出去了
	}
}

FD.widget.SidePop.prototype = {
	registry : [],
	init: function (id,cont,cfg){
		this.config = FD.common.applyIf(cfg||{}, FD.widget.SidePop.defConfig);
		
		var _t = this,c = _t.config

		/*************************
		功能区字符串生成
		*************************/
		var btns = ['none','none','none'];
		//根据btnset 设置功能区按钮
		if(c.btnset == 1){
			btns[2] = '';
		}else if(c.btnset == 2){
			btns[0] = '';
		}else if(c.btnset > 2){
			btns[2] = '';
			btns[0] = '';
		}
		//浮出控制栏字符串，提供关闭、最小化、还原功能，依赖样式
		var strBar = ['<div id="',id,'-bar" class="f-sidebar"><a id="',id,'-min" class="f-sidemin" style="display:',btns[0],'" href="javascript:void(0)" target="_self"></a><a id="',id,'-res" class="f-sideres" style="display:',btns[1],'" href="javascript:void(0)" target="_self"></a><a id="',id,'-close" class="f-sideclose" style="display:',btns[2],'" href="javascript:void(0)" target="_self"></a></div>'].join('');
		/*************************/

		
		/*************************
		创建对象节点
		*************************/
		//如果对象id不存在，新建div，为浮出层最外层div，并设置其id
		if(!(_t.obj = FYG(id))){
			//如果未设置初始宽（高）度，则取值100
			c.initWidth = c.initWidth || 0;
			c.initHeight = c.initHeight || 0;
			c.originWidth = c.originWidth || c.initWidth;			
			c.originHeight = c.originHeight || c.initHeight;

			_t.obj = document.createElement('div');
			_t.obj.id = id;

			//页面加载对象  
			var pob = FYG(c.position) || document.body;
			if(!pob) return;
			pob.insertBefore(_t.obj,FYD.getFirstChild(pob));

			var d = c.defaultShell;
			var strShellTop = d ? '<div class="f-sidepop"><div class="tt f-sidepop-tt"><div class="ttl"></div><div class="ttr"></div><div class="ttc">'+d+'<p></p></div><div class="ttr"></div></div><div class="f-sidepop-cont"><div class="f-sidepop-contin">' : '';
			var strShellBot =  d ? '' : '</div></div></div>'

			var s = d ? c.expandDir == 0 ? [c.shellBlank,c.remainArea] : [c.remainArea,c.shellBlank] : [0,0];
			var cw = [];
			cw[0] = c.expandDir == 1 && d ? c.initWidth : c.originWidth;
			cw[1] = c.expandDir == 0 && d ? c.initHeight : c.originHeight; 

			//浮出内容字符串 strCont
			//情况1：传入cont 为url地址，调用 iframe 模式
			//情况2：传入cont 为html代码，调用非 iframe 模式
			var strCont = cont.match(/^http:\/\//g) ?
				/*  iframe 模式*/['<iframe id="',id,'-cont" src="',cont,'" allowTransparency="true" frameborder="0" scrolling="no" width="',cw[0] - s[0],'" height="',cw[1]  - s[1],'" ></iframe>'].join('') : 
				/*非iframe 模式*/['<div id="',id,'-cont" style="width:',cw[0] - s[0],'px;height:',cw[1] - s[1],'px;">',cont,'</div>'].join('');
			
			//装载内容，浮出内容字符串 + 浮出控制栏字符串
			_t.obj.innerHTML = [strShellTop,strCont,strShellBot,strBar].join('');			
		}else{
			if(YAHOO.lang.isString(cont) && cont && FYG(id+'-cont')){
				if(cont.match(/^http:\/\//g)){
					//iframe 模式
					FYG(id+'-cont').src = cont;  
				}else{
					//普通容器模式
					FYG(id+'-cont').innerHTML = cont;
				}				
			}
		
			_t.obj.style.display = 'block';
			//如果未设置初始宽（高）度，则取值offsetWidth（offsetHeight）
			var w =  parseInt(0 + FYD.getStyle(_t.obj,'borderLeftWidth')) + parseInt(0 + FYD.getStyle(_t.obj,'borderRightWidth'))
			c.initWidth = c.initWidth || _t.obj.offsetWidth - w;
			c.initHeight = c.initHeight || _t.obj.offsetHeight - w;

			c.originWidth = c.originWidth || c.initWidth;
			c.originHeight = c.originHeight || c.initHeight;
			//为已存在的对象添加功能区（最小化、还原、关闭）
			var barobj = document.createElement('span');
			barobj.innerHTML = strBar;
			_t.obj.appendChild(barobj);
		}


		_t.expandObj = d ? FYG(id+'-cont') : _t.obj;
		/*************************/


		var o = _t.obj,os = o.style;
		
		/*************************
		对象基本属性设置
		*************************/
		os.position = 'absolute';
		os.overflow = 'hidden';
		os.zIndex = c.zIndex;	
		os.width = c.initWidth + 'px';		
		os.height = c.initHeight + 'px';

			/**** config参数调整 ****/
			
		c.departure = c.departure == 'center' ? ( FYD.getViewportWidth() - o.offsetWidth )/2 : c.departure;
		c.bias = c.bias == 'middle' ? ( FYD.getViewportHeight() - o.offsetHeight )/2 : c.bias;		
		
		//保存最原始的 bias 参数
		c.obias = c.bias; 
		if(YAHOO.env.ua.ie == 6 && c.baseline == 0 || YAHOO.env.ua.ie == 7 && c.baseline == 1 || YAHOO.env.ua.opera && c.baseline == 0){
			c.bias += 2
		}else if(YAHOO.env.ua.ie == 6 && c.baseline == 1 || YAHOO.env.ua.opera && c.baseline == 1){
			c.bias -= 2
		}
		os.left = c.dockSide ? 'auto' : c.departure + 'px';
		os.right = c.dockSide ? c.departure + 'px' : 'auto';
		/*************************/
		



		/*************************
		功能区按钮事件绑定
		*************************/
		//关闭按钮事件绑定
		FYE.on(o.id+'-close','click',function (){
			_t.close();
			_t.doAfterClose();
			return false;
		});
		//最小化按钮事件绑定
		FYE.on(o.id+'-min','click',function (){
			_t.minIt();
			return false;
		});
		//恢复按钮事件绑定
		FYE.on(o.id+'-res','click',function (){
			_t.maxIt();
			return false;
		});
		/*************************/	



		/*************************
		随滚动轴滚动的参数设定
		*************************/
		//设置初始状态的top 值，之前已设置过 position:absolute;
		FYD.setStyle(o,'top',(c.initTop == null ? c.baseline == 0 ? 0 : FYD.getViewportHeight() + FYD.getDocumentScrollTop() : c.initTop) + 'px');

		_t.firstScroll = _t.lastScroll = -c.bias; //firstScroll lastScroll 在 scrollWidth 方法中使用
		if(c.baseline >= 2){//如果 baseline == 2|3|4 当滚动轴滚动至对象原来位置的下方，开始有效浮动
			FYD.setStyle(o,'top',0);
			FYD.setStyle(o,'position','relative');
			//this is new
			if(YAHOO.env.ua.ie != 6 && c.isFixed == 1){
				_t.firstLeftX = FYD.getX(o);
				var vhold = document.createElement('div');
				o.parentNode.insertBefore(vhold,o);
				vhold.appendChild(o);
				FYD.setStyle(vhold,'height',o.offsetHeight + 'px');
			}
			///////////////////
		}else if(c.baseline == 1){//如果 baseline == 1 基线为viewport 底部，此时bias 为距离底部的高度
			_t.lastScroll = o.offsetHeight - FYD.getViewportHeight() -  FYD.getDocumentScrollTop();
			_t.firstScroll = _t.lastScroll - c.bias;
			if(YAHOO.env.ua.ie != 6 && c.isFixed == 1){
				FYD.setStyle(o,'position','fixed');
				FYD.setStyle(o,'top','auto');
				FYD.setStyle(o,'bottom',c.bias + 'px');
			}
		}else if(c.baseline == 0){//如果 baseline == 0 基线为viewport 顶部，此时bias 为距离顶部的高度
			if(YAHOO.env.ua.ie != 6 && c.isFixed == 1){
				FYD.setStyle(o,'position','fixed');
				FYD.setStyle(o,'top',c.bias + 'px');
				FYD.setStyle(o,'bottom','auto');
			}
		}
		_t.aTop =  FYD.getY(o);
		_t.abTop = _t.aTop;
		/*************************/		

		
		//timer控制器，在最小化、恢复原状过程中起作用
		_t.expandTimer = null;
		//timer控制器，在滚动跟随过程中起作用
		_t.scrollTimer = null;

		//this.expandObj 对象当前高（宽）度，在显示或隐去过程中改变，与对象高度实时保持一致
		//当defaultShell 生效时，this.expandObj 指代内容对象，不包括外框。		
		if(c.expandDir == 0){ //垂直方向展开收拢
			_t.size = d ? c.initHeight - c.remainArea : c.initHeight;
		}else if(c.expandDir == 1){//水平方向展开收拢		
			_t.size = d ? c.initWidth - c.remainArea : c.initWidth;
		}

		//根据initExe设置执行相关方法
		if(c.initExe == 1){
			setTimeout(function (){
				_t.maxIt();
			},c.exeDelay)			
		}else if(c.initExe == 2){
			setTimeout(function (){
				_t.minIt();
			},c.exeDelay)				
		}else if(c.initExe == 3){
			setTimeout(function (){
				if(FYD.getStyle(o,'display') == 'none'){return}
				_t.close();
				_t.doAfterClose();
			},c.exeDelay)
		}

		//根据scroll设置执行相关方法
		if(c.scroll){
			_t.scrollWith();		
		}

		_t.registry.push(_t) //将新对象 push 入对象注册数组，即注册新对象
	},
	/*
	计算当前的静态top 值
	*/
	getFinalTop : function (){
		var _t = this,c = _t.config,o = _t.obj;

		var a = c.baseline;
		var dscrtop = FYD.getDocumentScrollTop();
		var fall = o.offsetHeight - FYD.getViewportHeight();
		fall =  fall < 0 ? 0 : fall;
		if(a == 0){//baseline == 0 以viewport 顶部为基线
			return dscrtop + c.obias - fall;
		}else if(a == 1){//baseline == 1  以viewport 底部为基线
			return dscrtop + FYD.getViewportHeight() - o.offsetHeight - c.obias;
		}else if(a == 2){//baseline == 2 特殊处理 以viewport 顶部为基线 在下方
			var sb = dscrtop - _t.aTop + c.obias - fall;
			return sb > 0  ? sb : 0;
		}else if(a == 3){//baseline == 3 特殊处理 以viewport 顶部为基线 在上方
			var sb = dscrtop - _t.aTop + c.obias - fall;
			return sb < 0  ? sb : 0;
		}else if(a == 4){//baseline == 4 特殊处理 以viewport 顶部为基线 在区间
			var sb = dscrtop - _t.aTop + c.obias - fall;
			if(popregion > 0){
				return sb > 0 ? sb < popregion ? sb : popregion : 0;
			}else{
				return sb < 0 ? sb > popregion ? sb : popregion : 0;
			}
		}
	},
	/*
	功能区功能之 关闭功能
	*/
	close: function (){
		var _t = this,o = _t.obj;
		//清除各种timer
		clearTimeout(_t.expandTimer);
		clearInterval(_t.scrollTimer);		
		FYE.purgeElement(o.id+'-res')
		FYE.purgeElement(o.id+'-min')
		FYE.purgeElement(o.id+'-close')
		//将对象设为隐藏
		FYD.setStyle(o,'display','none');

		var tmp;
		if(tmp=FYG(o.id+'-bar')){
			FYG(o.id+'-bar').parentNode.removeChild(tmp)
		}		
	},
	/*
	关闭功能辅助，关闭后执行
	*/
	doAfterClose: function (){
		var _t = this,c = _t.config
		if(YAHOO.lang.isFunction(c.doAfterClose)){
			c.doAfterClose();
		}
	},
	/*
	功能区功能之 最小化功能
	*/
	minIt: function (){
		var _t = this,c = _t.config,o = _t.obj;
//		if(FYU.Anim){
//			var an = c.expandDir ? new FYU.Anim(o,{
//				width : { from : _t.size , to : c.remainArea }
//			},2*c.expandSpeed) : new FYU.Anim(o,{
//				height : { from : _t.size , to : c.remainArea }
//			},2*c.expandSpeed)
//			an.animate();
//			an.onComplete.subscribe(function (){
//				//设置最小化、恢复等功能区按钮状态
//				FYD.setStyle(o.id+'-min','display','none');
//				FYD.setStyle(o.id+'-res','display','block');
//			});
//			an.onTween.subscribe(function (){			
//				_t.size = c.expandDir ? parseInt(o.style.width) : parseInt(o.style.height);
//			});
//		}else{
			//最小化过程函数，递归调用自身，满足条件跳出递归
			(function _minIt(){	
				var theRemain = c.defaultShell ? 0 : c.remainArea;
				var condition = [_t.size <= theRemain];			

				//满足条件跳出递归，条件1：对象当前高度小于等于对象预留高（宽）度（仅显示标题状态）
				if(condition[0]){
					window.clearTimeout(_t.expandTimer);
					//设置最小化、恢复等功能区按钮状态
					FYD.setStyle(o.id+'-min','display','none');
					FYD.setStyle(o.id+'-res','display','block');

					//innerCall(0);
					//跳出递归
					return;
				}
				//计算每单位时间内移动的距离，其值等于伪速率乘以对象当前高度
				var len = c.expandSpeed * _t.size;
				len = len < 1 ? 1 : len;
				//对象当前高度数值计算，满足条件1，其值等于对象预留高（宽）度，不满足条件1，其值自减len
				_t.size = _t.size - len <= theRemain ? theRemain : _t.size - len;
				

				//设置对象高度
				if( c.expandDir ){					
					_t.expandObj.style.width = _t.size + 'px';
					if( c.defaultShell ){						
						o.style.width = _t.size + c.remainArea + 'px'
					}
				}else{
					_t.expandObj.style.height = _t.size + 'px';	
					if( c.defaultShell ){						
						o.style.height = _t.size + c.remainArea + 'px'
					}
				}			
				
				//递归调用自身
				_t.expandTimer = window.setTimeout(_minIt,10);
			})();
//		}
		
	},
	/*
	功能区功能之 还原功能
	*/
	maxIt: function (){
		var _t = this,c = _t.config,o = _t.obj;
//		if(FYU.Anim){
//			var an = c.expandDir ? new FYU.Anim(o,{
//				width : { from : _t.size , to : c.originWidth }
//			},2*c.expandSpeed) : new FYU.Anim(o,{
//				height : { from : _t.size , to : c.originHeight }
//			},2*c.expandSpeed);
//			an.animate();
//			an.onComplete.subscribe(function (){
//				//设置最小化、恢复等功能区按钮状态
//				FYD.setStyle(o.id+'-min','display','block');
//				FYD.setStyle(o.id+'-res','display','none');
//			});
//			an.onTween.subscribe(function (){
//				_t.size = c.expandDir ? parseInt(o.style.width) : parseInt(o.style.height);
//			});
//		}else{
			//最小化过程函数，递归调用自身，满足条件跳出递归
			(function _maxIt(){
				var theOrigin = c.expandDir ?  c.originWidth : c.originHeight;
				theOrigin -= c.defaultShell ? c.remainArea : 0; 
				var condition = [_t.size >= theOrigin]

				//满足条件跳出递归，条件1：对象当前高度大于等于对象原始高度（完全显示状态）
				if(condition[0]){
					window.clearTimeout(_t.expandTimer);
					//设置最小化、恢复等功能区按钮状态
					FYD.setStyle(o.id+'-min','display','block');
					FYD.setStyle(o.id+'-res','display','none');
//					FYD.setStyle(o,'visibility','hidden');
//					FYD.setStyle(o,'visibility','visible');					
					//跳出递归
					return;
				}
				//计算每单位时间内移动的距离，其值等于伪速率乘以对象原始高度，为匀速
				var len = c.expandSpeed * theOrigin;
				len = len < 1 ? 1 : len;

				_t.size = _t.size + len >= theOrigin ? theOrigin : _t.size + len;
				//设置对象高度
				if( c.expandDir ){
					_t.expandObj.style.width = _t.size + 'px';
					if( c.defaultShell ){						
						o.style.width = _t.size + c.remainArea + 'px'
					}
				}else{
					_t.expandObj.style.height = _t.size + 'px';
					if( c.defaultShell ){						
						o.style.height = _t.size + c.remainArea + 'px'
					}
				}

				//递归调用自身
				_t.expandTimer = window.setTimeout(_maxIt,10);
			})();		
//		}		
	},
	/*
	浮动对象随滚动轴滚动
	*/
	scrollWith : function(){
		var _t = this,c = _t.config,o = _t.obj;
		//this is new
		if(YAHOO.env.ua.ie != 6 && c.baseline < 2  && c.isFixed == 1){
			FYD.setStyle(o,'position','fixed');
			return;
		}

		if( c.scroll == 1 ){
			//////////////
			_t.scrollTimer = window.setInterval(function (){
				var dscrtop = FYD.getDocumentScrollTop();
				var dscrwitdh = FYD.getDocumentScrollLeft();
				var a = c.baseline;
				var perlen,perwidth;
				var lastpos = 0;
				var fall = o.offsetHeight - FYD.getViewportHeight();
				fall  = fall < 0 ? 0 : fall; 

				//保持横向位置的正确性
				if(c.dockSide == 1){
					perwidth = FYD.getViewportWidth() - o.offsetWidth + dscrwitdh - c.departure;
					FYD.setStyle(o,'left',perwidth + 'px');
				}else if(c.dockSide == 0){
					perwidth = dscrwitdh + c.departure;
					FYD.setStyle(o,'left',perwidth + 'px');
				}
				////

				if(a == 0){//baseline == 0 以viewport 顶部为基线
					perlen = c.floatSpeed*(dscrtop - _t.lastScroll - _t.aTop - fall); 
				}else if(a == 1){//baseline == 1  以viewport 底部为基线
					perlen = c.floatSpeed*(- _t.lastScroll  + _t.firstScroll + FYD.getViewportHeight() + dscrtop - o.offsetHeight - _t.aTop ); 
				}else if(a == 2 || a == 3 ){//baseline == 2|3 特殊处理 以viewport 顶部为基线
					//this is new
					var tmpsp = c.floatSpeed*(dscrtop - _t.aTop - _t.lastScroll - fall);
					var cdtion;
					if(a == 2){
						cdtion = dscrtop - _t.aTop > 0 || (FYD.getY(o)) > _t.aTop;
					}else if(a == 3){
						cdtion = dscrtop - _t.aTop < 0 || (FYD.getY(o)) < _t.aTop
					}
					
					if(cdtion){
						if(YAHOO.env.ua.ie != 6 && c.isFixed == 1){
							perlen = 0;
							FYD.setStyle(o,'position','fixed');
							FYD.setStyle(o,'left',_t.firstLeftX + 'px');
						}else{
							perlen = tmpsp;
						}
					}else{
						if(YAHOO.env.ua.ie != 6 && c.isFixed == 1){
							perlen = 0;
							FYD.setStyle(o,'position','relative');
							FYD.setStyle(o,'left',0);
						}else{
							perlen = 0;
						}
					}
					//////////////
				}else if(a == 4){
					//this is new
					var tmpsp = c.floatSpeed*(dscrtop - _t.abTop - _t.lastScroll - fall);

					if(YAHOO.env.ua.ie != 6 && c.isFixed == 1){
						perlen = 0;
						FYD.setStyle(o,'position','fixed');
						FYD.setStyle(o,'left',_t.firstLeftX + 'px');
					}else{
						perlen = tmpsp;
					}
					//////////////
				}

				if( perlen > -0.2 && perlen < 0.2 ){
					return
				}else{
					perlen = perlen>0 ? Math.ceil(perlen) : perlen=Math.floor(perlen)
				}
				
				o.style.top = parseInt(o.style.top) + perlen + "px";
				if( a == 2 && parseInt(o.style.top) <= 0 || a == 3 && parseInt(o.style.top) >=0 ){//baseline == 2|3 特殊处理 以viewport 顶部为基线
					o.style.top = 0;
					_t.lastScroll = _t.firstScroll;
				}else if(a == 4){
					if(c.popregion > 0 && parseInt(o.style.top) <= 0 ){
						o.style.top = 0;
						_t.abTop = _t.aTop;
						_t.lastScroll = _t.firstScroll;
					}else if(c.popregion > 0 && parseInt(o.style.top) >= c.popregion ){
						o.style.top = c.popregion + 'px';
						_t.abTop = _t.aTop + c.popregion;
						_t.lastScroll = _t.firstScroll;
					}else if(c.popregion < 0 && parseInt(o.style.top) >= 0 ){
						o.style.top = 0;
						_t.abTop = _t.aTop;
						_t.lastScroll = _t.firstScroll;
					}else if(c.popregion < 0 && parseInt(o.style.top) <= c.popregion ){
						o.style.top = c.popregion + 'px';
						_t.abTop = _t.aTop + c.popregion;
						_t.lastScroll = _t.firstScroll;
					}else{
						_t.lastScroll += perlen;
					}
				}else{
					_t.lastScroll += perlen;
				}
				
			},10);
		}else if( c.scroll == 2 ){ // scroll 为 2 时
			//注意传递的参数 FYD.getStyle(o,'visibility') 把初始时候的 visibility 传递出去
			FYE.addListener(window,'scroll',_t.scrollHandler,[FYD.getStyle(o,'visibility')],_t);
			o.style.top = _t.getFinalTop() + 'px';
		}
	},
	scrollHide : function (f){
		var _t = this,c = _t.config,o = _t.obj, f = f ? 1 : 0, vf = f ? 0 : 1;
		if(_t.ishiding) return;
		if(FYU.Anim){
			if(f)FYD.setStyle(o,'visibility', 'visible');
			_t.ishiding = 1;
			var aniHide = new FYU.Anim(o,{
				opacity : { to : f }
			},c.hideTime, YAHOO.util.Easing.easeIn);
			aniHide.animate();
			aniHide.onComplete.subscribe(function (){
				_t.ishiding = 0;
			});
		}else{
			FYD.setStyle(o,'visibility', f ? 'visible' : 'hidden');
		}
	},
	scrollHandler : function (e,vibi){
		var _t = this,c = _t.config,o = _t.obj;
		
		//当baseline 为 2 时，判断是否到达原始位置
		var a = c.baseline;
		var dscrtop = FYD.getDocumentScrollTop();
		var fall = o.offsetHeight - FYD.getViewportHeight();
		fall =  fall < 0 ? 0 : fall;
		var cdt = dscrtop - _t.aTop + c.obias - fall < 0 ;
		
		window.clearTimeout(_t.scrollTimer);
		if( a == 2  && cdt || a == 3 && !cdt ){
			FYD.setStyle(o,'visibility',vibi); // baseline 为 2 情况下，回到原始位置后重置其 visibility style 属性值
			return;
		}
		//隐藏对象
		_t.scrollHide();
		
		_t.scrollTimer = window.setTimeout(function (){
			o.style.top = _t.getFinalTop() + 'px';
			//显示对象
			_t.scrollHide(1);
		},500)

	}
}

/**
 * SidePoper 的封装，创建不同的 SidePop 对象
 */
FD.widget.SidePoper = new function() {
	this.init = function(id,cont,cfg) {
		return new FD.widget.SidePop(id,cont,cfg);
	}	
}