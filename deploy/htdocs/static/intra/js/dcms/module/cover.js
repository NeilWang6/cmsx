/**
 * @userfor 可视化编辑 - 遮罩对象
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
        //isWorkers: true,   //未使用workers
        show: null,
        hide: null
    }
    D.Cover.CONSTANTS = {
        COVER_DIV_TAG: 'cover',
        COVER_CLASS_NAME: 'dcms-cover-div'   //遮罩层的class名称，承载了一些css
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
            //如果不使用workers则调用_setCover，使用Workers的方案待定
            self._setCover(els);
            
            //监听使用JS异步加载进来的内容
            D.changeCapacity(els, function(el){
                self._setCover(el);
            });
            
            //绑定遮罩层显示/隐藏事件
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
         * @methed handlerCover 处理遮罩层
         * @param handler {string} 必选，处理形式，show/hide(只能是这两者之一)
         * @param el {object} 必选，需要处理的模块元素
         * @param isExecCallback {boolean} 可选，是否执行回调函数
         */
        handlerCover: function(handler, el, isExecCallback){
            //若handler非['show', 'hide']两者之一，则退出
            if (!(handler) && $.inArray(handler, ['show', 'hide'])<0){ return; }
            var constants = D.Cover.CONSTANTS,
            config = this.config,
            coverDivs = el.find(constants.COVER_DIV_TAG);
            //当遮罩层show时重新计算遮罩层的宽和高
            if (handler === 'show'){
                this._setCoverOffset(coverDivs);
            }
            //coverDivs.show() 或 coverDiv.hide()
            coverDivs[handler]();
            //执行回调函数
            if (isExecCallback!==false && $.isFunction(config[handler])){
                config[handler].apply(this, [el]);
            }
        },
        /**
         * @methed add 增加需要被遮罩的模块元素
         * @param els {object} 必选，新增的需要被遮罩的元素集，注：此元素集也必须是符合参数中tag和class要求的
         */
        add: function(els){
            this._setCover(els);
        },
        /**
         * @methed lock 锁定遮罩层
         * @param els {object} 可选，需要锁定的模块元素集；无，则表示对象中的所有元素
         */
        lock: function(els){
            var o = this.config;
            els = els || this.els;
            els.removeClass(o.className);
        },
        /**
         * @methed unlock 解锁遮罩层
         * @param els {object} 可选，需要解锁的模块元素集
         */
        unlock: function(els){
            var o = this.config;
            els = els || this.els;
            els.addClass(o.className);
        },
        //使用Workers时只要将此方法提取出来，使用到Workers中即可
        _setCover: function(els){
            var self = this,
            constants = D.Cover.CONSTANTS;
            
            els.each(function(i){
                var el = $(this),
                nodes = this.childNodes,
                children, color;
                
                //对text、table、iframe节点做相应处理
                for (var j=0, l=nodes.length; j<l; j++){
                    var nodeValue = $.trim(nodes[j].nodeValue);
                    if (nodes[j].nodeName.toUpperCase()==='#TEXT' && !(nodeValue==='\n'||nodeValue==='')){
                        $(nodes[j]).wrap('<span></span>');
                    }
                }
                el.find('table').wrap('<div></div>');
                el.find('iframe').wrap('<div></div>');
                //过滤style、link、script节点
                //children = (el.children().length===0) ? el : el.children(':visible').not('style').not('link').not('script');
                children = (el.children().length===0) ? el : el.children().not('style').not('link').not('script');
                
                color = self._getColor(el);
                
                //为每个子元素生成一个遮罩层
                self._createCover(children, color);
            });
        },
        /**
         * @methed _createCover 创建遮罩层
         * @param children {object} 需要遮罩层的元素集
         * @param color {object} 指定遮罩层的颜色
         */
        _createCover: function(children, color){
            var self = this,
            constants = D.Cover.CONSTANTS;
            children.each(function(i){
                var child = $(this),
                coverDiv, width, height, zIndex;
                /*if (child.css('position')!=='absolute' && child.css('position')!=='relative') {
                    //edited 属性用于记录被修改的Style，以便在保存代码时还原回来
                    //edited="pos"时说明修改了position:relative，edited="dis"说明修改了display:inline-block
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
         * @methed _setCoverOffset 设置遮罩层的高和宽
         * @param cover {object} 需要设置的遮罩层
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
         * @methed _getColor 返回遮罩层的颜色
         * @param el {object} 需要遮罩的模块
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
         * @methed _getZIndex 返回遮罩层的z-index值，被遮罩元素的（zIndex+1）
         * @param el {object} 创建遮罩层的元素
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
         * @methed _getArrayMax 返回数字数组中最大的一个元素
         * @param arr {array} 数字数组
         */
        _getArrayMax: function(arr){
            arr.sort(function(a, b){
                return a-b;
            });
            return arr[arr.length-1];
        }//,
        /**
         * @methed _isNumber 判断是否会正数，如果是返回true，否则返回false
         * @param num {int} 需要判断的数字
         */
        /*_isNumber: function(num){
            return !!(num-0 > 0);
        }*/
    }
})(jQuery, FE.dcms);