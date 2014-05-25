/**
 * author honglun.menghl date 2011-11-8 web 旺旺
 * 主程序,控制各模块初始化与业务逻辑(登陆登出逻辑与多TAB状态同步） 初始化顺序为:init storage -> login site ->init
 * localconnect -> init websocket -> login wangwang
 *
 * @update 20120301 by honglun.menghl 添加 chatTo 方法，暴露给 alitalk 组件使用
 * @update 20120328 by xuping.nie 调整初始化顺序为:先检测是否登陆网站才初始化localconnect 增加限制，以host
 *         tab的登陆ID为唯一的登陆id,防止登陆多用户公享通道导致消息混乱
 *         login逻辑重写，增加主动登陆还是自动登陆，自动登陆需要检测用户是否已经在线 isLogin状态由 core.js统一维护
 * @update 20130408 by levy.jiny 调整最近联系人显示顺序，有未读消息的放前面
 */
jQuery.namespace('FE.sys.webww');

(function ($) {
    var R = FE.sys.webww.ui.lib.Ri18n;

    var CORE = FE.sys.webww.core, CHATWIN = FE.sys.webww.ui.chatwin, CONTACTS = FE.sys.webww.ui.contacts, HISTORY = FE.sys.webww.history, BIZ = FE.sys.webww.biz;
    var main = {
        //<editor-fold>
        // 用户状态缓存
        userStatus:{},
        // 历史消息

        historyMsgs:{},
        isHost:false,
        sync:{},
        latestChatWinStatus:null,
        latestTrayStatus:null,
        coreInit:false,
        // 消息发送标示缓存
        sendMsgAckSeq:{},
        _openContactTime:0,
        errorMsg:'',
        callInit:false,
        chatToID:"",
		chatOffer:"",//add by levy.jiny
        isNeedSync:false,
        isShowWebWW:false,
        initTime:0,
        _notifyCenter: null,

        //</editor-fold>
        init:function () {
            var self = this;
            self.initTime = new Date() - 0;
            if (!FE.util.IsLogin()) {
                $(document).trigger('unlogin.combosocket');
                return;
            }
            var uid = FE.util.LoginId();
            console.log("main.js: init ...logon id：" + uid);


            FE.sys.tabSync.prepare.init('webww' + uid);
            // 要求显示webww或未安装旺旺客户端
            if (!FE.util.alitalk.isInstalled || self.isShowWebWW) {

                // 初始化tray,isHideTray = true则不显示
                var isHideTray = FE.sys.webww.WEBWW_CONFIG && FE.sys.webww.WEBWW_CONFIG['isHideSysTray'];
                CONTACTS.init($.proxy(self.contactClick, self), isHideTray);

                if (!this._notifyCenter) {
                    this._notifyCenter = new FE.sys.webww.ui.notificationCenter();
                }
                $(document).bind("onerror.combosocket", function (event, name, msg) {
                    self.loginNotify(R('SERVER_ERROR'), R('SERVER_ERROR_MESSAGE', msg));
                });

                FE.sys.webww.storageCore.ready(function () {
                    console.log("main.js: storageCore ready ")
                    FE.sys.tabSync.prepare.ready(function () {
                        console.log("main.js: init:tab sync ready ");
                        self.sync = new FE.sys.tabSync.sync("main",
                            $.proxy(self._onSync, self),
                            $.proxy(self._onHostChange, self),
                            $.proxy(self._onHeartBeat, self)
                        );
                        FE.sys.tabSync.prepare.bindSync(self.sync);
                        // 自动init websocket连接，便于其他消息通讯
                        FE.sys.comboSocket.init();
                        self._onHostChange(FE.sys.tabSync.prepare.isHost);
                    });
                });
            } else { // 插件检测到已经安装旺旺客户端，并且非要求显示webww的页面，也需要自动初始化websocket消息通道。
			console.log("main.js: using PC client.comboSocket.init");
                FE.sys.webww.storageCore.ready(function () {
                    FE.sys.tabSync.prepare.ready(function () {
                        FE.sys.comboSocket.init();
                    });
                });
            }
        },
        /**
         * 登陆消息提醒
         * @param title 提醒标题
         * @param notice 提醒内容
         * @param timeout 提醒最长时间(ms)
         */
        loginNotify:function (title, notice, timeout) {
            timeout = timeout || 10000; //登陆消息默认最多显示10s
            var options = { title:title, html:notice, timeout:timeout};
            if (this._loginNotify) {
                this._loginNotify.reset(options)
            } else {
                this._loginNotify = this._notifyCenter.notify(options);
            }
        },
        /**
         * 对popLogin前后的回调函数的调用
         */
        _popLoginCallback:function (functionName) {
            try {
                var fun = FE.sys.webww.WEBWW_CONFIG[functionName];
                if (typeof fun !== "function") {
                    return true;
                }
                var result = fun();
                if ((result === undefined) || (result === 0)) {
                    return true;
                }
                console.log("main.js: " + functionName + " is failed(): " + result);
                return false;
            } catch (e) {
                return true;
            }
        },

        /*
         * 如果指定打开了聊天窗口则打开指定的聊天窗口
         */
        _openContact:function (needSyn) {
			var regoffer = new RegExp("(^|&)" + 'offerid' + "=([^&]*)(&|$)");
			var rsoffer = window.location.search.substr(1).match(regoffer);
            if (rsoffer !== null) {
                this.chatOffer = unescape(rsoffer[2]);
				console.log("_openContact find offerid: " + this.chatOffer);
            }
			
            var reg = new RegExp("(^|&)" + 'towimmid' + "=([^&]*)(&|$)");
            var rs = window.location.search.substr(1).match(reg);

            if (rs !== null) {
                this._openContactTime++;
                this.chatTo(unescape(rs[2]), true, this.chatOffer);
            }
        },

        popLogin:function (init) {
            var self = this;
            // 2012-07-19 garcia.wul 当弹出登录框时，先给出一个登录提示
            self._notifyCenter = new FE.sys.webww.ui.notificationCenter();
            var messageNotify = self._notifyCenter.notify({ title:R('NOTIFY_NOTICE_TITLE'), text:R('PREPARE_LOGIN'), timeout:10000});
            $.use("webww-logist", function () {
                FE.sys.logist({
                    source:'webim',
                    aliDomain:'exodus.1688.com',
                    onLoginSuccess:function () {
                        console.log("main.js: logon to website success");
                        FE.sys.logist('close');
                        self.isShowWebWW = true;
                        // 2012-04-25 garcia.wul 在登录成功后调用回调函数
                        if (!self._popLoginCallback("afterLogin")) {
                            return;
                        }
                        messageNotify && messageNotify.destroy();
                        init();
                    },
                    onRegistSuccess:function () {
                        FE.sys.logist('close');
                        self.isShowWebWW = true;
                        // 2012-04-25 garcia.wul 在注册成功后调用回调函数
                        if (!self._popLoginCallback("afterRegister")) {
                            return;
                        }
                        messageNotify && messageNotify.destroy();
                        init();
                    }
                });
            });
        },

        /**
         * 暴露给外面的接口，不要轻易改动接口 增加document ready封装，避免JS准备好之前点击旺旺图标产生JS错误
         */
        chatTo:function (mid, needSync, offerid) {
            var self = this;
            if (typeof needSync === "undefined") {
                needSync = true;
            }
			this.chatOffer = offerid;
            $(document).ready(function () {
                self._chatTo(mid, needSync, offerid);
            });
            return true;
        },

        _chatTo:function (mid, needSyn) {

            var self = this;
            if (typeof needSyn === "undefined") {
                var needSyn = true;
            }
            this.chatToID = mid;
            this.isNeedSync = needSyn;
            console.log("main.js: _chatTo:isLogin : " + CORE.isLogin() + " needSyn: " + this.isNeedSync);

            if (!CORE.isLogin()) { // 旺旺未登陆
                if (!FE.util.IsLogin()) { // 网站未登录
                    console.log("main.js: _chatTo: call site login");
                    // 2012-04-25 garcia.wul 增加用于在PopLogin前的回调函数
                    if (!FE.sys.webww.main._popLoginCallback("beforePopLogin")) {
                        return;
                    }
                    self.popLogin($.proxy(self.init, self));
                    // $(document).trigger('unlogin.combosocket');
                } else { // 网站已登陆
                    if (!this.callInit) {
                        console.log("main.js: _chatTo: call init");
                        self.isShowWebWW = true;
                        this.init();
                    } else {
                        console.log("main.js: _chatTo: call login");
                        this.login();
                    }
                }
            } else {
                console.log("main.js: _chatTo: call onLoginSucess");
                this._onLoginSuccess();
            }
            return true;
        },

        _onLoginSuccess:function () {
            var self = this;
            self._loginNotify && self._loginNotify.destroy();
            var curMid = FE.util.LoginId();
            var longMid = 'cnalichn' + curMid;
            console.log("main.js: _onLoginSuccess:chatToID: " + this.chatToID);
            if (this.chatToID === "") {
//                this._initChatWin(longMid);
                return;
            }

            if (this.chatToID === curMid) {
                this._notifyCenter.notify({ title:R('NOTIFY_NOTICE_TITLE'), text:R('CAN_NOT_CHAT_WITH_SELF'), timeout:2000});
                return;
            }
            var uid = 'cnalichn' + this.chatToID;
			var offerid = this.chatOffer;
			FE.sys.webww.storage.setOfferId(curMid,uid,offerid);
            CORE.callAddContact(uid);
            this._initChatWin(longMid);
            CHATWIN.openTab(uid);
            this.renderRecentList();
            var data = {
                "type":"addContact"
            };
            this.sync.syncData(data);
        },

        _initChatWin:function (uid) {
            var self = this;
            if (CHATWIN.isInited) {
                return;
            }
            CHATWIN.init(BIZ);
            CHATWIN.setUserInfo({
                uid:uid
            });
            CHATWIN.bind("onGetContact", function (event, uid, name) {
                CORE.callAddContact(uid, name);
            });
            CHATWIN.bind("sendMsg", function (event, uid, msg) {
                self.sendMsg(uid, msg);
            });
            CHATWIN.bind("onTabChange", function (event, tabStatus) {
                self.tabStatusSync(tabStatus)
            });

            // 自动打开以前存储的tab
            this._handleChatWinSync();
        },

        _onHostChange:function (isHost) {
            var self = this;
            this.isHost = isHost;
            if (!this.callInit) {
                this.callInit = true;
                var callbacks = {
                    callbackLogin:$.proxy(self.callbackLogin, self),

                    callbackStatusChange:$.proxy(self.callbackStatusChange,
                        self),

                    callbackMsg:$.proxy(self.callbackMsg, self),

                    callbackFile:$.proxy(self.callbackFile, self),

                    callbackMedia:$.proxy(self.callbackMedia, self),

                    callLogout:$.proxy(self.callbackLogout, self),

                    onFailMsg:$.proxy(self.onFailMsg, self),

                    onContactsChange:$.proxy(self.onContactsChange, self)
                };
                CORE.init(callbacks, function () {
                    return self.isHost;
                });
            }
            //方便人为根据标题字体颜色判断是否是host，深的是host
            isHost && $("#webatm-title").css("color","#333");
            CORE.onHostChange();
            self.login(false);
        },
        /**
         * 登陆旺旺（调用前需要登陆网站并且调用初始化websocket）
         */
        login:function (isForceLogin) {
            var self = this;
            if (self.isHost) {
                self.loginNotify(R('LOGIN_NOTICE'), R('LOGINING'));
                CORE.callLogin(isForceLogin);
            } else { // is not host
                self.loginNotify(R('LOGIN_NOTICE'), R('SYNCING'));
                self.sync.syncData({
                    'type':'clientInitRequest',
                    'content':{
                        'isForceLogin':isForceLogin
                    }
                }, 'toHostOnly');
            }
        },

        _onSync:function (data) {

            var self = this;
			console.log("main.js: received Request:" + data.type)
            switch (data.type) {
                case 'clientInitRequest' :
                    if (!CORE.isLogin()) {
                        console.log("main.js: received clientInitRequest , not login ,begin login ")
                        self.login(data.content.isForceLogin);
                    }
                    self._responseClientInit();
                    break;
                case 'initClient' :
                    self._clientInit(data.content);
                    break;
                case 'sendMsg' :
                    self._handleSendMsg(data.content);
                    break;
                case 'chatWinSync' :
                    self._handleChatWinSync();
                    break;
                    break;
                case 'addContact' :
                    self.renderRecentList();
                    break;
                case 'closeWindow' :
                    self._handlerCloseWindow(data.content);
                    break;
            }

        },

        _onHeartBeat:function () {
        },

        /**
         * host 回应初始化请求
         */
        _responseClientInit:function () {
            var self = this;
            //仅host才需要响应responseClientInit
            if(!this.isHost){
                return;
            }
            console.log("main.js: responseClientInit ...");
            var data = {
                "type":"initClient",
                "content":{
                    "isLogin":CORE.isLogin(),
                    "userStatus":self.userStatus,
                    "chatWinStatus":self.latestChatWinStatus,
                    "unreadMsgs":self.unreadMsgs
                }
            };

            self.sync.syncData(data);
        },

        _clientInit:function (data) {

            var pageName = $("#spanName");
            if (pageName !== null) {
                pageName.html(FE.util.LoginId());
            }

            if (!data.isLogin) {
                console.log("main.js: _clientInit：sync data isLogin: " + data.isLogin);
                CONTACTS.changeState(false);
                return;
            }

            if ((CORE.isLogin() !== data.isLogin) || (CORE.user.memberId != FE.util.LoginId())) {
                console.log("main.js: _handle synced login status ..");
                CORE.onLogin(data.isLogin);
                this.userStatus = data.userStatus;
                if (data.unreadMsgs) {
                    this.unreadMsgs = data.unreadMsgs;
                }
                this._handleChatWinSync();
            }
        },

        // login 后的回调
        callbackLogin:function (isSuccess, loginCode, msg) {

            var diff = new Date() - this.initTime;
            console.log("main.js: init to callbackLogin time:" + diff + " ms");
            CONTACTS.changeState(isSuccess);
            this.isLogin = isSuccess;
            console.log("main.js: callbackLogin: " + isSuccess);
            if (isSuccess) {
                this._onLoginSuccess();
                this.renderRecentList();
                this._responseClientInit();
            } else {
                var html = "";
                // 该用户已经在别处登陆,需要用户确认后再登陆
                if (CORE.protocol.isOtherPlaceLogin(loginCode)) {
                    html += R('CONFIRM_LOGIN_FORCE');
                } else {
                    html += R('RETRY');
                }
                html = msg + ',<a href="#" onclick="FE.sys.webww.main.onClickLoginAgain()" target="_self">' + html + '</a>';
                this.loginNotify(R('LOGIN_NOTICE'), html);
                console.log(msg);
            }
        },
        onClickLoginAgain:function () {
            FE.sys.webww.storageCore.ready(function () {
                var STORE = FE.sys.webww.storageCore;
                STORE.setJson('combo-socket', {
                    'beKicked':false
                });
            });
            this._loginNotify && this._loginNotify.destroy();
            if (!FE.util.IsLogin()) {
                window.open('https://login.1688.com/member/signin.htm');
            } else {
                if (FE.sys.webww.main) {
                    console.log('main.js:call login force');
                    FE.sys.webww.main.login(true);
                }
            }
            return false;
        },

        // 处理订阅的用户的状态变更
        callbackStatusChange:function (statusList) {
            var self = this, changed = false;
            $.each(statusList, function (i, item) {
                var uid = item.userId, status =
                    CORE.protocol.decodeStatus(item.predefStatus);
                if (self.userStatus[uid] !== status) {
                    self.userStatus[uid] = status;
                    CHATWIN.updateTabStatus(uid, status);
                    changed = true;
                }
            });

            if (changed) {
                self.renderRecentList();
                changed = false;
            }
        },

        // 处理新消息
        callbackMsg:function (msg) {
            var self = this;

            if (!CHATWIN.isShow()) {
                HISTORY.addUnreadMsg(msg);
            } else {
                if (!CHATWIN.showMsg(msg.senderId, msg)) {
                    HISTORY.addUnreadMsg(msg);
                }
            }
            self._newMsgNotify(msg);
            self.renderRecentList();
        },

        _newMsgNotify:function (msg) {
            var self = this;
            var content = msg['msg'] || msg["msgContent"];
            content = CORE.protocol.processMessage(content, true);
			if(content == "")return;
            BIZ.requestUname(msg.senderId, function (uid, uname) {
                self._notifyCenter.notify({
                    title:R('RECEIVE_MESSAGE_NOTIFY', uname),
                    html:content,
                    timeout:2000
                });
            });
        },

        callbackFile:function (msg) {
            this._showErrMsg(R('RECEIVE_FILE'), msg.fromId, msg.sendTime);
        },

        callbackMedia:function (msg) {
            this._showErrMsg(R('REVEIVE_AUDIO'), msg.fromId, msg.sendTime);
        },

        callbackLogout:function () {
            console.log("main:callbackLogout");
            CONTACTS.changeState(false);
            this.loginNotify(R('LOGOUT_NOTICE'), R('LOGOUTED'), 5000);
            if (CHATWIN.isReady) {
                CHATWIN.hide();
            }
        },

        onFailMsg:function (msg) {
            console.log(msg);
        },

        _showErrMsg:function (msg, fromId, sendTime) {
            var errMsg = {
                time:sendTime,
                errMsg:msg,
                senderId:fromId,
                errType:'normal'
            };
            if (CHATWIN.isReady) {
                CHATWIN.showErrMsg(JSON.stringify(errMsg));
            }
        },

        _showSysErrMsg:function (msg) {
            this.errorMsg = msg;
            var sendTime =
                sendTime || (new Date()).format('yyyy-MM-dd hh:mm:ss'), errMsg =
            {
                time:sendTime,
                errMsg:msg,
                errType:'system'
            };
            if (CHATWIN.isReady) {
                CHATWIN.showErrMsg(JSON.stringify(errMsg));
            }
        },


        // 最近联系人列表有更新
        onContactsChange:function (contacts) {
            this.renderRecentList(contacts);
        },

        // 点击最近联系人列表中的联系人的操作
        contactClick:function (uid) {
            if (!CHATWIN.isInited) {
                this._initChatWin(uid);
            }
            CHATWIN.openTab(uid);
        },

        // 渲染最近联系人列表
        renderRecentList:function (contacts) {
            var self = this;
            contacts = contacts || CORE.callRecentContacts() || [];
            if (CORE.isLogin() === false) {
                return;
            }
            if (contacts.length === 0) {
                CHATWIN.renderRecentContacts();
                CONTACTS.renderList(contacts);
                return;
            }
            CORE.getMemberNamesByAliTalkIds(contacts, function (data) {
                $.each(data, function (i, item) {
                    var uid = item.uid, status = self.userStatus[uid] || 'offline';
                    data[i].status = status;
                    if ($.isArray(HISTORY.unreadMsgs[uid])) {
                        data[i].unreadCount = HISTORY.unreadMsgs[uid].length;
                    }
                });
				//根据消息数排序
				var sort = [], old = [];
				for ( var i=0 ; i < data.length ; ++i ) { 
					if(sort.length > 50)break;
				　　if ( data[i].unreadCount && data[i].unreadCount > 0 ) { 
						sort.push(data[i]);
				　　} 
					else{
						old.push(data[i]);
					}
			　　}
				for ( var i=0 ; i < old.length ; ++i ) { 
					if(sort.length > 50)break;
					sort.push(old[i]);
			　　}
				
                CHATWIN.renderRecentContacts(sort);
                CONTACTS.renderList(sort);
            });
        },

        // 发消息
        sendMsg:function (uid, msg) {
            var sendedMsg = FE.sys.webww.core.callSendMessage(uid, msg);
            var data = {
                "type":"sendMsg",
                "content":{
                    "sendedMsg":sendedMsg,
                    "targetId":uid
                }
            };
            this._handleSendMsg(data.content);
            this.sync.syncData(data);
        },

        /**
         * 实际显示消息
         *
         * @param {Object}
            *            data
         */
        _handleSendMsg:function (data) {
            var sendedMsg = data.sendedMsg;
            var targetId = data.targetId;
            if (sendedMsg.ackSeq !== this.sendMsgAckSeq[targetId]) {
                CHATWIN.showMsg(targetId, data.sendedMsg);
                this.sendMsgAckSeq[targetId] = sendedMsg.ackSeq;
            }
        },

        /**
         * 提供给 flash 用来关闭聊天窗口，发送关闭的消息给全体tab
         */
        closeWindow:function () {
            var data = {
                "type":"closeWindow",
                "content":{
                    "closeWindow":true
                }
            };
            this._handlerCloseWindow(data);
            this.sync.syncData(data);
        },

        /**
         * 真正执行关闭窗口操作
         *
         * @param {Object}
            *            data
         */
        _handlerCloseWindow:function (data) {
            if (data.closeWindow === true) {
                CHATWIN.closeWindow();
                this.latestChatWinStatus = null;
            }
        },

        /**
         *  调用此方法来和其他 tab 同步
         */
        tabStatusSync:function (statusData) {
            var statusData = JSON.stringify(statusData);
            statusData = decodeURIComponent(statusData);
            var data = {
                "type":"chatWinSync",
                "content":{
                    "statusData":statusData
                }
            };
            this.latestChatWinStatus = statusData;
            CORE.storage.storeTabStatus(CORE.getLongUid(), statusData);
            this.sync.syncData(data);
        },

        /**
         * 处理 tab 切换的同步
         */
        _handleChatWinSync:function () {
            var self = this;
            var chatStatus = CORE.storage.getTabStatus(CORE.getLongUid());
            if (this.latestChatWinStatus !== chatStatus) {
                this.latestChatWinStatus = chatStatus;
                if (CHATWIN.isReady) {
                    try {
                        chatStatus = JSON.parse(chatStatus);
                        console.log('main.js:chatStatus:' + chatStatus);
                    } catch (e) {
                        console.log('main.js:parse chatStatus error: ' + e.message, 'error', 'SYNC');
                        return;
                    }
                    CHATWIN.syncTabStatus(chatStatus);
                }
                // 为client页面，直接根据参数打开tab
                if (!self.isHost && self._openContactTime === 0) {
                    self._openContact(true);
                }
            }
        }
    };

    FE.sys.webww.main = main;

    var isMyChatPage = function () {
        var ismychat =
            window.location.href.toLowerCase().indexOf('mychat.htm') >= 0;
        var ismy_chat =
            window.location.href.toLowerCase().indexOf('my_chat.htm') >= 0;

        return (ismy_chat || ismychat);
    };

    var doMyChat = function () {
		console.log("main.js: doMyChat...");
		
		var regoffer = new RegExp("(^|&)" + 'offerid' + "=([^&]*)(&|$)");
		var rsoffer = window.location.search.substr(1).match(regoffer);
        if (rsoffer !== null) {
            FE.sys.webww.main.chatOffer = unescape(rsoffer[2]);
			console.log("doMyChat find offerid: " + FE.sys.webww.main.chatOffer);
        }
			
        var reg = new RegExp("(^|&)" + 'towimmid' + "=([^&]*)(&|$)");
        var rs = window.location.search.substr(1).match(reg);
        if (rs !== null) {
            FE.sys.webww.main.chatTo(unescape(rs[2]), true, FE.sys.webww.main.chatOffer);
        } else {
            FE.sys.webww.main.isShowWebWW = true;
            FE.sys.webww.main.init();
        }
    };

    $(document).ready(function () {
        // 为了和work平台配合,一定得在这儿初始化,不然word平台的msgcenter也new synctab时会出错
        FE.sys.pubsub.init(FE.sys.comboSocket);
        if (isMyChatPage()) {
            // 2012-04-25 garcia.wul 当只有网站没有登录时，才进行登录
            if (!FE.util.IsLogin()) {
                // 2012-04-25 garcia.wul 增加用于在PopLogin前的回调函数
                if (!FE.sys.webww.main._popLoginCallback("beforePopLogin")) {
                    return;
                }
				console.log("main.js: web is nologin, call main.popLogin");
                FE.sys.webww.main.popLogin($.proxy(FE.sys.webww.main.init,
                    FE.sys.webww.main));
            }
            doMyChat();
        } else if (FE.util.IsLogin()) {// 网站已经登陆，要求旺旺自动登陆
			console.log("main.js: web is login, call main.init");
            FE.sys.webww.main.init();
        }

        if (!FE.util.IsLogin()) {
            console.log("main.js: no init since no logon to website");
        }
    });

})(jQuery);
