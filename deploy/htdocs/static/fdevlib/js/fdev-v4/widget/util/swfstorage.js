/**
 * flash storage widget
 * @update 只支持flash存储
 */
('swfstorage' in jQuery.util) ||
(function($){

    var _funcsCache = [], Engine, initStat = false, // calc dependence 
 dependence = (function(){
        var de = [];
        if (!$.support.JSON) {
            de.push('util-json');
        }
        
		de.push('ui-flash-storage');
		Engine = 'swfStoreTemp'
        
        return de;
    })();
    
    /*var swfstorage = $.extend({},$.EventTarget);*/
    
    
    $.extend($.util, {
        swfstorage: $.extend({
            /**
             * store string to storage
             */
            setItem: function(key, value){
                try {
                    var result = Engine.setItem(key, value);
                } 
                catch (ex) {
                    this.trigger('error', {
                        exception: ex
                    });
                }
                return result;
            },
            
            /**
             * get string from storage
             */
            getItem: function(key){
                return Engine.getItem(key);
            },
            
            /**
             * set json to storage
             */
            setJson: function(key, value){
                return this.setItem(key, encodeURIComponent(JSON.stringify(value)));
            },
            
            /**
             * get json from storage
             */
            getJson: function(key){
                return JSON.parse(decodeURIComponent(this.getItem(key)));
            },
            
            /**
             * remove item from storage
             */
            removeItem: function(key){
                return Engine.removeItem(key);
            },
            
            /**
             * clear all data in storage
             */
            clear: function(){
                return Engine.clear();
            },
            
            /** 
             * return the number of key/value pairs  current in storage
             */
            getLength: function(){
                return Engine.getLength();
            },
            
            /**
             * return the name of nth key in the list
             */
            key: function(n){
                return Engine.key(n);
            },
            
            /** 
             * because of the fallback of flash(asyn mode) , all the operation must be wraped by this ready function
             */
            ready: function(func){
                if (initStat) {
                    func();
                }
                else {
                    _funcsCache.push(func);
                }
            }
        }, $.EventTarget)
    });
    
    /**
     * 初始化组件。如果使用的 flash 模式，需要等待 flash store engine 准备好
     */
    function _init(){
        if (!initStat) {
            _loadDependence(function(){
                if (Engine === 'swfStoreTemp') {
                    $(function(){ //确保 DOMReady
                        _initSwfStore();
                        $('#swf-storage-fla').bind('contentReady.flash', function(){
                            Engine = $(this).flash('getEngine');
                            _completeInit();
                        }).bind('error.flash', function(ev, o){
                            $.util.swfstorage.trigger('error', o);
                        }).bind('securityError.flash', function(ev, o){
                            $.util.swfstorage.trigger('securityError', o);
                        });
                    });
                }
                else {
                    _completeInit();
                }
            });
        }
    }
    
    /**
     * 完成组件初始化，改变状态，执行在完成之前滞留的动作
     */
    function _completeInit(){
        initStat = true;
        for (var i = 0, l = _funcsCache.length; i < l; i++) {
            _funcsCache[i]();
        }
    }
    
    /**
     * 解决依赖
     */
    function _loadDependence(callback){
        if (_isAllOk()) {
            callback();
            return;
        }
        for (var i = 0, l = dependence.length; i < l; i++) {
            (function(i){
                $.use(dependence[i], function(){
                    dependence[i] = true;
                    if (_isAllOk()) {
                        callback();
                    };
                                    });
            })(i)
        }
    }
    
    /**
     * 初始化swf store
     */
    function _initSwfStore(){
        $('<div id="swf-storage-fla">').appendTo('body').css({
            position: 'absolute',
            left: '0px',
            top: '0px',
            width: '1px',
            height: '1px'
        }).flash({
            module: 'storage'
        });
    }
    
    /**
     * 判断是否所有的依赖都已经OK
     */
    function _isAllOk(){
        if (dependence.length === 0) {
            return true;
        }
        else {
            for (var i = 0, l = dependence.length; i < l; i++) {
                if (dependence[i] !== true) {
                    return false;
                }
            }
            return true;
        }
    }
    
    // auto init
    _init();
    $.add('util-swfstorage')
})(jQuery);

