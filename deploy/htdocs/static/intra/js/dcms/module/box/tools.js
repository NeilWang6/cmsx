/**
 * @author hongss
 * @userfor ��ľ����-���������еĳ��ü򵥷���
 * @date 2012.02.02
 */

;(function($, D, undefined) {
    D.BoxTools = {
        /**
         * @methed parseOptions ���options�в㼶Ϊkeys��ֵ
         * @param {json} options json��ʽ�����ö���
         * @param {array} keys �㼶��ϵ������ֵ�Դӵ�һ�㵽���һ������
         * @return ���ػ�ȡ����value������������value�������
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
         * @methed getClassName ���elemԪ���з���reg��class����������ڶ��ƥ���class��ֻ���ص�һ��
         * @param elem {element} Ԫ�أ�jQuery����
         * @param query {regExp|function|string} ��ѯ����
         * @return {string} ����reg��class��
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
         * @methed getAreaOffset ��ȡ�༭������Ԫ�ص�offsetֵ
         * @param el {element} ��Ҫ��ȡoffset��Ԫ�أ�jQuery����
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
         * @methed showBigHeadLight ��ʾ��ͷ����(���ڸ���cell)
         * @param lightEl ��ѡ������Ԫ��
         * @param element ��ѡ�������Ԫ��
         * @param area ��ѡ�����򣬰��������ĸ�ֵ {'offsetTop':offsetTop, 'offsetLeft':offsetLeft, 'width':width, 'height':height}
         *                          offsetTop:����Top��ƫ������offsetLeft:����Left��ƫ������width:��ȣ�height:�߶�
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
         * @methed hideCellLight cell ����cell����
         * @param lightEl ��ѡ������Ԫ��
         * @param isRemoveEl ��ѡ���Ƿ���Ҫ�Ƴ�����Ԫ��
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
         * @methed showHighLight ��ʾ����
         * @param highEl {element} ���ڸ�����Ԫ�أ�jQuery����
         * @param el {element} ��Ҫ��ʾ������Ԫ�أ�jQuery����
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
         * @methed hideHighLight ���ظ���Ԫ��
         * @param highEl {element} ���ڸ�����Ԫ�أ�jQuery����
         */
        hideHighLight : function(highEl) {
            highEl = highEl || D.highLightEl;
            //highEl.closest('body').append(highEl);
            highEl.removeData(D.BoxTools.CONSTANTS.RELATED_DATA_ELEM);
            highEl.hide();
            highEl.attr('style', '');
        },
        /**
         * @methed replaceClassName �滻className
         * @param html {string} html����
         * @param oldClass {string} �ϵ�className
         * @param newClass {string} �µ�className
         */
        replaceClassName : function(html, oldClass, newClass) {
            var regClassName = new RegExp('([\\s\'\"\\.])(' + oldClass + ')([\\s\'\"\{])', 'g');
            return html.replace(regClassName, "$1" + newClass + "$3");
        },
        /**
         * @methed getObjectHtml ��ȡ�����html����
         * @param el jQuery����
         * @return ����html����
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
         * @methed getHTMLDomNode ��ȡhtml������html�Ľڵ�
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
         * @methed setEdited �� D.isEdited ����Ϊtrue�Ա�ʾ�������޸�
         * @param editObj   ��¼�����Ķ������ڡ��س���������
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
         * @methed resetEdited �� D.isEdited ��ԭ��false
         */
        resetEdited : function() {
            D.isEdited = false;
        },
        /**
         * @methed getIsEdited ��� D.isEdited ��ֵ
         */
        getIsEdited : function() {
            return D.isEdited;
        },
        initUuid : function(uuid) {
            D.uuid = (!!(uuid > 0)) ? uuid : 0;
        },
        /**
         * @methed setUuid ���� D.uuid ��ֵ
         */
        setUuid : function() {
            if( typeof D.uuid === 'undefined') {
                D.uuid = 0;
            } else {
                D.uuid++;
            }
        },
        /**
         * @methed getUuid ��� D.uuid ��ֵ
         */
        getUuid : function() {
            this.setUuid();
            return D.uuid;
        },
        /**
         * @methed getMax �����������������Ǹ�ֵ
         * @param arr ÿ��Ԫ��Ϊ���ֵ�����
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
         * @methed _getPath ��ȡ·��
         * @param el ��Ҫ���·����Ԫ�أ�jQuery����
         * @param startEl ��ʼ·���ĸ�����ǩ�������͵�bodyλ�ã�jQuery����
         */
        //ɾ��js-control.js�ļ��е��������
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
         * @methed _getElem ��ȡԪ��
         * @param elPath Ԫ��·��
         * @param startEl ��ʼ·���ĸ�����ǩ�������͵�bodyλ�ã�jQuery����
         */
        //ɾ��js-control.js�ļ��е��������
        getElem : function(elPath, startEl) {
            var elem = startEl;
            for(var i = 0, l = elPath.length; i < l; i++) {
                elem = elem.children().eq(elPath[i]);
            }
            return elem;
        },
        /**
         * @methed getNodePosition ���ݵ�ǰԪ�أ���ȡԪ�ص�λ����Ϣ
         * @param el Ԫ��
         * @param type ���ͣ���ѡֵedit|add|move|delete
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
         * @methed getEl2Html ���el������HTML����
         * @param el Ԫ��
         */
        getEl2Html : function(el) {
            var div = $('<div />');
            el.filter('script').add(el.find('script')).attr('type', 'text/plain');
            div.html(el.clone());
            div.find('script').attr('type', 'text/javascript');
            return div.html();
        },
        /**
         *ȫվ990դ�����Ϊ ��ҵ990դ�� Ŀǰֻ֧��ͨ��
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
         *�����ͳһ����id�ɱ༭�������û�д�����������
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
         * ���ӿ�������
         * $arg ��ǰԪ��
         * type �������:���֣�css��ability
         * o ��ӵ������� object����
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

    //����
    D.BoxTools.CONSTANTS = {
        RELATED_DATA_ELEM : 'elem',
        HEIGHT_LIGHT_CELL_CURRENT : 'crazy-box-cell-current'
    };
})(dcms, FE.dcms);
