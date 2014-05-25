/**
 * @author hongss
 * @userfor ���༭ҳ�桱�еĸ��ָ���
 * @date  2012.05.20
 */

;(function($, D, undefined) {
    D.HighLight = {
        /**
         * @methed showLight ��ʾ��ͷ����(���ڸ���cell)
         * @param lightEl ��ѡ������Ԫ��
         * @param element ��ѡ�������Ԫ��
         * @param area ��ѡ�����򣬰��������ĸ�ֵ {'offsetTop':offsetTop, 'offsetLeft':offsetLeft, 'width':width, 'height':height}
         *                          offsetTop:����Top��ƫ������offsetLeft:����Left��ƫ������width:��ȣ�height:�߶�
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
         * @methed showLeft ��Ҫ��ʾ��showElԪ����ʾ��elem�����
         * @param showEl ��ѡ������ʾԪ��
         * @param elem ��ѡ����ԵĲ���Ԫ��
         * @param area ��ѡ�����򣬰��������ĸ�ֵ {'offsetTop':offsetTop, 'offsetLeft':offsetLeft, 'css':css}
         *                          offsetTop:����Top��ƫ������offsetLeft:����Left��ƫ������width:��ȣ�height:�߶�
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
         * @methed showFixBigHeadLight �̶���ʾ��ͷ����(���ڸ���cell)
         * @param fixLight ��ѡ�����ڹ̶���ʾ�ĸ���Ԫ��
         * @param lightEl ��ѡ������Ԫ��
         * @param element ��ѡ�������Ԫ��
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
         * @methed addLightClassName �������ڸ�����className
         * @param elem ��ѡ���������Ԫ��
         * @param className ��ѡ�����ڸ�����class��
         */
        addLightClassName : function(elem, className) {
            elem.addClass(className);
        },
        /**
         * @methed removeLightClassName �Ƴ����ڸ�����className
         * @param elem ��ѡ�����Ƴ�������Ԫ��
         * @param className ��ѡ�����ڸ�����class��
         */
        removeLightClassName : function(elem, className) {
            if (elem){
                 elem.removeClass(className);
            }
           
        },
        /**
         * @methed hideLight ���ظ���
         * @param lightEl ��ѡ������Ԫ��
         * @param isRemoveEl ��ѡ���Ƿ���Ҫ�Ƴ�����Ԫ��
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
         * @methed getLightElemData ��ȡ����Ԫ�ص�data-elem������ֵ
         * @param lightEl ��ѡ������Ԫ��
         */
        getLightElemData : function(lightEl) {
            return lightEl.data(D.HighLight.CONSTANTS.LIGHT_DATA_ELEMENT);
        },
        /**
         * ɾ�� ��ǰcrazy-box-cell-current
         */
        removeMicroLight : function(lightEl) {
            var lightMicro = D.HighLight.getLightElemData(lightEl);
            if(lightMicro && lightMicro.length) {
                D.HighLight.removeLightClassName(lightMicro, D.DropInPage.defConfig.cellHightLightCurrent);

            }
        },
        /**
         *���� ΢���ָ�����Ϣ 
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
         * @methed _showMicroLightFix ��ʾ��ͷ����(���ڸ���micro)
         * @param lightEl ��ѡ������Ԫ��
         * @param element ��ѡ�������Ԫ��
         * @param area ��ѡ�����򣬰��������ĸ�ֵ {'offsetTop':offsetTop, 'offsetLeft':offsetLeft, 'width':width, 'height':height}
         *                          offsetTop:����Top��ƫ������offsetLeft:����Left��ƫ������width:��ȣ�height:�߶�
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
         * @methed high light show ΢����
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
         * @methed showMicrolayoutLight ��ʾ��ͷ����(���ڸ���΢����)
         * @param lightEl ��ѡ������Ԫ��
         * @param element ��ѡ�������Ԫ��
         * @param area ��ѡ�����򣬰��������ĸ�ֵ {'offsetTop':offsetTop, 'offsetLeft':offsetLeft, 'width':width, 'height':height}
         *                          offsetTop:����Top��ƫ������offsetLeft:����Left��ƫ������width:��ȣ�height:�߶�
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
