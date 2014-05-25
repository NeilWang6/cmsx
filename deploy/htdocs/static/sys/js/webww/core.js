/**
 * author hang.yangh <br>
 * ���� <br>
 * js/lib/fdev-v4/core/fdev-min.js js/lib/fdev-v3/util/bom-min.js <br>
 * js/app/im/webim/wim-m.js date 2011-10-20 <br>
 * web����������ṩ����ͨѶ��װ
 */

jQuery.namespace('FE.sys.webww');
('core' in FE.sys.webww) || (function ($) {
    var core = {
        // �洢���,����洢��Ϣ
        "storage":FE.sys.webww.storage,
        // �����ʹ���ʹ洢��ǰ�û�״̬
        "user":FE.sys.webww.user,
        // protocol���,��������ϢЭ��
        "protocol":FE.sys.webww.protocol,

        /**
         * �Ƿ�����Ҫ��tabҳ<br>
         * ��tabҳ�Ž����յ���Ϣ�Ĵ洢�ȴ���
         */
        "_isHost":null, //�Ƿ�host�Ļص�����
        /**
         * �����ʹ��
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
         * ��¼
         *
         *  �ɹ��������ص� callbackLogin
         */
        "callLogin":function (isForceLogin) {
            console.log('callLogin:isLogin = ' + this.isLogin() + ' isForceLogin:' + isForceLogin);
            if (!this.isLogin()) {
                console.log("call prepareSendLoginMsg");
                this.protocol.prepareSendLoginMsg(isForceLogin);
            }
        },
        /**
         * ������Ϣ
         *
         * @param uid
         *            ������Ϣ�����ID<br>
         *            ��Ҫ������ID,��������IDͷ
         * @param msg
         *            ������Ϣ������
         *
         */
        "callSendMessage":function (uid, msg) {
            // uid������
            if (uid == null || uid == '' || uid == this.user.memberId) {
                return;
            }
            if (msg == null || msg == '') {
                return;
            }

            // �ж��Ƿ��Ǻ������е���
            var isblack = this.storage.isBlack(uid, this.user.memberId);
            if (isblack) {
                return;
            }

            // ���Ǻ���������
            var contactId = uid;
            var memberId = this.user.memberId;

            /**
             * �������Ϣ���Ͷ����������ϵ���б���<br>
             * ���������ϵ���б����Ͷ�����Ϣ
             */
            if (!this.storage.isContact(memberId, contactId)) {
                this.protocol.feedState([ contactId ]);
            }

            // ������Ϣ
            var sendedMsg = this.protocol.sendMsg(contactId, msg,
                this.storage.msgCount(contactId));

            // �洢��Ϣ
            this.storage.storeMessage(sendedMsg, memberId);

            // ������Ϣ,���ͳɹ�
            return sendedMsg;
        },
        /**
         * ��ȡ�����ϵ���б�
         *
         *  �����ϵ������id������
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
         * �������ϵ���б�������һ��
         *
         *
         */
        "callAddContact" : function(uid, uname) {
            var memberId = this.user.memberId;
            if(!uid || uid.length <= 8){ //��ǰ׺
                return;
            }
            var rs = this.storage.addContact(uid, uname, memberId);
            // ������µ���ϵ��,���ĸ���ϵ��״̬
            if(rs.add != null) {
                this.protocol.feedState([rs.add]);
            }
            /**
             * �����ϵ���б�����, ��Ҫ�߳�һ�� <br>
             * ������߳�����ȡ��Ϣ״̬����
             */
            if(rs.remove != null) {
                this.protocol.cancelFeedState([rs.remove]);
            }
            // ��������ϵ���б��б��,����֪ͨ
            if(rs.add != null || rs.remove != null || rs.update != null) {
                this.onContactsChange();
            }
        },
        /**
         * ȡ���û����е���ʷ��Ϣ
         *
         *  uid�����Ӧ��Ϣ��map
         */
        "getLocalStoredMsgs":function () {
            var memberId = this.user.memberId;
            return this.storage.getMsgs(memberId);
        },
        /**
         * �û���¼
         *
         * @param �Ƿ��¼�ɹ�
         * @param ��¼ʧ�ܵ���Ϣ
         *
         */
        "onLogin":function (success, loginCode, message) {
            // ��¼�ɹ�ʵ�����û���Ϣ
            console.log("core.js onLogin");
            if (success) {

                this.user.init(this);
            }
            // ��¼�ɹ����ûص�
            console.log("core.js callbackLogin:" + success);
            this.callbacks.callbackLogin(success, loginCode, message);
        },
        /**
         * ��ú�����ʱ�Ĵ���
         *
         * @param blackList
         *
         */
        "onBlackList":function (msg) {
            var blackList = msg.blackIds;
            // ֻ��Ҫ��tabҳ����
            if (!this._isHost()) {
                return;
            }
            // ����û��ѵ�¼������������������б�
            if (this.user.status.isLogin) {
                this.storage.storeBlackList(this.user.memberId,
                    blackList);
            } else {
                // ������ʱ�������ȵ�¼����ٴ���
                this.user.status.blackList = blackList;
            }
        },
        /**
         * �û�״̬�ı�
         */
        "onStatusChange":function (msg) {
            // ���ûص�
            this.callbacks.callbackStatusChange(msg.userStatusList);
        },
        /**
         * �����ϵ���б�������
         *
         *
         */
        "onContactsChange":function () {
            // ȡ�����ϵ��
            var contacts = this.callRecentContacts();
            // �����ص�
            this.callbacks.onContactsChange(contacts);
        },
        /**
         * ���������Ϣ
         */
        "onOfflineMsg":function (msg) {
            var self = this;
            var offLineMsgs = msg.offLineMsgs;
            if (this.user.status.isblackListInit) {
                // ���û��ĺ�����������Ͽ�ִ��������Ϣ����
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
                // �����ȴ������Ⱥ�������������ٴ���
                this.user.status.offLineMsg = offLineMsgs;
            }
        },
        /**
         * �յ���Ϣʱ����
         *
         * @param msg
         *            ��Ϣ��
         * @param needSendBack
         *            �Ƿ���Ҫ���ͻ�ִ
         *
         */
        "onMsg":function (msg, needSendBack) {
            if (this._isHost()) {
                /**
                 * ���ͻ�ִ<br>
                 * ���߷�������Ϣ�ɹ�����<br>
                 * �´ε�¼�򲻻�������
                 */
                if (needSendBack) {
                    this.protocol.sendBackMsg(msg);
                }
                /**
                 * �洢��Ϣ,�����������ϵ���߼�<br>
                 * �����ϵ���б��򳬳������,����Ҫ��������״̬
                 */
                var rs = this.storage.storeMessage(msg,
                    this.user.memberId);
                // ����Ǻ������򷵻�
                if (rs.isblack) {
                    return;
                }
                // ������µ���ϵ��,���ĸ���ϵ��״̬
                if (rs.add != null) {
                    this.protocol.feedState([ rs.add ]);
                }
                /**
                 * �����ϵ���б�����, ��Ҫ�߳�һ�� <br>
                 * ������߳�����ȡ��Ϣ״̬����
                 */
                if (rs.remove != null) {
                    this.protocol.cancelFeedState([ rs.remove ]);
                }
                // ��������ϵ���б��б��,����֪ͨ
                if (rs.add != null || rs.remove != null) {
                    this.onContactsChange();
                }
            }
            /**
             * ֪ͨ���뷽��Ϣ����
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
         * �յ��ļ�ʱ�Ĵ���
         *
         * @param msg
         */
        "onFile":function (msg) {
            this.callbacks.callbackFile(msg);
        },
        /**
         * �յ���Ƶ������Ƶʱ����
         *
         * @param msg
         *
         */
        "onMedia":function (msg) {
            this.callbacks.callbackMedia(msg);
        },
        /**
         * �������߻�ǿ���˳�
         *
         *
         */
        "onLogout":function () {
            this.user.status.isLogin = false;
            this.callbacks.callLogout();
        },
        /**
         * ϵͳ����
         *
         *
         */
        "onFailMsg":function () {
            this.callbacks.onFailMsg();
        },
        /**
         * ��������վID��ȡ����ID
         *
         * @param mid
         *            ����վID
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
         * �����û�IDȡ�û���
         *
         * @param ids
         *            �û�ID����
         * @param callback
         *            �õ����ݺ�ص�
         * @param realIds
         *            �û�����ID����
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
         * ��¶���ⲿ�Ļص�<br>
         * ʹ�ñ����ʱ,�����Ҫ������Щ�¼�,��ʵ��֮
         */
        "callbacks":{
            /**
             * �յ���¼��ִ��Ϣ��Ĵ���
             *
             * @success �Ƿ��¼�ɹ�
             * @message ���ʧ��ʧ�ܵ���Ϣ
             */
            "callbackLogin":function () {
                console.log("default callbackLogin");
            },
            /**
             * �յ��û�״̬�ı����Ϣ
             *
             * @statusList �û�״̬�ı��б�
             */
            "callbackStatuChange":function () {
            },
            /**
             * �յ���Ϣ����
             */
            "callbackMsg":function () {
            },

            /**
             * �յ��ļ�����
             */
            "callbackFile":function () {
            },
            /**
             * �յ���Ƶ������Ƶ����
             */
            "callbackMedia":function () {
            },
            /**
             * �û��ǳ���ʾ
             */
            "callLogout":function () {
            },
            /**
             * ����Ϣ�����ִ
             */
            "onFailMsg":function () {
            },
            /**
             * �����ϵ���б���
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
