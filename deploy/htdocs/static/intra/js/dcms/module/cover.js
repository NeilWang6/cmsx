/**
 * @userfor ���ӻ��༭ - ���ֶ���
 * @author hongss
 * @date 2011.08.10
 */

;(function($, D, undefined){
    D.Cover = function(config){
        this._init(config);
    }
    D.Cover.defConfig = {
        className: 'dcms-cover-mods',
        position: 'position',
        template: 'dtemplate',
        posColor: '#bdf809',
        tempColor: '#c00',
        showEvent: 'mouseleave',
        hideEvent: 'mouseenter',
        //isWorkers: true,   //δʹ��workers
        show: null,
        hide: null
    }
    D.Cover.CONSTANTS = {
        COVER_DIV_TAG: 'cover',
        COVER_CLASS_NAME: 'dcms-cover-div'   //���ֲ��class���ƣ�������һЩcss
    }
    
    D.Cover.prototype = {
        _init: function(config){
            //if (!els){ return; }
            var self = this,
            constants = D.Cover.CONSTANTS;
            
            self.config = $.extend(D.Cover.defConfig, config);
            self.coverObj = $('<'+constants.COVER_DIV_TAG+' class="'+constants.COVER_CLASS_NAME+'"></'+constants.COVER_DIV_TAG+'>');
            
            var o = self.config ,
            els = $(o.position+'.'+o.className+', '+o.template+'.'+o.className);
            self.els = els;
            //�����ʹ��workers�����_setCover��ʹ��Workers�ķ�������
            self._setCover(els);
            
            //����ʹ��JS�첽���ؽ���������
            D.changeCapacity(els, function(el){
                self._setCover(el);
            });
            
            //�����ֲ���ʾ/�����¼�
            els.live(o.hideEvent, function(e){
                var el = $(e.currentTarget);
                self.handlerCover('hide', el);
            });
            
            if (o.showEvent){
                els.live(o.showEvent, function(e){
                    var el = $(e.currentTarget);
                    self.handlerCover('show', el);
                });
            }
        },
        /**
         * @methed handlerCover �������ֲ�
         * @param handler {string} ��ѡ��������ʽ��show/hide(ֻ����������֮һ)
         * @param el {object} ��ѡ����Ҫ�����ģ��Ԫ��
         * @param isExecCallback {boolean} ��ѡ���Ƿ�ִ�лص�����
         */
        handlerCover: function(handler, el, isExecCallback){
            //��handler��['show', 'hide']����֮һ�����˳�
            if (!(handler) && $.inArray(handler, ['show', 'hide'])<0){ return; }
            var constants = D.Cover.CONSTANTS,
            config = this.config,
            coverDivs = el.find(constants.COVER_DIV_TAG);
            //�����ֲ�showʱ���¼������ֲ�Ŀ�͸�
            if (handler === 'show'){
                this._setCoverOffset(coverDivs);
            }
            //coverDivs.show() �� coverDiv.hide()
            coverDivs[handler]();
            //ִ�лص�����
            if (isExecCallback!==false && $.isFunction(config[handler])){
                config[handler].apply(this, [el]);
            }
        },
        /**
         * @methed add ������Ҫ�����ֵ�ģ��Ԫ��
         * @param els {object} ��ѡ����������Ҫ�����ֵ�Ԫ�ؼ���ע����Ԫ�ؼ�Ҳ�����Ƿ��ϲ�����tag��classҪ���
         */
        add: function(els){
            this._setCover(els);
        },
        /**
         * @methed lock �������ֲ�
         * @param els {object} ��ѡ����Ҫ������ģ��Ԫ�ؼ����ޣ����ʾ�����е�����Ԫ��
         */
        lock: function(els){
            var o = this.config;
            els = els || this.els;
            els.removeClass(o.className);
        },
        /**
         * @methed unlock �������ֲ�
         * @param els {object} ��ѡ����Ҫ������ģ��Ԫ�ؼ�
         */
        unlock: function(els){
            var o = this.config;
            els = els || this.els;
            els.addClass(o.className);
        },
        //ʹ��WorkersʱֻҪ���˷�����ȡ������ʹ�õ�Workers�м���
        _setCover: function(els){
            var self = this,
            constants = D.Cover.CONSTANTS;
            
            els.each(function(i){
                var el = $(this),
                nodes = this.childNodes,
                children, color;
                
                //��text��table��iframe�ڵ�����Ӧ����
                for (var j=0, l=nodes.length; j<l; j++){
                    var nodeValue = $.trim(nodes[j].nodeValue);
                    if (nodes[j].nodeName.toUpperCase()==='#TEXT' && !(nodeValue==='\n'||nodeValue==='')){
                        $(nodes[j]).wrap('<span></span>');
                    }
                }
                el.find('table').wrap('<div></div>');
                el.find('iframe').wrap('<div></div>');
                //����style��link��script�ڵ�
                //children = (el.children().length===0) ? el : el.children(':visible').not('style').not('link').not('script');
                children = (el.children().length===0) ? el : el.children().not('style').not('link').not('script');
                
                color = self._getColor(el);
                
                //Ϊÿ����Ԫ������һ�����ֲ�
                self._createCover(children, color);
            });
        },
        /**
         * @methed _createCover �������ֲ�
         * @param children {object} ��Ҫ���ֲ��Ԫ�ؼ�
         * @param color {object} ָ�����ֲ����ɫ
         */
        _createCover: function(children, color){
            var self = this,
            constants = D.Cover.CONSTANTS;
            children.each(function(i){
                var child = $(this),
                coverDiv, width, height, zIndex;
                /*if (child.css('position')!=='absolute' && child.css('position')!=='relative') {
                    //edited �������ڼ�¼���޸ĵ�Style���Ա��ڱ������ʱ��ԭ����
                    //edited="pos"ʱ˵���޸���position:relative��edited="dis"˵���޸���display:inline-block
                    child.css('position', 'relative');
                    child.attr('edited', 'pos')
                }*/
                
                coverDiv = child.find(constants.COVER_DIV_TAG+'.'+constants.COVER_CLASS_NAME);
                if (coverDiv.length===0){
                    var text = $.trim(child.text()),
                    nodeName = child[0].tagName.toUpperCase();
                    if ((nodeName==='TEXT' && text!=='' && text!=='\n') || nodeName!=='TEXT'){
                        coverDiv = self.coverObj.clone();
                        child.append(coverDiv);
                    } 
                }
                
                zIndex = self._getZIndex(child);
                coverDiv.css({'background-color':color, 'z-index':zIndex});
                self._setCoverOffset(coverDiv);
                
            });
        },
        /**
         * @methed _setCoverOffset �������ֲ�ĸߺͿ�
         * @param cover {object} ��Ҫ���õ����ֲ�
         */
        _setCoverOffset: function(cover){
            cover.each(function(i){
                var el = $(this),
                parent = el.parent(),
                position = parent.position(),
                strPostion = parent.css('position'),
                top = position.top,
                left = position.left,
                width = parent.outerWidth(),
                height = parent.outerHeight();
                if (height==0){
                    parent.css('overflow', 'hidden');
                    height = parent.outerHeight();
                }
                if (strPostion==='absoulte'||strPostion==='relative'){
                    top = 0;
                    left = 0;
                }
                el.css({'width':width+'px', 'height':height+'px', 'top':top, 'left':left});
            });
        },
        /**
         * @methed _getColor �������ֲ����ɫ
         * @param el {object} ��Ҫ���ֵ�ģ��
         */
        _getColor: function(el){
            var tag = el[0].tagName.toUpperCase(),
            config = this.config, color,
            position = config.position.toUpperCase(),
            template = config.template.toUpperCase();
            switch (tag){
                case position:
                    color = config.posColor;
                    break;
                case template:
                    color = config.tempColor;
                    break;
                default:
                    color = config.tempColor;
                    break;
            }
            return color;
        },
        /**
         * @methed _getZIndex �������ֲ��z-indexֵ��������Ԫ�صģ�zIndex+1��
         * @param el {object} �������ֲ��Ԫ��
         */
        _getZIndex: function(el){
            var offsprings = el.find('*'),
            self = this,
            zIndex = [];
            offsprings.each(function(i){
                var z = $(this).css('z-index');
                if (z && D.isNumber(z)){
                    zIndex.push(z);
                }
            });
            return (zIndex.length>0) ? (parseInt(this._getArrayMax(zIndex))+1) : 1;
        },
        /**
         * @methed _getArrayMax ������������������һ��Ԫ��
         * @param arr {array} ��������
         */
        _getArrayMax: function(arr){
            arr.sort(function(a, b){
                return a-b;
            });
            return arr[arr.length-1];
        }//,
        /**
         * @methed _isNumber �ж��Ƿ������������Ƿ���true�����򷵻�false
         * @param num {int} ��Ҫ�жϵ�����
         */
        /*_isNumber: function(num){
            return !!(num-0 > 0);
        }*/
    }
})(jQuery, FE.dcms);