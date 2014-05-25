/**
 * @author hongss
 * @userfor ����JS����Ч��ʧЧ
 * @date  2012-02-20
 */
 
;(function($, D, undefined){
    D.JsControl = function(config){
        this._init(config);
    }
    
    D.JsControl.defConfig = {
        widget: null,     //ָ����ֵʱ��ָ��widget�ڵ����б�ǩ����󶼻ᴥ��ʹJSʧЧ����  
        type: 'crazy-box-module',
        inureBtn: null,
        iframeDoc: null,
        stateClass: 'crazy-box-control-current'    //JSʧЧ״̬ʱ��Ҫ�ӵ�class��
    }
    
    D.JsControl.prototype = {
        /**
         * @methed _init ��ʼ��
         * @param config ������
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
                
                this.add = null;         //��add������գ�������ʹ��
                this._getBtnOffset = function(){   //���ٶ�btn offset �ļ���
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
                this.add = null;         //��add������գ�������ʹ��
                this._getBtnOffset = function(){   //���ٶ�btn offset �ļ���
                    return btnOffset;
                }
            }*/
        },
        /**
         * @methed add ����elem���ó�JS��Ч״̬����config������������widgetʱ��add������Ч
         * @param elem ��Ҫ���ó�JS��Ч״̬��Ԫ�أ�jQuery����
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
         * @methed _inureBtnListener �������ظ�JS��Ч���İ�ť��click�¼�
         * @param btn ��Ҫ������btnԪ�أ�jQuery����
         */
        _inureBtnListener: function(btn){
            var self = this;
            btn.bind('click', function(e){
                self._jsValid(btn);
                //add by pingchun.yupc 2013-01-15 ȷ���󣬴����ص�����
                self.config.callback&&typeof self.config.callback==='function'?self.config.callback.call(self):'';
            });
        },
        /**
         * @methed _isValidAddCtr �ж��Ƿ���Ҫ��JSʧЧ����
         * @param widget ��ҪJSʧЧ����
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
         * @methed _widgetListener �������ظ�JS��Ч���İ�ť��click�¼�
         * @param btn ��Ҫ������btnԪ�أ�jQuery����
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
         * @methed _jsInvalid ʹJSʧЧ�ķ���
         * @param widget ��ҪʧЧJS��widget
         */
        _jsInvalid: function(elem, widget){
            var //wrap = widget.parent(),   //ע�⣺���뱣֤widget(����js,css,html)��Ψһ�ĸ��ڵ�
                wrap = widget,
                elPath = this._getPath(elem, wrap);  
            this.invalid = true;   //��ʾ�Ѿ�����JSʧЧ״̬
            
            wrap.find('script').attr('type', 'text/plain');
            wrap.html(wrap.html());
            wrap.addClass(this.config.stateClass);
            this._showInureBtn(wrap);
            
            return this._getElem(elPath, wrap);
        },
        /**
         * @methed _jsValid ʹJS��Ч�ķ���
         * @param btn ʹJS��Ч��btn��ť
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
         * @methed jsValid �ṩ���ⲿʹ�õģ�ʹJS��Ч�ķ���
         * @param btn ʹJS��Ч��btn��ť
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
            //���IE��<base />��ǩ�е�bug
            (base.length>0) ? head.insertBefore(child, base[0]) : head.appendChild(child);
        },
        /**
         * @methed _showInureBtn ��ʾʹJS��Ч�İ�ť
         * @param widget Ԫ������jQuery����
         */
        _showInureBtn: function(widget){
            var btnOffset = this._getBtnOffset(widget);
            
            this.config.inureBtn.data('elem', widget);
            this.config.inureBtn.show();
            this.config.inureBtn.offset(btnOffset);
            
        },
        /**
         * @methed _hideInureBtn ����ʹJS��Ч�İ�ť
         */
        _hideInureBtn: function(){
            this.config.inureBtn.removeData('elem');
            this.config.inureBtn.hide();
        },
        /**
         * @methed _getBtnOffset ����ʹJS��Ч�İ�ť������
         * @param widget Ԫ������jQuery����
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
         * @methed _getPath ��ȡ·��
         * @param el ��Ҫ���·����Ԫ�أ�jQuery����
         * @param startEl ��ʼ·���ĸ�����ǩ�������͵�bodyλ�ã�jQuery����
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
         * @methed _getElem ��ȡԪ��
         * @param elPath Ԫ��·��
         * @param startEl ��ʼ·���ĸ�����ǩ�������͵�bodyλ�ã�jQuery����
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