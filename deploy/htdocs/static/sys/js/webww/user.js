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
             * ���������ϵ����Ϣ
             */
            console.log("user init 1 : memberid : " + self.memberId);
            var recentContacts =
                this.core.storage.getRecentContacts(self.memberId);
            this.core.protocol.feedState(recentContacts);

            /**
             * ���õ�¼�ɹ�����λ
             */
            this.status.isLogin = true;
            // ִ��δ����¼�
            /**
             * ������к������б���ִ���յ��������б��߼�
             */
            if (this.status.blackList !== null) {
                this.core.onBlackList(this.status.blackList);
                this.status.blackList = null;
            }
            this.status.isblackListInit = true;
            /**
             * �����ص�������Ϣ
             */
            if (this.status.offLineMsg !== null) {
                this.core.onOfflineMsg(this.status.offLineMsg);
                this.status.offLineMsg = null;
            }
            /**
             * ��ȡmemberName
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
