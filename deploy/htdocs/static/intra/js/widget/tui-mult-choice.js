/**
 * @author shanshan.hongss
 * @usefor 工具后台样式统一 —— 替代多选框、单选框；支持动态追加元素
 * @date   2013.09.03
 */

;(function($, T){
    T.MultChoice = function(opts){
        this._init(opts);
    };
    T.MultChoice.defConfig = {
        area:document,  //范围，默认为整个文档；不能用'.tui-mult-choice'作为范围标识
        type:'checkbox',  //类型，'checkbox'或'radio' 目前只支持这两种
        valueInput:null,   //存放value的输入框，可用于表单提交等，多选框的值用','分开
        choicedClass:'current',  //被选中的class标识
        ableCancel:true, //是否允许取消选中，选中后再单击便是取消选中；
        choice:null   //选中后的回调函数，返回参数：当前操作的值、当前操作的元素，存放value的输入框，所有选项元素集；this指向当前操作元素  
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
         * @methed _setViewValue 设置可看到的值
         * @param value 值，如果多个值用','分隔，也可以直接传入数组
         * @param isAdd 是否是追加，如果是追加不清除原来的值；否则清楚原有的值
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
         * @methed setValue 设置值
         * @param value 值，如果多个值用','分隔，也可以直接传入数组
         */
        setValue: function(value){
            var itemEls = this.areaEl.find(T.MultChoice.CONSTANTS.ITEM_CLASS_NAME);
            
            this._setViewValue(value, this.valueInput, this.config.choicedClass, itemEls, false);
        },
        /**
         * @methed addValue 追加值
         * @param value 值，如果多个值用','分隔，也可以直接传入数组
         */
        addValue: function(value){
            var itemEls = this.areaEl.find(T.MultChoice.CONSTANTS.ITEM_CLASS_NAME);
            
            this._setViewValue(value, this.valueInput, this.config.choicedClass, itemEls, true);
        }
    }
})(jQuery, FE.tools);