/**
 * FD.widget.Slider
 *
 * �õ�Ƭ������
 * ���ƣ�
 * 		1���õ�Ƭ���������<ul>�У�ÿ�Żõ�Ƭ��һ��<li>
 * 		2���������js/core/fdev.js��js/core/yui/animation-min.js����js�ļ�
 * 		3�����δ�ṩ��Ҫ��css���ã�������ʽ������Ҫ����css/widget/slider.css�ļ�
 * ���÷�����
 * 		����
 * 		<div id="slider1" class="slider-demo">
 *			<ul>
 *				<li><img src="a.jpg" /></li>
 *				<li><img src="b.jpg" /></li>
 *				<li><img src="c.jpg" /></li>
 *			</ul>
 *		</div>
 *		����
 *		<script type="text/javascript">
 *			var slider = new FD.widget.Slider('slider1',{});
 *		</script>
 *
 * @author 	yaosl<happyyaosl@gmail.com>
 * @link    http://www.fdev-lib.cn/
 */
 

/**
 * ��ʼ���������Ժ���Ϊ
 * @method init 
 * @param {Object} container ���������ID
 * @param {Object} config ���ò���
 */	
FD.widget.Slide = function(container, config) {
	this.init(container, config);
}

/* Ĭ�ϲ������� */ 
FD.widget.Slide.defConfig = {
	sliderClass: 'f-slider',			/* �õ�ӰƬul��className */
	triggersClass: 'f-slider-triggers',	/* �����className */
	currentClass: 'current',			/* ��ǰ�����className */
	eventType: 'click',					/* ������ܵ��¼����ͣ�Ĭ��������� */
	timeDelay: 3,						/* �Զ�����ʱ���� */
	isAutoPlay: true,					/* �Ƿ��Զ����� */
	sliderHeight:null					/* ֻ�е��޷���ȷ��ȡ�߿�ʱ������Ҫ�趨 */
};
FD.widget.Slide.prototype = {
	/**
	 * ��ʼ���������Ժ���Ϊ
	 * @method init 
	 * @param {Object} container ���������ID
	 * @param {Object} config ���ò���
	 */
	init: function(container, config) {
		this.container = $(container);
		this.config = FD.common.applyIf(config||{}, FD.widget.Slide.defConfig);
		//��ȡul�б��õ�Ƭ�飩
		this.slidesUL = $D.getElementsByClassName(this.config.sliderClass, 'ul', this.container)[0];
		if(!this.slidesUL) {
			//ȡ��һ�� ul �ӽڵ�
			this.slidesUL = $D.getFirstChild(this.container, function(node) {
				return node.tagName.toLowerCase === 'ul';
			});
		}
		this.slides = $D.getChildren(this.slidesUL); 	//ֻȡֱ�ӵ���<li>Ԫ��
		if (this.slides.length <= 0) return;			//���Ϊ��ֱ���˳�
		this.delayTimeId = null;		/* eventType = 'mouse' ʱ���ӳٵ�TimeId */
		this.autoPlayTimeId = null;		/* �Զ�����TimeId */
		this.curSlide = -1;
		this.sliding = false;	/* ����״̬ */						
		this.pause = false;		/* ��ͣ״̬ */
			
		// ָ�� fdev-Lib/css/widget/slider.css ���趨�� className
		$D.addClass(this.container, 'f-slider');
		$D.addClass(this.slidesUL, 'f-slider-list');
		$D.setStyle(this.slidesUL, 'height', (this.config.sliderHeight || this.container.offsetHeight) + 'px');
		
		this.initSlides(); 		// ��ʼ���õ�Ƭ����
		this.initTriggers();	// ��ʼ����������
		this.play(1);			// �ӵ�һ����ʼ����
		if (this.config.isAutoPlay) this.autoPlay();
		if (YAHOO.lang.isFunction(this.config.onInit)) this.config.onInit.call(this);
	},
	
	/**
	 * ���ݻõ�Ƭ�����Զ����ɴ��㣬������һ��<ul>�У�ҳ����CSS�б����ж�Ӧ��������
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
		this.triggersUL = ul;	/* �����ɵ�ul�б�ֵ������ */
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
	 * ��ʼ���õ�Ƭ
	 * @method initSlides 
	 */
	initSlides: function() {
		$E.on(this.slides, 'mouseover', function(){this.pause = true;}, this, true);
		$E.on(this.slides, 'mouseout', function(){this.pause = false;}, this, true);
		$D.setStyle(this.slides, 'display', 'none');
	},
	
	/**
	 * ����¼�����
	 * @param {Object} e Event����
	 */
	clickHandler: function(e) {
		var t = $E.getTarget(e);
		var idx = parseInt(FD.common.stripTags(t.innerHTML));
		//ð�ݼ��
		while(t != this.container) {
			if(t.nodeName.toUpperCase() == "LI") {
				 /* ������ڻ�����,ֹͣ��Ӧ */
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
	 * ����¼�����
	 * @param {Object} e Event ����
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
	 * ����ָ��ҳ�Ļõ�Ƭ
	 * @param {Object} n ҳ����Ҳ���Ǵ�������ֵ
	 * @param {Object} flag ���flag=true�������û������ģ���֮��Ϊ�Զ�����
	 */
	play: function(n, flag) {
		n = n - 1;
		if (n == this.curSlide) return;	//������ǵ�ǰ����ֱ���˳�
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
	 * �л��õ�Ƭ����򵥵��л���������/��ʾ��
	 * ��ͬ��Ч�����Ը��Ǵ˷���
	 * @see FD.widget.ScrollSlide
	 * @see FD.widget.FadeSlide
	 * @param {Object} n ҳ��
	 */
	slide: function(n) {
		var curSlide = this.curSlide >= 0 ? this.curSlide : 0;
		this.sliding = true;
		$D.setStyle(this.slides[curSlide], 'display', 'none');
		$D.setStyle(this.slides[n], 'display', 'inline');
		this.sliding = false;
	},
	
	/**
	 * �����Զ�����
	 * @method autoPlay
	 */
	autoPlay: function() {
		var self = this;
		var callback = function() {
			if ( !self.pause && !self.sliding ) {
				// @important ��ȡ��һ�����㷨
				var n = (self.curSlide+1) % self.slides.length + 1;		
				self.play(n, false);
			}
		}
		this.autoPlayTimeId = setInterval(callback, this.config.timeDelay * 1000);
	}
}

/**
 * ����Ч���Ļõ�Ƭ������
 * @param {Object} container
 * @param {Object} config
 */
FD.widget.ScrollSlide = function(container, config){
	this.init(container, config);
}
YAHOO.extend(FD.widget.ScrollSlide, FD.widget.Slide, {
	/**
	 * ���Ǹ������Ϊ�������ػõ�Ƭ
	 * CSS��ע������ slidesUL overflow:hidden����ֻ֤��ʾһ���õ�
	 */
	initSlides: function() {
		FD.widget.ScrollSlide.superclass.initSlides.call(this);
		$D.setStyle(this.slides, 'display', 'inline');
	},
	/**
	 * ���Ǹ������Ϊ��ʹ�ù�������
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
 * ���뵭��Ч���Ļõ�Ƭ������
 * @param {Object} container
 * @param {Object} config
 */
FD.widget.FadeSlide = function(container, config){
	this.init(container, config);
}
YAHOO.extend(FD.widget.FadeSlide, FD.widget.Slide, {
	/**
	 * ���Ǹ������Ϊ�����ûõ�Ƭ��position=absolute
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
	 * ���Ǹ������Ϊ��ʹ�õ��뵭������
	 * @param {Object} n
	 */
	slide: function(n) {
		/* ��һ������ */
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
 * Slider �ķ�װ��ͨ�� effect ������������ͬ��Slide����
 */
FD.widget.Slider = function(container, config) {
	if (!container) return;	//û����ʾ����ֱ���˳�
	config = config || {};
	if (config.effect == 'scroll') {
		//Ч����ʾΪ����
		if (YAHOO.env.ua.gecko && $(container).getElementsByTagName('iframe').length > 0) {// <li>�°���<iframe>ʱ��firefox��ʾ�쳣
			return new FD.widget.Slide(container, config);
		}
		return new FD.widget.ScrollSlide(container, config);
	}else if (config.effect == 'fade') {//Ч����ʾΪ���뵭��
		return new FD.widget.FadeSlide(container, config);
	}else {//û��Ч��ֱ�ӱ任
		return new FD.widget.Slide(container, config);
	}
}
