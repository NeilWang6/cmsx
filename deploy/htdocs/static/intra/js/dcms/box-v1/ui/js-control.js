/**
 * @author hongss
 * @userfor 控制JS的生效与失效
 * @date  2012-02-20
 */
 
;(function($, D, undefined){
    D.JsControl = function(config){
        this._init(config);
    }
    
    D.JsControl.defConfig = {
        widget: null,     //指定此值时，指定widget内的所有标签点击后都会触发使JS失效功能  
        type: 'crazy-box-module',
        inureBtn: null,
        iframeDoc: null,
        stateClass: 'crazy-box-control-current'    //JS失效状态时需要加的class名
    }
    
    D.JsControl.prototype = {
        /**
         * @methed _init 初始化
         * @param config 配置项
         */
        _init: function(config){
            if (!config['inureBtn']){ return; }
            this.config = $.extend({}, D.JsControl.defConfig, config);
            
            this.config.inureBtn = $(this.config.inureBtn);
            this._inureBtnListener(this.config.inureBtn);
            this.config.widget=$(this.config.widget);
            
            if (this._isValidAddCtr(this.config.widget)===true){
                var btnOffset = this._getBtnOffset(this.config.widget);
                this._widgetListener(this.config.widget);
                
                this.add = null;         //将add方法清空，不能再使用
                this._getBtnOffset = function(){   //减少对btn offset 的计算
                    return btnOffset;
                }
            }
            /*if (this.config.widget && this.config.widget.length){
                var self = this,
                    scriptLength = this.config.widget.parent().find('script').length,
                    btnOffset = this._getBtnOffset(this.config.widget);
                if (scriptLength>0){
                    this._widgetListener(this.config.widget);
                }
                this.add = null;         //将add方法清空，不能再使用
                this._getBtnOffset = function(){   //减少对btn offset 的计算
                    return btnOffset;
                }
            }*/
        },
        /**
         * @methed add 加入elem设置成JS无效状态，当config参数中设置了widget时，add方法无效
         * @param elem 需要设置成JS无效状态的元素，jQuery对象
         */
        add: function(elem){
            if (!elem){ return; }
            
            var widget = elem.closest('.'+this.config.type);
            
            if (this._isValidAddCtr(widget)===true && !this.invalid){
                /*this.invalid = true;*/
                return this._jsInvalid(elem, widget);
            } else {
                return elem;
            }
            
        },
        /**
         * @methed _inureBtnListener 监听“回复JS有效”的按钮的click事件
         * @param btn 需要监听的btn元素，jQuery对象
         */
        _inureBtnListener: function(btn){
            var self = this;
            btn.bind('click', function(e){
                self._jsValid(btn);
                //add by pingchun.yupc 2013-01-15 确定后，触发回调方法
                self.config.callback&&typeof self.config.callback==='function'?self.config.callback.call(self):'';
            });
        },
        /**
         * @methed _isValidAddCtr 判断是否需要加JS失效功能
         * @param widget 需要JS失效对象
         */
        _isValidAddCtr: function(widget){
            if (widget && widget.length){
                var scriptLength = widget.parent().find('script').length;
                if (scriptLength>0){
                    return true;
                }
            }
            return false;
        },
        /**
         * @methed _widgetListener 监听“回复JS有效”的按钮的click事件
         * @param btn 需要监听的btn元素，jQuery对象
         */
        _widgetListener: function(widget){
            var self = this;
            widget.bind('mouseup', function(e){
                if (!self.invalid){
                    /*self.invalid = true;*/
                    var target = $(e.target);
                    setTimeout(function(){
                        self._jsInvalid(target, widget);
                    }, 200);
                }
            });
        },
        /**
         * @methed _jsInvalid 使JS失效的方法
         * @param widget 需要失效JS的widget
         */
        _jsInvalid: function(elem, widget){
            var //wrap = widget.parent(),   //注意：必须保证widget(包含js,css,html)有唯一的父节点
                wrap = widget,
                elPath = this._getPath(elem, wrap);  
            this.invalid = true;   //表示已经进入JS失效状态
            
            wrap.find('script').attr('type', 'text/plain');
            wrap.html(wrap.html());
            wrap.addClass(this.config.stateClass);
            this._showInureBtn(wrap);
            
            return this._getElem(elPath, wrap);
        },
        /**
         * @methed _jsValid 使JS生效的方法
         * @param btn 使JS生效的btn按钮
         */
        _jsValid: function(btn){
            var wrap = btn.data('elem');
            if (!wrap){ return; }
            
            this.invalid = false;
            //wrap.find('script').attr('type', 'text/javascript');
            //D.InsertHtml.init(wrap.html(), wrap, 'html', this.config.iframeDoc);
            this._execJs(wrap.find('script'));
            
            
            wrap.removeClass(this.config.stateClass);
            this._hideInureBtn();
            
            D.BoxTools.hideHighLight();
        },
        /**
         * @methed jsValid 提供给外部使用的，使JS生效的方法
         * @param btn 使JS生效的btn按钮
         */
        jsValid: function(){
            this._jsValid(this.config.inureBtn);
        },
        
        _execJs: function(jsObj){
            var self = this;
            jsObj.each(function(i, el){
                if (!el.src){
                    var el = $(el),
                        script = document.createElement('script');
                    script.type = 'text/javascript';
                    self._insertHead(script, self.config.iframeDoc);
                    script.text = el.text();
                }
                
            });
        },
        _insertHead: function(child, doc){
            var head = $('head', doc)[0],
            base = $('base', head);
            //解决IE中<base />标签中的bug
            (base.length>0) ? head.insertBefore(child, base[0]) : head.appendChild(child);
        },
        /**
         * @methed _showInureBtn 显示使JS生效的按钮
         * @param widget 元件对象，jQuery对象
         */
        _showInureBtn: function(widget){
            var btnOffset = this._getBtnOffset(widget);
            
            this.config.inureBtn.data('elem', widget);
            this.config.inureBtn.show();
            this.config.inureBtn.offset(btnOffset);
            
        },
        /**
         * @methed _hideInureBtn 隐藏使JS生效的按钮
         */
        _hideInureBtn: function(){
            this.config.inureBtn.removeData('elem');
            this.config.inureBtn.hide();
        },
        /**
         * @methed _getBtnOffset 返回使JS生效的按钮的坐标
         * @param widget 元件对象，jQuery对象
         */
        _getBtnOffset: function(widget){
            var offset = widget.offset(),
                widgetWidth = widget.width(),
                btnWidth = this.config.inureBtn.width(),
                btnHeight = this.config.inureBtn.height(),
                top = offset.top-btnHeight-2,  //+2
                left = offset.left+widgetWidth-btnWidth+2;  //-2
            top = (top<0) ? 0 : top;
            return {'top':top, 'left':left};
        },
        /**
         * @methed _getPath 获取路径
         * @param el 需要获得路径的元素，jQuery对象
         * @param startEl 开始路径的父级标签，不传就到body位置，jQuery对象
         */
        _getPath: function(el, startEl){
            var startEl = startEl || 'body',
                parents = el.parentsUntil(startEl),
                elPath = [];
            for (var i=parents.length-1; i>=0; i--){
                var idx = parents.eq(i).index();
                elPath.push(idx);
            }
            elPath.push(el.index());
            return elPath;
        },
        /**
         * @methed _getElem 获取元素
         * @param elPath 元素路径
         * @param startEl 开始路径的父级标签，不传就到body位置，jQuery对象
         */
        _getElem: function(elPath, startEl){
            var elem = startEl;
            for (var i=0, l=elPath.length; i<l; i++){
                elem = elem.children().eq(elPath[i]);
            }
            return elem;
        }
    }
})(dcms, FE.dcms);