/**
 * copy from core.js ( hang.yangh) author honglun.menghl date 2011-11-8
 */
('user' in FE.sys.webww) || (function($) {

    var user = {
        core : null,
        memberId : null,
        memberName : null,
        status : {
            isLogin : false,
            isblackListInit : false,
            blackList : null,
            offLineMsg : null
        },
        init : function(core) {
            var self = this;
            this.core = core;
            self.memberId = FE.util.LoginId();
            /**
             * 订阅最近联系人消息
             */
            console.log("user init 1 : memberid : " + self.memberId);
            var recentContacts =
                this.core.storage.getRecentContacts(self.memberId);
            this.core.protocol.feedState(recentContacts);

            /**
             * 设置登录成功标致位
             */
            this.status.isLogin = true;
            // 执行未完成事件
            /**
             * 如果存有黑名单列表则执行收到黑名单列表逻辑
             */
            if (this.status.blackList !== null) {
                this.core.onBlackList(this.status.blackList);
                this.status.blackList = null;
            }
            this.status.isblackListInit = true;
            /**
             * 处理返回的离线消息
             */
            if (this.status.offLineMsg !== null) {
                this.core.onOfflineMsg(this.status.offLineMsg);
                this.status.offLineMsg = null;
            }
            /**
             * 获取memberName
             */
            var ids = [self.memberId];
            this.core.getMemberNames(ids, function(data) {
                    $.each(data, function() {
                            if (this.uid === self.memberId) {
                                self.memberName = this.uname;
                                return false;
                            }
                        });
                });
        }
    };

    FE.sys.webww.user = user;
})(jQuery);
