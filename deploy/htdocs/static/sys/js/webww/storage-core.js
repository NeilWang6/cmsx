/**
 * author honglun.menghl
 * date 2011-5-9
 * storage widget
 * dependence: jQuery
 *
 * modify for web ww . ������Ҫ������洢��ǿ��ʹ�� flash
 * 2012-12-18 Ϊ��֧��ipad��ֻ��ʹ��ԭ��localstorage����ˮ
 */

jQuery.namespace('FE.sys.webww');
('storageCore' in FE.sys.webww) ||
(function ($) {

    var _funcsCache = [], Engine, initStat = false, // calc dependence 
        dependence = (function () {
            var de = [];
            if (!$.support.JSON) {
                /*if(true){*/
                de.push('util-json');
            }

            // ʹ�� flash
			if(window.localStorage && jQuery.util.flash.available == false){
				console.log("storage-core.js: not support Falsh, using html5 localstorage..");
				Engine = window.localStorage;
			}
			else{
				de.push('ui-flash-storage');
				Engine = 'swfStoreTemp';
			}

            return de;
        })();

    /*var storage = $.extend({},$.EventTarget);*/


    $.extend(FE.sys.webww, {
        storageCore:$.extend({
            /**
             * store string to localStorage
             */
            setItem:function (key, value) {
                try {
                    var result = Engine.setItem(key, value);
                }
                catch (ex) {
                    this.trigger('error', {
                        exception:ex
                    });
                }
                return result;
            },

            /**
             * get string from localStorage
             */
            getItem:function (key) {
                return Engine.getItem(key);
            },

            /**
             * set json to localStorage
             */
            setJson:function (key, value) {
                return this.setItem(key, encodeURIComponent(JSON.stringify(value)));
            },

            /**
             * get json from localStorage
             */
            getJson:function (key) {
                return JSON.parse(decodeURIComponent(this.getItem(key)));
            },

            /**
             * remove item from localStorage
             */
            removeItem:function (key) {
                return Engine.removeItem(key);
            },

            /**
             * clear all data in localStorage
             */
            clear:function () {
                return Engine.clear();
            },

            /**
             * return the number of key/value pairs  current in localStorage
             */
            getLength:function () {
                return $.support.localStorage ? Engine.length : Engine.getLength();
            },

            /**
             * return the name of nth key in the list
             */
            key:function (n) {
                return Engine.key(n);
            },

            /**
             * because of the fallback of flash(asyn mode) , all the operation must be wraped by this ready function
             */
            ready:function (func) {
                if (initStat) {
					console.log("storage-core.js: initStat is true.");
                    func();
                }
                else {
					console.log("storage-core.js: initStat is false. do _funcsCache.push");
                    _funcsCache.push(func);
                }
            }
        }, $.EventTarget)
    });

    /**
     * ��ʼ����������ʹ�õ� flash ģʽ����Ҫ�ȴ� flash store engine ׼����
     */
    function _init() {
        if (!initStat) {
            _loadDependence(function () {
                if (Engine === 'swfStoreTemp') {
                    $(function () { //ȷ�� DOMReady
                        _initSwfStore();
                        $('#swf-storage').bind('contentReady.flash',function () {
                            Engine = $(this).flash('getEngine');
                            console.log("storage-core.js: swfstorage flash mode ......");
                                _completeInit();
                        }).bind('error.flash',function (ev, o) {
                                console.log("swfstorage error.flash");
                                $.util.storage.trigger('error', o);
                            }).bind('securityError.flash',function (ev, o) {
                                console.log("storage-core.js: storage securityError.flash");
                                $.util.storage.trigger('securityError', o);
                            }).bind("swfReady.flash", function () {
                                console.log("storage-core.js: swfstorage ready");
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
     * ��������ʼ�����ı�״̬��ִ�������֮ǰ�����Ķ���
     */
    function _completeInit() {
        initStat = true;
        console.log("storage-core.js: _completeInit");
        for (var i = 0, l = _funcsCache.length; i < l; i++) {
            _funcsCache[i]();
        }
    }

    /**
     * �������
     */
    function _loadDependence(callback) {
        if (_isAllOk()) {
            callback();
            return;
        }
        for (var i = 0, l = dependence.length; i < l; i++) {
            (function (i) {
                $.use(dependence[i], function () {
                    dependence[i] = true;
                    if (_isAllOk()) {
                        callback();
                    }
                    ;
                });
            })(i)
        }
    }

    /**
     * ��ʼ��swf store
     */
    function _initSwfStore() {
        $('<div id="swf-storage">').appendTo('body').css({
            position:'absolute',
            left:'0px',
            top:'0px',
            width:'1px',
            height:'1px'
        }).flash({
                module:'storage'
            });
        console.log("storage-core.js: _initSwfStore() .....");
    }

    /**
     * �ж��Ƿ����е��������Ѿ�OK
     */
    function _isAllOk() {
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

})(jQuery);

