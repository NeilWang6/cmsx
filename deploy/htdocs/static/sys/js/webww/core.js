/**
 * author hang.yangh <br>
 * 依赖 <br>
 * js/lib/fdev-v4/core/fdev-min.js js/lib/fdev-v3/util/bom-min.js <br>
 * js/app/im/webim/wim-m.js date 2011-10-20 <br>
 * web旺旺组件，提供各种通讯封装
 */

jQuery.namespace('FE.sys.webww');
('core' in FE.sys.webww) || (function ($) {
    var core = {
        // 存储组件,负责存储消息
        "storage":FE.sys.webww.storage,
        // 负责初使化和存储当前用户状态
        "user":FE.sys.webww.user,
        // protocol组件,负责处理消息协议
        "protocol":FE.sys.webww.protocol,

        /**
         * 是否是主要的tab页<br>
         * 主tab页才进行收到消息的存储等处理
         */
        "_isHost":null, //是否host的回调函数
        /**
         * 组件初使化
         *
         */
        "init":function (callbacks, isHost) {
            console.log("core.js:init");
            var self = this;
            this.protocol.init(this);
            this._isHost = isHost;
            FE.sys.webww.storageCore.ready(function () {
                console.log("core.js:storage core ready!");
//                self.storage.init(self);
                $.extend(self.callbacks, callbacks);
            });
        },

        "onHostChange":function () {
            this.user.status.isLogin = false;
        },
        getLongUid:function () {
            if (this.longUid) {
                return this.longUid;
            } else {
                var uid = FE.util.LoginId();
                this.longUid = "cnalichn" + uid;
                return this.longUid;
            }
        },

        /**
         * 登录
         *
         *  成功后会产生回调 callbackLogin
         */
        "callLogin":function (isForceLogin) {
            console.log('callLogin:isLogin = ' + this.isLogin() + ' isForceLogin:' + isForceLogin);
            if (!this.isLogin()) {
                console.log("call prepareSendLoginMsg");
                this.protocol.prepareSendLoginMsg(isForceLogin);
            }
        },
        /**
         * 发送消息
         *
         * @param uid
         *            发送消息对象的ID<br>
         *            需要是旺旺ID,加上旺旺ID头
         * @param msg
         *            发送消息的内容
         *
         */
        "callSendMessage":function (uid, msg) {
            // uid错误检查
            if (uid == null || uid == '' || uid == this.user.memberId) {
                return;
            }
            if (msg == null || msg == '') {
                return;
            }

            // 判读是否是黑名单中的人
            var isblack = this.storage.isBlack(uid, this.user.memberId);
            if (isblack) {
                return;
            }

            // 不是黑名单返回
            var contactId = uid;
            var memberId = this.user.memberId;

            /**
             * 如果该消息发送对向不在最近联系人列表中<br>
             * 加入最近联系人列表并发送订阅消息
             */
            if (!this.storage.isContact(memberId, contactId)) {
                this.protocol.feedState([ contactId ]);
            }

            // 发送消息
            var sendedMsg = this.protocol.sendMsg(contactId, msg,
                this.storage.msgCount(contactId));

            // 存储消息
            this.storage.storeMessage(sendedMsg, memberId);

            // 返回消息,发送成功
            return sendedMsg;
        },
        /**
         * 获取最近联系人列表
         *
         *  最近联系人旺旺id的数组
         */
        "callRecentContacts":function () {
            var contacts = null;
            var memberId = this.user.memberId;
            if (this.user.status.isLogin) {
                contacts = this.storage.getRecentContacts(memberId);
            }
            return contacts;
        },
        /**
         * 向最近联系人列表中增加一人
         *
         *
         */
        "callAddContact" : function(uid, uname) {
            var memberId = this.user.memberId;
            if(!uid || uid.length <= 8){ //无前缀
                return;
            }
            var rs = this.storage.addContact(uid, uname, memberId);
            // 如果是新的联系人,则订阅该联系人状态
            if(rs.add != null) {
                this.protocol.feedState([rs.add]);
            }
            /**
             * 如果联系人列表满了, 需要踢除一个 <br>
             * 将这个踢出的人取消息状态订阅
             */
            if(rs.remove != null) {
                this.protocol.cancelFeedState([rs.remove]);
            }
            // 如果最近联系人列表有变更,负责通知
            if(rs.add != null || rs.remove != null || rs.update != null) {
                this.onContactsChange();
            }
        },
        /**
         * 取该用户所有的历史消息
         *
         *  uid和其对应消息的map
         */
        "getLocalStoredMsgs":function () {
            var memberId = this.user.memberId;
            return this.storage.getMsgs(memberId);
        },
        /**
         * 用户登录
         *
         * @param 是否登录成功
         * @param 登录失败的消息
         *
         */
        "onLogin":function (success, loginCode, message) {
            // 登录成功实例化用户信息
            console.log("core.js onLogin");
            if (success) {

                this.user.init(this);
            }
            // 登录成功调用回调
            console.log("core.js callbackLogin:" + success);
            this.callbacks.callbackLogin(success, loginCode, message);
        },
        /**
         * 获得黑名单时的处理
         *
         * @param blackList
         *
         */
        "onBlackList":function (msg) {
            var blackList = msg.blackIds;
            // 只需要主tab页处理
            if (!this._isHost()) {
                return;
            }
            // 如果用户已登录将黑名单加入黑名单列表
            if (this.user.status.isLogin) {
                this.storage.storeBlackList(this.user.memberId,
                    blackList);
            } else {
                // 否则暂时存起来等登录完成再处理
                this.user.status.blackList = blackList;
            }
        },
        /**
         * 用户状态改变
         */
        "onStatusChange":function (msg) {
            // 调用回调
            this.callbacks.callbackStatusChange(msg.userStatusList);
        },
        /**
         * 最近联系人有变更的情况
         *
         *
         */
        "onContactsChange":function () {
            // 取最近联系人
            var contacts = this.callRecentContacts();
            // 传给回调
            this.callbacks.onContactsChange(contacts);
        },
        /**
         * 获得离线消息
         */
        "onOfflineMsg":function (msg) {
            var self = this;
            var offLineMsgs = msg.offLineMsgs;
            if (this.user.status.isblackListInit) {
                // 当用户的黑名单处理完毕可执行离线消息处理
                $.each(offLineMsgs, function () {
                    var senderId = this.fromId;
                    var sendTime = this.sendTime;
                    var msgContent = this.message;
                    var msg = {
                        'mType':'50',
                        'senderId':senderId,
                        'sendTime':sendTime,
                        'msgContent':msgContent,
                        'serverType':0
                    };
                    self.onMsg(msg, false);
                });
                self.protocol.sendOfflineBackMsg(offLineMsgs);
            } else {
                // 否则先存起来等黑名单处理完毕再处理
                this.user.status.offLineMsg = offLineMsgs;
            }
        },
        /**
         * 收到消息时处理
         *
         * @param msg
         *            消息体
         * @param needSendBack
         *            是否需要发送回执
         *
         */
        "onMsg":function (msg, needSendBack) {
            if (this._isHost()) {
                /**
                 * 发送回执<br>
                 * 告诉服务器消息成功接收<br>
                 * 下次登录则不会再推送
                 */
                if (needSendBack) {
                    this.protocol.sendBackMsg(msg);
                }
                /**
                 * 存储消息,并更改最近联系人逻辑<br>
                 * 如果联系人列表因超出而变更,则需要调整订阅状态
                 */
                var rs = this.storage.storeMessage(msg,
                    this.user.memberId);
                // 如果是黑名单则返回
                if (rs.isblack) {
                    return;
                }
                // 如果是新的联系人,则订阅该联系人状态
                if (rs.add != null) {
                    this.protocol.feedState([ rs.add ]);
                }
                /**
                 * 如果联系人列表满了, 需要踢除一个 <br>
                 * 将这个踢出的人取消息状态订阅
                 */
                if (rs.remove != null) {
                    this.protocol.cancelFeedState([ rs.remove ]);
                }
                // 如果最近联系人列表有变更,负责通知
                if (rs.add != null || rs.remove != null) {
                    this.onContactsChange();
                }
            }
            /**
             * 通知接入方消息到来
             */
            var uid = msg.senderId || msg.targetId;
            var isblack = false;
            if (uid != null) {
                isblack = this.storage.isBlack(uid, this.user.memberId);
            }
            if (!isblack) {
                this.callbacks.callbackMsg(msg);
            }
        },
        /**
         * 收到文件时的处理
         *
         * @param msg
         */
        "onFile":function (msg) {
            this.callbacks.callbackFile(msg);
        },
        /**
         * 收到音频或者视频时处理
         *
         * @param msg
         *
         */
        "onMedia":function (msg) {
            this.callbacks.callbackMedia(msg);
        },
        /**
         * 被挤下线或被强制退出
         *
         *
         */
        "onLogout":function () {
            this.user.status.isLogin = false;
            this.callbacks.callLogout();
        },
        /**
         * 系统出错
         *
         *
         */
        "onFailMsg":function () {
            this.callbacks.onFailMsg();
        },
        /**
         * 根据中文站ID获取旺旺ID
         *
         * @param mid
         *            中文站ID
         *
         */
        "getWrapMId":function (mid) {
            if (mid != '') {
                return 'cnalichn' + mid;
            }
            return mid;
        },
        "isLogin":function () {
            if(this.user) {
                return this.user.status.isLogin;
            }
            return false;
        },
        /**
         * 根据用户ID取用户名
         *
         * @param ids
         *            用户ID数组
         * @param callback
         *            得到数据后回调
         * @param realIds
         *            用户旺旺ID数组
         *
         */
        "getMemberNames":function (ids, callback, realIds) {
            var server = FE.sys.webww.server.webww;
            server += 'message/ajax/getMemberNames.htm';
            server += '\?memberIds=' + ids.join('|');
            var idArray = ids;
            var realIdArray = realIds;
            $.ajax({
                url:server,
                dataType:"jsonp",
                jsonp:"ns",
                success:function (data) {
                    if (callback != null) {
                        var nameMap = {};
                        for (var i = 0; i < data.length; i++) {
                            nameMap[data[i].uid] = data[i].uname;
                        }
                        var rs = [];
                        for (var i = 0; i < idArray.length; i++) {
                            var item = {};
                            var uid;
                            if (realIdArray != null) {
                                uid = realIdArray[i];
                            } else {
                                uid = idArray[i];
                            }
                            var uname = '';
                            if (uid.substring(0, 8) === "cnalichn") {
                                uname = nameMap[idArray[i]];
                            }

                            if (uname == null || uname == '') {
                                uname = idArray[i];
                            }
                            item.uid = uid;
                            item.uname = uname;
                            rs[i] = item;
                        }
                        callback(rs);
                    }
                }
            });
        },
        /**
         *
         * @param realIds
         * @param callback
         *
         */
        "getMemberNamesByAliTalkIds":function (realIds, callback) {
            var ids = [];
            for (var i = 0; i < realIds.length; i++) {
                ids[i] = realIds[i].substring(8);
            }
            this.getMemberNames(ids, callback, realIds);
        },
        /**
         * 暴露给外部的回调<br>
         * 使用本组件时,如果需要关心这些事件,则实现之
         */
        "callbacks":{
            /**
             * 收到登录回执消息后的处理
             *
             * @success 是否登录成功
             * @message 如果失败失败的消息
             */
            "callbackLogin":function () {
                console.log("default callbackLogin");
            },
            /**
             * 收到用户状态改变的消息
             *
             * @statusList 用户状态改变列表
             */
            "callbackStatuChange":function () {
            },
            /**
             * 收到消息后处理
             */
            "callbackMsg":function () {
            },

            /**
             * 收到文件处理
             */
            "callbackFile":function () {
            },
            /**
             * 收到音频或者视频处理
             */
            "callbackMedia":function () {
            },
            /**
             * 用户登出提示
             */
            "callLogout":function () {
            },
            /**
             * 发消息出错回执
             */
            "onFailMsg":function () {
            },
            /**
             * 最近联系人列表变更
             */
            "onContactsChange":function () {
            },

            "onMessageReady":function () {
            },
			"onSysNotify":function () {
            }
        }
    };

    FE.sys.webww.core = core;

})(jQuery);
