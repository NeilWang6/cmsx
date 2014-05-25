/**
 * @author shanshan.hongss
 * @usefor 模拟下拉框
 * @date   2012.12.26
 */

;(function($, T){
    T.Select = function(elem, opts){
        this._init(elem, opts);
    };
    T.Select.defConfig = {
        inputEl: '.s-text',   //input框的选择器，用于存储已选择的文本数据
        hiddenEl: '.s-value',   //隐藏input框的选择器，用于存储已选择的value数据
        spotEl: '.s-arrow',    //下拉按钮的选择器
        selectEl: '.pull-down',  //下拉框的选择器
        optionEl: 'li',  //可选择项，类似于select中的option标签
        dataText: null,  //用于存储文本的自定义属性，取data-后面的字符串;如果为null则取selectEl中的文本内容
        dataValue: 'val',  //用于存储值的自定义属性，取data-后面的字符串
        css: null,   //下拉框元素的css样式，需符合jquery.css中的对象参数写法
        //pullDownHtml: '',  //下拉菜单的HTML代码
        beforeShow: null,  //下拉菜单显示前的回调函数
        selected: null   //选择后的回调函数；返回selectEl(下拉框元素)和selectedEl(被选中项元素)
    };
    T.Select.prototype = {
        _init: function(elem, opts){
            if (!elem){ return; }
            
            var elem = $(elem),
                config = $.extend({}, T.Select.defConfig, opts),
                inputEl = $(config.inputEl, elem),
                hiddenEl = $(config.hiddenEl, elem),
                spotEl = $(config.spotEl, elem),
                selectEl = $(config.selectEl, elem),
                self = this;
            
            if (config.css){
                selectEl.css(config.css);
            }
            
            inputEl.bind('focus', function(e){
                self._showSelectEl(selectEl, config.beforeShow);
            });
            spotEl.bind('click', function(e){
                self._showSelectEl(selectEl, config.beforeShow);
            });
            
            //选中某个值
            selectEl.delegate(config.optionEl, 'click', function(e){
                self._selectItem(selectEl, $(this), inputEl, hiddenEl, config);
            });
            
            //单击其他区域，下拉框消失
            $(document).bind('click', function(e){
                var target = $(e.target)
                if (target.closest(elem).length===0 && selectEl.filter(':visible').length>0){
                    self._hideSelectEl(selectEl);
                }
            });
        },
        _showSelectEl: function(selectEl, beforeShow){
            if (beforeShow && $.isFunction(beforeShow)){
                beforeShow.call(this, selectEl);
            }
            
            selectEl.show();
            
        },
        _selectItem: function(selectEl, selectedEl, inputEl, hiddenEl, config){
            if (config.dataText){
                inputEl.val(selectedEl.data(config.dataText));
            } else {
                inputEl.val(selectedEl.text());
            }
            
            if (config.dataValue && hiddenEl[0]){
                hiddenEl.val(selectedEl.data(config.dataValue));
            }
            
            this._hideSelectEl(selectEl);
            
            if (config.selected && $.isFunction(config.selected)){
                config.selected.call(this, selectEl, selectedEl);
            }
        },
        _hideSelectEl: function(selectEl){
            selectEl.hide();
        }
    };
})(jQuery, FE.tools);