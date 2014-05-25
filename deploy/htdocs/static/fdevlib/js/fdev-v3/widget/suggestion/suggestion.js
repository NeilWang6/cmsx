/**
 * 关键字搜索建议
 * @update xiaodong.li 2011.11.17 增加了category的推荐信息扩展
 */
!(function(){
	var $Y = YAHOO,
		$L = $Y.lang,
		win = window,
		doc = document,
		head = doc.getElementsByTagName("head")[0],
		ie = $Y.env.ua.ie,
		ie6 = (ie === 6),
		DEFAULT_DATA_SOURCE = "http:\/\/suggest.1688.com\/bin\/suggest";
        SUGGEST_ID = "suggest-style", // 样式 style 元素的 id
        SUGGEST_CONTAINER_CLASS = "suggest-container",
        SUGGEST_KEY_CLASS = "suggest-key", // 提示层中，key 元素的 class
        SUGGEST_RESULT_CLASS = "suggest-result", // 提示层中，result 元素的 class
        SUGGEST_SELECTED_ITEM_CLASS = "selected", // 提示层中，选中项的 class
        SUGGEST_TIPS_CLASS = 'suggest-tips',
        SUGGEST_BOTTOM_CLASS = "suggest-bottom",
        SUGGEST_CLOSE_BTN_CLASS = "suggest-close-btn",
        SUGGEST_SHIM_CLASS = "suggest-shim", // iframe shim 的 class
		//SUGGEST_ITEM_INDEX =-1,

        EVENT_BEFORE_DATA_REQUEST = "beforeDataRequest",
        EVENT_ON_DATA_RETURN = "onDataReturn",
        EVENT_BEFORE_SHOW = "beforeShow",
        EVENT_ON_ITEM_SELECT = "onItemSelect",
		
		
		defaultConfig={
			/**
             * 用户附加给悬浮提示层的 class
             *
             * 提示层的默认结构如下：
             * <div class="suggest-container [container-class]">
             *     <ol>
             *         <li>
             *             <span class="suggest-key">...</span>
             *             <span class="suggest-result">...</span>
             *         </li>
             *     </ol>
             *     <div class="suggest-bottom">
             *         <a class="suggest-close-btn">...</a>
             *     </div>
             * </div>
             * @type String
             */
			 
            containerClass: "",
			
			/**
			 * 自定义参数
			 */
			myParam:'',
			
            /**
             * 提示层的宽度
             * 注意：默认情况下，提示层的宽度和input输入框的宽度保持一致
             * 示范取值："200px", "10%"等，必须带单位
             * @type String
             */
            containerWidth: "auto",

            /**
             * result的格式
             * @type String
             */
            resultFormat: "约%result%条结果",
			
			/*显示引导*/
			showTis:true,
			
            /**
             * 是否显示关闭按钮
             * @type Boolean
             */
            showCloseBtn: false,

            /**
             * 关闭按钮上的文字
             * @type String
             */
            closeBtnText: "关闭",

            /**
             * 是否需要iframe shim
             * @type Boolean
             */
            useShim: ie6,

            /**
             * 定时器的延时
             * @type Number
             */
            timerDelay: 200,

            /**
             * 初始化后，自动激活
             * @type Boolean
             */
            autoFocus: false,

            /**
             * 鼠标点击完成选择时，是否自动提交表单
             * @type Boolean
             */
            submitFormOnClickSelect: false,
			/**
			 * 存放接口数据的变量名称
			 */
			varName:'_suggest_result_',
			/**
			 * suggest层left偏移量修正
			 */
			leftOffset:0,
			/**
			 * suggest层top偏移量修正
			 */
			topOffset:0,
			/**
			 * 超过数目后显示滚动条,默认为0，表示不做限制
			 */
			showNum:0,
			/**
			 * title字数截取
			 */
			titleLength:0,
			/**
			 * 自定义点击事件
			 */
			customClick:null,
			/**
			 * suggest展开打点
			 */
			suggestTracelogShow:'',
			/**
			 * 选中suggest的推荐词打点
			 */
			suggestTracelogSubmit:'',
            /**
			 * 选中suggest的推荐词并且点下打点
			 */
			suggestTracelogClick:'',
             /**
			 * suggest的打点类型，供应，产品，公司，咨询等
			 */
			suggestTracelogType:'',
            /**
			 * suggest的打点序号
			 */
			suggestTracelogIndex:0
            
		};
	FD.widget.Suggest=function(q,dataSource,config){
		var that = this;
		if(!(this instanceof arguments.callee)){
			return new arguments.callee(q, dataSource, config);
		}
		/**
         * 文本输入框
         * @type HTMLElement
         */
        this.textInput = $D.get(q);
		/**
         * 获取数据的URL 或 JSON格式的静态数据
         * @type {String|Object}
         */
        this.dataSource = dataSource||DEFAULT_DATA_SOURCE;

        /**
         * 通过jsonp返回的数据
         * @type Object
         */
        this.returnedData = null;

        /**
         * 配置参数
         * @type Object
         */
        this.config = $L.merge(defaultConfig, config || {});

        /**
         * 存放提示信息的容器
         * @type HTMLElement
         */
        this.container = null;

        /**
         * 输入框的值
         * @type String
         */
        this.query = "";

        /**
         * 获取数据时的参数
         * @type String
         */
        this.queryParams = "";

        /**
         * 内部定时器
         * @private
         * @type Object
         */
        this._timer = null;

        /**
         * 计时器是否处于运行状态
         * @private
         * @type Boolean
         */
        this._isRunning = false;

        /**
         * 获取数据的script元素
         * @type HTMLElement
         */
        this.dataScript = null;

        /**
         * 数据缓存
         * @private
         * @type Object
         */
        this._dataCache = {};

        /**
         * 最新script的时间戳
         * @type String
         */
        this._latestScriptTime = "";

        /**
         * script返回的数据是否已经过期
         * @type Boolean
         */
        this._scriptDataIsOut = false;

        /**
         * 是否处于键盘选择状态
         * @private
         * @type Boolean
         */
        this._onKeyboardSelecting = false;

        /**
         * 提示层的当前选中项
         * @type Boolean
         */
        this.selectedItem = null;
		
		this.suggestTracelogKeyword = '';
		this.suggestTracelogRecommendedword = '';
		this.suggestTracelogCategory='';
		
		this._index = -1;
        // init
        this._init();
		
		return this;
	}
	$L.augmentObject(FD.widget.Suggest.prototype,{
		/**
             * 初始化方法
             * @protected
             */
            _init: function() {
                // init DOM
                this._initTextInput();
                this._initContainer();
                if (this.config.useShim) this._initShim();
                this._initStyle();

                // create events
                this.createEvent(EVENT_BEFORE_DATA_REQUEST);
                this.createEvent(EVENT_ON_DATA_RETURN);
                this.createEvent(EVENT_BEFORE_SHOW);
                this.createEvent(EVENT_ON_ITEM_SELECT);

                // window resize event
                this._initResizeEvent();
            },

            /**
             * 初始化输入框
             * @protected
             */
            _initTextInput: function() {
                var instance = this;

                // turn off autocomplete
                this.textInput.setAttribute("autocomplete", "off");

                // blur
                $E.on(this.textInput, "blur", function() {
                    instance.stop();
                    //instance.hide();
                });
				//focus 获取焦点后光标显示在文本结束处
				$E.on(this.textInput,'focus',function(){
					instance._setContainerRegion();
                    instance._setShimRegion();
					var items = instance.container.getElementsByTagName("li");
					if (items.length == 0) return;
					//if (!instance.isVisible()) {
						//instance.show();
						//return; // 保留原来的选中状态
					//}
					instance.start();
					
				});

				// click
                $E.on(this.textInput, "click", function(e) {
					e = e || win.event;
					e.cancelBubble = true;
                });
			
                // auto focus
                if (this.config.autoFocus) this.textInput.focus();

                // keydown
                // 注：截至目前，在Opera9.64中，输入法开启时，依旧不会触发任何键盘事件
                var pressingCount = 0; // 持续按住某键时，连续触发的keydown次数。注意Opera只会触发一次。
                $E.on(this.textInput, "keydown", function(ev) {
                    var keyCode = ev.keyCode;
                    //console.log("keydown " + keyCode);

                    switch (keyCode) {
                        case 27: // ESC键，隐藏提示层并还原初始输入
                            instance.hide();
                            instance.textInput.value = instance.query;
                            break;
                        case 13: // ENTER键

                            // 如果是键盘选中某项后回车，触发onItemSelect事件
                            if (instance._onKeyboardSelecting) {
                                if (instance.textInput.value == instance._getSelectedItemKey()) { // 确保值匹配
                                    instance.fireEvent(EVENT_ON_ITEM_SELECT, instance.textInput.value);
                                }
                            }
							instance.textInput.blur();
                            instance.hide();
							
							//自定义点击事件
							if (instance.config.customClick) instance.config.customClick();
                            // 提交表单
                            instance._submitForm();
							return

                            break;
                        case 40: // DOWN键
                        case 38: // UP键
                            // 按住键不动时，延时处理
                            if (pressingCount++ == 0) {
                                if (instance._isRunning) instance.stop();
                                instance._onKeyboardSelecting = true;
                                instance.selectItem(keyCode == 40);

                            } else if (pressingCount == 3) {
                                pressingCount = 0;
                            }
                            break;
                    }

                    // 非 DOWN/UP 键时，开启计时器
                    if (keyCode != 40 && keyCode != 38) {
                        if (!instance._isRunning) {
                            // 1. 当网速较慢，js还未下载完时，用户可能就已经开始输入
                            //    这时，focus事件已经不会触发，需要在keyup里触发定时器
                            // 2. 非DOWN/UP键时，需要激活定时器
                            instance.start();
                        }
                        instance._onKeyboardSelecting = false;
                    }
                });

                // reset pressingCount
                $E.on(this.textInput, "keyup", function() {
                    pressingCount = 0;
					instance.suggestTracelogKeyword=this.value;
                });
            },

            /**
             * 初始化提示层容器
             * @protected
             */
            _initContainer: function() {
                // create
                var container = doc.createElement("div"),
                    customContainerClass = this.config.containerClass;

                container.className = SUGGEST_CONTAINER_CLASS;
                if (customContainerClass) {
                    container.className += " " + customContainerClass;
                }
                container.style.position = "absolute";
                container.style.visibility = "hidden";
                this.container = container;
                this._setContainerRegion();
                this._initContainerEvent();

                // append
                doc.body.insertBefore(container, doc.body.firstChild);
            },

            /**
             * 设置容器的left, top, width
             * @protected
             */
            _setContainerRegion: function() {
				that=this;
                var r = $D.getRegion(this.textInput);
                var left = r.left, w = r.right - left - 2;  // 减去border的2px

                // bug fix: w 应该判断下是否大于 0, 后边设置 width 的时候如果小于 0, ie 下会报参数无效的错误
                w = w > 0 ? w : 0;

                // ie8兼容模式
                // document.documentMode:
                // 5 - Quirks Mode
                // 7 - IE7 Standards
                // 8 - IE8 Standards
                /* var docMode = doc.documentMode;
                if (docMode === 7 && (ie === 7 || ie === 8)) {
                   left -= 2;
                } else if (YAHOO.env.ua.gecko) { // firefox下左偏一像素 注：当 input 所在的父级容器有 margin: auto 时会出现
                    left++;
                } */
				if (ie && ie<8){//解决ie6,ie7下 左移2px的bug
					left += 2;
				}
				//alert(this.container)
				this.container.style.left =this.config.leftOffset + left + "px";
				this.container.style.top =this.config.topOffset + r.bottom + "px";

                if (this.config.containerWidth == "auto") {
                    this.container.style.width = w + "px";
                } else {
                    this.container.style.width = this.config.containerWidth;
                }
            },

            /**
             * 初始化容器事件
             * 子元素都不用设置事件，冒泡到这里统一处理
             * @protected
             */
            _initContainerEvent: function() {
                var instance = this;

                // 鼠标事件
                $E.on(this.container, "mousemove", function(ev) {
                    //console.log("mouse move");
                    var target = $E.getTarget(ev);   
                    if (target.nodeName != "LI") {
                        target = $D.getAncestorByTagName(target, "li");
                    }
                    if ($D.isAncestor(instance.container, target)) {
                        if (target != instance.selectedItem) {
                            // 移除老的
                            instance._removeSelectedItem();
                            // 设置新的
                            instance._setSelectedItem(target);
							instance._index = parseInt($D.getAttribute(target,'index')-1);
							//console.log(instance._index)
                        }
                    }
                });

                var mouseDownItem = null;
                this.container.onmousedown = function(e) {
                    e = e || win.event;
                    // 鼠标按下处的item
                    mouseDownItem = e.target || e.srcElement;
					
					//取消事件冒泡
					e.cancelBubble = true;

                    // 鼠标按下时，让输入框不会失去焦点
                    // 1. for IE
                    instance.textInput.onbeforedeactivate = function() {
                        //win.event.returnValue = false;
                        instance.textInput.onbeforedeactivate = null;
                    };
                    // 2. for W3C
                    //return false;
                };

                // mouseup事件
                $E.on(this.container, "mouseup", function(ev) {
                    // 当mousedown在提示层，但mouseup在提示层外时，点击无效
                    if (!instance._isInContainer($E.getXY(ev))) return;
                    var target = $E.getTarget(ev);
                    // 在提示层A项处按下鼠标，移动到B处释放，不触发onItemSelect
                    if (target != mouseDownItem) return;

                    // 点击在关闭按钮上
                    if (target.className == SUGGEST_CLOSE_BTN_CLASS) {
                        instance.hide();
                        return;
                    }

                    // 可能点击在li的子元素上
                    if (target.nodeName != "LI") {
                        target = $D.getAncestorByTagName(target, "li");
                    }
                    // 必须点击在container内部的li上
                    if ($D.isAncestor(instance.container, target)) {
                        
                        instance._updateInputFromSelectItem(target);

                        // 触发选中事件
                        instance.fireEvent(EVENT_ON_ITEM_SELECT, instance.textInput.value);

                        
                        instance.textInput.blur();

                        instance.hide();
                        instance._clickSelect();

						if (instance.config.customClick) instance.config.customClick();
                        // 提交表单
                        instance._submitForm();
						return
						
                    }
                });
            },

            /**
             * click选择 or enter后，提交表单
             */
            _submitForm: function() {
                // 注：对于键盘控制enter选择的情况，由html自身决定是否提交。否则会导致某些输入法下，用enter选择英文时也触发提交
                if (this.config.submitFormOnClickSelect) {
                    var form = this.textInput.form;
                    if (!form) return;
					
					//categoryId赋值
					FYG('search_category') && (FYG('search_category').value = this._getSelectedItemCategoryId());

                    // 通过js提交表单时，不会触发onsubmit事件
                    // 需要js自己触发
                    if (doc.createEvent) { // w3c
                        var evObj = doc.createEvent("MouseEvents");
                        evObj.initEvent("submit", true, false);
                        form.dispatchEvent(evObj);
                    }
                    else if (doc.createEventObject) { // ie
                        form.fireEvent("onsubmit");
                    }
					//选中suggest词提交
					/*suggest展开打点*/
					this._suggestClick("submit");
                    form.submit();
                }
            },
             /**
             * 指定的选项被点下
             * @param 
             */
            _clickSelect: function(){
                
                //this._suggestClick("click");
            
            },
            /**
             * 判断p是否在提示层内
             * @param {Array} p [x, y]
             */
            _isInContainer: function(p) {
                var r = $D.getRegion(this.container);
                return p[0] >= r.left && p[0] <= r.right && p[1] >= r.top && p[1] <= r.bottom;
            },

            /**
             * 给容器添加iframe shim层
             * @protected
             */
            _initShim: function() {
                var iframe = doc.createElement("iframe");
                iframe.src = "about:blank";
                iframe.className = SUGGEST_SHIM_CLASS;
                iframe.style.position = "absolute";
                iframe.style.visibility = "hidden";
                iframe.style.border = "none";
				iframe.style.backgroundColor = "transparent";
				$D.setStyle(iframe,'filter','progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)');
                this.container.shim = iframe;

                this._setShimRegion();
                doc.body.insertBefore(iframe, doc.body.firstChild);
            },

            /**
             * 设置shim的left, top, width
             * @protected
             */
            _setShimRegion: function() {
                var container = this.container, shim = container.shim;
                if (shim) {
                    shim.style.left = (parseInt(container.style.left) - 2) + "px"; // 解决吞边线bug
                    shim.style.top = container.style.top;
                    shim.style.width = (parseInt(container.style.width) + 2) + "px";
                }
            },

            /**
             * 初始化样式
             * @protected
             */
            _initStyle: function() {
                var styleEl = $D.get(SUGGEST_ID);
                if (styleEl) return; // 防止多个实例时重复添加

                var style = ".suggest-container{background-color:white;border:1px solid #ccc;z-index:99999;}"
                    + ".suggest-shim{z-index:99998}"
                    + ".suggest-container li{color:#555;font-size:12px;line-height:21px;height:21px;overflow:hidden;vertical-align:middle}"
                    + ".suggest-container li.selected{background-color:#FFEED7;cursor:default}"
                    + ".suggest-key{float:left;text-align:left;padding-left:5px;color:#333;}"
                    + ".suggest-result{float:right;text-align:right;padding-right:5px;color:#c3c3c3}"
                    + ".suggest-container li.selected span{color:#3C3C3C;cursor:default}"
					+ ".suggest-container li .suggest-key{font-weight:bold;}"
					+ ".suggest-container li span b{font-style:normal;font-weight:normal;}"
					+ ".suggest-tips{margin-bottom:2px;clear:both;padding:3px 5px 5px;background-color:#EDECEC;height:12px;overflow:hidden;font:12px/1 Tahoma;}"
					+ ".suggest-tips em {color:#ff0000;}"
                    + ".suggest-bottom{padding:0px 5px 5px;backgrpund-color:#E5E5E5;height:12px;ovrflow:hidden;}"
					+ ".suggest-bottom a:link,.suggest-bottom a:visited{color:#1C60C2; text-decoration:none;}"
					+ ".suggest-bottom a:hover{color:#ff7300;text-decoration:underline;}"
                    + ".suggest-close-btn{float:right;line-height:14px;}"
                    + ".suggest-container li,.suggest-bottom{overflow:hidden;zoom:1;clear:both}"
                    + ".suggest-container{*margin-left:0px;_margin-left:-2px;_margin-top:-3px}"
					+ ".suggest-category{color:#999;padding-left:10px;text-align:right;}";

                styleEl = doc.createElement("style");
                styleEl.id = SUGGEST_ID;
                styleEl.type = "text/css";
                head.appendChild(styleEl); // 先添加到DOM树中，都在cssText里的hack会失效

                if (styleEl.styleSheet) { // IE
                    styleEl.styleSheet.cssText = style;
                } else { // W3C
                    styleEl.appendChild(doc.createTextNode(style));
                }
            },

            /**
             * window.onresize时，调整提示层的位置
             * @protected
             */
            _initResizeEvent: function() {
                var instance = this, resizeTimer;
				var oldHeight = FYD.getClientHeight(),
					oldWidth = FYD.getClientWidth();
				
				$E.removeListener(win,"resize",winResize);

                $E.on(win, "resize",winResize);
				
				function winResize(){
					 if (resizeTimer) {
                        clearTimeout(resizeTimer);
                    }
                    resizeTimer = setTimeout(function() {
						//if (typeof instance.textInput == 'undefined') return;
						var newHeight,
							newWidth;
						newHeight = FYD.getClientHeight();
						newWidth = FYD.getClientWidth();
						if (newHeight == oldHeight && newWidth == oldWidth) return;
						
                        instance._setContainerRegion();
                        instance._setShimRegion();
						
						oldHeight = newHeight
						oldWidth = newWidth;
                    }, 50);
				}
            },

            /**
             * 启动计时器，开始监听用户输入
             */
            start: function() {
                FD.widget.Suggest.focusInstance = this;

                var instance = this;
                instance._timer = setTimeout(function() {
                    instance.updateContent();
                    instance._timer = setTimeout(arguments.callee, instance.config.timerDelay);
                }, instance.config.timerDelay);

                this._isRunning = true;
            },

            /**
             * 停止计时器
             */
            stop: function() {
                FD.widget.Suggest.focusInstance = null;
                clearTimeout(this._timer);
                this._isRunning = false;
            },

            /**
             * 显示提示层
             */
            show: function() {
                var instance = this,
					container = this.container, 
					shim = container.shim,
					n=this.config.showNum,
					li=FYS('li',container),
					h=21,
					ol=FYS('ol',container,true);

				if(n && n<li.length){//超过设定的条数时显示滚动条
				
					//h=h.replace('px','');
					ol.style.height = parseInt(h*n) + 'px';
					ol.style.overflow = 'auto';
				}
				
                if (this.isVisible()) return;

                container.style.visibility = "";
				ol.scrollTop = 0;
				this._index = -1;
				
                if (shim) {
                    if (!shim.style.height) { // 第一次显示时，需要设定高度
                        var r = $D.getRegion(container);
						/*解决IE6下的bug*/
                        shim.style.height ="210px";// (r.bottom - r.top - 2) + "px";
                    }
                    shim.style.visibility = "";
                }
				
				//利用body点击事件，关闭提示框

				$E.on(doc,'click',onClickHandler);
				
				function onClickHandler(){
					instance.hide();
					$E.removeListener(doc,'click',onClickHandler);
				}
            },

            /**
             * 隐藏提示层
             */
            hide: function() {
                if (!this.isVisible()) return;
                var container = this.container, shim = container.shim;
				
                if (shim) {
					shim.style.visibility = "hidden";
					//shim.parentNode.removeChild(shim);
				}
                container.style.visibility = "hidden";
				//container.parentNode.removeChild(container)
				
            },

            /**
             * 提示层是否显示
             */
            isVisible: function() {
                return this.container.style.visibility != "hidden";
            },

            /**
             * 更新提示层的数据
             */
            updateContent: function() {
				
                if (!this._needUpdate()){ 
					this._displayContainer();
					return;
				}

                this._updateQueryValueFromInput();
                var q = this.query;
				this._index = -1;

                // 1. 输入为空时，隐藏提示层
                if (!$L.trim(q).length) {
                    this._fillContainer("");
                    this.hide();
                    return;
                }

                if (typeof this._dataCache[q] != "undefined") { // 2. 使用缓存数据
                
                    this.returnedData = "using cache";
                    this._fillContainer(this._dataCache[q]);
                    this._displayContainer();
					/*suggest展开打点*/
					this._suggestClick("show");
					
                } else { // 4. 请求服务器数据
                    this.requestData();
                }
								
				
            },

            /**
             * 是否需要更新数据
             * @protected
             * @return Boolean
             */
            _needUpdate: function() {
                // 注意：加入空格也算有变化
                return this.textInput.value != this.query;
            },

            /**
             * 通过script元素加载数据
             */
            requestData: function() {
				if (!this.config.myParam || this.config.myParam == ''){
					this.queryParams = "type=saleoffer&q=" + this.query;
				}
				else{
					this.queryParams = this.config.myParam+"&q="+this.query;
				}
                this.fireEvent(EVENT_BEFORE_DATA_REQUEST, this.query);
				this.dataScript={};
                this.dataScript.src = this.dataSource + "?" + this.queryParams;
				var that = this;
				$Y.util.Get.script(this.dataScript.src,{
					onSuccess:that.onSuccess,
					onFailure:that.onFailure,
					timeout:5000,
					scope:that,
					charset:'GB2312'
				});
            },
			/**
			 * 接口请求成功的处理方法
			 * @param {Object} o 回到参数
			 */
			onSuccess:function(o){
				this.handleResponse(o);
			},
			/**
			 * 接口请求失败的处理方法
			 * @param {Object} o 回到参数
			 */
			onFailure:function(o){
				//do nothing
			},
            /**
             * 处理获取的数据
             * @param {Object} data
             */
            handleResponse: function(o) {
				try{
	                var content = "",
						list = doc.createElement("ol"),
						len = 0,
						categoryData = '';
						
					if (this._scriptDataIsOut) return; // 抛弃过期数据，否则会导致bug：1. 缓存key值不对； 2. 过期数据导致的闪屏
					this.returnedData = eval(this.config.varName);
					this.summary = this.returnedData.summary?this.returnedData.summary:'';
					this.keywords = null;
					if (this.summary&&this.returnedData.result.length>0) {
						this.keywords = this.returnedData.result[0][0].substr(this.returnedData.result[0][0].indexOf('_')+1,this.summary.length);
					}
					categoryData = this.returnedData.category||'';//类目数据

					// 格式化数据
					this.returnedData = this.formatData(this.returnedData);
					this.fireEvent(EVENT_ON_DATA_RETURN, this.returnedData);
 					len = this.returnedData.length;
                   
					
                    //初始化打点序号
                    this.suggestTracelogIndex=0;
	                // 填充数据
					if (categoryData && categoryData.length>0 && FYG('search_category')){
						for (var i=0 ; i<categoryData.length; i++){
							var cateLi = this.formatCategoryData(categoryData[i]);
							list.appendChild(cateLi);
						}
					}
	                if (len > 0) {
	                    for (var i = 0; i < len; ++i) {
	                        var itemData = this.returnedData[i];
	                        var li = this.formatItem(itemData["key"], itemData["result"]);
	                        // 缓存key值到attribute上
	                        li.setAttribute("key", YAHOO.lang.trim(itemData["key2"]));
							li.setAttribute('title',YAHOO.lang.trim(itemData["key2"]))
	                        li.setAttribute("index", i+1);
	                        list.appendChild(li);
	                    }
	                    content = list;

	                }else{
						this.hide();
						this._fillContainer('');
						return;
					}
	                this._fillContainer(content);
					//this.appendTis(this.summary,this.keywords);
	                // 有内容时才添加底部
	                if (len > 0) this.appendBottom();
	
	                // fire event
	                if ($L.trim(this.container.innerHTML)) {
	                    // 实际上是beforeCache，但从用户的角度看，是beforeShow
	                    this.fireEvent(EVENT_BEFORE_SHOW, this.container);
	                }
	
	                // cache
	                this._dataCache[this.query] = this.container.innerHTML;
	
	                // 显示容器
	                this._displayContainer();
					/*suggest展开打点*/
					this._suggestClick("show");
				
				}catch(e){
					this.onFailure(o);
				}
            },
			/**
             * 格式化Category数据
             * @param {object} data Category数据
             * @return {HTMLElement}
             */
			formatCategoryData:function(_data){
				var _html = '',
					li = doc.createElement("li");
					keySpan = null,
					categorySpan = null,
					val = this.textInput.value;
				
				li.setAttribute('categoryId',_data.id);
				li.setAttribute('key',_data.query);
				li.setAttribute("index", 1);
				
				keySpan = doc.createElement("span");
				keySpan.className = SUGGEST_KEY_CLASS;
				
				
				_data.query = _data.query.replace(val,"<b>"+val+"</b>")
				keySpan.innerHTML = _data.query;
				
				li.appendChild(keySpan);
				
				categorySpan = doc.createElement("span");
				categorySpan.className = 'suggest-category';
				categorySpan.innerHTML = '在<strong>'+ _data.name +'</strong>分类下搜索'
				
				li.appendChild(categorySpan);

				return li;
			},

            /**
             * 格式化输入的数据对象为标准格式
             * @param {Object} data 格式可以有3种：
             *  1. {"result" : [["key1", "result1"], ["key2", "result2"], ...]}
             *  2. {"result" : ["key1", "key2", ...]}
             *  3. 1和2的组合
             *  4. 标准格式
             *  5. 上面1-4中，直接取o["result"]的值
             * @return Object 标准格式的数据：
             *  [{"key" : "key1", "result" : "result1"}, {"key" : "key2", "result" : "result2"}, ...]
             */
            formatData: function(data) {
                var arr = [];
                if (!data) return arr;
                if ($L.isArray(data["result"])) data = data["result"];
                var len = data.length;
                if (!len) return arr;
                var item;
				var itemTemp;
				var title;
				var tlen = this.config.titleLength,val=this.textInput.value;
                for (var i = 0; i < len; ++i) {
                    item = data[i];
					if ($L.isArray(item)) { 
						itemTemp = item[0].replace('_',"");
						itemTemp = itemTemp.replace('%','');
						
						//字符截取
						var l= itemTemp.lenB();
						title = (tlen && l > tlen)?itemTemp.cut(tlen) + "…":itemTemp;
						title = title.replace(val,"<b>"+val+"</b>")
						//item[0] = item[0].replace('%','</b>');
                        arr[i] = {"key" : title, "result" : item[1],'key2':itemTemp};
                    }
                }
                return arr;
            },

            /**
             * 格式化输出项
             * @param {String} key 查询字符串
             * @param {Number} result 结果 可不设
             * @return {HTMLElement}
             */
            formatItem: function(key, result) {
                var li = doc.createElement("li");
                var keyEl = doc.createElement("span");
                keyEl.className = SUGGEST_KEY_CLASS;
				keyEl.innerHTML = key;
                li.appendChild(keyEl);

                if (typeof result != "undefined") { // 可以没有
                    var resultText = this.config.resultFormat.replace("%result%", result);
                    if ($L.trim(resultText)) { // 有值时才创建
                        var resultEl = doc.createElement("span");
                        resultEl.className = SUGGEST_RESULT_CLASS;
                        resultEl.appendChild(doc.createTextNode(resultText));
                        li.appendChild(resultEl);
                    }
                }

                return li;
            },
			appendTis:function(summary,keywords){
				if(!summary)return;
				if(this.config.showTis&&summary.length>=2){
					var tips = doc.createElement("div");
					tips.className = SUGGEST_TIPS_CLASS;
					tips.innerHTML = '<p>输入"</span><em>'+summary+'</em>"也能在提示框找到"<em>'+keywords+'</em>"</p>';
					this.container.appendChild(tips);
				}
			},
            /**
             * 添加提示层底部
             */
            appendBottom: function() {
                var bottom = doc.createElement("div");
                bottom.className = SUGGEST_BOTTOM_CLASS;
                if (this.config.showCloseBtn) {
                    var closeBtn = doc.createElement("a");
                    closeBtn.href = "javascript: void(0)";
                    closeBtn.setAttribute("target", "_self"); // bug fix: 覆盖<base target="_blank" />，否则会弹出空白页面
                    closeBtn.className = SUGGEST_CLOSE_BTN_CLASS;
                    closeBtn.appendChild(doc.createTextNode(this.config.closeBtnText));
                    bottom.appendChild(closeBtn);
					this.container.appendChild(bottom);
                }
            },

            /**
             * 填充提示层
             * @protected
             * @param {String|HTMLElement} content innerHTML or Child Node
             */
            _fillContainer: function(content) {
                if (content.nodeType == 1) {
                    this.container.innerHTML = "";
                    this.container.appendChild(content);
                } else {
                    this.container.innerHTML = content;
                }

                // 一旦重新填充了，selectedItem就没了，需要重置
                this.selectedItem = null;
            },

            /**
             * 根据contanier的内容，显示或隐藏容器
             */
            _displayContainer: function() {
                if ($L.trim(this.container.innerHTML)) {
                    this.show();
                } else {
                    this.hide();
                }
            },

            /**
             * 选中提示层中的上/下一个条
             * @param {Boolean} down true表示down，false表示up
             */
            selectItem: function(down) {
                //console.log("select item " + down);
                var items = this.container.getElementsByTagName("li");
                if (items.length == 0) return;

                // 有可能用ESC隐藏了，直接显示即可
                if (!this.isVisible()) {
                    this.show();
                    return; // 保留原来的选中状态
                }
                var newSelectedItem,
					ol=$$('ol',this.container,true),
					showNum=this.config.showNum;
					//index=SUGGEST_ITEM_INDEX;

                // 没有选中项时，选中第一/最后项
                if (!this.selectedItem) {
                    //newSelectedItem = items[down ? 0 : items.length - 1];
                } 
			   //else {
                    // 选中下/上一项
					if(down){//向下选择
						//console.log(this._index)
						//alert('down'+this._index )
						this._index += 1;
						if (this._index >= items.length ) {
							if (showNum) ol.scrollTop = 0;
							this._index = 0;
						}
						
						newSelectedItem = items[this._index];
						
						//如果
						if(showNum && this._index > showNum-1) ol.scrollTop+=21;
						//console.log(this._index)
						
					}else{//向上选择
						//console.log(this._index)
						//alert('up'+this._index )
						this._index -= 1;
						if (this._index < 0) {
							this._index = items.length-1;
							if ( showNum && items.length > showNum) ol.scrollTop = (items.length - showNum)*21;
						}
						
						newSelectedItem = items[this._index];
						
						//如果
						if(showNum && this._index < (items.length - showNum)) ol.scrollTop-=21;
						//console.log(this._index)
					}
                    //newSelectedItem = $D[down ? "getNextSibling" : "getPreviousSibling"](this.selectedItem);
                    // 已经到了最后/前一项时，归位到输入框，并还原输入值
                   // if (!newSelectedItem) {
                        //this.textInput.value = this.query;
                   // }
                //}

                // 移除当前选中项
                this._removeSelectedItem();

                // 选中新项
                if (newSelectedItem) {
                    this._setSelectedItem(newSelectedItem);
                    this._updateInputFromSelectItem(newSelectedItem);
                }
            },

            /**
             * 移除选中项
             * @protected
             */
            _removeSelectedItem: function() {
                $D.removeClass(this.selectedItem, SUGGEST_SELECTED_ITEM_CLASS);
                this.selectedItem = null;
            },

            /**
             * 设置当前选中项
             * @protected
             * @param {HTMLElement} item
             */
            _setSelectedItem: function(item) {
                $D.addClass((item), SUGGEST_SELECTED_ITEM_CLASS);
                this.selectedItem = (item);
				
            },

            /**
             * 获取提示层中选中项的key字符串
             * @protected
             */
            _getSelectedItemKey: function() {
                if (!this.selectedItem) return "";
                return this.selectedItem.getAttribute("key");
            },

			/**
             * 获取提示层中选中项的CategoryId
             * @protected
             */
            _getSelectedItemCategoryId: function() {
                if (!this.selectedItem) return "";
                return this.selectedItem.getAttribute("categoryId")||'';
            },

            /**
             * 将textInput的值更新到this.query
             * @protected
             */
            _updateQueryValueFromInput: function() {
                this.query = this.textInput.value;
            },

            /**
             * 将选中项的值更新到textInput
             * @protected
             */
            _updateInputFromSelectItem: function(target) {
                this.textInput.value = this._getSelectedItemKey(this.selectedItem);
                this.suggestTracelogIndex=target.getAttribute('index');
                this.suggestTracelogRecommendedword=this._getSelectedItemKey(this.selectedItem);
				this.suggestTracelogCategory=this._getSelectedItemCategoryId(this.selectedItem);
				
            },
			/**
			 * 统一都打点到搜索的打点服务器上
			 * @param {Object} o 不care
			 * @param {String} param
			 */
			aliclick:function(o,param){
				if(typeof window.dmtrack!="undefined"){
					dmtrack.clickstat("http://stat.1688.com/search/queryreport.html",param);
				}else{
					d = new Date();
				    if (document.images)
				        (new Image()).src = "http://stat.1688.com/search/queryreport.html" + param + "&time=" + d.getTime();
				}
			    return true;
			},
			/*曝光打点*/
			 exposureClick:function(sectionexp){
				if(typeof window.dmtrack!="undefined"){
					dmtrack.clickstat("http://stat.1688.com/sectionexp.html",('?sectionexp='+sectionexp));
				}else{
					(new Image).src="http://stat.1688.com/sectionexp.html?sectionexp="+sectionexp+"&time="+(+new Date);
				}
			},
			/**
			 * suggest统一打点封装
			 * @param {String} clickType 
			 */
			_suggestClick:function(clickType){
				var tempTraceLog = "?searchtrace=";
				switch(clickType){
					case 'show'://曝光打点
                        //tempTraceLog+=this.config.suggestTracelogShow;
						
						var categoryTracelog = '';
						var categories = $$("li[categoryId]", this.container);
						for(var i=0; i<categories.length; i++){
							categoryTracelog += ('_' + categories[i].getAttribute("categoryId"));
						}
						
						return this.exposureClick(this.config.suggestTracelogShow+'_'+encodeURIComponent(this.query)+categoryTracelog);
                    break;
                    case 'click':
                        tempTraceLog+=this.config.suggestTracelogType
                            +'_suggest_'
                            +encodeURIComponent(this.suggestTracelogKeyword)
                            +'_'
                            +encodeURIComponent(this.suggestTracelogRecommendedword)
                            +'_'
                            +this.suggestTracelogIndex
							+(this.suggestTracelogCategory ? ('_'+this.suggestTracelogCategory ):'');
                    break;
					case 'submit':
                        if(this.suggestTracelogIndex>0){
                            this._suggestClick('click');
                        }
                        tempTraceLog+=this.config.suggestTracelogSubmit;
                    break;
					default:break;
				}
				this.aliclick(this,tempTraceLog);
			}

        });
        $L.augmentObject(FD.widget.Suggest.prototype, YAHOO.util.EventProvider.prototype);
})();
