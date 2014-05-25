/**
 * @author shanshan.hongss
 * @usefor DCMS-积木盒子 —— 菜单切换
 * @date   2012.10.19
 */

;(function($, D, undefined) {
    D.MenuTab = function(opts) {
        this._init(opts);
    };

    D.MenuTab.defConfig = {
        handlerEls : '', //必选，触点元素选择器，必须要有“boxCon”参数
        boxEls : '', //必选，主内容展示区元素选择器，当此参数不存在时
        handlerCon : '', //触点元素的父级元素，只在新增中使用
        boxCon : '', //主内容展示区元素的父级元素，只在新增中使用
        closeEls : '', //关闭触点选择器，程序自动认为此元素为触点的子孙元素
        currClass : 'current', //当前元素
        selected : 0, //默认选择哪个菜单
        afterShow : null, //展示后的回调函数，在使用了createTab后也会触发
        afterCreate : null, //新建后的回调函数，在tab已经存在未插入新元素时不触发
        afterClose : null, // 关闭后调用函数
        beforeClose : null//关闭前调用函数

    };

    D.MenuTab.prototype = {
        _init : function(opts) {
            var config = $.extend({}, D.MenuTab.defConfig, opts), handlerCon = $(config.handlerCon), boxCon = $(config.boxCon), handlerEls = $(config.handlerEls, handlerCon), boxEls = $(config.boxEls, boxCon), self = this;

            this.config = config;
            this.handlerCon = handlerCon;
            this.boxCon = $(config.boxCon);

            //初始化状态
            this._showTab(config.selected, handlerEls, boxEls);

            //注册触点事件
            handlerCon.delegate(config.handlerEls, 'click', function(e) {
                e.preventDefault();
                var handlerEl = $(this);
                self._showTab(handlerEl);
            });

            //注册关闭事件
            handlerCon.delegate(config.closeEls, 'click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var closeEl = $(this), handlerEl = closeEl.closest(config.handlerEls);
                if(config.beforeClose && typeof config.beforeClose === 'function') {
                    config.beforeClose.call(self, handlerEl);
                } else {
                    if(config.afterClose && typeof config.afterClose === 'function') {
                        config.afterClose.call(self, handlerEl);
                    }
                    if(handlerEl.length > 0) {
                        self._removeTab(handlerEl);
                    }
                }
            });
        },
        /**
         * @methed _showTab 指定tab展示
         * @param handle 数字或元素对象，指定“第几个”tab展示
         * @param handlerEls 触点元素集， 可选
         * @param boxEls 主内容展示区元素集， 可选
         */
        _showTab : function(handle, handlerEls, boxEls) {
            var config = this.config, n, handlerEl, boxEl;
            handlerEls = handlerEls || $(config.handlerEls, this.handlerCon);
            boxEls = boxEls || $(config.boxEls, this.boxCon);

            if($.type(handle) === 'number') {
                n = handle;
                handlerEl = handlerEls.eq(n);
            } else {
                handlerEl = handle;
                n = handlerEls.index(handlerEl);
            }

            boxEl = boxEls.eq(n);
            handlerEls.removeClass(config.currClass);
            handlerEl.addClass(config.currClass);
            boxEls.hide();
            boxEl.show();

            if(config.afterShow) {
                config.afterShow.call(this, handlerEl, boxEl);
            }
        },
        /**
         * @methed _removeTab 指定tab删除
         * @param handle 数字或元素对象，指定“第几个”tab删除
         * @param handlerEls 触点元素集， 可选
         * @param boxEls 主内容展示区元素集， 可选
         */
        _removeTab : function(handle, handlerEls, boxEls) {
            var config = this.config, n, handlerEl;
            handlerEls = handlerEls || $(config.handlerEls, this.handlerCon);
            boxEls = boxEls || $(config.boxEls, this.boxCon);

            if($.type(handle) === 'number') {
                n = handle;
                handlerEl = handlerEls.eq(n);
            } else {
                handlerEl = handle;
                n = handlerEls.index(handlerEl);
            }
            if(handlerEl.hasClass(config.currClass)) {
                var i = (n === handlerEls.length - 1) ? n - 1 : n + 1;
                this._showTab(i, handlerEls, boxEls);
            }

            handlerEl.remove();
            boxEls.eq(n).remove();
        },
        /**
         * @methed removeTab 指定tab删除
         * @param handle 数字或元素对象，指定“第几个”tab删除
         */
        removeTab : function(handle) {
            this._removeTab(handle);
        },
        /**
         * @methed createTab 插入一个新的tab
         * @param id 特定ID，如果此ID已经存在，则不再新建；初始化时候必须对已有的触点元素加上一个特定ID
         * @param handlerHtml 新建时需要用到的触点代码，如果非新建可以不传此参数
         * @param boxHtml 新建时需要用到的主展示区代码，如果非新建可以不传此参数
         * @param fn 回调函数
         * @param onlyCreate 是否只有在新建时执行，如果true则表示只在新建时执行，否则都执行
         */
        createTab : function(id, handlerHtml, boxHtml, fn, onlyCreate) {
            var config = this.config, handlerEls = $(config.handlerEls, this.handlerCon), boxEls = $(config.boxEls, this.boxCon), handlerEl = handlerEls.filter('#' + id);

            if(handlerEl.length > 0) {
                this._showTab(handlerEl, handlerEls, boxEls);

                if(fn && onlyCreate !== true) {
                    fn.call(this, handlerEl, boxEls.eq(handlerEls.index(handlerEl)));
                }
            } else {
                var newHandler = $(handlerHtml).appendTo(this.handlerCon), newBox = $(boxHtml).appendTo(this.boxCon);
                newHandler.attr('id', id);

                this._showTab(handlerEls.length);

                if(fn) {
                    fn.call(this, newHandler, newBox);
                }
                if(config.afterCreate) {
                    config.afterCreate.call(this, newHandler, newBox);
                }
            }
        }
    };
})(dcms, FE.dcms);
