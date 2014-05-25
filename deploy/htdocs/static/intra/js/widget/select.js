/**
 * @author shanshan.hongss
 * @usefor ģ��������
 * @date   2012.12.26
 */

;(function($, T){
    T.Select = function(elem, opts){
        this._init(elem, opts);
    };
    T.Select.defConfig = {
        inputEl: '.s-text',   //input���ѡ���������ڴ洢��ѡ����ı�����
        hiddenEl: '.s-value',   //����input���ѡ���������ڴ洢��ѡ���value����
        spotEl: '.s-arrow',    //������ť��ѡ����
        selectEl: '.pull-down',  //�������ѡ����
        optionEl: 'li',  //��ѡ���������select�е�option��ǩ
        dataText: null,  //���ڴ洢�ı����Զ������ԣ�ȡdata-������ַ���;���Ϊnull��ȡselectEl�е��ı�����
        dataValue: 'val',  //���ڴ洢ֵ���Զ������ԣ�ȡdata-������ַ���
        css: null,   //������Ԫ�ص�css��ʽ�������jquery.css�еĶ������д��
        //pullDownHtml: '',  //�����˵���HTML����
        beforeShow: null,  //�����˵���ʾǰ�Ļص�����
        selected: null   //ѡ���Ļص�����������selectEl(������Ԫ��)��selectedEl(��ѡ����Ԫ��)
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
            
            //ѡ��ĳ��ֵ
            selectEl.delegate(config.optionEl, 'click', function(e){
                self._selectItem(selectEl, $(this), inputEl, hiddenEl, config);
            });
            
            //��������������������ʧ
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