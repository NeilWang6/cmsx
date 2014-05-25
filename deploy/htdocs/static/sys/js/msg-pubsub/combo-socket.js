/**
 * author honglun.menghl date 2011-11-7 websocket
 * proxy,封装websocket功能，并负责建立websocket
 *
 * @dependence : pubsub.js, localconnect.js, tab-sync.js events: onopen onclose
 * @update by tony_nie 2012-3-28
 *         由于多个同时connect会导致connect失败,新增状态变化，防止启动多个同时进行connect
 *         TODO:解决websocket重新new的问题，增加重连机制
 */

('comboSocket' in FE.sys) || (function ($) {

    var wwServer = FE.sys.webww.server.webww;

    var comboSocket = $.extend({

        readyState:3,

        isHost:false,

        _activeScene:['system'], // 已经激活的场景

        userInfo:{},

        monitor:'off',

        beKicked:false,

        lastMsgTime:0,

        _monitorT:0,

        status:"closed", // 状态变换 closed ->connecting ->opened|timeout ->
        // closed

        cacheSocketSendData:[], // 若socket未开启，但有发送消息的需求，就将数据先保存，当socket开启后，再将数据发送出去

        init:function () {
            var self = this;
            if (!FE.util.IsLogin()) {
                $(document).trigger('unlogin.combosocket');
                return;
            }

            FE.sys.tabSync.prepare.ready(function () {
                // console.log('combosocket：tab sync ready');
                self.sync = new FE.sys.tabSync.sync("combosocket",
                    $.proxy(self._onSync, self),
                    $.proxy(self._onHostChange, self),
                    $.proxy(self._onHeartBeat, self)
                );
                FE.sys.tabSync.prepare.bindSync(self.sync);
                self._onHostChange(FE.sys.tabSync.prepare.isHost);
            });
        },

        /**
         * @param {
            *            object | string } data . The data you want send to the
         *            server 所有的数据都通过主 tab 发送，所以这里不急于发送数据，而是通过 syncData 同步到主 tab ,
         *            由于只需要主 tab 收到这个数据，所以 type 选 toHostOnly
         */
        send:function (data) {
            if ($.isPlainObject) {
                data = JSON.stringify(data);
            }
            this.sync.syncData({
                "type":"wssend",
                "content":data
            }, 'toHostOnly');
        },

        /**
         * @param {
            *            string } scene . scene name 添加场景的方法，pubsub
         *            组件需要调用这个来添加场景。放在 combo-socket 的原因是，这里可以方便同步到主 tab
         *            去，然后判断这个场景是否处于激活状态，如果处于激活状态，就不需要重复添加
         */
        addScene:function (scene) {
            var data = {
                "type":"sceneOp",
                "content":{
                    "action":"addScene",
                    "scene":scene
                }
            };
            // console.log("combo addScene...");
            this.sync.syncData(data, 'toHostOnly');
        },

        /**
         * @param {
            *            string } scene . scene name 删除场景方法。
         *            pubsub组件需要调用这个来删除场景。放在这里的原因同样是，这里可以方便同步到主 tab ，然后主 tab
         *            不急于删除此场景，而是要要询问其他 tab 是否都不在需要此场景，只有所有的场景 都确认不再需要此场景，才能安全删除
         *            TODO ：此方法并未实现，需要实现下面的 _reqRemoveScene 方法
         */
        removeScene:function (scene) {
            var data = {
                "type":"sceneOp",
                "content":{
                    "action":"removeScene",
                    "scene":scene
                }
            };
            this.sync.SyncData(data, 'toHostOnly');
        },

        /**
         * @param {
            *            string } scene . scene name 获取场景的状态，pubsub 组件也需要调用这个来确认状态。
         */
        getSceneState:function (scene) {
            return this.readyState === 1 && $.inArray(scene, this._activeScene) !== -1;
        },

        /**
         * 根据同步的消息类型选择处理函数
         */
        _onSync:function (data) {

            var self = this;
            switch (data.type) {
                case 'wsmsg' :
                    self._handleMsg(data.content);
                    break;
                case 'wsctrl' :
                    self._handleWsControl(data.content);
                    break;
                case 'wssend' :
                    // console.log("wssend:" + data.content);
                    self._handleWsSend(data.content);
                    break;
                case 'clientInit' :
                    self._handleClientInit();
                    break;
                case 'syncStatus' :
                    self._handleSyncStatus(data.content);
                    break;
                case 'sceneOp' :
                    self._handleSceneOp(data.content);

            }
        },

        _onHostChange:function (isHost) {
            var self = this;
            self._activeScene = ['system'];

            if (isHost) {
                this._connect();
                self.isHost = true;
            } else {
                self.sync.syncData({
                    'type':'clientInit'
                }, 'toHostOnly');
                self.isHost = false;
            }
        },

        _monitorStart:function () {
            if (this.monitor != 'on') {
                var self = this;
                _monitorT = setInterval(function () {
                    self._monitor();
                }, 1000);
                this.monitor = 'on';
            }
        },

        _monitorStop:function () {
            clearInterval(_monitorT);
            this.monitor = 'off';
        },

        _monitor:function () {
            var self = this;
            var timeDiff = new Date().getTime() - this.lastMsgTime;

            FE.sys.webww.storageCore.ready(function () {
                var STORE = FE.sys.webww.storageCore;
                var beKicked = STORE.getJson('combo-socket', {
                    'beKicked':false
                });
                if (beKicked !== null) {
                    self.beKicked = beKicked.beKicked;
                } else {
                    self.beKicked = false;
                }
            });

            if (this.userInfo.loginId !== FE.util.LoginId() && this.socket) {
                // console.log('combo-socket:_monitor:logon false');
                this.socket.close();
                this._onclose();
            }

            if (FE.util.LoginId() !== null && this.readyState == 3 && !this.beKicked) {
                // console.log('combo-socket:_monitor:logon true');
                // 由于websocket在ie下重新new会报错，只有重刷页面解决该问题{
                this.socket.close();
                this._onclose();
                // history.go(0); 带来不少 BUG，先去掉重新连接的功能 TODO: 用更好的办法来重连
            }

            return false;
        },

        _onHeartBeat:function () {
            if (this.sync.isHost && this.userInfo.loginId) {
                if (this.userInfo.loginId !== FE.util.LoginId() && this.socket) {
                    this.socket.close();
                }
            }
        },

        _handleMsg:function (data) {
            try {
                data = JSON.parse(data);
            } catch (e) {
                return false;
            }

            this.trigger('onmessage', data);
        },

        _handleWsControl:function (data) {
            if (data === 'onopen') {
                this.readyState = 1;
                this.trigger('onopen');
            } else if (data === 'onclose') {
                this.readyState = 3;
                // console.log('combo-socket.js:_handleWsControl:onclose');
                this.trigger('onclose');
            }
        },

        _handleWsSend:function (data) {
            if (this.sync.isHost) {
                this.socket.send(data);
            }
        },

        // Host 处理 client init 的请求
        _handleClientInit:function () {
            this._syncStatus();
        },

        _handleSyncStatus:function (data) {
            var self = this;
            if (data.readyState === 1 && this.readyState !== 1) {
                this.readyState = 1;
                this.trigger('onopen');
            }
            this._activeScene = data.activeScene;
            // console.log('sync status: readyState is ' + this.readyState);
            // console.log(this._activeScene);
            $.each(this._activeScene, function (i, item) {
                self.trigger('onSceneActive', {
                    scene:item
                });
            });
        },

        _syncStatus:function () {
            var self = this;
            var data = {
                type:'syncStatus',
                content:{
                    readyState:self.readyState,
                    activeScene:self._activeScene
                }
            };
            this.sync.syncData(data);
        },

        _handleSceneOp:function (data) {
            if (data.action === 'addScene') {
                this._reqAddScene(data.scene);
            } else if (this.action === 'removeScene') {
                this._reqRemoveScene(data.scene);
            }

        },

        _reqAddScene:function (scene) {
            if ($.inArray(scene, this._activeScene) === -1) {

                var data = {
                    "scene":"system",
                    "content":{
                        "mType":"subscribe",
                        "name":scene
                    }
                };
                data = JSON.stringify(data);
                if (!this.socket) {
                    this.cacheSocketSendData.push(data);
                    return;
                }
                this.socket.send(data);
                /* this.socket.send('test'); */
            }
        },

        _reqRemoveScene:function (scene) {
            // todo
        },

        _connect:function () {
            var self = this;
            if (self.status !== "closed") { // 必须处于closed状态才能开始建立连接，防止重复建立
                // console.log("warn: can't connect before closed,now status:" + self.status);
                return;
            }
            if (this.socket && this.socket.readyState === 1) {
                // console.log("warn:connect has established!");
                return;
            }
            // console.log("combsocket connecting ...");
            self.status = "connecting";

            var url = wwServer + '/message/ajax/getDomain.html';
            $.ajax(url, {
                dataType:'jsonp',
                timeout:10000
            }).success(function (data) {
                    if (data.success && data.domain) {
                        self._initLogin(data.domain);
                    } else if (data.errorMsg === 'unlogin') {
                        $(document).ready(function () {
                            $(document).trigger('unlogin.combosocket');
                        });
                    }
                }).error(function (data) {
                    // console.log("getDomain:" + url + " fail");
                    self.status = "closed";
                    $(document).trigger('onerror.combosocket',
                        ['getdomain', '获取域名失败']);
                });
        },

        /**
         * 添加这个额外的 HTTP 请求的原因是：在不支持 websocket 的浏览器下，使用 flash 的方式来模拟， 但是中国站的
         * coockie 中一个验证用户用的 cn_tmp 是 http only 的，flash 的实现方式是需要借助 js 来取
         * document.cookie 的，这样的话，就取不到 cn_tmp 的值，服务器端会验证失败。
         *
         * 于是，多发送这次 HTTP 请求，用来验证用户,返回的随机数，在接下来建立 websocket 的时候，发送过去， 用来和 session
         * 中的比较，变相验证用户登陆状态
         */
        _initLogin:function (domain) {
            var start = new Date() - 0;
            // console.log('init request at ' + start);
            var self = this;
            var url = 'http://' + domain + '/init';
            $.ajax(url, {
                dataType:'jsonp'
            }).success(function (data) {
                    var diff = new Date() - start;
                    // console.log('init response elapse ' + diff + " ms");
                    if (data.success === true && data.data.w_s_id) {
                        self._initWebSocket(domain, data.data);
                    } else {
                        $(document).ready(function () {
                            $(document).trigger('unlogin.combosocket');
                        });
                    }
                }).error(function (data) {
                    // console.log("init login response: " + url + " fail,status = CLOSED");
                    self.status = "closed";
                    $(document).trigger('onerror.combosocket',
                        ['initlogin', '初始化登陆失败']);
                });
        },

        _initWebSocket:function (domain, extraData) {
            var self = this;
            // console.log("init WebSocket");
            // add webVersion = 0.0.1C
            self.socket = new FE.ui.WebSocket({
                url:'ws://' + domain + '/fc;' + extraData.w_s_id + '|0.0.1C',
                cid:'unify',
                onopen:$.proxy(self._onopen, self),
                onmessage:$.proxy(self._onmessage, self),
                onclose:$.proxy(self._onclose, self)
            });
            setTimeout(function () {
                if (self.status === "connecting") { // 依然处于connecting状态，超时
                    $(document).trigger('onerror.combosocket',
                        ["websokect", '初始化链接超过10s']);
                }
            }, 10000);
        },

        _onopen:function () {
            // console.log('combo-socket:_onopen:called');
            var self = this;
            self.status = "opened";
            if (this.cacheSocketSendData.length > 0) {
                $.each(this.cacheSocketSendData, function (idx, data) {
                    self.socket.send(data);
                });
                this.cacheSocketSendData = [];
            }
            this.sync.syncData({
                "type":"wsctrl",
                "content":"onopen"
            });
            if (this.sync.isHost) {
                this.userInfo.loginId = FE.util.LoginId();
            }
            // this._monitorStart();
        },

        _onmessage:function (ev) {
            this.lastMsgTime = new Date().getTime();
            var data = null;
            if (ev.type === 'message' && ev.data) {
                try {
                    data = JSON.parse(ev.data);
                } catch (e) {
                    return false;
                }

                if (data.scene === 'system') {
                    this._handleSysMsg(data.content);
                } else if (data.mType == '1025') {
                    // 被踢掉的情况
                    FE.sys.webww.storageCore.ready(function () {
                        var STORE = FE.sys.webww.storageCore;
                        STORE.setJson('combo-socket', {
                            "beKicked":true
                        });
                        $(document).trigger('onerror.combosocket', ['websocket', '该用户被踢掉线']);
                    });
                } else {
                    this.sync.syncData({
                        "type":"wsmsg",
                        "content":ev.data
                    });
                }
            }
        },

        _handleSysMsg:function (data) {
            try {
                data = JSON.parse(data);
            } catch (e) {
                return false;
            }

            var scene = null;
            if (data.mType === 'subscribe' && data.result) {
                scene = data.name;
                if ($.inArray(scene, this._activeScene) === -1) {
                    this._activeScene.push(scene);
                    this._syncStatus();
                }
            } else if (data.mType === 'unsubscribe' && data.result) {
                scene = data.name;
                index = $.inArray(scene, this._activeScene);
                if (index !== -1) {
                    this._activeScene.splice(index, 1);
                    this._syncStatus();
                }
            }
        },

        _onclose:function () {
            self.status = "closed";
            $(document).trigger('onerror.combosocket', ['websocket', '链接被关闭']);
            // console.log('combo-socket:_onclose:called');
            this.sync.syncData({
                "type":"wsctrl",
                "content":"onclose"
            });
        }

    }, $.EventTarget);

    FE.sys.comboSocket = comboSocket;

})(jQuery);
