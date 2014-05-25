/**
 * @author hongss
 * @userfor 积木盒子-操作界面中的常用简单方法
 * @date 2012.02.02
 */

;(function($, D, undefined) {
    D.BoxTools = {
        /**
         * @methed parseOptions 获得options中层级为keys的值
         * @param {json} options json格式的配置对象
         * @param {array} keys 层级关系，数组值以从第一层到最后一层排列
         * @return 返回获取到的value，数据类型由value本身决定
         */
        parseOptions : function(options, keys) {
            if(!options || !keys.length) {
                return;
            }
            var opt = options;
            for(var i = 0, l = keys.length; i < l; i++) {
                var optVal = opt[keys[i]];
                if(optVal) {
                    opt = optVal;
                } else {
                    return;
                }
            }
            return opt;
        },
        /**
         * @methed getClassName 获得elem元素中符合reg的class名，如果存在多个匹配的class名只返回第一个
         * @param elem {element} 元素，jQuery对象
         * @param query {regExp|function|string} 查询条件
         * @return {string} 符合reg的class名
         */
        getClassName : function(elem, query) {
            if(!(elem && query)) {
                return;
            }
            var classNames = elem.attr('class'), arrClass, className;
            if(!classNames) {
                return;
            }
            arrClass = classNames.split(' ');
            for(var i = 0, l = arrClass.length; i < l; i++) {
                var name = $.trim(arrClass[i]);
                if(($.type(query) == 'function' && query && query(name)) || ($.type(query) == 'regexp' && query.test(name) == true) || ($.type(query) == 'string' && query == name)) {
                    className = name;
                    break;
                }
            }
            return className;
        },
        /**
         * @methed getAreaOffset 获取编辑区域内元素的offset值
         * @param el {element} 需要获取offset的元素，jQuery对象
         */
        getAreaOffset : function(el) {
            if(!el) {
                return;
            }
            var elOffset = el.offset(), offset, marginTop = parseInt(el.css('margin-top')) || 0, marginLeft = parseInt(el.css('margin-left')) || 0;

            offset = {
                'top' : elOffset['top'], //+marginTop +this.iframeOffset['top']
                'left' : elOffset['left']     //+marginLeft +this.iframeOffset['left']
            }
            return offset;
        },
        /**
         * @methed showBigHeadLight 显示粗头高亮(用于高亮cell)
         * @param lightEl 必选，高亮元素
         * @param element 必选，需高亮元素
         * @param area 可选，区域，包括下面四个值 {'offsetTop':offsetTop, 'offsetLeft':offsetLeft, 'width':width, 'height':height}
         *                          offsetTop:坐标Top的偏移量；offsetLeft:坐标Left的偏移量；width:宽度；height:高度
         */
        showCellLight : function(lightEl, elem, area) {
            var offset = elem.offset(), defaultArea = {
                offsetTop : 0,
                offsetLeft : 0,
                width : elem.outerWidth(),
                height : elem.outerHeight(),
                css : null
            };
            area = $.extend({}, defaultArea, area);

            lightEl.show();
            lightEl.offset({
                'top' : offset['top'] - 27,
                'left' : offset['left'] - area['offsetLeft']
            });
            //lightEl.width(area['width']);
            //lightEl.height(area['height']);
            //console.log(lightEl);
            if(area['css']) {
                lightEl.css(area['css']);
            }
            if(elem && elem.length > 0) {
                var el = elem[0];
                if(el.classList && el.classList.add) {
                    el.classList.add(D.BoxTools.CONSTANTS.HEIGHT_LIGHT_CELL_CURRENT);
                } else {
                    elem.addClass(D.BoxTools.CONSTANTS.HEIGHT_LIGHT_CELL_CURRENT);
                }
            }
            lightEl.data(D.BoxTools.CONSTANTS.RELATED_DATA_ELEM, elem);
        },
        showCellFixLight : function(lightEl, elem, area) {
            var offset = elem.offset(), defaultArea = {
                offsetTop : 0,
                offsetLeft : 0,
                width : elem.outerWidth(),
                height : elem.outerHeight(),
                css : null
            };
            area = $.extend({}, defaultArea, area);

            lightEl.show();
            lightEl.offset({
                'top' : offset['top'],
                'left' : offset['left'] - area['offsetLeft']
            });
            //lightEl.width(area['width']);
            //lightEl.height(area['height']);

            if(area['css']) {
                lightEl.css(area['css']);
            }

        },
        /**
         * @methed hideCellLight cell 隐藏cell高亮
         * @param lightEl 必选，高亮元素
         * @param isRemoveEl 可选，是否需要移除高亮元素
         */
        /*hideCellLight: function(lightEl, isRemoveEl){
        lightEl.hide();
        lightEl.removeAttr('style');
        if (isRemoveEl===true){
        var elem = lightEl.data(D.BoxTools.CONSTANTS.RELATED_DATA_ELEM);
        if (elem && elem.length> 0){
        var el = elem[0];
        if(el&& el.classList && el.classList.remove){
        el.classList.remove(D.BoxTools.CONSTANTS.HEIGHT_LIGHT_CELL_CURRENT);
        } else {
        elem.removeClass(D.BoxTools.CONSTANTS.HEIGHT_LIGHT_CELL_CURRENT);
        }
        }

        lightEl.removeData(D.BoxTools.CONSTANTS.RELATED_DATA_ELEM);
        }
        },*/
        /**
         * @methed showHighLight 显示高亮
         * @param highEl {element} 用于高亮的元素，jQuery对象
         * @param el {element} 需要显示高亮的元素，jQuery对象
         */
        showHighLight : function(el, highEl) {
            highEl = highEl || D.highLightEl;
            var offset = this.getAreaOffset(el), width = el.outerWidth(), height = el.outerHeight();
            //el.after(highEl);
            highEl.show();
            highEl.offset(offset);
            highEl.width(width);
            highEl.height(height);
            highEl.data(D.BoxTools.CONSTANTS.RELATED_DATA_ELEM, el);
        },
        /**
         * @methed hideHighLight 隐藏高亮元素
         * @param highEl {element} 用于高亮的元素，jQuery对象
         */
        hideHighLight : function(highEl) {
            highEl = highEl || D.highLightEl;
            //highEl.closest('body').append(highEl);
            highEl.removeData(D.BoxTools.CONSTANTS.RELATED_DATA_ELEM);
            highEl.hide();
            highEl.attr('style', '');
        },
        /**
         * @methed replaceClassName 替换className
         * @param html {string} html代码
         * @param oldClass {string} 老的className
         * @param newClass {string} 新的className
         */
        replaceClassName : function(html, oldClass, newClass) {
            var regClassName = new RegExp('([\\s\'\"\\.])(' + oldClass + ')([\\s\'\"\{])', 'g');
            return html.replace(regClassName, "$1" + newClass + "$3");
        },
        /**
         * @methed getObjectHtml 获取对象的html代码
         * @param el jQuery对象
         * @return 返回html代码
         */
        getObjectHtml : function(el) {
            if(el && typeof el === 'object') {
                var div = $('<div />');
                div.append(el);
                return div.html();
            }
            return el;
        },
        /**
         * @methed getHTMLDomNode 获取html代码中html的节点
         * @param htmlcode
         */
        /*getHTMLDomNode: function(htmlcode){
        var node = $(htmlcode).not(function(){
        if ($.inArray(this.nodeName.toUpperCase(), ['LINK', 'STYLE', 'SCRIPT', '#TEXT'])===-1){
        return false;
        }
        return true;
        });
        return node;
        },*/
        /**
         * @methed setEdited 将 D.isEdited 设置为true以表示进行了修改
         * @param editObj   记录操作的对象，用于“回撤”功能中
         */
        setEdited : function(editObj) {
            if(!D.isEdited) {
                D.isEdited = true;
            }
            if(editObj) {
                $(window).trigger('PageOperateHistory.save', editObj);
            }
        },
        /**
         * @methed resetEdited 将 D.isEdited 还原回false
         */
        resetEdited : function() {
            D.isEdited = false;
        },
        /**
         * @methed getIsEdited 获得 D.isEdited 的值
         */
        getIsEdited : function() {
            return D.isEdited;
        },
        initUuid : function(uuid) {
            D.uuid = (!!(uuid > 0)) ? uuid : 0;
        },
        /**
         * @methed setUuid 设置 D.uuid 的值
         */
        setUuid : function() {
            if( typeof D.uuid === 'undefined') {
                D.uuid = 0;
            } else {
                D.uuid++;
            }
        },
        /**
         * @methed getUuid 获得 D.uuid 的值
         */
        getUuid : function() {
            this.setUuid();
            return D.uuid;
        },
        /**
         * @methed getMax 从数组中挑出最大的那个值
         * @param arr 每个元素为数字的数组
         */
        getMax : function(arr) {
            if(arr && $.type(arr) !== 'array') {
                return;
            }
            var max = parseInt(arr[0]) || 0;
            for(var i = 0, l = arr.length; i < l; i++) {
                if(max < parseInt(arr[i])) {
                    max = arr[i];
                }
            }
            return max;
        },
        /**
         * @methed _getPath 获取路径
         * @param el 需要获得路径的元素，jQuery对象
         * @param startEl 开始路径的父级标签，不传就到body位置，jQuery对象
         */
        //删除js-control.js文件中的这个方法
        getPath : function(el, startEl) {
            var startEl = startEl || 'body', parents = el.parentsUntil(startEl), elPath = [];
            for(var i = parents.length - 1; i >= 0; i--) {
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
        //删除js-control.js文件中的这个方法
        getElem : function(elPath, startEl) {
            var elem = startEl;
            for(var i = 0, l = elPath.length; i < l; i++) {
                elem = elem.children().eq(elPath[i]);
            }
            return elem;
        },
        /**
         * @methed getNodePosition 根据当前元素，获取元素的位置信息
         * @param el 元素
         * @param type 类型，可选值edit|add|move|delete
         */
        /*getNodePosition:function(el,type){
         var self = this,
         path,
         relation;
         if(type == 'edit'|| type == 'add'){
         path = self.getPath(el);
         return {
         'path':path,
         'relation':'self'
         };
         }else if(type == 'delete'){
         var prevJQEl = el.prev(),
         nextJQEl = el.next(),
         parentJQEl   = el.parent();

         if(prevJQEl[0]){
         path = self.getPath(prevJQEl);
         relation = 'prev';
         }else if(nextJQEl[0]){
         path = self.getPath(nextJQEl);
         relation = 'next';
         }else if(parentJQEl[0]){
         path = self.getPath(parentJQEl);
         relation = 'parent';
         }

         return {
         'path':path,
         'relation':relation
         }
         }else if(type == 'move'){

         }
         return {};
         },*/

        _getRelativeNode : function(el) {
            var prevJQEl = el.prev(), nextJQEl = el.next(), parentJQEl = el.parent(), relativeNode, insertType;

            if(prevJQEl[0]) {
                relativeNode = prevJQEl;
                insertType = 'after';
            } else if(nextJQEl[0]) {
                relativeNode = nextJQEl;
                insertType = 'before';
            } else if(parentJQEl[0]) {
                relativeNode = parentJQEl;
                insertType = 'html';
            }
            return {
                'elem' : relativeNode,
                'insertType' : insertType
            }
        },
        /**
         * @methed getEl2Html 获得el的整个HTML代码
         * @param el 元素
         */
        getEl2Html : function(el) {
            var div = $('<div />');
            el.filter('script').add(el.find('script')).attr('type', 'text/plain');
            div.html(el.clone());
            div.find('script').attr('type', 'text/javascript');
            return div.html();
        },
        /**
         *全站990栅格更换为 行业990栅格 目前只支持通栏
         */
        q990ToH990 : function(htmlCode) {
            var $htmlCode = $('<div/>');
            D.InsertHtml.init(htmlCode, $htmlCode, 'html', false);
            /****/
            //var $htmlCode = $('<div/>').append(htmlCode);

            var $layout = $htmlCode.find('.crazy-box-layout');
            $layout.each(function(index, layout) {
                var _self = $(layout);
                if(!_self.hasClass('layout-col')) {
                    _self.addClass('layout-col');
                    _self.find('.crazy-box-grid ').removeClass('grid-25').addClass('grid');
                    // console.log(_self);
                }
            });
            return $htmlCode.html();
        },
        /**
         *对组件统一加上id可编辑配置项，对没有此配置项的组件
         */
        addEditAttr : function(htmlCode) {
            var $htmlCode = $('<div/>'),self = this;
            D.InsertHtml.init(htmlCode, $htmlCode, 'html', false);
            var $module = $htmlCode.find('.crazy-box-module');
            $module.each(function(index, module) {
                var _self = $(module);
                self.addBoxOptions(_self,'ability',{"editAttr":[{"key":"id","name":"ID"}]});
            });

            return $htmlCode.html();
        },
        /**
         * 增加可配置项
         * $arg 当前元素
         * type 添加类型:二种：css和ability
         * o 添加的配置项 object类型
         */
        addBoxOptions : function($arg, type, o) {
            var _boxOptions = $arg.data(D.bottomAttr.CONSTANTS['boxOptions']), _addCssBoxOptions = function($arg, type, o, cssObj) {
                var isEx = false;
                if(cssObj) {
                    for(var i = 0; i < cssObj.length; i++) {
                        var obj = cssObj[i];
                        if(obj.key === o.key) {
                            isEx = true;
                            break;
                        }
                    }
                    if(!isEx) {
                        cssObj.push(o);
                    }

                } else {
                    _boxOptions['css'] = [o];
                }
            }, _addAbilityBoxOptions = function($arg, type, o, abilityObj) {
                var isEx = false, abilityOptions = _boxOptions['ability'];
                if(abilityObj) {
                    for(var name in abilityObj) {
                        for(var title in o) {
                            if(name === title) {
                                isEx = true;
                                break;
                            }
                        }
                    }
                    if(!isEx) {
                        for(var title in o) {
                            abilityObj[title] = o[title];
                             
                        }

                    }

                } else {
                    abilityOptions = o;
                }

            };
            if($arg && _boxOptions) {
                var cssObj = _boxOptions.css, abilityObj = _boxOptions.ability;
                if(type === 'css') {
                    _addCssBoxOptions($arg, type, o, cssObj);
                }
                if(type === 'ability') {
                    _addAbilityBoxOptions($arg, type, o, abilityObj);
                }
            } else if($arg && !_boxOptions) {
                if(type === 'css') {
                    $arg.data(D.bottomAttr.CONSTANTS['boxOptions'], {
                        "css" : [o]
                    });
                    if(type === 'ability') {
                        $arg.data(D.bottomAttr.CONSTANTS['boxOptions'], {
                            "ability" : o
                        });
                    }
                }
            }
        },
    };

    //常量
    D.BoxTools.CONSTANTS = {
        RELATED_DATA_ELEM : 'elem',
        HEIGHT_LIGHT_CELL_CURRENT : 'crazy-box-cell-current'
    };
})(dcms, FE.dcms);
