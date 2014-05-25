/**
 * author honglun.menghl date 2011-11-7 websocket
 * proxy,��װwebsocket���ܣ���������websocket
 *
 * @dependence : pubsub.js, localconnect.js, tab-sync.js events: onopen onclose
 * @update by tony_nie 2012-3-28
 *         ���ڶ��ͬʱconnect�ᵼ��connectʧ��,����״̬�仯����ֹ�������ͬʱ����connect
 *         TODO:���websocket����new�����⣬������������
 */

('comboSocket' in FE.sys) || (function ($) {

    var wwServer = FE.sys.webww.server.webww;

    var comboSocket = $.extend({

        readyState:3,

        isHost:false,

        _activeScene:['system'], // �Ѿ�����ĳ���

        userInfo:{},

        monitor:'off',

        beKicked:false,

        lastMsgTime:0,

        _monitorT:0,

        status:"closed", // ״̬�任 closed ->connecting ->opened|timeout ->
        // closed

        cacheSocketSendData:[], // ��socketδ���������з�����Ϣ�����󣬾ͽ������ȱ��棬��socket�������ٽ����ݷ��ͳ�ȥ

        init:function () {
            var self = this;
            if (!FE.util.IsLogin()) {
                $(document).trigger('unlogin.combosocket');
                return;
            }

            FE.sys.tabSync.prepare.ready(function () {
                // console.log('combosocket��tab sync ready');
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
         *            server ���е����ݶ�ͨ���� tab ���ͣ��������ﲻ���ڷ������ݣ�����ͨ�� syncData ͬ������ tab ,
         *            ����ֻ��Ҫ�� tab �յ�������ݣ����� type ѡ toHostOnly
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
            *            string } scene . scene name ��ӳ����ķ�����pubsub
         *            �����Ҫ�����������ӳ��������� combo-socket ��ԭ���ǣ�������Է���ͬ������ tab
         *            ȥ��Ȼ���ж���������Ƿ��ڼ���״̬��������ڼ���״̬���Ͳ���Ҫ�ظ����
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
            *            string } scene . scene name ɾ������������
         *            pubsub�����Ҫ���������ɾ�����������������ԭ��ͬ���ǣ�������Է���ͬ������ tab ��Ȼ���� tab
         *            ������ɾ���˳���������ҪҪѯ������ tab �Ƿ񶼲�����Ҫ�˳�����ֻ�����еĳ��� ��ȷ�ϲ�����Ҫ�˳��������ܰ�ȫɾ��
         *            TODO ���˷�����δʵ�֣���Ҫʵ������� _reqRemoveScene ����
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
            *            string } scene . scene name ��ȡ������״̬��pubsub ���Ҳ��Ҫ���������ȷ��״̬��
         */
        getSceneState:function (scene) {
            return this.readyState === 1 && $.inArray(scene, this._activeScene) !== -1;
        },

        /**
         * ����ͬ������Ϣ����ѡ������
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
                // ����websocket��ie������new�ᱨ��ֻ����ˢҳ����������{
                this.socket.close();
                this._onclose();
                // history.go(0); �������� BUG����ȥ���������ӵĹ��� TODO: �ø��õİ취������
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

        // Host ���� client init ������
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
            if (self.status !== "closed") { // ���봦��closed״̬���ܿ�ʼ�������ӣ���ֹ�ظ�����
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
                        ['getdomain', '��ȡ����ʧ��']);
                });
        },

        /**
         * ����������� HTTP �����ԭ���ǣ��ڲ�֧�� websocket ��������£�ʹ�� flash �ķ�ʽ��ģ�⣬ �����й�վ��
         * coockie ��һ����֤�û��õ� cn_tmp �� http only �ģ�flash ��ʵ�ַ�ʽ����Ҫ���� js ��ȡ
         * document.cookie �ģ������Ļ�����ȡ���� cn_tmp ��ֵ���������˻���֤ʧ�ܡ�
         *
         * ���ǣ��෢����� HTTP ����������֤�û�,���ص���������ڽ��������� websocket ��ʱ�򣬷��͹�ȥ�� ������ session
         * �еıȽϣ�������֤�û���½״̬
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
                        ['initlogin', '��ʼ����½ʧ��']);
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
                if (self.status === "connecting") { // ��Ȼ����connecting״̬����ʱ
                    $(document).trigger('onerror.combosocket',
                        ["websokect", '��ʼ�����ӳ���10s']);
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
                    // ���ߵ������
                    FE.sys.webww.storageCore.ready(function () {
                        var STORE = FE.sys.webww.storageCore;
                        STORE.setJson('combo-socket', {
                            "beKicked":true
                        });
                        $(document).trigger('onerror.combosocket', ['websocket', '���û����ߵ���']);
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
            $(document).trigger('onerror.combosocket', ['websocket', '���ӱ��ر�']);
            // console.log('combo-socket:_onclose:called');
            this.sync.syncData({
                "type":"wsctrl",
                "content":"onclose"
            });
        }

    }, $.EventTarget);

    FE.sys.comboSocket = comboSocket;

})(jQuery);
