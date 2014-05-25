/**
 * ����������ʷ��δ����Ϣ�洢�ͻ�ȡ
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
        // ��ʷ��Ϣ
        unreadMsgs:{},
        // δ����Ϣ
        /**
         * �ṩ�� chatwin ui�����û�ȡ��ʷ��Ϣ
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

        // ��δ����Ϣ��������
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
