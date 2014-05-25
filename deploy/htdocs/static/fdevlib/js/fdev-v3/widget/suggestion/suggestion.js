/**
 * �ؼ�����������
 * @update xiaodong.li 2011.11.17 ������category���Ƽ���Ϣ��չ
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
        SUGGEST_ID = "suggest-style", // ��ʽ style Ԫ�ص� id
        SUGGEST_CONTAINER_CLASS = "suggest-container",
        SUGGEST_KEY_CLASS = "suggest-key", // ��ʾ���У�key Ԫ�ص� class
        SUGGEST_RESULT_CLASS = "suggest-result", // ��ʾ���У�result Ԫ�ص� class
        SUGGEST_SELECTED_ITEM_CLASS = "selected", // ��ʾ���У�ѡ����� class
        SUGGEST_TIPS_CLASS = 'suggest-tips',
        SUGGEST_BOTTOM_CLASS = "suggest-bottom",
        SUGGEST_CLOSE_BTN_CLASS = "suggest-close-btn",
        SUGGEST_SHIM_CLASS = "suggest-shim", // iframe shim �� class
		//SUGGEST_ITEM_INDEX =-1,

        EVENT_BEFORE_DATA_REQUEST = "beforeDataRequest",
        EVENT_ON_DATA_RETURN = "onDataReturn",
        EVENT_BEFORE_SHOW = "beforeShow",
        EVENT_ON_ITEM_SELECT = "onItemSelect",
		
		
		defaultConfig={
			/**
             * �û����Ӹ�������ʾ��� class
             *
             * ��ʾ���Ĭ�Ͻṹ���£�
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
			 * �Զ������
			 */
			myParam:'',
			
            /**
             * ��ʾ��Ŀ��
             * ע�⣺Ĭ������£���ʾ��Ŀ�Ⱥ�input�����Ŀ�ȱ���һ��
             * ʾ��ȡֵ��"200px", "10%"�ȣ��������λ
             * @type String
             */
            containerWidth: "auto",

            /**
             * result�ĸ�ʽ
             * @type String
             */
            resultFormat: "Լ%result%�����",
			
			/*��ʾ����*/
			showTis:true,
			
            /**
             * �Ƿ���ʾ�رհ�ť
             * @type Boolean
             */
            showCloseBtn: false,

            /**
             * �رհ�ť�ϵ�����
             * @type String
             */
            closeBtnText: "�ر�",

            /**
             * �Ƿ���Ҫiframe shim
             * @type Boolean
             */
            useShim: ie6,

            /**
             * ��ʱ������ʱ
             * @type Number
             */
            timerDelay: 200,

            /**
             * ��ʼ�����Զ�����
             * @type Boolean
             */
            autoFocus: false,

            /**
             * ��������ѡ��ʱ���Ƿ��Զ��ύ��
             * @type Boolean
             */
            submitFormOnClickSelect: false,
			/**
			 * ��Žӿ����ݵı�������
			 */
			varName:'_suggest_result_',
			/**
			 * suggest��leftƫ��������
			 */
			leftOffset:0,
			/**
			 * suggest��topƫ��������
			 */
			topOffset:0,
			/**
			 * ������Ŀ����ʾ������,Ĭ��Ϊ0����ʾ��������
			 */
			showNum:0,
			/**
			 * title������ȡ
			 */
			titleLength:0,
			/**
			 * �Զ������¼�
			 */
			customClick:null,
			/**
			 * suggestչ�����
			 */
			suggestTracelogShow:'',
			/**
			 * ѡ��suggest���Ƽ��ʴ��
			 */
			suggestTracelogSubmit:'',
            /**
			 * ѡ��suggest���Ƽ��ʲ��ҵ��´��
			 */
			suggestTracelogClick:'',
             /**
			 * suggest�Ĵ�����ͣ���Ӧ����Ʒ����˾����ѯ��
			 */
			suggestTracelogType:'',
            /**
			 * suggest�Ĵ�����
			 */
			suggestTracelogIndex:0
            
		};
	FD.widget.Suggest=function(q,dataSource,config){
		var that = this;
		if(!(this instanceof arguments.callee)){
			return new arguments.callee(q, dataSource, config);
		}
		/**
         * �ı������
         * @type HTMLElement
         */
        this.textInput = $D.get(q);
		/**
         * ��ȡ���ݵ�URL �� JSON��ʽ�ľ�̬����
         * @type {String|Object}
         */
        this.dataSource = dataSource||DEFAULT_DATA_SOURCE;

        /**
         * ͨ��jsonp���ص�����
         * @type Object
         */
        this.returnedData = null;

        /**
         * ���ò���
         * @type Object
         */
        this.config = $L.merge(defaultConfig, config || {});

        /**
         * �����ʾ��Ϣ������
         * @type HTMLElement
         */
        this.container = null;

        /**
         * ������ֵ
         * @type String
         */
        this.query = "";

        /**
         * ��ȡ����ʱ�Ĳ���
         * @type String
         */
        this.queryParams = "";

        /**
         * �ڲ���ʱ��
         * @private
         * @type Object
         */
        this._timer = null;

        /**
         * ��ʱ���Ƿ�������״̬
         * @private
         * @type Boolean
         */
        this._isRunning = false;

        /**
         * ��ȡ���ݵ�scriptԪ��
         * @type HTMLElement
         */
        this.dataScript = null;

        /**
         * ���ݻ���
         * @private
         * @type Object
         */
        this._dataCache = {};

        /**
         * ����script��ʱ���
         * @type String
         */
        this._latestScriptTime = "";

        /**
         * script���ص������Ƿ��Ѿ�����
         * @type Boolean
         */
        this._scriptDataIsOut = false;

        /**
         * �Ƿ��ڼ���ѡ��״̬
         * @private
         * @type Boolean
         */
        this._onKeyboardSelecting = false;

        /**
         * ��ʾ��ĵ�ǰѡ����
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
             * ��ʼ������
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
             * ��ʼ�������
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
				//focus ��ȡ���������ʾ���ı�������
				$E.on(this.textInput,'focus',function(){
					instance._setContainerRegion();
                    instance._setShimRegion();
					var items = instance.container.getElementsByTagName("li");
					if (items.length == 0) return;
					//if (!instance.isVisible()) {
						//instance.show();
						//return; // ����ԭ����ѡ��״̬
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
                // ע������Ŀǰ����Opera9.64�У����뷨����ʱ�����ɲ��ᴥ���κμ����¼�
                var pressingCount = 0; // ������סĳ��ʱ������������keydown������ע��Operaֻ�ᴥ��һ�Ρ�
                $E.on(this.textInput, "keydown", function(ev) {
                    var keyCode = ev.keyCode;
                    //console.log("keydown " + keyCode);

                    switch (keyCode) {
                        case 27: // ESC����������ʾ�㲢��ԭ��ʼ����
                            instance.hide();
                            instance.textInput.value = instance.query;
                            break;
                        case 13: // ENTER��

                            // ����Ǽ���ѡ��ĳ���س�������onItemSelect�¼�
                            if (instance._onKeyboardSelecting) {
                                if (instance.textInput.value == instance._getSelectedItemKey()) { // ȷ��ֵƥ��
                                    instance.fireEvent(EVENT_ON_ITEM_SELECT, instance.textInput.value);
                                }
                            }
							instance.textInput.blur();
                            instance.hide();
							
							//�Զ������¼�
							if (instance.config.customClick) instance.config.customClick();
                            // �ύ��
                            instance._submitForm();
							return

                            break;
                        case 40: // DOWN��
                        case 38: // UP��
                            // ��ס������ʱ����ʱ����
                            if (pressingCount++ == 0) {
                                if (instance._isRunning) instance.stop();
                                instance._onKeyboardSelecting = true;
                                instance.selectItem(keyCode == 40);

                            } else if (pressingCount == 3) {
                                pressingCount = 0;
                            }
                            break;
                    }

                    // �� DOWN/UP ��ʱ��������ʱ��
                    if (keyCode != 40 && keyCode != 38) {
                        if (!instance._isRunning) {
                            // 1. �����ٽ�����js��δ������ʱ���û����ܾ��Ѿ���ʼ����
                            //    ��ʱ��focus�¼��Ѿ����ᴥ������Ҫ��keyup�ﴥ����ʱ��
                            // 2. ��DOWN/UP��ʱ����Ҫ���ʱ��
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
             * ��ʼ����ʾ������
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
             * ����������left, top, width
             * @protected
             */
            _setContainerRegion: function() {
				that=this;
                var r = $D.getRegion(this.textInput);
                var left = r.left, w = r.right - left - 2;  // ��ȥborder��2px

                // bug fix: w Ӧ���ж����Ƿ���� 0, ������� width ��ʱ�����С�� 0, ie �»ᱨ������Ч�Ĵ���
                w = w > 0 ? w : 0;

                // ie8����ģʽ
                // document.documentMode:
                // 5 - Quirks Mode
                // 7 - IE7 Standards
                // 8 - IE8 Standards
                /* var docMode = doc.documentMode;
                if (docMode === 7 && (ie === 7 || ie === 8)) {
                   left -= 2;
                } else if (YAHOO.env.ua.gecko) { // firefox����ƫһ���� ע���� input ���ڵĸ��������� margin: auto ʱ�����
                    left++;
                } */
				if (ie && ie<8){//���ie6,ie7�� ����2px��bug
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
             * ��ʼ�������¼�
             * ��Ԫ�ض����������¼���ð�ݵ�����ͳһ����
             * @protected
             */
            _initContainerEvent: function() {
                var instance = this;

                // ����¼�
                $E.on(this.container, "mousemove", function(ev) {
                    //console.log("mouse move");
                    var target = $E.getTarget(ev);   
                    if (target.nodeName != "LI") {
                        target = $D.getAncestorByTagName(target, "li");
                    }
                    if ($D.isAncestor(instance.container, target)) {
                        if (target != instance.selectedItem) {
                            // �Ƴ��ϵ�
                            instance._removeSelectedItem();
                            // �����µ�
                            instance._setSelectedItem(target);
							instance._index = parseInt($D.getAttribute(target,'index')-1);
							//console.log(instance._index)
                        }
                    }
                });

                var mouseDownItem = null;
                this.container.onmousedown = function(e) {
                    e = e || win.event;
                    // ��갴�´���item
                    mouseDownItem = e.target || e.srcElement;
					
					//ȡ���¼�ð��
					e.cancelBubble = true;

                    // ��갴��ʱ��������򲻻�ʧȥ����
                    // 1. for IE
                    instance.textInput.onbeforedeactivate = function() {
                        //win.event.returnValue = false;
                        instance.textInput.onbeforedeactivate = null;
                    };
                    // 2. for W3C
                    //return false;
                };

                // mouseup�¼�
                $E.on(this.container, "mouseup", function(ev) {
                    // ��mousedown����ʾ�㣬��mouseup����ʾ����ʱ�������Ч
                    if (!instance._isInContainer($E.getXY(ev))) return;
                    var target = $E.getTarget(ev);
                    // ����ʾ��A�������꣬�ƶ���B���ͷţ�������onItemSelect
                    if (target != mouseDownItem) return;

                    // ����ڹرհ�ť��
                    if (target.className == SUGGEST_CLOSE_BTN_CLASS) {
                        instance.hide();
                        return;
                    }

                    // ���ܵ����li����Ԫ����
                    if (target.nodeName != "LI") {
                        target = $D.getAncestorByTagName(target, "li");
                    }
                    // ��������container�ڲ���li��
                    if ($D.isAncestor(instance.container, target)) {
                        
                        instance._updateInputFromSelectItem(target);

                        // ����ѡ���¼�
                        instance.fireEvent(EVENT_ON_ITEM_SELECT, instance.textInput.value);

                        
                        instance.textInput.blur();

                        instance.hide();
                        instance._clickSelect();

						if (instance.config.customClick) instance.config.customClick();
                        // �ύ��
                        instance._submitForm();
						return
						
                    }
                });
            },

            /**
             * clickѡ�� or enter���ύ��
             */
            _submitForm: function() {
                // ע�����ڼ��̿���enterѡ����������html��������Ƿ��ύ������ᵼ��ĳЩ���뷨�£���enterѡ��Ӣ��ʱҲ�����ύ
                if (this.config.submitFormOnClickSelect) {
                    var form = this.textInput.form;
                    if (!form) return;
					
					//categoryId��ֵ
					FYG('search_category') && (FYG('search_category').value = this._getSelectedItemCategoryId());

                    // ͨ��js�ύ��ʱ�����ᴥ��onsubmit�¼�
                    // ��Ҫjs�Լ�����
                    if (doc.createEvent) { // w3c
                        var evObj = doc.createEvent("MouseEvents");
                        evObj.initEvent("submit", true, false);
                        form.dispatchEvent(evObj);
                    }
                    else if (doc.createEventObject) { // ie
                        form.fireEvent("onsubmit");
                    }
					//ѡ��suggest���ύ
					/*suggestչ�����*/
					this._suggestClick("submit");
                    form.submit();
                }
            },
             /**
             * ָ����ѡ�����
             * @param 
             */
            _clickSelect: function(){
                
                //this._suggestClick("click");
            
            },
            /**
             * �ж�p�Ƿ�����ʾ����
             * @param {Array} p [x, y]
             */
            _isInContainer: function(p) {
                var r = $D.getRegion(this.container);
                return p[0] >= r.left && p[0] <= r.right && p[1] >= r.top && p[1] <= r.bottom;
            },

            /**
             * ���������iframe shim��
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
             * ����shim��left, top, width
             * @protected
             */
            _setShimRegion: function() {
                var container = this.container, shim = container.shim;
                if (shim) {
                    shim.style.left = (parseInt(container.style.left) - 2) + "px"; // ����̱���bug
                    shim.style.top = container.style.top;
                    shim.style.width = (parseInt(container.style.width) + 2) + "px";
                }
            },

            /**
             * ��ʼ����ʽ
             * @protected
             */
            _initStyle: function() {
                var styleEl = $D.get(SUGGEST_ID);
                if (styleEl) return; // ��ֹ���ʵ��ʱ�ظ����

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
                head.appendChild(styleEl); // ����ӵ�DOM���У�����cssText���hack��ʧЧ

                if (styleEl.styleSheet) { // IE
                    styleEl.styleSheet.cssText = style;
                } else { // W3C
                    styleEl.appendChild(doc.createTextNode(style));
                }
            },

            /**
             * window.onresizeʱ��������ʾ���λ��
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
             * ������ʱ������ʼ�����û�����
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
             * ֹͣ��ʱ��
             */
            stop: function() {
                FD.widget.Suggest.focusInstance = null;
                clearTimeout(this._timer);
                this._isRunning = false;
            },

            /**
             * ��ʾ��ʾ��
             */
            show: function() {
                var instance = this,
					container = this.container, 
					shim = container.shim,
					n=this.config.showNum,
					li=FYS('li',container),
					h=21,
					ol=FYS('ol',container,true);

				if(n && n<li.length){//�����趨������ʱ��ʾ������
				
					//h=h.replace('px','');
					ol.style.height = parseInt(h*n) + 'px';
					ol.style.overflow = 'auto';
				}
				
                if (this.isVisible()) return;

                container.style.visibility = "";
				ol.scrollTop = 0;
				this._index = -1;
				
                if (shim) {
                    if (!shim.style.height) { // ��һ����ʾʱ����Ҫ�趨�߶�
                        var r = $D.getRegion(container);
						/*���IE6�µ�bug*/
                        shim.style.height ="210px";// (r.bottom - r.top - 2) + "px";
                    }
                    shim.style.visibility = "";
                }
				
				//����body����¼����ر���ʾ��

				$E.on(doc,'click',onClickHandler);
				
				function onClickHandler(){
					instance.hide();
					$E.removeListener(doc,'click',onClickHandler);
				}
            },

            /**
             * ������ʾ��
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
             * ��ʾ���Ƿ���ʾ
             */
            isVisible: function() {
                return this.container.style.visibility != "hidden";
            },

            /**
             * ������ʾ�������
             */
            updateContent: function() {
				
                if (!this._needUpdate()){ 
					this._displayContainer();
					return;
				}

                this._updateQueryValueFromInput();
                var q = this.query;
				this._index = -1;

                // 1. ����Ϊ��ʱ��������ʾ��
                if (!$L.trim(q).length) {
                    this._fillContainer("");
                    this.hide();
                    return;
                }

                if (typeof this._dataCache[q] != "undefined") { // 2. ʹ�û�������
                
                    this.returnedData = "using cache";
                    this._fillContainer(this._dataCache[q]);
                    this._displayContainer();
					/*suggestչ�����*/
					this._suggestClick("show");
					
                } else { // 4. �������������
                    this.requestData();
                }
								
				
            },

            /**
             * �Ƿ���Ҫ��������
             * @protected
             * @return Boolean
             */
            _needUpdate: function() {
                // ע�⣺����ո�Ҳ���б仯
                return this.textInput.value != this.query;
            },

            /**
             * ͨ��scriptԪ�ؼ�������
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
			 * �ӿ�����ɹ��Ĵ�����
			 * @param {Object} o �ص�����
			 */
			onSuccess:function(o){
				this.handleResponse(o);
			},
			/**
			 * �ӿ�����ʧ�ܵĴ�����
			 * @param {Object} o �ص�����
			 */
			onFailure:function(o){
				//do nothing
			},
            /**
             * �����ȡ������
             * @param {Object} data
             */
            handleResponse: function(o) {
				try{
	                var content = "",
						list = doc.createElement("ol"),
						len = 0,
						categoryData = '';
						
					if (this._scriptDataIsOut) return; // �����������ݣ�����ᵼ��bug��1. ����keyֵ���ԣ� 2. �������ݵ��µ�����
					this.returnedData = eval(this.config.varName);
					this.summary = this.returnedData.summary?this.returnedData.summary:'';
					this.keywords = null;
					if (this.summary&&this.returnedData.result.length>0) {
						this.keywords = this.returnedData.result[0][0].substr(this.returnedData.result[0][0].indexOf('_')+1,this.summary.length);
					}
					categoryData = this.returnedData.category||'';//��Ŀ����

					// ��ʽ������
					this.returnedData = this.formatData(this.returnedData);
					this.fireEvent(EVENT_ON_DATA_RETURN, this.returnedData);
 					len = this.returnedData.length;
                   
					
                    //��ʼ��������
                    this.suggestTracelogIndex=0;
	                // �������
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
	                        // ����keyֵ��attribute��
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
	                // ������ʱ����ӵײ�
	                if (len > 0) this.appendBottom();
	
	                // fire event
	                if ($L.trim(this.container.innerHTML)) {
	                    // ʵ������beforeCache�������û��ĽǶȿ�����beforeShow
	                    this.fireEvent(EVENT_BEFORE_SHOW, this.container);
	                }
	
	                // cache
	                this._dataCache[this.query] = this.container.innerHTML;
	
	                // ��ʾ����
	                this._displayContainer();
					/*suggestչ�����*/
					this._suggestClick("show");
				
				}catch(e){
					this.onFailure(o);
				}
            },
			/**
             * ��ʽ��Category����
             * @param {object} data Category����
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
				categorySpan.innerHTML = '��<strong>'+ _data.name +'</strong>����������'
				
				li.appendChild(categorySpan);

				return li;
			},

            /**
             * ��ʽ����������ݶ���Ϊ��׼��ʽ
             * @param {Object} data ��ʽ������3�֣�
             *  1. {"result" : [["key1", "result1"], ["key2", "result2"], ...]}
             *  2. {"result" : ["key1", "key2", ...]}
             *  3. 1��2�����
             *  4. ��׼��ʽ
             *  5. ����1-4�У�ֱ��ȡo["result"]��ֵ
             * @return Object ��׼��ʽ�����ݣ�
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
						
						//�ַ���ȡ
						var l= itemTemp.lenB();
						title = (tlen && l > tlen)?itemTemp.cut(tlen) + "��":itemTemp;
						title = title.replace(val,"<b>"+val+"</b>")
						//item[0] = item[0].replace('%','</b>');
                        arr[i] = {"key" : title, "result" : item[1],'key2':itemTemp};
                    }
                }
                return arr;
            },

            /**
             * ��ʽ�������
             * @param {String} key ��ѯ�ַ���
             * @param {Number} result ��� �ɲ���
             * @return {HTMLElement}
             */
            formatItem: function(key, result) {
                var li = doc.createElement("li");
                var keyEl = doc.createElement("span");
                keyEl.className = SUGGEST_KEY_CLASS;
				keyEl.innerHTML = key;
                li.appendChild(keyEl);

                if (typeof result != "undefined") { // ����û��
                    var resultText = this.config.resultFormat.replace("%result%", result);
                    if ($L.trim(resultText)) { // ��ֵʱ�Ŵ���
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
					tips.innerHTML = '<p>����"</span><em>'+summary+'</em>"Ҳ������ʾ���ҵ�"<em>'+keywords+'</em>"</p>';
					this.container.appendChild(tips);
				}
			},
            /**
             * �����ʾ��ײ�
             */
            appendBottom: function() {
                var bottom = doc.createElement("div");
                bottom.className = SUGGEST_BOTTOM_CLASS;
                if (this.config.showCloseBtn) {
                    var closeBtn = doc.createElement("a");
                    closeBtn.href = "javascript: void(0)";
                    closeBtn.setAttribute("target", "_self"); // bug fix: ����<base target="_blank" />������ᵯ���հ�ҳ��
                    closeBtn.className = SUGGEST_CLOSE_BTN_CLASS;
                    closeBtn.appendChild(doc.createTextNode(this.config.closeBtnText));
                    bottom.appendChild(closeBtn);
					this.container.appendChild(bottom);
                }
            },

            /**
             * �����ʾ��
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

                // һ����������ˣ�selectedItem��û�ˣ���Ҫ����
                this.selectedItem = null;
            },

            /**
             * ����contanier�����ݣ���ʾ����������
             */
            _displayContainer: function() {
                if ($L.trim(this.container.innerHTML)) {
                    this.show();
                } else {
                    this.hide();
                }
            },

            /**
             * ѡ����ʾ���е���/��һ����
             * @param {Boolean} down true��ʾdown��false��ʾup
             */
            selectItem: function(down) {
                //console.log("select item " + down);
                var items = this.container.getElementsByTagName("li");
                if (items.length == 0) return;

                // �п�����ESC�����ˣ�ֱ����ʾ����
                if (!this.isVisible()) {
                    this.show();
                    return; // ����ԭ����ѡ��״̬
                }
                var newSelectedItem,
					ol=$$('ol',this.container,true),
					showNum=this.config.showNum;
					//index=SUGGEST_ITEM_INDEX;

                // û��ѡ����ʱ��ѡ�е�һ/�����
                if (!this.selectedItem) {
                    //newSelectedItem = items[down ? 0 : items.length - 1];
                } 
			   //else {
                    // ѡ����/��һ��
					if(down){//����ѡ��
						//console.log(this._index)
						//alert('down'+this._index )
						this._index += 1;
						if (this._index >= items.length ) {
							if (showNum) ol.scrollTop = 0;
							this._index = 0;
						}
						
						newSelectedItem = items[this._index];
						
						//���
						if(showNum && this._index > showNum-1) ol.scrollTop+=21;
						//console.log(this._index)
						
					}else{//����ѡ��
						//console.log(this._index)
						//alert('up'+this._index )
						this._index -= 1;
						if (this._index < 0) {
							this._index = items.length-1;
							if ( showNum && items.length > showNum) ol.scrollTop = (items.length - showNum)*21;
						}
						
						newSelectedItem = items[this._index];
						
						//���
						if(showNum && this._index < (items.length - showNum)) ol.scrollTop-=21;
						//console.log(this._index)
					}
                    //newSelectedItem = $D[down ? "getNextSibling" : "getPreviousSibling"](this.selectedItem);
                    // �Ѿ��������/ǰһ��ʱ����λ������򣬲���ԭ����ֵ
                   // if (!newSelectedItem) {
                        //this.textInput.value = this.query;
                   // }
                //}

                // �Ƴ���ǰѡ����
                this._removeSelectedItem();

                // ѡ������
                if (newSelectedItem) {
                    this._setSelectedItem(newSelectedItem);
                    this._updateInputFromSelectItem(newSelectedItem);
                }
            },

            /**
             * �Ƴ�ѡ����
             * @protected
             */
            _removeSelectedItem: function() {
                $D.removeClass(this.selectedItem, SUGGEST_SELECTED_ITEM_CLASS);
                this.selectedItem = null;
            },

            /**
             * ���õ�ǰѡ����
             * @protected
             * @param {HTMLElement} item
             */
            _setSelectedItem: function(item) {
                $D.addClass((item), SUGGEST_SELECTED_ITEM_CLASS);
                this.selectedItem = (item);
				
            },

            /**
             * ��ȡ��ʾ����ѡ�����key�ַ���
             * @protected
             */
            _getSelectedItemKey: function() {
                if (!this.selectedItem) return "";
                return this.selectedItem.getAttribute("key");
            },

			/**
             * ��ȡ��ʾ����ѡ�����CategoryId
             * @protected
             */
            _getSelectedItemCategoryId: function() {
                if (!this.selectedItem) return "";
                return this.selectedItem.getAttribute("categoryId")||'';
            },

            /**
             * ��textInput��ֵ���µ�this.query
             * @protected
             */
            _updateQueryValueFromInput: function() {
                this.query = this.textInput.value;
            },

            /**
             * ��ѡ�����ֵ���µ�textInput
             * @protected
             */
            _updateInputFromSelectItem: function(target) {
                this.textInput.value = this._getSelectedItemKey(this.selectedItem);
                this.suggestTracelogIndex=target.getAttribute('index');
                this.suggestTracelogRecommendedword=this._getSelectedItemKey(this.selectedItem);
				this.suggestTracelogCategory=this._getSelectedItemCategoryId(this.selectedItem);
				
            },
			/**
			 * ͳһ����㵽�����Ĵ���������
			 * @param {Object} o ��care
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
			/*�ع���*/
			 exposureClick:function(sectionexp){
				if(typeof window.dmtrack!="undefined"){
					dmtrack.clickstat("http://stat.1688.com/sectionexp.html",('?sectionexp='+sectionexp));
				}else{
					(new Image).src="http://stat.1688.com/sectionexp.html?sectionexp="+sectionexp+"&time="+(+new Date);
				}
			},
			/**
			 * suggestͳһ����װ
			 * @param {String} clickType 
			 */
			_suggestClick:function(clickType){
				var tempTraceLog = "?searchtrace=";
				switch(clickType){
					case 'show'://�ع���
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
