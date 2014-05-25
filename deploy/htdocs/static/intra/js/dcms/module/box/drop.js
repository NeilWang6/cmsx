/**
 * @author hongss
 * @userfor 基于HTML5拖放事件的拖放效果，允许只存在拖拽元素或拖放目标元素
 * @date 2012.01.09
 */
 
;(function($, D, undefined){
    
    D.DragAddDrop = {
        /**
         * @methed _init 初始化
         * @param config 配置项
         */
        init: function(config){
            this.config = $.extend({}, D.DragAddDrop.defConfig, config);
            var config = this.config,
                dragEls = config.dragEls,
                dropEls = config.dropEls;
            //如果dragEls和dropEls都不存在，则返回
            if (!(dragEls && dropEls)){ return; }
            
            //如果dragEls存在，绑定所有需要绑定在dragEls上的事件
            if (dragEls){
                this.dragEls = dragEls = $(dragEls);
                for (var i=0, l=dragEls.length; i<l; i++){
                    this._drag(dragEls[i]);
                    this._dragstart(dragEls[i]);
                    this._dragend(dragEls[i]);
                }
            }
            
            //如果dropEls存在，绑定所有需要绑定在dropEls上的事件
            if (dropEls){
                this.dropEls = dropEls = $(dropEls);
                for (var i=0, l=dropEls.length; i<l; i++){
                    this._dragleave(dropEls[i]);
                    this._dragenter(dropEls[i]);
                    this._dragover(dropEls[i]);
                    this._drop(dropEls[i]);
                }
            }
        },
        /**
         * @methed _drag 当拖动元素时执行，绑定于dragEls上
         * @param el 需要绑定事件的元素，非jQuery对象
         */
        _drag: function(el){
            var drag = this.config.drag;
            el.addEventListener('drag', function(e){
                if (drag && $.isFunction(drag)){
                    drag.call(this, e);
                }
            }, false);
        },
        /**
         * @methed _dragstart 当拖动操作开始时执行，绑定于dragEls上
         * @param el 需要绑定事件的元素，非jQuery对象
         */
        _dragstart: function(el){
            var dragstart = this.config.dragstart;
            el.addEventListener('dragstart', function(e){
                e.dataTransfer.dropEffect = "copy";
                e.dataTransfer.effectAllowed = "copyMove";
                
                if (dragstart && $.isFunction(dragstart)){
                    dragstart.call(this, e);
                }
            }, false);
        },
        /**
         * @methed _dragend 当拖动操作结束时执行，绑定于dragEls上
         * @param el 需要绑定事件的元素，非jQuery对象
         */
        _dragend: function(el){
            var dragend = this.config.dragend;
            el.addEventListener('dragend', function(e){
                e.preventDefault();
                if (dragend && $.isFunction(dragend)){
                    dragend.call(this, e);
                }
            }, false);
        },
        /**
         * @methed _dragenter 当元素被拖动至有效的拖放目标时执行，绑定于dropEls上
         * @param el 需要绑定事件的元素，非jQuery对象
         */
        _dragenter: function(el){
            var dragenter = this.config.dragenter;
            el.addEventListener('dragenter', function(e){
                if (dragenter && $.isFunction(dragenter)){
                    dragenter.call(this, e);
                }
            }, false);
        },
        /**
         * @methed _dragover 当元素被拖动至有效拖放目标上方时执行，绑定于dropEls上
         * @param el 需要绑定事件的元素，非jQuery对象
         */
        _dragover: function(el){
            var dragover = this.config.dragover;
            el.addEventListener('dragover', function(e){
                e.preventDefault();
                if (dragover && $.isFunction(dragover)){
                    dragover.call(this, e);
                }
            }, false);
        },
        /**
         * @methed _dragleave 当元素离开有效拖放目标时执行，绑定于dropEls上
         * @param el 需要绑定事件的元素，非jQuery对象
         */
        _dragleave: function(el){
            var dragleave = this.config.dragleave;
            el.addEventListener('dragleave', function(e){
                if (dragleave && $.isFunction(dragleave)){
                    dragleave.call(this, e);
                }
            }, false);
        },
        /**
         * @methed _drop 当被拖动元素正在被拖放时执行，绑定于dropEls上
         * @param el 需要绑定事件的元素，非jQuery对象
         */
        _drop: function(el){
            var drop = this.config.drop;
            el.addEventListener('drop', function(e){
                e.preventDefault();
                if (drop && $.isFunction(drop)){
                    drop.call(this, e);
                }
            }, false);
        }
    };
    
    //默认配置项
    D.DragAddDrop.defConfig = {
        dragEls: null,           //被拖拽的元素集
        dropEls: null,           //拖放目标元素集
        //dataType: 'text/html',   //被拖拽元素存储的和拖放目标元素的数据类型
        drag: null,              //回调函数，当拖动元素时执行，绑定于dragEls上
        dragstart: null,         //回调函数，当拖动操作开始时执行，绑定于dragEls上
        dragend: null,           //回调函数，当拖动操作结束时执行，绑定于dragEls上
        dragenter: null,         //回调函数，当元素被拖动至有效的拖放目标时执行，绑定于dropEls上
        dragover: null,          //回调函数，当元素被拖动至有效拖放目标上方时执行，绑定于dropEls上
        dragleave: null,         //回调函数，当元素离开有效拖放目标时执行，绑定于dropEls上
        drop: null               //回调函数，当被拖动元素正在被拖放时执行，绑定于dropEls上
    };
})(dcms, FE.dcms);