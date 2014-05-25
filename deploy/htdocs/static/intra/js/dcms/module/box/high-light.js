/**
 * @author hongss
 * @userfor “编辑页面”中的各种高亮
 * @date  2012.05.20
 */

;(function($, D, undefined) {
    D.HighLight = {
        /**
         * @methed showLight 显示粗头高亮(用于高亮cell)
         * @param lightEl 必选，高亮元素
         * @param element 必选，需高亮元素
         * @param area 可选，区域，包括下面四个值 {'offsetTop':offsetTop, 'offsetLeft':offsetLeft, 'width':width, 'height':height}
         *                          offsetTop:坐标Top的偏移量；offsetLeft:坐标Left的偏移量；width:宽度；height:高度
         */
        showLight : function(lightEl, elem, area) {
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
                'top' : offset['top'] - area['offsetTop'],
                'left' : offset['left'] - area['offsetLeft']
            });
            lightEl.width(area['width']);
            lightEl.height(area['height']);
            if(area['css']) {
                lightEl.css(area['css']);
            }

            lightEl.data(D.HighLight.CONSTANTS.LIGHT_DATA_ELEMENT, elem);
        },
        /**
         * @methed showLeft 将要显示的showEl元素显示在elem的左边
         * @param showEl 必选，需显示元素
         * @param elem 必选，相对的参照元素
         * @param area 可选，区域，包括下面四个值 {'offsetTop':offsetTop, 'offsetLeft':offsetLeft, 'css':css}
         *                          offsetTop:坐标Top的偏移量；offsetLeft:坐标Left的偏移量；width:宽度；height:高度
         */
        showLeft: function(showEl, elem, area){
            var offset = elem.offset(), 
                elWidth = elem.outerWidth(),
                defaultArea = {
                    offsetTop : 0,
                    offsetLeft : 0,
                    css : null
                };
            area = $.extend({}, defaultArea, area);
            showEl.show();
            showEl.offset({
                'top' : offset['top'] - area['offsetTop'],
                'left' : offset['left'] + elWidth - area['offsetLeft']
            });
            
            if(area['css']) {
                showEl.css(area['css']);
            }

            showEl.data(D.HighLight.CONSTANTS.LIGHT_DATA_ELEMENT, elem);
        },
        /**
         * @methed showFixBigHeadLight 固定显示粗头高亮(用于高亮cell)
         * @param fixLight 必选，用于固定显示的高亮元素
         * @param lightEl 必选，高亮元素
         * @param element 必选，需高亮元素
         */
        showFixLight : function(fixLight, lightEl, elem) {
            var dataElem = lightEl.data(D.HighLight.CONSTANTS.LIGHT_DATA_ELEMENT);

            if(dataElem && (dataElem[0] === elem[0])) {
                fixLight.show();
                fixLight.attr('style', lightEl.attr('style'));
                fixLight.data(D.HighLight.CONSTANTS.LIGHT_DATA_ELEMENT, elem);
            } else {
                this.showLight(fixLight, elem);
            }
            lightEl.hide();
        },
        /**
         * @methed addLightClassName 增加用于高亮的className
         * @param elem 必选，需高亮的元素
         * @param className 必选，用于高亮的class名
         */
        addLightClassName : function(elem, className) {
            elem.addClass(className);
        },
        /**
         * @methed removeLightClassName 移除用于高亮的className
         * @param elem 必选，需移除高亮的元素
         * @param className 必选，用于高亮的class名
         */
        removeLightClassName : function(elem, className) {
            if (elem){
                 elem.removeClass(className);
            }
           
        },
        /**
         * @methed hideLight 隐藏高亮
         * @param lightEl 必选，高亮元素
         * @param isRemoveEl 可选，是否需要移除高亮元素
         */
        hideLight : function(lightEl, isRemoveEl) {
            if(!lightEl) {
                return;
            }
            lightEl.hide();
            lightEl.removeAttr('style');
            if(isRemoveEl === true) {
                lightEl.removeData(D.HighLight.CONSTANTS.LIGHT_DATA_ELEMENT);
            }
        },
        /**
         * @methed getLightElemData 获取高亮元素的data-elem的属性值
         * @param lightEl 必选，高亮元素
         */
        getLightElemData : function(lightEl) {
            return lightEl.data(D.HighLight.CONSTANTS.LIGHT_DATA_ELEMENT);
        },
        /**
         * 删除 当前crazy-box-cell-current
         */
        removeMicroLight : function(lightEl) {
            var lightMicro = D.HighLight.getLightElemData(lightEl);
            if(lightMicro && lightMicro.length) {
                D.HighLight.removeLightClassName(lightMicro, D.DropInPage.defConfig.cellHightLightCurrent);

            }
        },
        /**
         *隐藏 微布局高亮信息 
         */
        hideMicroLight:function(lightEl,micro){
            var lightMicro = D.HighLight.getLightElemData(lightEl);
            if (!micro || micro[0]===lightMicro[0]){
                D.HighLight.hideLight(lightEl, false);
            }
            if (lightMicro && lightMicro.length){
                D.HighLight.removeLightClassName(micro||lightMicro, D.DropInPage.defConfig.cellHightLightCurrent);
            }
        },

        /**
         * @methed high light show micro
         */
        showMicroLightFix : function(target, fixMicroHighLightEl) {
            if(target.length > 0) {
                this._showMicroLightFix(fixMicroHighLightEl, target);
            }
        },
        /**
         * @methed _showMicroLightFix 显示粗头高亮(用于高亮micro)
         * @param lightEl 必选，高亮元素
         * @param element 必选，需高亮元素
         * @param area 可选，区域，包括下面四个值 {'offsetTop':offsetTop, 'offsetLeft':offsetLeft, 'width':width, 'height':height}
         *                          offsetTop:坐标Top的偏移量；offsetLeft:坐标Left的偏移量；width:宽度；height:高度
         */
        _showMicroLightFix : function(lightEl, elem, area) {
            var offset = elem.offset(), defaultArea = {
                offsetTop : 0,
                offsetLeft : 0,
                width : elem.outerWidth(),
                height : elem.outerHeight(),
                css : null
            };
            area = $.extend({}, defaultArea, area);
            if(area['css']) {
                lightEl.css(area['css']);
            }
            lightEl.width(area['width']);
            lightEl.height(area['height']);
            lightEl.offset({
                'top' : offset['top'],
                'left' : offset['left'] - area['offsetLeft']
            });
        
            lightEl.show();

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
        /**
         * @methed high light show 微布局
         */
        showMicrolayoutLight : function(target, microHightLightEl) {
            var self = this;
            if(target.length > 0) {
                // self._clearTimeoutId(_boxCell);
                //self._checkCellMove(_boxCell);
                self._showMicrolayoutLight(microHightLightEl, target);
            }
        },
        /**
         * @methed showMicrolayoutLight 显示粗头高亮(用于高亮微布局)
         * @param lightEl 必选，高亮元素
         * @param element 必选，需高亮元素
         * @param area 可选，区域，包括下面四个值 {'offsetTop':offsetTop, 'offsetLeft':offsetLeft, 'width':width, 'height':height}
         *                          offsetTop:坐标Top的偏移量；offsetLeft:坐标Left的偏移量；width:宽度；height:高度
         */
        _showMicrolayoutLight : function(lightEl, elem, area) {
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
            if(area['css']) {
                lightEl.css(area['css']);
            }
            if(elem && elem.length > 0) {
                var el = elem[0];
                if(el.classList && el.classList.add) {
                    el.classList.add(D.HighLight.CONSTANTS.HEIGHT_LIGHT_MICROLAYOUT_CURRENT);
                } else {
                    elem.addClass(D.HighLight.CONSTANTS.HEIGHT_LIGHT_MICROLAYOUT_CURRENT);
                }
            }
            lightEl.data(D.BoxTools.CONSTANTS.RELATED_DATA_ELEM, elem);
        },
    }

    D.HighLight.CONSTANTS = {
        LIGHT_DATA_ELEMENT : 'elem',
        HEIGHT_LIGHT_MICROLAYOUT_CURRENT : 'crazy-box-microlayout-current'
    }

})(dcms, FE.dcms);
