/**
 * 负责旺旺历史或未读消息存储和获取
 * @author xuping.nie
 */
jQuery.namespace('FE.sys.webww');
(function ($) {
    if ('history' in FE.sys.webww) {
        return;
    }

    var history = {
        CORE:FE.sys.webww.core,
        historyMsgs:{},
        // 历史消息
        unreadMsgs:{},
        // 未读消息
        /**
         * 提供给 chatwin ui来调用获取历史消息
         */
        getHistory:function (uid) {
            console.log('getHistory ...');
            this.historyMsgs = this.CORE.getLocalStoredMsgs();
            var data = this.historyMsgs[uid];
            if (!data) {
                return '';
            } else {
                var unread = this.unreadMsgs[uid];
                if (unread && $.isArray(unread) && (unread.length > 0)) {
                    unreadLength = unread.length;
                    this.unreadMsgs[uid] = [];
                    FE.sys.webww.main.renderRecentList();
                }
                return data;
            }
        },
        getUnreadMsgs:function (uid) {
            var unreadMsgs = this.unreadMsgs[uid];
            if ($.isArray(unreadMsgs) && unreadMsgs.length > 0) {
                this.unreadMsgs[uid] = [];
                FE.sys.webww.main.renderRecentList();
                return unreadMsgs;
            }
            return [];
        },

        // 把未读消息缓存起来
        addUnreadMsg:function (msg) {
            var uid = msg.senderId;
            if ($.isArray(this.unreadMsgs[uid])) {
                this.unreadMsgs[uid].push(msg);
            } else {
                this.unreadMsgs[uid] = [msg];
            }
        }
    };
    FE.sys.webww.history = history;
})(jQuery);
