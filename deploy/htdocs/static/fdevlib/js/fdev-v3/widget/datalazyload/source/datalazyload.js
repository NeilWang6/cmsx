/*
* @fileoverview ͼƬ��ʱ����
* @author Denis<chuangui.xiecg@alibaba-inc.com>
* @version 1.0.0
* @version 1.0.1 Bug fixed: ͼƬonload�¼�ע��˳������ --- Denis
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
	 * ͼƬ��ʱ�������
	 * @param {Array|HTMLElement} containers Ŀ������
	 * @param {Object} config ���ò���
	 */
	w.DataLazyload=function(containers,config){
		var self = this,fnThreshold = '';
		if(!(self instanceof arguments.callee)){
			return new arguments.callee(containers, config);
		}
		// containers ��һ�� HTMLElement ʱ
		if (!lang.isArray(containers)) {
			containers = [FYG(containers) || doc];
		}
		self.containers = containers;
		self.config = FD.common.applyIf(config || {}, defConfig);
		
		// �������ݴ���
		fnThreshold = self.config.fnThreshold;
		self.config.fnThreshold = fnThreshold === DEFAULT ? self.config.threshold : fnThreshold;
		
		this._init();
	};

	lang.augmentObject(w.DataLazyload.prototype,{
		/**
		 * ��ʼ��
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
		 * ��ȡҪ�ӳټ��ص�ͼƬ����
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
		 * ͼƬ������
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
		 * �Զ��庯��������
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
		 * ��ȡ��ǰ�ӳټ��ص�����
		 * @method _getItemsLength
		 * @protected
		 * @return {Int}
		 */
		_getItemsLength:function(){
			return this.images.length+this.fns.length;
		},
		/**
		 * ��ʼ���¼�
		 * @method _initLoadEvent
		 * @protected
		 */
		_initLoadEvent:function(){
			var timer, self = this;
			// scroll �� resize ʱ������ͼƬ
			FYE.on(win, SCROLL, loader);
			FYE.on(win, RESIZE, function() {
				self.threshold = self._getThreshold(self.config.threshold);
				self.fnThreshold = self._getThreshold(self.config.fnThreshold);
				loader();
			});

			// ��Ҫ��������һ�Σ��Ա�֤��һ�����ӳ���ɼ�
			if (self._getItemsLength()) {
				FYE.onDOMReady(function() {
					loadItems();
				});
			}

			// ���غ���
			function loader() {
				if (timer) return;
				timer = setTimeout(function() {
					loadItems();
					timer = null;
				}, 100);
			}

			// �����ӳ���
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
		 * �����ӳ���
		 * @method _loadItems
		 * @protected
		 */
		_loadItems: function() {
			this._loadImgs();
			this._loadFns();
		},
		/**
		 * ����ͼƬ
		 * @method _loadImgs
		 * @protected
		 */
		_loadImgs: function() {
			var self = this;
			self.images = self.images.filter(self._loadImg, self);
		},
		/**
		 * ��ع���������ͼƬ
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
		 * ����ͼƬ src
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
		 * ���ذ����Զ��庯��
		 * @method _loadFns
		 * @protected
		 */
		_loadFns: function() {
			var self = this;
			self.fns = self.fns.filter(self._loadFn, self);
		},
		/**
		 * ��ع���������HTMLElement
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
		 * ��ȡ�Զ�������data-fn,��ִ�нű�����
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
		 * ��ȡ��ֵ
		 * @method _getThreshold
		 * @protected
		 * @return {int}
		 */
		_getThreshold:function(threshold){
			var vh = FYD.getViewportHeight();
			if (threshold === DEFAULT) return 2 * vh; //Ĭ������֮��ſ�ʼ��ʱ����
			else return vh + threshold;
		},
		/**
		 * �ַ���ת����
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