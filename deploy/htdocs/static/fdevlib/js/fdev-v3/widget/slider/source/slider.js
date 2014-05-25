/**
 * FD.widget.Slider
 *
 * 幻灯片播放器
 * 限制：
 * 		1、幻灯片必须包括在<ul>中，每张幻灯片是一个<li>
 * 		2、必须包含js/core/fdev.js和js/core/yui/animation-min.js两个js文件
 * 		3、如果未提供必要的css设置（触点样式）则还需要包含css/widget/slider.css文件
 * 调用方法：
 * 		……
 * 		<div id="slider1" class="slider-demo">
 *			<ul>
 *				<li><img src="a.jpg" /></li>
 *				<li><img src="b.jpg" /></li>
 *				<li><img src="c.jpg" /></li>
 *			</ul>
 *		</div>
 *		……
 *		<script type="text/javascript">
 *			var slider = new FD.widget.Slider('slider1',{});
 *		</script>
 *
 * @author 	yaosl<happyyaosl@gmail.com>
 * @link    http://www.fdev-lib.cn/
 */
 

/**
 * 初始化对象属性和行为
 * @method init 
 * @param {Object} container 容器对象或ID
 * @param {Object} config 配置参数
 */	
FD.widget.Slide = function(container, config) {
	this.init(container, config);
}

/* 默认参数配置 */ 
FD.widget.Slide.defConfig = {
	sliderClass: 'f-slider',			/* 幻灯影片ul的className */
	triggersClass: 'f-slider-triggers',	/* 触点的className */
	currentClass: 'current',			/* 当前触点的className */
	eventType: 'click',					/* 触点接受的事件类型，默认是鼠标点击 */
	timeDelay: 3,						/* 自动播放时间间隔 */
	isAutoPlay: true,					/* 是否自动播放 */
	sliderHeight:null					/* 只有当无法正确获取高宽时，才需要设定 */
};
FD.widget.Slide.prototype = {
	/**
	 * 初始化对象属性和行为
	 * @method init 
	 * @param {Object} container 容器对象或ID
	 * @param {Object} config 配置参数
	 */
	init: function(container, config) {
		this.container = $(container);
		this.config = FD.common.applyIf(config||{}, FD.widget.Slide.defConfig);
		//获取ul列表（幻灯片组）
		this.slidesUL = $D.getElementsByClassName(this.config.sliderClass, 'ul', this.container)[0];
		if(!this.slidesUL) {
			//取第一个 ul 子节点
			this.slidesUL = $D.getFirstChild(this.container, function(node) {
				return node.tagName.toLowerCase === 'ul';
			});
		}
		this.slides = $D.getChildren(this.slidesUL); 	//只取直接的子<li>元素
		if (this.slides.length <= 0) return;			//如果为空直接退出
		this.delayTimeId = null;		/* eventType = 'mouse' 时，延迟的TimeId */
		this.autoPlayTimeId = null;		/* 自动播放TimeId */
		this.curSlide = -1;
		this.sliding = false;	/* 滚动状态 */						
		this.pause = false;		/* 暂停状态 */
			
		// 指定 fdev-Lib/css/widget/slider.css 中设定的 className
		$D.addClass(this.container, 'f-slider');
		$D.addClass(this.slidesUL, 'f-slider-list');
		$D.setStyle(this.slidesUL, 'height', (this.config.sliderHeight || this.container.offsetHeight) + 'px');
		
		this.initSlides(); 		// 初始化幻灯片设置
		this.initTriggers();	// 初始化触点设置
		this.play(1);			// 从第一个开始滚动
		if (this.config.isAutoPlay) this.autoPlay();
		if (YAHOO.lang.isFunction(this.config.onInit)) this.config.onInit.call(this);
	},
	
	/**
	 * 根据幻灯片长度自动生成触点，包含在一个<ul>中，页面中CSS中必须有对应属性设置
	 * @method initTriggers 
	 */
	initTriggers: function() {
		var ul = document.createElement('ul');
		this.container.appendChild(ul);
		for (var i = 0, len = this.slides.length; i < len; ++i) {
			var li = document.createElement('li');
			li.innerHTML = i+1;
			ul.appendChild(li);
		}
		$D.addClass(ul, this.config.triggersClass);
		this.triggersUL = ul;	/* 将生成的ul列表赋值给触点 */
		if (this.config.eventType == 'mouse') {
			$E.on(this.triggersUL, 'mouseover', this.mouseHandler, this, true);
			$E.on(this.triggersUL, 'mouseout', function(e){
				clearTimeout(this.delayTimeId);
				this.pause = false;
			}, this, true);
		} else {
			$E.on(this.triggersUL, 'click', this.clickHandler, this, true);
		}
	},
	
	/**
	 * 初始化幻灯片
	 * @method initSlides 
	 */
	initSlides: function() {
		$E.on(this.slides, 'mouseover', function(){this.pause = true;}, this, true);
		$E.on(this.slides, 'mouseout', function(){this.pause = false;}, this, true);
		$D.setStyle(this.slides, 'display', 'none');
	},
	
	/**
	 * 点击事件处理
	 * @param {Object} e Event对象
	 */
	clickHandler: function(e) {
		var t = $E.getTarget(e);
		var idx = parseInt(FD.common.stripTags(t.innerHTML));
		//冒泡检查
		while(t != this.container) {
			if(t.nodeName.toUpperCase() == "LI") {
				 /* 如果还在滑动中,停止响应 */
				if (!this.sliding){
					this.play(idx, true);
				}
				break;
			} else {
				t = t.parentNode;
			}
		}		
	},
	
	/**
	 * 鼠标事件处理
	 * @param {Object} e Event 对象
	 */
	mouseHandler: function(e) {
		var t = $E.getTarget(e);
		var idx = parseInt(FD.common.stripTags(t.innerHTML));
		while(t != this.container) {
			if(t.nodeName.toUpperCase() == "LI") {
				var self = this;			
				this.delayTimeId = setTimeout(function() {
						self.play(idx, true);
						self.pause = true;
					}, (self.sliding?.5:.1)*1000);
				break;
			} else {
				t = t.parentNode;
			}
		}
	},
	
	/**
	 * 播放指定页的幻灯片
	 * @param {Object} n 页数，也就是触点数字值
	 * @param {Object} flag 如果flag=true，则是用户触发的，反之则为自动播放
	 */
	play: function(n, flag) {
		n = n - 1;
		if (n == this.curSlide) return;	//如果就是当前项则直接退出
		var curSlide = this.curSlide >= 0 ? this.curSlide : 0;
		if (flag && this.autoPlayTimeId) clearInterval(this.autoPlayTimeId);
		var triggersLis = this.triggersUL.getElementsByTagName('li');
		triggersLis[curSlide].className = ''; 
		triggersLis[n].className = this.config.currentClass;
		this.slide(n);
		this.curSlide = n;
		if (flag && this.config.isAutoPlay)this.autoPlay();
	},
	
	/**
	 * 切换幻灯片，最简单的切换就是隐藏/显示。
	 * 不同的效果可以覆盖此方法
	 * @see FD.widget.ScrollSlide
	 * @see FD.widget.FadeSlide
	 * @param {Object} n 页数
	 */
	slide: function(n) {
		var curSlide = this.curSlide >= 0 ? this.curSlide : 0;
		this.sliding = true;
		$D.setStyle(this.slides[curSlide], 'display', 'none');
		$D.setStyle(this.slides[n], 'display', 'inline');
		this.sliding = false;
	},
	
	/**
	 * 设置自动播放
	 * @method autoPlay
	 */
	autoPlay: function() {
		var self = this;
		var callback = function() {
			if ( !self.pause && !self.sliding ) {
				// @important 获取下一个的算法
				var n = (self.curSlide+1) % self.slides.length + 1;		
				self.play(n, false);
			}
		}
		this.autoPlayTimeId = setInterval(callback, this.config.timeDelay * 1000);
	}
}

/**
 * 滚动效果的幻灯片播放器
 * @param {Object} container
 * @param {Object} config
 */
FD.widget.ScrollSlide = function(container, config){
	this.init(container, config);
}
YAHOO.extend(FD.widget.ScrollSlide, FD.widget.Slide, {
	/**
	 * 覆盖父类的行为，不隐藏幻灯片
	 * CSS中注意设置 slidesUL overflow:hidden，保证只显示一幅幻灯
	 */
	initSlides: function() {
		FD.widget.ScrollSlide.superclass.initSlides.call(this);
		$D.setStyle(this.slides, 'display', 'inline');
	},
	/**
	 * 覆盖父类的行为，使用滚动动画
	 * @param {Object} n
	 */
	slide: function(n) {
		var curSlide = this.curSlide >= 0 ? this.curSlide : 0;
		var args = { scroll: {by:[0, this.slidesUL.offsetHeight*(n-curSlide)]} };
		var anim = new $Y.Scroll(this.slidesUL, args, .5, $Y.Easing.easeOutStrong);
		anim.onComplete.subscribe(function(){
			this.sliding = false;
		}, this, true);
		anim.animate();
		this.sliding = true;
	}
});

/**
 * 淡入淡出效果的幻灯片播放器
 * @param {Object} container
 * @param {Object} config
 */
FD.widget.FadeSlide = function(container, config){
	this.init(container, config);
}
YAHOO.extend(FD.widget.FadeSlide, FD.widget.Slide, {
	/**
	 * 覆盖父类的行为，设置幻灯片的position=absolute
	 */
	initSlides: function() {
		FD.widget.FadeSlide.superclass.initSlides.call(this);
		$D.setStyle(this.slides, 'position', 'absolute');
		$D.setStyle(this.slides, 'top', this.config.slideOffsetY||0);
		$D.setStyle(this.slides, 'left', this.config.slideOffsetX||0);
		$D.setStyle(this.slides, 'z-index', 1);
		/* fix bug ie */
		$D.setStyle(this.slides, 'width', this.container.offsetWidth);
		$D.setStyle(this.slides, 'height', this.container.offsetHeight);
	},
	
	/**
	 * 覆盖父类的行为，使用淡入淡出动画
	 * @param {Object} n
	 */
	slide: function(n) {
		/* 第一次运行 */
		if (this.curSlide == -1) {
			$D.setStyle(this.slides[n], 'display', 'block');
		} else {
			var curSlideLi = this.slides[this.curSlide];
			$D.setStyle(curSlideLi, 'display', 'block');
			$D.setStyle(curSlideLi, 'z-index', 10);
			var fade = new $Y.Anim(curSlideLi, { opacity: { to: 0 } }, .5, $Y.Easing.easeNone);
			fade.onComplete.subscribe(function(){
				$D.setStyle(curSlideLi, 'z-index', 1);
				$D.setStyle(curSlideLi, 'display', 'none');
				$D.setStyle(curSlideLi, 'opacity', 1);
				this.sliding = false;
			}, this, true);
			$D.setStyle(this.slides[n], 'display', 'block');
			fade.animate();			
			this.sliding = true;
		}
	}
});	
	


/**
 * Slider 的封装，通过 effect 参数，创建不同的Slide对象
 */
FD.widget.Slider = function(container, config) {
	if (!container) return;	//没有显示对象直接退出
	config = config || {};
	if (config.effect == 'scroll') {
		//效果显示为滚动
		if (YAHOO.env.ua.gecko && $(container).getElementsByTagName('iframe').length > 0) {// <li>下包含<iframe>时，firefox显示异常
			return new FD.widget.Slide(container, config);
		}
		return new FD.widget.ScrollSlide(container, config);
	}else if (config.effect == 'fade') {//效果显示为淡入淡出
		return new FD.widget.FadeSlide(container, config);
	}else {//没有效果直接变换
		return new FD.widget.Slide(container, config);
	}
}
