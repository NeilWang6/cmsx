/**
 * 封装旺旺相关的存储逻辑
 * 继承于storage.js，故storage.js定义的方法都可以使用 <br>
 *
 * cid : 消息对象用户的id<br>
 * memberId : 用户id <br>
 * memberName:用户名称<br>
 * msg : 消息内容
 * @author xuping.nie
 */
jQuery.namespace('FE.sys.webww');
(function($) {
    if('storage' in FE.sys.webww) {
        return;
    }

    var storage = {
        // 本地存储组件
        "config" : {
            maxContact : 20,
            maxMessage : 50
        },
        /**
         * 接收及发送的消息对象模拟
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
             * 用户id,非旺旺id,不带旺旺id头
             */
            this.id = memberId;
			
            /**
             * 黑名单列表
             */
            this.blackList = [];
            /**
             * 包含 tab ids ,curId
             */
            this.tabStatus = {};
            /**
             * 最近聊系人列表
             */
            this.recentContacts = [];
            /**
             * 最近联系人名称{uid:uname}
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
         *  boolean 是否是需要处理的消息
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
            // 检查是否是黑名单中的成员
            var isBlack = this._isBlack(uid, user);
            if(isBlack) {
                result.isblack = true;
                return result;
            }
            // 增加到最近联系人列表
            var userChange = this._addContact(uid, null, user);
            result.add = userChange.add;
            result.remove = userChange.remove;

            /*// 存储消息*/
            this._addMsg(msg, user);
            this._saveUser(memberId, user);
            // 返回结果
            return result;
        },
        /**
         * 判断是否是黑名单
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
                // 如果最近消息过长,则删除最早的消息
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
         * 增加最近联系人
         */
        "_addContact" : function(uid, uname, user) {
            var userChange = {
                add : null,
                remove : null,
                update : null
            };
            var contacts = user.recentContacts || [];
            // 删除该ID
            var pos = $.inArray(uid, contacts);
            if(pos >= 0) {
                contacts.splice(pos, 1);
            } else {
                userChange.add = uid;
            }
            // 加到第一个
            contacts.splice(0, 0, uid);
            //更新用户名
            if(uname && user.recentContactNames && user.recentContactNames[uid] != uname) {
                userChange.update = uid;
                user.recentContactNames[uid] = uname;
            }

            // 如果超过最大的一个则删除最后一个
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
         * 判断是否是黑名单
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
         * 获取该用户的存储串
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
		
		// 存储offerid
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
