/*
* @fileoverview 图片延时加载
* @author Denis<chuangui.xiecg@alibaba-inc.com>
* @version 1.0.0
* @version 1.0.1 Bug fixed: 图片onload事件注册顺序问题 --- Denis
*/
;(function(w){
	var lang = YAHOO.lang,win = window,doc = document,IMG_DATA_SRC = 'data-lazyload-src', 
		DEFAULT = 'default', SCROLL = 'scroll', RESIZE = 'resize',IMG='img',NULL = null,
		FN_DATA_CLS = 'fn-lazyload',FN_DATA_NAME = 'data-fn',
		defConfig={
			fnThreshold:DEFAULT,
			threshold:DEFAULT,
			elements:IMG,
			onComplete:NULL,
			onLoad:NULL
		};
	/**
	 * 图片延时加载组件
	 * @param {Array|HTMLElement} containers 目标容器
	 * @param {Object} config 配置参数
	 */
	w.DataLazyload=function(containers,config){
		var self = this,fnThreshold = '';
		if(!(self instanceof arguments.callee)){
			return new arguments.callee(containers, config);
		}
		// containers 是一个 HTMLElement 时
		if (!lang.isArray(containers)) {
			containers = [FYG(containers) || doc];
		}
		self.containers = containers;
		self.config = FD.common.applyIf(config || {}, defConfig);
		
		// 做个兼容处理
		fnThreshold = self.config.fnThreshold;
		self.config.fnThreshold = fnThreshold === DEFAULT ? self.config.threshold : fnThreshold;
		
		this._init();
	};

	lang.augmentObject(w.DataLazyload.prototype,{
		/**
		 * 初始化
		 * @method _init
		 * @protected
		 */
		_init:function(){
			var self = this;
			self.threshold = self._getThreshold(self.config.threshold);
			self.fnThreshold = self._getThreshold(self.config.fnThreshold);
			self._filterItems();
			self._getItemsLength() && self._initLoadEvent();
		},
		/**
		 * 获取要延迟加载的图片对象
		 * @method filterItems
		 * @protected
		 */
		_filterItems:function(){
			var self = this,
				containers = self.containers,n, N, imgs,lazyImgs = [],fns,lazyFns=[];
				
			for (n = 0,N = containers.length; n < N; ++n) {
				imgs = FYS(self.config.elements, containers[n]);
				lazyImgs = lazyImgs.concat(imgs.filter(self._filterImg, self));
				
				fns = FYS(('.'+FN_DATA_CLS), containers[n]);
				lazyFns = lazyFns.concat(fns.filter(self._filterFn, self));
				
			}
			self.images = lazyImgs;
			self.fns = lazyFns;
		},
		/** 
		 * 图片过滤器
		 * @method  _filterImg
		 * @protected
		 * @return {Boolean}
		 */
		_filterImg:function(img){
			var self = this,
				dataSrc = img.getAttribute(IMG_DATA_SRC);
			if (dataSrc) return true;
		},
		/** 
		 * 自定义函数过滤器
		 * @method  _filterFn
		 * @protected
		 * @return {Boolean}
		 */
		_filterFn:function(el){
			var self = this,
				fn = el.getAttribute(FN_DATA_NAME);
			if (fn) return true;
		},
		/**
		 * 获取当前延迟加载的数量
		 * @method _getItemsLength
		 * @protected
		 * @return {Int}
		 */
		_getItemsLength:function(){
			return this.images.length+this.fns.length;
		},
		/**
		 * 初始化事件
		 * @method _initLoadEvent
		 * @protected
		 */
		_initLoadEvent:function(){
			var timer, self = this;
			// scroll 和 resize 时，加载图片
			FYE.on(win, SCROLL, loader);
			FYE.on(win, RESIZE, function() {
				self.threshold = self._getThreshold(self.config.threshold);
				self.fnThreshold = self._getThreshold(self.config.fnThreshold);
				loader();
			});

			// 需要立即加载一次，以保证第一屏的延迟项可见
			if (self._getItemsLength()) {
				FYE.onDOMReady(function() {
					loadItems();
				});
			}

			// 加载函数
			function loader() {
				if (timer) return;
				timer = setTimeout(function() {
					loadItems();
					timer = null;
				}, 100);
			}

			// 加载延迟项
			function loadItems() {
				self._loadItems();
				if (self._getItemsLength() === 0) {
					if(typeof self.config.onComplete==='function'){
						self.config.onComplete();
					}
					self.config.onComplete=null;
					FYE.removeListener(win, SCROLL, loader);
					FYE.removeListener(win, RESIZE, loader);
				}
			}

		},
		/**
		 * 加载延迟项
		 * @method _loadItems
		 * @protected
		 */
		_loadItems: function() {
			this._loadImgs();
			this._loadFns();
		},
		/**
		 * 加载图片
		 * @method _loadImgs
		 * @protected
		 */
		_loadImgs: function() {
			var self = this;
			self.images = self.images.filter(self._loadImg, self);
		},
		/**
		 * 监控滚动，处理图片
		 * @method _loadImg
		 * @protected
		 * @return {Boolean}
		 */
		_loadImg: function(img) {
			var self = this,
				scrollTop = FYD.getDocumentScrollTop(),
				threshold = self.threshold + scrollTop,
				offset = FYD.getRegion(img);
			if (offset.top <= threshold) {
				if(typeof self.config.onLoad=='function'){
					FYE.on(img,'load',function(){
						self.config.onLoad(img);
					});
				}
                self._loadImgSrc(img);
			} else {
				return true;
			}
		},
		/**
		 * 加载图片 src
		 * @method _loadImgSrc
		 * @static
		 */
		_loadImgSrc: function(img) {
			var dataSrc = img.getAttribute(IMG_DATA_SRC);
			
			if (dataSrc && img.src != dataSrc) {
				img.src = dataSrc;
				img.removeAttribute(IMG_DATA_SRC);
			}
		},
		/**
		 * 加载包含自定义函数
		 * @method _loadFns
		 * @protected
		 */
		_loadFns: function() {
			var self = this;
			self.fns = self.fns.filter(self._loadFn, self);
		},
		/**
		 * 监控滚动，处理HTMLElement
		 * @method _loadFn
		 * @protected
		 * @return {Boolean}
		 */
		_loadFn: function(el) {
			var self = this,
				scrollTop = FYD.getDocumentScrollTop(),
				threshold = self.fnThreshold + scrollTop,
				offset = FYD.getRegion(el);
			if (offset.top <= threshold) {
				self._instantiatedFn(el);
			} else {
				return true;
			}
		},
		/**
		 * 获取自定义属性data-fn,并执行脚本函数
		 * @method _instantiatedFn
		 * @static
		 */
		_instantiatedFn: function(el) {
			var self = this,
				fnName = el.getAttribute(FN_DATA_NAME),r;
			if(fnName != null){
				r = self._parseFunction(fnName);
				if(r.length==2){
					r[0](el);
				}
				if (fnName) {
					el.removeAttribute(FN_DATA_NAME);
				}
			}
		},
		/**
		 * 获取阀值
		 * @method _getThreshold
		 * @protected
		 * @return {int}
		 */
		_getThreshold:function(threshold){
			var vh = FYD.getViewportHeight();
			if (threshold === DEFAULT) return 2 * vh; //默认两屏之外才开始延时加载
			else return vh + threshold;
		},
		/**
		 * 字符串转函数
		 * @param {String} str
		 */
		_parseFunction:function(str){
			var a = str.split('.'),i,s=window;
			for(i=a[0]==='window'?1:0;i<a.length-1;i++){
				if(typeof s[a[i]]=='object'){
					s = s[a[i]];
				}else{
					return [];
				}
			}
			if(FDEV.lang.isFunction(s[a[a.length-1]])) return [s[a[a.length-1]],s];
				return [];
		},
		end:0
	});
})(FD.widget);