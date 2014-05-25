/**
 * @author springyu
 */

;(function($, D) {
    var __hasProp = {}.hasOwnProperty, __extends = function(child, parent) {
        for(var key in parent) {
            if(__hasProp.call(parent, key))
                child[key] = parent[key];
        }
        function SuperClass() {
            this.constructor = child;
        }

        if(parent.prototype) {
            SuperClass.prototype = parent.prototype;
        }
        child.prototype = new SuperClass();
        if(parent.prototype) {
            child.__super__ = parent.prototype;
        }
        return child;
    }, __slice = [].slice;
    D.Log = {
        trace : true,
        logPrefix : '(DCMS):',
        log : function() {
            var args;
            if(!this.trace) {
                return;
            }
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            if(this.logPrefix) {
                args.unshift(this.logPrefix);
            }
            if( typeof console !== "undefined" && console !== null) {
                if( typeof console.log === "function") {
                    console.log.apply(console, args);
                }
            }
            return this;
        }
    };
    D.Class = function(_super) {
        if(_super) {
            __extends(Module, _super);
        }
        function Module(instAttr) {
            if(instAttr && typeof instAttr === 'object') {//实例属性 不同对象，不一样
                //if(instAttr.attr === true) {
                //this.attr = instAttr;
                var _ref = instAttr;
                for(key in _ref) {
                    this[key] = _ref[key];
                }
                //} else {
                // this.attr = instAttr;
                // }

            }
            if( typeof this.init === "function") {//原型对象，实例对象都有
                var args = arguments.length > 1 ? __slice.call(arguments, 1) : [];
                this.init.apply(this, args);
            }
        };
        Module.prototype.init = function() {
        };
        /**
         * 定义prototype的别名
         */
        Module.fn = Module.prototype;
        /**
         * 定义类的别名
         */
        Module.fn.parent = Module;
        Module.proxy = function(func) {
            var self = this;
            var args = Array.prototype.slice.call(arguments, 1);
            return (function() {
                return func.apply(self, args);
            });
        };
        Module.fn.proxy = Module.proxy;
        /**
         * 给类添加属性
         * @param {Object} obj
         */
        Module.extend = function(obj) {
            if(!obj) {
                throw new Error('extend(obj) requires obj');
            }
            if(obj) {
                var self = this, extended = obj.extended;
                (function() {
                    $.extend(self, obj);
                    if(obj.extended) {
                        extended(self);
                    }
                })();
            }
            return this;
        };
        /**
         *  给实例添加属性
         * @param {Object} obj
         */
        Module.include = function(obj) {
            if(!obj) {
                throw new Error('include(obj) requires obj');
            }
            if(obj) {
                var self = this, included = obj.included;
                (function() {
                    $.extend(self.fn, obj);
                    if(obj.included) {
                        included(self.fn);
                    }
                })();
            }
            return this;
        };
        return Module;
    };

})(jQuery, FE.dcms);
