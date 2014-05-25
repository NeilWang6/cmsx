/**
 * @author hongss
 * @userfor 多选级联菜单
 * @date  2012.08.27
 * 
 */

jQuery.namespace('FE.elf'); 
;(function($, E, undefined){
    E.MultiplePca = function(opts){
        this._init(opts);
    };
    
    E.MultiplePca.defConfig = {
        chooseBtns: null,  //包含选择按钮和所选的选择框，数据格式:{'1':{'btn':'selector', 'select':'selector'}, ...}
        resultSel: null,   //存放结果的选择框
        delBtn: null,    //删除按钮的选择器
        afterDel: null,  //删除任意一个结果集中的内容时触发回调函数
        afterAdd: null,  //点击一次任意选择按钮并在结果框中有新增时触发回调函数
        complete: null   //点击一次任意选择按钮就触发的回调函数
    }
    
    E.MultiplePca.prototype = {
        _init: function(opts){
            var self = this, config;
            this.config = config = $.extend({}, E.MultiplePca.defConfig, opts);
            
            //选择按钮的操作
            for (var p in config.chooseBtns){
                var obj = config.chooseBtns[p],
                    btn = $(obj['btn']);
                btn.data('select', $(obj['select']))
                $(obj['btn']).click(function(e){
                    var sel = $(this).data('select');
                    self._addResult($('option:selected', sel), obj);
                });
            }
            
            //删除按钮的操作
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
         * @methed _addResult 添加结果集
         * @param selected 被选中的option
         * @param chooseBtn 当前操作的按钮对象
         */
        _addResult: function(selected, chooseBtn){
            var resultSel = $(this.config.resultSel),
                val = selected.val(),
                options = $('option', resultSel),
                isRepeated = false;
            //如果已经在结果集中存在，则选择已存在的结果；此处不处理包含关系
            for (var i=0, l=options.length; i<l; i++){
                if (val===options[i].value){
                    resultSel.val(val);
                    isRepeated = true;
                }
            }
            //如果结果集中不存在，则新加一条记录
            if (isRepeated===false){
                var resultEl = selected.clone();
                resultSel.append(resultEl);
                resultSel.val(val);
                //执行新增后的回调函数
                if (this.config.afterAdd && $.isFunction(this.config.afterAdd)){
                    this.config.afterAdd.call(this, val, resultEl);
                }
            }
            //执行完成选择后的回调函数
            if (this.config.complete && $.isFunction(this.config.complete)){
                this.config.complete.call(this, val);
            }
        }
    };
    
})(jQuery, FE.elf);