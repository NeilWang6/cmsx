/// <reference path="http://style.c.aliimg.com/js/fdevlib/core/fdev-min.js"/>
/// <reference path="http://style.c.aliimg.com/js/fdevlib/widget/flash/fdev-flash-min.js"/>

/**
* FD.SWFStore
*
* Flash本地数据存储
* 限制：
* 		1、必须安装Flash Player 9.0及以上
* 		2、必须包含js/fdevlib/core/fdev.js和js/fdevlib/widget/flash/fdev-flash-min.js
* 		3、使用时需要注意，Flash加载需要时间，监听engineReady事件进行后续处理
*
* 调用方法：
*
*		<script type="text/javascript">
*           //删除数据
*           FD.SWFStore.removeItem('message');
*
*           FD.SWFStore.on('engineReady', function(){
*               //读取数据
*               var msg = FD.SWFStore.getItem('message');
*               //写入数据
*   			FD.SWFStore.setItem('message', 'Hello!');
*               ...
*           });
*           FD.SWFStore.init();
*           
*		</script>
*
* @author 	hua.qiuh <hua.qiuh@alibaba-inc.com>
* @version 1.1
* @changelogs 
* 1.1 增加HTML5/WebStorage规范的接口
*/

(function() {

    if (typeof (FD.SWFStore) != 'undefined') return;

    /**
    * Flash数据存储组件
    * 可以将数据存储到Flash sharedObject中
    */
    FD.SWFStore = (function() {

        //事件
        var evt = new YAHOO.util.EventProvider();
        /**
        * 初始化
        */
        evt.createEvent('init');
        /**
        * 安全错误
        */
        evt.createEvent('securityError');
        /**
        * 数据读写时错误
        */
        evt.createEvent('error');
        /**
        * 引擎初始化完毕
        */
        evt.createEvent('engineReady');
        /**
        * 数据发生变化
        */
        evt.createEvent('dataChange');

        /** APIs **/

        return {

            Event: evt,

            /**
            * 是否已经可以使用
            */
            ready: false,

            /**
            * 默认配置
            */
            config: {
                swfUrl: 'http://img.china.alibaba.com/swfapp/swfstore/swfstore.swf',
                local_path: '/',
                start_delay: 500,
                write_mode: false
            },

            init: function(conf) {
                this.config = FD.common.applyIf(conf || {}, this.config);
                this._initEngine();
                this.Event.fireEvent('init');
            },

            /**
            * 记录值
            */
            setItem: function(key, v) {
                if (this.ready) {
                    var result = this._getFlash().setItem(key, v);
                    this._fireEvent('dataChange', {
                        key: key, value: v
                    });
                    return result;
                } else {
                    this._dataProxy[key] = v;
                    this.init();
                }
            },

            /**
            * 获取值
            */
            getItem: function(key) {
                if (this.ready) {
                    return this._getFlash().getValueOf(key);
                } else {
                    throw new Error("SWFStore engine is not ready yet.");
                }
            },

            /**
            * 删除值
            */
            removeItem: function(key) {
                if (this.ready) {
                    var result = false;
                    try {
                        result = this._getFlash().removeItem(key);
                    } catch (e) { }
                    this._fireEvent('dataChange', {
                        key: key, value: null
                    });
                    return result;
                } else {
                    this._dataProxy[key] = this._deleteFlag;
                    this.init();
                }
            },

            /**
            * 清除所有本地存储数据，慎用
            */
            clear: function() {
                var result = this._getFlash().clear();
                this._fireEvent('dataChange');
                return result;
            },

            /**
            * 获取已经存储的长度
            */
            getLength: function() {
                return this._getFlash().getLength();
            },

            /**
            * 
            */
            key: function(index) {
                return this._getFlash().getNameAt(index);
            },

            on: function() {
                return this.Event.subscribe.apply(this.Event, arguments);
            },

            isAvailable: function() {
                return FD.widget.Flash && swfobject.hasFlashPlayerVersion("9");
            },

            //--- private
            _swf: null,
            _deleteFlag: {},
            _dataProxy: {},
            _initEngine: function() {

                var swf, swfConf = {
                    width: '1',
                    height: '1',
                    url: this.config.swfUrl,
                    id: 'storageSwf',
                    flashvars: {
                        localPath: this.config.local_path,
                        startDelay: this.config.start_delay,
                        allowedDomain: location.hostname
                    },
                    insert: false,
                    allowScriptAccess: 'always'
                };

                if (this.config.write_mode) {
                    swf = new FD.widget.Flash(null, swfConf);
                    swf.write();
                } else {
                    var div = document.createElement('div');
                    div.innerHTML = '<span id="storageSwf"></span>';
                    $D.setStyle(div, 'width', '1px');
                    $D.setStyle(div, 'height', '1px');
                    $D.setStyle(div, 'position', 'absolute');
                    $D.setStyle(div, 'left', '0');
                    $D.setStyle(div, 'top', '0');
                    document.body.appendChild(div);
                    swf = FD.widget.Flash.init('storageSwf', swfConf);
                }
                this._swf = swf;
                swf.on('ALLEVENT', this._swfEventHandler, this);

                //10秒钟后超时
                if (this._TRIGGER) {
                    clearTimeout(this._TRIGGER);
                }
                this._TRIGGER = setTimeout(function() {
                    FD.SWFStore._onTimeout();
                }, FD.SWFStore.TIMEOUT);
            },

            _getFlash: function() {
                return this._swf.getFlash();
            },

            _swfEventHandler: function(evt) {
                switch (evt.type) {
                    case 'contentReady':
                        this._onEngineReady();
                        break;
                    default:
                        this._fireEvent(evt.type, evt);
                }
            },

            _onTimeout: function() {
                delete this._TRIGGER;
                this._fireEvent('error');
            },

            _onEngineReady: function() {

                if (this._TRIGGER) {
                    clearTimeout(this._TRIGGER);
                    delete this._TRIGGER;
                }

                this.ready = true;
                this._fireEvent('engineReady');
                for (var each in this._dataProxy) {
                    var v = this._dataProxy[each];
                    if (v == Object.prototype[each]) continue;
                    else if (v == this._deleteFlag) {
                        this.removeItem(each);
                    } else {
                        this.setItem(each, v);
                    }
                    delete this._dataProxy[each];
                }
            },

            _fireEvent: function(e, arg) {
                return this.Event.fireEvent(e, arg);
            }
        };
    })();

    FD.SWFStore.TIMEOUT = 10000;

    //turn YUIBridge event into FD Flash Event
    FD.SWFStore.EventHandler = function(swfid, evt) {
        evt.swfid = swfid;
        FD.widget.Flash.eventHandler(evt);
    };

})();