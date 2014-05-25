/**
 * FD.widget.Tab
 *
 * Tab切换类
 * 限制：
 * 		1、要求触点title和内容box出现的顺序保持一致
 * 		2、必须包含js/core/fdev.js
 * 调用方法：
 * 		……
 *		<div id="tab1">
 *			<ul class="clr">
 *				<li class="f-tab-t current">tab1</li>
 *				<li class="f-tab-t">tab2</li>
 *				<li class="f-tab-t">tab3</li>
 *				<li class="f-tab-t">tab4</li>
 *			</ul>
 *			<div class="f-tab-b">a</div>
 *			<div class="f-tab-b">b</div>
 *			<div class="f-tab-b">c</div>
 *			<div class="f-tab-b">d</div>
 *		</div>
 *		……
 *		<script type="text/javascript">
 *			FD.widget.Tab.init('tab1',{});
 *		</script>
 *
 * @author 	yaosl<happyyaosl@gmail.com>
 * @link    http://www.fdev-lib.cn/
 * 
 * 说明：hongss增加如下两功能（2011.01.06）：
 * 	 1、lazy loading(懒加载)
 * 	 2、callback (回调函数)
 */

FD.widget.Tab = function(container,config){
	this.init(container,config);
}

/**
 * 默认配置
 */
FD.widget.Tab.defConfig = {
	isAutoPlay: true,			/* 是否自动进行切换 */
	timeDelay:	3,				/* 自动切换的时间间隔 */
	eventType:  'mouse',		/* 切换的时间触发类型 mouse:onmouseover触发、click：鼠标点击触发 */
	showType:	'block',		/* box的容器显示类型，block:块状元素、inline:行内元素,还有table-cell等浏览器支持的display属性 */
	currentClass:	'current',	/* 当前tab的触点样式 */
	tabTitleClass:	'f-tab-t',	/* 触点的class名 */
	tabBoxClass:	'f-tab-b',	/* 内容box的class */
	startItem:	0,				/* 设置初始化时第几个触点为当前状态 */
	isLazy: false,              //33加，false：不使用lazy loading, true：使用lazy loading。 默认false
	lazyImg: 'data-lazyimg',    //33加，lazy loading 时需用到的专有属性
	callback: null              //33加，回调函数
}

FD.widget.Tab.prototype = {
	init: function(container,config){
		this.container = $(container);
		this.config = FD.common.applyIf(config||{}, FD.widget.Tab.defConfig);
		//获取title列表
		this.tabTitles = FD.common.toArray($D.getElementsByClassName(this.config.tabTitleClass,'*',this.container));
		this.tabBoxs =  FD.common.toArray($D.getElementsByClassName(this.config.tabBoxClass,'*',this.container));
		//如果对象为0或者title和box个数不相等则直接退出
		if(this.tabTitles.length == 0 || this.tabTitles.length != this.tabBoxs.length) return;
		
		this.pause = false;
		this.delayTimeId = null;
		this.autoPlayTimeId = null;
		
		//初始化第一个显示的内容
		$D.setStyle(this.tabBoxs,'display','none');
		$D.removeClass(this.tabTitles,this.config.currentClass);
		this.setTab(this.config.startItem,false);
		
		//box区域鼠标移动上去后暂停变换
		$E.on(this.tabBoxs, 'mouseover', function(){ this.pause = true; }, this, true);
		$E.on(this.tabBoxs, 'mouseout', function(){ this.pause = false; }, this, true);
		//title触点动作监听
		if (this.config.eventType == 'mouse') {
			$E.on(this.tabTitles, 'mouseover' ,this.mouseHandler, this, true);
			$E.on(this.tabTitles, 'mouseout' ,function(){
				clearTimeout(this.delayTimeId);
				this.pause = false;
			}, this, true);
		}else{
			$E.on(this.tabTitles, 'click' ,this.clickHandler, this, true);
		}
		
		if(this.config.isAutoPlay) this.autoPlay();
		
	},

	/**
	 * 点击事件处理
	 * @method clickHandler
	 * @param {Object} e Event 对象
	 */		
	clickHandler: function(e){
		var t = this.getTabTitleTarget(e);
		var idx = this.tabTitles.indexOf(t);
		this.setTab(idx,'true');
	},
	
	/**
	 * 鼠标上移事件处理
	 * @method mouseHandler
	 * @param {Object} e Event 对象
	 */
	 mouseHandler: function(e){
	 	var t = this.getTabTitleTarget(e);
	 	var idx = this.tabTitles.indexOf(t);
	 	var self = this;
	 	this.delayTimeId = setTimeout(function(){
	 		self.pause = true;
	 		self.setTab(idx,'true');
	 	},.1*1000)
	 },
     
     /**
	 * 获取tab触点事件目标
	 * @method getTabTitleTarget
	 * @param {Object} e Event 对象
	 */
	 getTabTitleTarget: function(e){
	 	var t = $E.getTarget(e);
	 	while (this.tabTitles.indexOf(t) == -1){
            t = t.parentNode;
        }
        return t;
	 },

	/**
	 * 显示指定的box内容
	 * @method setTab
	 * @param {Object} n 序号，也就是触点数字值
	 * @param {Object} flag 如果flag=true，则是用户触发的，反之则为自动播放
	 */	 
	 setTab: function(idx, flag){
		if (idx == this.curId) return;	//如果就是当前项则直接退出
		var curId = this.curId >= 0 ? this.curId : 0;
		if (flag && this.autoPlayTimeId) clearTimeout(this.autoPlayTimeId);
		//取消原先的设置
		$D.removeClass(this.tabTitles[curId],this.config.currentClass);
		$D.setStyle(this.tabBoxs[curId],'display','none');
		//对给定的idx项进行设置
		$D.addClass(this.tabTitles[idx],this.config.currentClass);
		$D.setStyle(this.tabBoxs[idx],'display',this.config.showType);
		this.curId = idx;
		
		if (flag && this.config.isAutoPlay)	this.autoPlay();
		
		if (this.config.isLazy===true) {     //hongss加，lazy loading
			this._imgLoad(this.tabBoxs[idx]); 
		}
		
		if (this.config.callback !== null) {   //hongss加， callback
			this.config.callback.call(this, idx, this.tabTitles[idx], this.tabBoxs[idx]);  //返回三个参数，idx, title EL, box EL
		}
	},
		
	/**
	 * 自动运行
	 * @method autoPlay
	 */		
	autoPlay: function(){
		var curId = this.curId >= 0 ? this.curId : 0;
		var self = this;
		this.autoPlayTimeId = setTimeout(function(){
			if ( !self.pause ) {
				var n = curId + 1;
				if( n == self.tabTitles.length ) n=0;		
				self.setTab(n, false);
			}
			self.autoPlay();		
		}, this.config.timeDelay * 1000);
	},
	/**
	 * lazy loading - img load
	 * @method _imgLoad
	 * add by hongss on 2011.01.06
	 */	
	_imgLoad: function(box) {
		var imgs = $$('img['+this.config.lazyImg+']', box);
		if (imgs!==[]) {
			for (var i=0, l = imgs.length; i<l; i++) {
				$D.setAttribute( imgs[i], 'src', $D.getAttribute(imgs[i], this.config.lazyImg) );
				imgs[i].removeAttribute(this.config.lazyImg);
			}
		}
	}
}

/**
 * 添加静态方法init初始化
 * @method init
 * @param {Object} container 外层容器
 * @param {Object} config 配置参数
 */
FD.widget.Tab.init = function(container, config) {
	return new FD.widget.Tab(container, config);
};
