/**
 * @author hongss
 * @userfor ��ѡ�����˵�
 * @date  2012.08.27
 * 
 */

jQuery.namespace('FE.elf'); 
;(function($, E, undefined){
    E.MultiplePca = function(opts){
        this._init(opts);
    };
    
    E.MultiplePca.defConfig = {
        chooseBtns: null,  //����ѡ��ť����ѡ��ѡ������ݸ�ʽ:{'1':{'btn':'selector', 'select':'selector'}, ...}
        resultSel: null,   //��Ž����ѡ���
        delBtn: null,    //ɾ����ť��ѡ����
        afterDel: null,  //ɾ������һ��������е�����ʱ�����ص�����
        afterAdd: null,  //���һ������ѡ��ť���ڽ������������ʱ�����ص�����
        complete: null   //���һ������ѡ��ť�ʹ����Ļص�����
    }
    
    E.MultiplePca.prototype = {
        _init: function(opts){
            var self = this, config;
            this.config = config = $.extend({}, E.MultiplePca.defConfig, opts);
            
            //ѡ��ť�Ĳ���
            for (var p in config.chooseBtns){
                var obj = config.chooseBtns[p],
                    btn = $(obj['btn']);
                btn.data('select', $(obj['select']))
                $(obj['btn']).click(function(e){
                    var sel = $(this).data('select');
                    self._addResult($('option:selected', sel), obj);
                });
            }
            
            //ɾ����ť�Ĳ���
            $(config.delBtn).click(function(e){
                var resultSel = $(config.resultSel),
                    resultEl = $('option:selected', resultSel);
                
                resultEl.remove();
                if (config.afterDel && $.isFunction(config.afterDel)){
                    config.afterDel.call(this, resultEl);
                }
            });
        },
        /**
         * @methed _addResult ��ӽ����
         * @param selected ��ѡ�е�option
         * @param chooseBtn ��ǰ�����İ�ť����
         */
        _addResult: function(selected, chooseBtn){
            var resultSel = $(this.config.resultSel),
                val = selected.val(),
                options = $('option', resultSel),
                isRepeated = false;
            //����Ѿ��ڽ�����д��ڣ���ѡ���Ѵ��ڵĽ�����˴������������ϵ
            for (var i=0, l=options.length; i<l; i++){
                if (val===options[i].value){
                    resultSel.val(val);
                    isRepeated = true;
                }
            }
            //���������в����ڣ����¼�һ����¼
            if (isRepeated===false){
                var resultEl = selected.clone();
                resultSel.append(resultEl);
                resultSel.val(val);
                //ִ��������Ļص�����
                if (this.config.afterAdd && $.isFunction(this.config.afterAdd)){
                    this.config.afterAdd.call(this, val, resultEl);
                }
            }
            //ִ�����ѡ���Ļص�����
            if (this.config.complete && $.isFunction(this.config.complete)){
                this.config.complete.call(this, val);
            }
        }
    };
    
})(jQuery, FE.elf);