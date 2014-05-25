/**
 * author honglun.menghl date 2011-11-6 web wangwang latest contacts list
 *
 * @update 2012-3-30 wsl flash the wangwang pic while logining
 */

jQuery.namespace("FE.sys.webww.ui");
('contacts' in FE.sys.webww) || (function ($) {

    var R = FE.sys.webww.ui.lib.Ri18n;

    var contacts = {
        '$container':null,
        '$wwIcon':null,
        '$unreadAmount':null,
        unreadAmount:0,
        isClose:true,
        latestList:[],
        onClick:$.noop,
        loginSuccess:false,
        loginNowTimer:null,
        /**
         * show web ww
         * @param onClick 点击联系人的回调
         * @param isHide 是否显示旺旺系统状态图标（右下角）
         */
        init:function (onClick,isHide) {
            this.onClick = onClick;
            var $tray = $('#purchaseAssist2');

            if ($tray.length === 0) {
                $tray = $('<div class="purchaseAssist2" id="purchaseAssist2"><ul class="tab-list"></ul></div>').appendTo('body');
            }
            if(isHide){
                $tray.hide();
            }
            if ($tray.find('.mainTab').length === 0) {
                var html = [];
                html.push('<li class="mainTab" id="sys-webww">');
                html.push(Hogan.compile('<div class="webww"><a hidefocus href="#" class="trigger unlogin" title="{{{text}}}">{{{text}}}</a><span class="unread-amount"></span></div>').render({text: R('WEB_BASED_WANGWANG')}));
                html.push('<div class="webww-contacts fd-hide"></div>');
                html.push('</li>');
                $tray.find('ul.tab-list').append(html.join(''));
            }

            this.$container = $tray.find('div.webww-contacts');
            this.$webww = $('#sys-webww');
            this.$unreadAmount = this.$webww.find('span.unread-amount');
            this._bindEv();
            this.changeState(false);
            this.loginNowTimer = window.setInterval(this.loginNow, 600);
            setTimeout(function(){ // 20s后停止闪烁
                window.clearInterval(this.loginNowTimer);
            },20000);
        },

        loginNow:function () {
            $('#sys-webww').find('a.trigger').toggleClass('unlogin').toggleClass('logined');
        },
        /**
         * 改变登陆状态
         */
        changeState:function (isLogin) {
            window.clearInterval(this.loginNowTimer);
            if (isLogin) {
                this.$webww.find('a.trigger').removeClass('unlogin').addClass('logined');
                this.renderList(this.latestList);
            } else {
                this.$webww.find('a.trigger').removeClass('logined').addClass('unlogin');
                this.renderList([], true);
            }
        },
        /**
         * @param {
            *            array } list . The contacts list
         * @param {
            *            jQuery object } $container . The contacts list container
         */
        renderList:function (list, unLogin) {
            this.unreadAmount = 0;
            this.latestList = list;
            var html = [];
            html.push(this._renderHeader(list, unLogin));
            html.push(this._renderBody(list, unLogin));
            this.$container.html(html.join(''));
            this._renderUnreadAmount();
        },

        _renderHeader:function (list, unLogin) {
            var html = [];
            html.push('<div class="pa-head">');
            if (!unLogin) {
                html.push(Hogan.compile('<span>{{{text}}}<span class="count">(' + list.length + ')</span></span>').render({text: R('RECENT_CONTACTS')}));
            }
            html.push('<a hidefocus href="#" class="min"></a>');
            html.push('</div>');
            return html.join('');
        },

        _renderBody:function (list, unLogin) {
            var html = [];
            html.push('<div class="contacts-list">');
            if (unLogin) {
                html.push(this._renderLoginUrl());
            } else {
                if (list.length === 0) {
                    html.push(this._renderNoContact());
                } else {
                    html.push(this._renderContacts(list));
                }
                if (list.length < 11) {
                    html.push(this._renderAliwwSoft());
                }
            }
            html.push('</div>');
            return html.join('');
        },

        _renderLoginUrl:function () {
            return Hogan.compile('<div class="no-login"><span>{{{text0}}},<a href="#" onclick="FE.sys.webww.main.onClickLoginAgain()" target="_self">{{{text1}}}</a></span><div>').render({
                text0: R('YET_NOT_LOGIN'),
                text1: R('PLEASE_LOGIN')
            });
        },

        _renderNoContact:function () {
            return Hogan.compile('<div class="no-contact"><span>{{{text}}}</span></div>').render({
                text: R('NO_CONTACT')
            });
        },

        _renderContacts:function (list) {
            var html = [], self = this;
            html.push('<div class="list-container">');
            html.push('<ul>');
            $.each(list, function (index, item) {
                html.push('<li><a href="#" data-uid="' + item.uid + '">');
                if (item.status === 'online') {
                    html.push('<span class="uname online">' + item.uname + '</span>');
                } else {
                    html.push('<span class="uname offline">' + item.uname + '</span>');
                }
                if (item.unreadCount && item.unreadCount > 0) {
                    self.unreadAmount += item.unreadCount;
                    html.push('<span class="unread-count">' + item.unreadCount + '</span>');
                }
                html.push('</a></li>');
            });
            html.push('</ul>');
            html.push('</div>');
            return html.join('');
        },

        _renderAliwwSoft:function () {
            return Hogan.compile('<div class="rec-aliwwsoft"><span>{{{text0}}},{{{text1}}}<a href="http://wangwang.1688.com/" target="_blank" title="下载阿里旺旺软件">{{{text2}}}</a></span></div>').render({
                text0: R('MORE_FEATURES'),
                text1: R('PLEASE'),
                text2: R('DOWNLOAD_WANGWANG_CLIENT')
            });
        },

        _renderUnreadAmount:function () {
            if (this.unreadAmount === 0) {
                this.$unreadAmount.text('').hide();
            } else {
                this.$unreadAmount.text(this.unreadAmount);
                if (this.isClose === true) {
                    this.$unreadAmount.css('display', 'block');
                }
            }
        },

        _bindEv:function () {
            var self = this, $tray = this.$webww.find('div.webww');
            this.$webww.find('a.trigger').click(function (ev) {
                if ($tray.hasClass('avail')) {
                    self.foldContacts();
                } else {
                    self.unfoldContacts();
                }
                ev.preventDefault();
            });
            this.$webww.delegate('a.min', 'click', function (ev) {
                ev.preventDefault();
                self.foldContacts();
            });
            this.$container.delegate('div.list-container li', 'mouseenter',
                function (ev) {
                    self.$container.find('div.list-container li').removeClass('hover');
                    $(this).addClass('hover');
                }).delegate('div.list-container li', 'mouseleave',
                function (ev) {
                    $(this).removeClass('hover');
                });

            this.$container.delegate('div.list-container li a', 'click',
                function (ev) {
                    ev.preventDefault();
                    self.onClick($(this).data('uid'));
                });

        },

        foldContacts:function () {
            var self = this;
            $tray = this.$webww.find('div.webww');
            $tray.removeClass('avail');
            /* self.$container.addClass('fd-hide'); */
            self.$container.hide();
            if (self.unreadAmount !== 0) {
                self.$unreadAmount.css('display', 'block');
            }
            self.isClose = true;
        },

        unfoldContacts:function () {
            var self = this;
            $tray = this.$webww.find('div.webww');
            $tray.addClass('avail');
            /* self.$container.removeClass('fd-hide'); */
            self.$container.show();
            self.$unreadAmount.hide();
            self.isClose = false;
        }
    };

    FE.sys.webww.ui.contacts = contacts;

})(jQuery);
