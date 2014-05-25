/**
 * @author shanshan.hongss
 * @usefor 工具后台样式统一 —— 增加、删除、移动
 * @date   2012.09.24
 */

;(function($, T){
    T.AddDelMove = function(opts){
        this._init(opts);
    };
    T.AddDelMove.defConfig = {
        container:'.form', //父级容器的选择器(selector)，用于下面触点的事件代理
        operateEl:'.item-operate', //操作对象，即“增加、删除、移动”对象的选择器(selector)，程序会从操作点往上(父级)找
        add:'.icon-add',  //增加触点的选择器(selector)
        del:'.icon-delete',  //删除触点的选择器(selector)
        moveup:'.icon-moveup',  //上移触点的选择器(selector)
        movedown:'.icon-movedown',  //下移触点的选择器(selector)
        afterAdd: null,  //触发增加操作后的回调函数
        afterDel: null,  //触发删除操作后的回调函数
        afterMoveup: null,  //触发上移操作后的回调函数
        afterMovedown: null,  //触发下移操作后的回调函数
        allowDelAll:false //是否允许删除全部，即当只剩一个元素时是否允许删除
    };
    T.AddDelMove.prototype = {
        _init: function(opts){
            var self = this,
                config = $.extend({}, T.AddDelMove.defConfig, opts);

            self._setFirstAddLastStyle(config);
            //增加触点绑定事件
            $(config.container).delegate(config.operateEl+' '+config.add, 'click', function(e){
                e.preventDefault();
                var el = $(this),
                    operateEl = el.closest(config.operateEl),
                    cloneEl = operateEl.clone();

                operateEl.after(cloneEl);

                self._setFirstAddLastStyle(config);

                if (config.afterAdd){
                    config.afterAdd.call(this, cloneEl, el);
                }
            });

            //删除触点绑定事件
            $(config.container).delegate(config.operateEl+' '+config.del, 'click', function(e){
                e.preventDefault();
                var el = $(this),
                    operateEl = el.closest(config.operateEl),
                    siblingEls = operateEl.siblings(config.operateEl);

                if (config.allowDelAll==true || siblingEls.length>0){
                    operateEl.remove();
                }

                self._setFirstAddLastStyle(config);

                if (config.afterDel){
                	//add by 2013-02-18  pingchun.yupc 增加兄弟节点参数
                    config.afterDel.call(this, operateEl, el,siblingEls);
                }
            });

            //上移触点绑定事件
            $(config.container).delegate(config.operateEl+' '+config.moveup, 'click', function(e){
                e.preventDefault();
                var el = $(this),
                    operateEl = el.closest(config.operateEl),
                    prevEl = operateEl.prev(config.operateEl);
                if (prevEl.length>0){
                    prevEl.before(operateEl);
                }

                self._setFirstAddLastStyle(config);

                if (config.afterMoveup){
                    config.afterMoveup.call(this, operateEl, el);
                }
            });

            //下移触点绑定事件
            $(config.container).delegate(config.operateEl+' '+config.movedown, 'click', function(e){
                e.preventDefault();
                var el = $(this),
                    operateEl = el.closest(config.operateEl),
                    nextEl = operateEl.next(config.operateEl);
                if (nextEl.length>0){
                    nextEl.after(operateEl);
                }

                self._setFirstAddLastStyle(config);

                if (config.afterMovedown){
                    config.afterMovedown.call(this, operateEl, el);
                }
            });
        },
        _setFirstAddLastStyle: function(config){
            var items = $(config.operateEl, config.container),
                firstEl = items.eq(0),
                lastEl = items.eq(items.length-1);
            items.find(config.moveup).show();
            items.find(config.movedown).show();
            items.find(config.del).show();
            firstEl.find(config.moveup).hide();
            lastEl.find(config.movedown).hide();

            if ( config.allowDelAll==false && items.length===1){
                items.find(config.del).hide();
            }
        }
    };
})(jQuery, FE.tools);