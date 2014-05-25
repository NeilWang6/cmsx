/**
 * 窗口右侧面板
 * User: tony_nie
 * Date: 12-7-3
 * Time: 下午2:20
 *
 */

jQuery.namespace("FE.sys.webww.ui");
(function ($) {

    var panel = {
        redrawInfoTimer:null,
        selectedInfoTab:'webatm-companyInfo',
        _recentContacts:[],
        unreadAmount:0,
        config:null,
        currentChatId:null,
        onContactClick:null,
        init:function (config) {
            this.config = config || {};
            this.$container = $('#webatm-info');
            this.$recentcontacts = $('#webatm-recentcontactsInfo');
            this.$contactinfo = $('#webatm-companyInfo');
			this.$offerinfo = $('#webatm-offerInfo');
            this.$unreadAmount = $('#webatm-recentcontactsInfo span.unread-amount');
            this._bindContactClickEvent();
            $('#webatm-infoTab').bind('click', $.proxy(this._onClickInfoTab, this));
        },

        /**
         * 切换到所选择的info tab信息
         * @param  {String} selectedInfoTab 选择的Tab
         */
        switchInfoTab:function (cid, targetInfoTab) {
            targetInfoTab = targetInfoTab || this.selectedInfoTab;
            this.currentChatId = cid;
            clearTimeout(this.redrawInfoTimer);
            this.$container.html('');
            console.log("switchInfoTab:" + targetInfoTab);
            if (targetInfoTab) {
                $('#webatm-infoTab li').removeClass('selected');
                $('#' + targetInfoTab).addClass('selected');
            }
            switch (targetInfoTab) {
                case 'webatm-companyInfo':
                    $('#webatm-info').css("overflow-y","hidden");
                    this.showUserPanel();
                    break;
                case 'webatm-recentcontactsInfo':
                    $('#webatm-info').css("overflow-y","auto");
                    this.renderRecentContacts();
                    break;
				case 'webatm-offerInfo':
                    $('#webatm-info').css("overflow-y","auto");
                    this.showOfferPanel();
                    break;
            }
            this.selectedInfoTab = targetInfoTab;
            this._renderUnreadAmount();

            //fix iframe height when switch
            $('#webatm-info-company').height($("#webatm-container").height() - 100);
        },

        _onClickInfoTab:function (e) {
            var target = e.target;
            console.log("chickinfoTab :" + target.id + " this.selectedInfoTab:" + this.selectedInfoTab);
            if (target.id != this.selectedInfoTab) {
                this.switchInfoTab(this.currentChatId, target.id);
            }
        },
        _bindContactClickEvent:function () {
            var self = this;
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
                    self.onContactClick && self.onContactClick($(this).data('uid'));
                });
        },

        renderRecentContacts:function (list) {
            var html = [];
            list = list || this._recentContacts ;
            console.log("renderRecentContacts:" + list.length);
            this._recentContacts = list;
            if (this.$container && this.$recentcontacts.hasClass('selected')) {
                html.push('<div class="contacts-list">');
                if (!list || list.length === 0) {
                    html.push('<span >暂无最近联系人</span>');
                } else {
                    html.push(this._renderContacts(list));
                }
                html.push('</div>');
                this.$container.html(html.join(''));
                this._renderUnreadAmount();
            }
        },
        _renderContacts:function (list) {
            var html = [], self = this;
            this.unreadAmount = 0;
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
        _renderUnreadAmount:function () {
            var self = this;
            if (this.unreadAmount === 0) {
                this.$unreadAmount.text('').hide();
            } else {
                this.$unreadAmount.text(this.unreadAmount);
                if (!$('#webatm-recentcontactsInfo').hasClass('selected')) {
                    $('#webatm-recentcontactsInfo').addClass('unread');
                    this.$unreadAmount.show();
                } else {
                    $('#webatm-recentcontactsInfo').removeClass('unread');
                    this.$unreadAmount.hide();
                }
            }
            var info = "";
            if (this.unreadAmount > 0) {
                info += (',你有 <span title="点击在最近联系人查看" class="unread-amount">' + this.unreadAmount + '</span> 条新消息');
            }
            FE.sys.webww.ui.chatwin.updateTitle(info);
            $("#webatm-title span.unread-amount").bind("click",function(){
                self.switchInfoTab(this.currentChatId,'webatm-recentcontactsInfo');
            });
        },

        showUserPanel:function () {
            if (!this.config.showUserPanel) {
                console.log("no config.showUserPanel");
                return;
            }
            // 开始填充
            if (this.currentChatId) {
                this.redrawInfoTimer && clearTimeout(this.redrawInfoTimer);
                var self = this;
                console.log("showUserPanel:" + this.currentChatId);
                this.redrawInfoTimer = setTimeout(function () {//防止频繁获取
                    if (self.$contactinfo.hasClass('selected')) {
                        self.config.showUserPanel(self.currentChatId);
                    }
                }, 500);
            }
        },
		
		// offer info, add by levy.jiny
		showOfferPanel:function () {
            if (!this.config.showOfferPanel) {
                console.log("no config.showUserPanel");
                return;
            }
            // 开始填充
            if (this.currentChatId) {
                this.redrawInfoTimer && clearTimeout(this.redrawInfoTimer);
                var self = this;
                console.log("showOfferPanel:" + this.currentChatId);
                this.redrawInfoTimer = setTimeout(function () {//防止频繁获取
                    if (self.$offerinfo.hasClass('selected')) {
                        self.config.showOfferPanel(self.currentChatId);
                    }
                }, 500);
            }
        }
    }
    FE.sys.webww.ui.panel = panel;
})
    (jQuery);