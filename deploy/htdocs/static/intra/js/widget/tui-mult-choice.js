/**
 * @author shanshan.hongss
 * @usefor ���ߺ�̨��ʽͳһ ���� �����ѡ�򡢵�ѡ��֧�ֶ�̬׷��Ԫ��
 * @date   2013.09.03
 */

;(function($, T){
    T.MultChoice = function(opts){
        this._init(opts);
    };
    T.MultChoice.defConfig = {
        area:document,  //��Χ��Ĭ��Ϊ�����ĵ���������'.tui-mult-choice'��Ϊ��Χ��ʶ
        type:'checkbox',  //���ͣ�'checkbox'��'radio' Ŀǰֻ֧��������
        valueInput:null,   //���value������򣬿����ڱ��ύ�ȣ���ѡ���ֵ��','�ֿ�
        choicedClass:'current',  //��ѡ�е�class��ʶ
        ableCancel:true, //�Ƿ�����ȡ��ѡ�У�ѡ�к��ٵ�������ȡ��ѡ�У�
        choice:null   //ѡ�к�Ļص����������ز�������ǰ������ֵ����ǰ������Ԫ�أ����value�����������ѡ��Ԫ�ؼ���thisָ��ǰ����Ԫ��  
    };
    T.MultChoice.CONSTANTS = {
        ITEM_CLASS_NAME: '.tui-mult-choice .item-choice'
    }
    T.MultChoice.prototype = {
        _init: function(opts){
            var self = this,
                config = $.extend({}, T.MultChoice.defConfig, opts),
                areaEl = $(config.area), valueInput = null,
                ITEM_CLASS_NAME = T.MultChoice.CONSTANTS.ITEM_CLASS_NAME,
                itemEls = areaEl.find(ITEM_CLASS_NAME);
                
            this.config = config;
            this.areaEl = areaEl;
            
            if (config.valueInput){
                valueInput = $(config.valueInput);
                
                self._setViewValue(valueInput.val(), valueInput, config.choicedClass, itemEls, false);
            }
            this.valueInput = valueInput;
            
            areaEl.delegate(ITEM_CLASS_NAME, 'click', function(e){
                var itemEl = $(this),
                    choicedClass = config.choicedClass,
                    itemEls = areaEl.find(ITEM_CLASS_NAME);
                
                if (itemEl.hasClass(choicedClass)){
                    if (config.ableCancel===true){
                        itemEl.removeClass(choicedClass);
                    }
                } else {
                    if (config.type==='radio'){
                        itemEls.removeClass(choicedClass);
                    }
                    itemEl.addClass(choicedClass);
                }
                
                if (valueInput){
                    self._setValue(valueInput, choicedClass, itemEls);
                }
                
                if (config.choice && $.type(config.choice)==='function'){
                    config.choice.call(this, itemEl.data('val'), itemEl, valueInput, itemEls);
                }
            });
        },
        /**
         * @methed _setViewValue ���ÿɿ�����ֵ
         * @param value ֵ��������ֵ��','�ָ���Ҳ����ֱ�Ӵ�������
         * @param isAdd �Ƿ���׷�ӣ������׷�Ӳ����ԭ����ֵ���������ԭ�е�ֵ
         */
        _setViewValue: function(value, valueInput, choicedClass, itemEls, isAdd){
            if ($.type(value)!=='array'){
                value = String(value).split(',');
            }
            
            if (isAdd!==true){
                itemEls.removeClass(choicedClass);
            }
            
            itemEls.each(function(){
                var itemEl = $(this);
                
                for (var i=0, l=value.length; i<l; i++){
                    if (String(itemEl.data('val'))===value[i]){
                        itemEl.addClass(choicedClass);
                    }
                }
            });
            
            if (valueInput){
                if (isAdd===true){
                    this._setValue(valueInput, choicedClass, itemEls);
                } else {
                    valueInput.val(value.join());
                }
            }
            
        },
        _setValue: function(valueInput, choicedClass, itemEls){
            var values = [];
            
            itemEls.each(function(){
                var itemEl = $(this);
                if (itemEl.hasClass(choicedClass)){
                    values.push(itemEl.data('val'));
                }
            });
            valueInput.val(values.join());
        },
        /**
         * @methed setValue ����ֵ
         * @param value ֵ��������ֵ��','�ָ���Ҳ����ֱ�Ӵ�������
         */
        setValue: function(value){
            var itemEls = this.areaEl.find(T.MultChoice.CONSTANTS.ITEM_CLASS_NAME);
            
            this._setViewValue(value, this.valueInput, this.config.choicedClass, itemEls, false);
        },
        /**
         * @methed addValue ׷��ֵ
         * @param value ֵ��������ֵ��','�ָ���Ҳ����ֱ�Ӵ�������
         */
        addValue: function(value){
            var itemEls = this.areaEl.find(T.MultChoice.CONSTANTS.ITEM_CLASS_NAME);
            
            this._setViewValue(value, this.valueInput, this.config.choicedClass, itemEls, true);
        }
    }
})(jQuery, FE.tools);