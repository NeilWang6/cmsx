/**
 * ��װ������صĴ洢�߼�
 * �̳���storage.js����storage.js����ķ���������ʹ�� <br>
 *
 * cid : ��Ϣ�����û���id<br>
 * memberId : �û�id <br>
 * memberName:�û�����<br>
 * msg : ��Ϣ����
 * @author xuping.nie
 */
jQuery.namespace('FE.sys.webww');
(function($) {
    if('storage' in FE.sys.webww) {
        return;
    }

    var storage = {
        // ���ش洢���
        "config" : {
            maxContact : 20,
            maxMessage : 50
        },
        /**
         * ���ռ����͵���Ϣ����ģ��
         *
         * @param isSend
         * @param contactId
         * @param content
         * 
         */
        "message" : function(isSend, contactId, content) {
            this.isSend = isSend;
            this.contactId = contactId;
            this.content = content;
            var time = new Date();
            var timeStr = time.format('yyyy-MM-dd hh:mm:ss');
            this.date = timeStr;
        },
        "user" : function(memberId) {
            /**
             * �û�id,������id,��������idͷ
             */
            this.id = memberId;
			
            /**
             * �������б�
             */
            this.blackList = [];
            /**
             * ���� tab ids ,curId
             */
            this.tabStatus = {};
            /**
             * �����ϵ���б�
             */
            this.recentContacts = [];
            /**
             * �����ϵ������{uid:uname}
             */
            this.recentContactNames = {};

            /**
             * messageMap
             */
            this.message = {};
            /**
             * messageCount
             */
            this.count = 0;

        },
        "storeTabStatus" : function(memberId, tabStatus) {
            var user = this._getUser(memberId);
            user.tabStatus = tabStatus;
            this._saveUser(memberId, user);
        },
        "getTabStatus" : function(memberId) {
            var user = this._getUser(memberId);
            return user.tabStatus;
        },
        "storeBlackList" : function(memberId, ids) {
            var user = this._getUser(memberId);
            user.blackList = ids;
        },
        "getRecentContacts" : function(memberId) {
            var user = this._getUser(memberId);
            return user.recentContacts;
        },
        "getRecentContactNames" : function(memberId) {
            var user = this._getUser(memberId);
            return user.recentContactNames;
        },
        "getMsgs" : function(memberId) {
            var user = this._getUser(memberId);
            return user.message;
        },
        /**
         *
         * @param msg
         * @param memberId
         *  boolean �Ƿ�����Ҫ�������Ϣ
         */
        "storeMessage" : function(msg, memberId) {
            var result = {
                isblack : false,
                add : null,
                remove : null
            };
            //var user = this.getJson(memberId);
            var user = this._getUser(memberId);
            var uid = msg.senderId || msg.targetId;
            if(uid == null || uid == '') {
                return result;
            }
            // ����Ƿ��Ǻ������еĳ�Ա
            var isBlack = this._isBlack(uid, user);
            if(isBlack) {
                result.isblack = true;
                return result;
            }
            // ���ӵ������ϵ���б�
            var userChange = this._addContact(uid, null, user);
            result.add = userChange.add;
            result.remove = userChange.remove;

            /*// �洢��Ϣ*/
            this._addMsg(msg, user);
            this._saveUser(memberId, user);
            // ���ؽ��
            return result;
        },
        /**
         * �ж��Ƿ��Ǻ�����
         *
         * @param uid
         * @param memberId
         * 
         */
        "isBlack" : function(uid, memberId) {
            var user = this._getUser(memberId);
            var isBlack = this._isBlack(uid, user);
            return isBlack;
        },
        "msgCount" : function(memberId) {
            var user = this._getUser(memberId);
            var count = user.count++;
            this._saveUser(memberId, user);
            return count;
        },
        "isContact" : function(memberId, uid) {
            var user = this._getUser(memberId);
            var contacts = user.recentContacts;
            var pos = $.inArray(uid, contacts);
            var rs;
            if(pos >= 0) {
                rs = true;
            } else {
                rs = false;
            }
            return rs;
        },
        "_saveUser" : function(memberId, user) {
            this.setJson(memberId, user);
        },
        /**
         *
         * @param msg
         * @param user
         * 
         */
        "_addMsg" : function(msg, user) {
            var uid = msg.senderId || msg.targetId;
            var msgs = user.message[uid];
            if(msgs != null) {
                msgs.push(msg);
                // ��������Ϣ����,��ɾ���������Ϣ
                if(msgs.length > this.config.maxMessage) {
                    msgs.splice(0, 1);
                }
            } else {
                user.message[uid] = [msg];
            }
        },

        "addContact" : function(uid, uname, memberId) {
            var user = this._getUser(memberId);
            var rs = this._addContact(uid, uname, user);
            this._saveUser(memberId, user);
            return rs;
        },
        /**
         * ���������ϵ��
         */
        "_addContact" : function(uid, uname, user) {
            var userChange = {
                add : null,
                remove : null,
                update : null
            };
            var contacts = user.recentContacts || [];
            // ɾ����ID
            var pos = $.inArray(uid, contacts);
            if(pos >= 0) {
                contacts.splice(pos, 1);
            } else {
                userChange.add = uid;
            }
            // �ӵ���һ��
            contacts.splice(0, 0, uid);
            //�����û���
            if(uname && user.recentContactNames && user.recentContactNames[uid] != uname) {
                userChange.update = uid;
                user.recentContactNames[uid] = uname;
            }

            // �����������һ����ɾ�����һ��
            var length = contacts.length;
            var max = this.config.maxContact;
            if(length > max) {
                userChange.remove = contacts[max - 1];
                contacts.splice(max, 1);
                delete user.recentContactNames[userChange.remove];
            }
            return userChange;
        },
        /**
         * �ж��Ƿ��Ǻ�����
         *
         * @param uid
         * @param memberId
         * 
         */
        "_isBlack" : function(uid, user) {
            var blackList = user.blackList;
            var rs = $.inArray(uid, blackList);
            var isblack;
            if(rs >= 0) {
                isblack = true;
            } else {
                isblack = false;
            }
            return isblack;
        },
        /**
         * ��ȡ���û��Ĵ洢��
         *
         * @param memberId
         * 
         */
        "_getUser" : function(memberId) {
            var user = this.getJson(memberId);
            if(user == null) {
                console.log("user is null", "info", "store")
                user = new this.user(memberId);
                this.setJson(memberId, user);
            }
            return user;
        },
		
		// �洢offerid
		"getOfferId" : function(memberId,toId) {
            var offerid = this.getItem("offerid" + memberId + "-" + toId);
			console.log("getOfferid: " + "offerid" + memberId + "-" + toId + ",offerid:" + offerid);
            return offerid;
        },
		
		"setOfferId" : function(memberId, toId, offerid) {
			console.log("setOfferid: " + "offerid" + memberId + "-" + toId + ",offerid:" + offerid);
            this.setItem("offerid" + memberId + "-" + toId, offerid);
        }
    };
    $.extend(storage, FE.sys.webww.storageCore);
    FE.sys.webww.storage = storage;
})(jQuery);
