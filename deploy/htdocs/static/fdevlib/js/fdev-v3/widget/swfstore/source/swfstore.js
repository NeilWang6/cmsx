/// <reference path="http://style.c.aliimg.com/js/fdevlib/core/fdev-min.js"/>
/// <reference path="http://style.c.aliimg.com/js/fdevlib/widget/flash/fdev-flash-min.js"/>

/**
* FD.SWFStore
*
* Flash�������ݴ洢
* ���ƣ�
* 		1�����밲װFlash Player 9.0������
* 		2���������js/fdevlib/core/fdev.js��js/fdevlib/widget/flash/fdev-flash-min.js
* 		3��ʹ��ʱ��Ҫע�⣬Flash������Ҫʱ�䣬����engineReady�¼����к�������
*
* ���÷�����
*
*		<script type="text/javascript">
*           //ɾ������
*           FD.SWFStore.removeItem('message');
*
*           FD.SWFStore.on('engineReady', function(){
*               //��ȡ����
*               var msg = FD.SWFStore.getItem('message');
*               //д������
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
* 1.1 ����HTML5/WebStorage�淶�Ľӿ�
*/

(function() {

    if (typeof (FD.SWFStore) != 'undefined') return;

    /**
    * Flash���ݴ洢���
    * ���Խ����ݴ洢��Flash sharedObject��
    */
    FD.SWFStore = (function() {

        //�¼�
        var evt = new YAHOO.util.EventProvider();
        /**
        * ��ʼ��
        */
        evt.createEvent('init');
        /**
        * ��ȫ����
        */
        evt.createEvent('securityError');
        /**
        * ���ݶ�дʱ����
        */
        evt.createEvent('error');
        /**
        * �����ʼ�����
        */
        evt.createEvent('engineReady');
        /**
        * ���ݷ����仯
        */
        evt.createEvent('dataChange');

        /** APIs **/

        return {

            Event: evt,

            /**
            * �Ƿ��Ѿ�����ʹ��
            */
            ready: false,

            /**
            * Ĭ������
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
            * ��¼ֵ
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
            * ��ȡֵ
            */
            getItem: function(key) {
                if (this.ready) {
                    return this._getFlash().getValueOf(key);
                } else {
                    throw new Error("SWFStore engine is not ready yet.");
                }
            },

            /**
            * ɾ��ֵ
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
            * ������б��ش洢���ݣ�����
            */
            clear: function() {
                var result = this._getFlash().clear();
                this._fireEvent('dataChange');
                return result;
            },

            /**
            * ��ȡ�Ѿ��洢�ĳ���
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

                //10���Ӻ�ʱ
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