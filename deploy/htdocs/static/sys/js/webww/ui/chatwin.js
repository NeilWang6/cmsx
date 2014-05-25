/**
 * ���촰��UI�����߼�
 * �ṩ����Ҫ�ӿ��У�
 *  openTab
 *  showMsg
 *  showAlert
 */
// ����ɾ��������������
// #import /ui/mustache.js
// #import /ui/layout.js
// #import /ui/i18n.js
// #import /ui/editor.js
// #import /ui/tab.js
// #import /ui/emotions.js
// #import /ui/contacts.js
// #import webww/protocol.js
jQuery.namespace("FE.sys.webww.ui");
(function ($) {
    var R = FE.sys.webww.ui.lib.Ri18n;

    var chatwin = {
        emotions:FE.sys.webww.emotions,
        storage:FE.sys.webww.storage,
        protocol:FE.sys.webww.protocol,
        _container:null,
        // protocol���,��������ϢЭ��
        config:{},
        contacts:{},
        products:{},
        selectedMainTab:null,
        username:null,
        tabManager:null,
        panel:FE.sys.webww.ui.panel,
        // ��ǰ������id offerid addby levy.jiny
        currentChatId:null,
		offerId:null,
        // ��ǰҳ����״̬MAP ��ϵ��Ϊkey
        isInited:false,
        isReady:false,
        lockSync:false,
        redrawInfoTimer:null,
        autoHideTimer:null,
        //�洢����λ�����С״̬
        winStatus:{},
        tabStatusMap:{},

        init:function (config) {
            var self = this;
            if (self.isInited) {
                return;
            }
            self.config = config || {};
            self.isInited = true;
            FE.sys.webww.ui.layout.render();
            this._container = $("#webatm-container");

            this._initDrag();
            this._initTabManger()
            this._initResize();
            this._bindMaxEvent();
            this._bindMinEvent();
            // 2012-07-19 fix IE6��û�е�ס��Ŀѡ���Bug
            $('#webatm-window').css('z-index', '998');
            $('#webatm-container').css('z-index', $("#webatm-window")[0].style.zIndex);

            // 2012-7-19 fix IE6�²�֧��position:fixed������
            if($.browser.msie && parseInt($.browser.version) == 6) {
                $('#webatm-window').PositionFixed({x:0, y:0});
            }

            $('#webatm-closeWin').bind('click', $.proxy(this._onClickClose, this));
			$('#webatm-topclose').bind('click', $.proxy(this._onClickClose, this));
			
            var editor = this._initEditor();
            this.emotions.init(editor);
            this._fixFirefoxEditable();
            //TODO:�Զ����ع���

            this.panel.init(config);
            this.panel.onContactClick = function (cid) {
                self.openTab(cid);
            };
			
			this.touchScroll("webatm-log");
            self.isReady = true;
            console.log("chatwin init --- OK", "info", "chatwin");
        },
		//Ϊ�˴���ipad�ϵĹ������¼� add by ��ˮ 2012-12-19
		touchScroll:function (id){
			if(jQuery.util.flash.available == false){
				var el=document.getElementById(id);
				var scrollStartPos=0;
				 
				document.getElementById(id).addEventListener("touchstart", function(event) {
				scrollStartPos=this.scrollTop+event.touches[0].pageY;
				event.preventDefault();
				},false);
				 
				document.getElementById(id).addEventListener("touchmove", function(event) {
				this.scrollTop=scrollStartPos-event.touches[0].pageY;
				event.preventDefault();
				},false);
			}
		},
        _onClickClose:function (e) {
            var self = this;
            self.winStatus = self._saveStatus();
            $('#webatm-window').hide();
            if ($("#sys-webww")[0] && $.effects && $.effects.transfer) {
                options = { to:"#sys-webww", className:"ui-effects-transfer" };
                $("#webatm-container").effect("transfer", options, 1000);
            }
        },


        _saveStatus:function () {
            var status = {};
            status['height'] = parseInt(this._container.css('height'));
            status['width'] = parseInt(this._container.css('width'));
            status['top'] = parseInt(this._container.css('top'));
            status['left'] = parseInt(this._container.css('left'));
            return status;
        },
        _restoreStatus:function (status) {
            console.log("restoreStatus: height:" + status.height, 'info', 'chatwin');
            status['width'] && this._container.width(status['width']);
            status['height'] && this._container.height(status['height']);
            status['top'] && this._container.css('top', status['top'] + 'px');
            status['left'] && this._container.css('left', status['left'] + 'px');
            var ui = {size:{width:status.width,
                height:status.height}};
            this._onResize(null, ui);
        },
        _initDrag:function () {
            var self = this;
            var pageWidth = parseInt($(window).width()), pageHeight = parseInt($(window).height());
            if ($.util.ua.ie6) {  //ie6���Զ�λ
                pageWidth = 1200;
                pageHeight = 2500;
            }

            this._container.draggable({
                start: function (event, ui) {
                    ui.helper.data('draggableXY.originalPosition', ui.position || {top: 0, left: 0});
                    ui.helper.data('draggableXY.newDrag', true);
                },

                stop: function(event, ui) {
                    var topValue = ui.position.top;
                    topValue = parseInt(topValue);
                    if (topValue < 0) {
                        ui.helper.css('top', "0");
                    }
                },

                scroll:false,
                iframeFix:true,
                distance:5,
                opacity:0.7,
                handle:"#webatm-title",
//                containment:[-200, 0, pageWidth - 50 , pageHeight - 30]
                containment:"document"
            });

            this._container.bind('drag', function (ev) {
                self._container.triggerHandler("onStatusChange");
            });
            this._container.bind('dragstop', function (ev) {
                self.winStatus = self._saveStatus();
            });
        },

        _initTabManger:function () {
            var self = this;
            this.tabManager = new FE.sys.webww.ui.TabManager();
            this.tabManager.addTabCloseListener(function (id) {
                delete self.products[self.contacts[id].pid];
                delete self.contacts[id];
                // ���tab״̬��
                delete self.tabStatusMap[id];
                self._tabChanged();
            });
            this.tabManager.addTabSelectedListener(function (id) {
                var cid = id;
                if (cid != self.selectedMainTab) {
                    console.log("tabselected:" + cid);
                    self._switchTabData(cid);
                }
            });
        },

        _initEditor:function () {
            var self = this;
            var sendMessage = function (msg) {
                if (!self.selectedMainTab || !self.contacts[self.selectedMainTab]) {
				    console.log("----------------EMPTY_LIMIT");
                    self.showAlert(R("EMPTY_LIMIT"));
                    return false;
                }
                self._container.triggerHandler("sendMsg", [self.selectedMainTab, msg]);
                return true;
            }
            var editor = new FE.sys.webww.Editor(sendMessage, self.showAlert, self.config.beforePasteOrDrop);
            return editor;
        },

        /**
         * Firefox <= 11��contenteditable����֧����BUG,������Ӷ�webatm-input����Ƴ���������¼���
         */
        _fixFirefoxEditable:function () {
            var self = this;

            /**
             * ������ȥwebatm-inputʱ
             */
            var _onMouseEnterInputArea = function (e) {
                $("#webatm-input").attr("contenteditable", "true");
            };

            /**
             *�����ѡ���κη�webatm-editor�µ�textʱ
             */
            var _onSelectAnyText = function (e) {
                var evTarget = e.target;
                //console.log("evTarget id: " + evTarget.id);
                if ((evTarget.id !== "webatm-input") && (evTarget.id !== "webatm-emotions-selector")) {
                    $("#webatm-input").attr("contenteditable", "false");
                }
                return true;
            };

            if (jQuery.browser.mozilla && parseInt(jQuery.browser.version) <= 11) {
                console.log("���Firefox�汾: " + jQuery.browser.version);
                $("#webatm-input").attr("contenteditable", "false");
                $(document.body).bind("click", _onSelectAnyText);
                $("#webatm-input").bind("click", _onMouseEnterInputArea);
                $("#webatm-inputwrapper").bind('mouseenter', _onMouseEnterInputArea);
            }
        },
        _fixIE6Style:function () {
            if ($.util.ua.ie6) {
                $("#webatm-uiwrapper").css("zoom", "1");
                $("#webatm-inputwrapper").width($('#webatm-log').innerWidth());
                var webatmInfoHeight = $("#webatm-info").outerHeight();
                $("#webatm-info").css("height", webatmInfoHeight + 8 + "px");
            }
        },
        /**
         * �������
         */
        _bindMaxEvent:function () {
            var self = this;
            var maximized = false;
            var status = self._saveStatus();
            var onClickMaximize = function (e) {
                if (maximized) {
                    self._restoreStatus(status);
                    $("#webatm-maximize").removeClass("maximized");
                    maximized = false;
                    $('#webatm-maximize').attr('title', R('MAXIMIZE'));
                } else {
                    status = self._saveStatus();
                    self._container.css("top", '0px');
                    self._container.css("left", '0px');
                    self._container.css("width", $(window).width());
                    self._container.css("height", $(window).height());
                    self._onResize(null, null, false);
                    $("#webatm-maximize").addClass("maximized");
                    maximized = true;
                    $('#webatm-maximize').attr('title', R('RESTORE'));
                }
            };
            $("#webatm-maximize").bind('click', onClickMaximize);
        },
        /**
         * ������С���¼���
         * @private
         */
        _bindMinEvent:function () {
            var self = this;
            var content = $("#webatm-uiwrapper");
            var title = $("#webatm-title");
            var height = this._container.height();
            var onClickMinimized = function (e) {
                if (content.css("display") === "none") {
                    self._container.css("opacity", 1);
                    content.show();
                    self._container.height(height);
                    self._onResize();
                    title.attr("title", "");
                } else {
                    title.attr("title", R("DBLCLICK_RESTORE"));
                    height = self._container.height();
                    content.hide();
                    self._container.height($("#webatm-title").height());
                    self._container.css("opacity", 0.7);
                }
            }
            $("#webatm-title").bind('dblclick', onClickMinimized);
            $("#webatm-minimize").bind('click', onClickMinimized);
        },

        /**
         * ��container resizeʱ���ڲ�DIV��Ҫ������
         * @saveStatus {BOOL} �Ƿ�洢״̬��Ĭ�ϴ洢,saveStatus === false �Ų��洢
         */
        _onResize:function (event, ui, saveStatus) {
            var self = this, width = 0, height = 0
            self._container.css("opacity", 1);
            $("#webatm-uiwrapper").show();
            if (ui) {
                width = ui.size.width;
                height = ui.size.height;
            } else {
                width = self._container.width();
                height = self._container.height();
            }
            console.log("onResize container width:  " + width + " height " + height, "info", "chatwin");

            // 2012-06-20 garcia.wul ��input Panel ��widthС��contacts info panel��widthʱ,Ҳ����contacts info panel
            var willResizeSmallWidth = (width <= 335) || ( $("#webatm-input").width() < $("#webatm-info").width());

            if (willResizeSmallWidth) {
                $('#webatm-uiwrapper').addClass('webatm-resize-small-width');
            } else {
                $('#webatm-uiwrapper').removeClass('webatm-resize-small-width');
            }

            if (height > 300) {
                //���webatm-info��ʽ����padding������IE6��֪�ι�����ʱ������Ӧ
                $('#webatm-log').height(height - 227);
                $('#webatm-info').height(height - 80);
            } else {
                $('#webatm-uiwrapper').hide();
            }
            //change iframe height
            $('#webatm-info-company').height(height - 100);

            self.tabManager.changeViewport();
            self._fixIE6Style();

            self._container.triggerHandler("onStatusChange");
            if (saveStatus !== false) {
                self.winStatus = self._saveStatus();
            }
        },
        /**
         * ��ʼ��resize���ܲ��
         */
        _initResize:function () {
            var resize = this._container.resizable({
                handles:'all',
                helper:"ui-resizable-helper",
                containment:"document.body",
                minWidth:335,
                minHeight:350
            });
            //�������λ��iframe���棬resize��ʧЧ����˶�̬��һ���ڸǲ㣬һ��Ҫ��mouseup��ʱ��ɾ���ڸǲ�
            $(".ui-resizable-handle").bind("mousedown", function () {
                if ($("#webww-resize-overlay").length === 0) {
                    $("<div id='webww-resize-overlay'></div>").appendTo(document.body);
                }
            });
            $(document).bind("mouseup",function(){
                $('#webww-resize-overlay').remove();
            });
            resize.bind("resizestop", $.proxy(this._onResize, this));
            this._onResize();
        },
        /**
         * �¼���,ע��δ��ʼ��֮ǰ���ܰ󶨳ɹ�
         * @param eventType
         * @param eventhandler
         */
        bind:function (eventType, eventhandler) {
            if (this._container) {
                this._container.bind(eventType, eventhandler);
            } else {
                console.log("bind before init");
            }
        },
        unbind:function () {
            if (this._container) {
                this._container.unbind();
            } else {
                console.log("unbind before init");
            }
        },

        _showUnReadMsgs:function (cid, includeRecentHistory) {
            // �Զ���ʾ���ش洢����ʷ��δ����Ϣ
            var history = FE.sys.webww.history;
            if (history) {
                if (includeRecentHistory) {
                    var msgs = history.getHistory(cid);
                } else {
                    var msgs = history.getUnreadMsgs(cid);
                }
                for (var i = 0; i < msgs.length; ++i) {
                    this.showMsg(cid, msgs[i]);
                }

                if (msgs.length > 0) {
                    this.tabManager.notify(cid);
                }
            }
        },

        /**
         * ��һ���µ�Tab,����Ѿ����ڣ��Զ��л���ָ����tab
         * @param cid ��Tab����ϵ��ID
         */
        openTab:function (cid, pid) {
            console.log("openTab:" + cid, "info", "chatwin");
            if (!cid || cid.length <= 8) {
                return;
            }
            if (!this.isReady) {
                console.log("chatwin not ready", "error", "chatwin");
                return;
            }
			
            this.show();
            if (this.contacts && this.contacts[cid]) {
                console.log("tab exist:" + cid, "info", "chatwin");
                this._showUnReadMsgs(cid);
                this.tabManager.activeTab(cid);
                return;
            }
            this.contacts[cid] = {
                cid:cid,
                pid:pid,
                log:'',
                // ���촰Ĭ��ֵ
                input:'',
                nickname:'',
                msgs:[],
                scrollTop:0
            };

            var names = this.storage.getRecentContactNames(this.uid);
            var name = names[cid] || cid.substring(8);
            this.newTab(cid, name);
            this.contacts[cid]['nickname'] = name;
            this.tabManager.activeTab(cid);
            this._showUnReadMsgs(cid, true);

            if (!this.config.requestUname) {
                console.log("no config.requestUname!", "error", "chatwin");
                return;
            }
            var self = this;
            this.config.requestUname(cid, function (uid, uname) {
                self.updateContactInfo({cid:uid, name:uname})
            });
        },

        updateContactInfo:function (contactInfo) {
            if (!contactInfo) {
                return;
            }
            var cid = contactInfo['cid'];
            if (!this.contacts[cid]) {
                return;
            }
            console.log("updateUserInfo:" + cid, "info", "chatwin");
            if (cid === this.uid) {
                this.username = contactInfo['name'] || cid.substring(8);
                this.updateTitle();
                return;
            }
            this.tabManager.updateTitle(cid, $.util.escapeHTML(contactInfo['name']));
            this.contacts[cid]['nickname'] = contactInfo['name'];
            this._container.triggerHandler("onGetContact", [cid, contactInfo['name']]);
        },

        /**
         * ��ʾ��Ϣ
         * @cid target Id
         * @param msg   {
         'ackSeq' : 0,
         'mType' : '-1',
         'msg' : 'hello, world!',
         'sendTime' : '',
         'senderId' : 'hotook',
         };
         @param pid product Ids
         @param from  from page
         @result true/false
         */
        showMsg:function (cid, msg) {
//            console.log("showMsg: " + msg, "info", "chatwin");
            if (!this.contacts[cid]) {
                return false;
            } else {
                if ('' == this.contacts[cid]['nickname']) {
                    this.contacts[cid]['msgs'].push(msg);
                } else {
                    this._appendMessage(cid, msg);
                }
                this.tabManager.notify(cid);
            }
            return true;
        },

        _tabChanged:function () {
            if (this.lockSync) {//�����໥ͬ��������ѭ��
                console.log("_tabChanged-------- locked sync ----:");
                return;
            }
            var cids = [];
            for (var cid in this.tabStatusMap) {
                cids.push(cid);
            }
            console.log("-------- changedTab----:" + cids);
            this._container.triggerHandler('onTabChange', {
                cids:cids,
                curId:this.currentChatId
            });
        },

        syncTabStatus:function (chatStatus) {
            console.log("syncTabStatus-------- begin lock SYNC ----:");
            this.lockSync = true;

            try {
                //���ڱ�ͬ��
                for (var i = 0; i < chatStatus.cids.length; i++) {
                    console.log("syncTabStatus-------- openTab ----:" + chatStatus.cids[i]);
                    this.openTab(chatStatus.cids[i]);
                }
                ;

                for (var cid in this.tabStatusMap) {
                    var i = 0;
                    for (; i < chatStatus.cids.length; i++) {
                        if (cid === chatStatus.cids[i]) {
                            break;
                        }
                    }
                    if (i === chatStatus.cids.length) {
                        console.log("syncTabStatus-------- removeTab ----:" + cid);
                        this.tabManager.removeTab(cid);
                    }
                }
                this.tabManager.activeTab(chatStatus.curId);
            } catch (e) {
                console.log("--------syncTabStatus error ----:" + e.message);
            }
            this.lockSync = false;

            console.log("syncTabStatus-------- end lock SYNC ----:");
        },
        /**
         * ����tab״̬
         */
        updateTabStatus:function (cid, status) {
            if (this.tabManager) {
                this.tabManager.updateStatus(cid, status);
            }
        },
        /**
         * �����û���Ϣ���û�����ͷ��
         */
        setUserInfo:function (payload) {
            this.uid = payload['uid'];
            if (!payload['username']) {
                this.username = payload['uid'].substring(8);
                this.updateTitle();
                var self = this;
                this.config.requestUname(payload['uid'], function (uid, uname) {
                    self.updateContactInfo({cid:uid, name:uname});
                });
            } else {
                this.username = payload['username'];
                this.updateTitle();
            }
        },
        /**
         * ���´��ڱ�����Ϣ
         */
        updateTitle:function (info) {
            if (!this.isReady) {
                return;
            }
            info = info || "";
            info = $.util.escapeHTML(this.username) + "  " + info;
            $('#webatm-title-info').html(info);
        },

        showAlert:function (msg) {
            // �޸�BUG:133, ������alert��λ��ò�ƺ�WebATM��һ��
            var pos = $('#webatm-slider').offset();
            pos.left += 8;
            pos.top -= 48;
            var notice = $('#webatm-notice');
            notice.css({
                'display':'block',
                'position':'absolute',
                'width':($('#webatm-slider').outerWidth() - 28) + 'px'
            });
            notice.offset(pos);
            var alertBoard = $("<div></div>");
            alertBoard.addClass('webatm-dpl-board-alert');
            alertBoard.text(msg);
            notice.empty();
            notice.append(alertBoard);

            setTimeout(function () {
                notice.css('display', 'none');
            }, 5 * 1000);
        },

        newTab:function (cid, name) {
            this.tabManager.addTab({
                title:name,
                id:cid
            });
        },


        _switchTabData:function (cid) {
            if (!this.contacts[cid]) {
                return;
            }
            if (this.selectedMainTab && this.contacts[this.selectedMainTab]) {
                this.contacts[this.selectedMainTab]['scrollTop'] = $('#webatm-log').scrollTop;
            }
            this.selectedMainTab = cid;
            $('#webatm-log').html(this.contacts[cid].log || '');
            this.emotions.emotionImgDisplay("#webatm-log");
            var self = this;
            setTimeout(function () {
                if (self.contacts[cid]) {
                    $('#webatm-log')[0].scrollTop = self.contacts[cid]['scrollTop'];
                }
            }, 100);


            // ��¼��ǰ�������
            this.currentChatId = cid;

            // ��һ�δ�tab ����ǰ�û�һ��״̬�ռ�
            if (!this.tabStatusMap[this.currentChatId]) {
                this.tabStatusMap[this.currentChatId] = {};
            }

            // �л����
			var offerid = FE.sys.webww.storage.getOfferId(FE.sys.webww.core.user.memberId,cid);
			if(offerid && offerid != "" && offerid != 'undefined'  && offerid != "null"){
				this.panel.switchInfoTab(cid, 'webatm-offerInfo');
				this.panel.$offerinfo.show();
			}else{
				this.panel.switchInfoTab(cid, 'webatm-companyInfo');
				this.panel.$offerinfo.hide();
			}

            this._tabChanged();
        },

        _appendMessage:function (cid, msg) {
            var message = {};
            message['message'] = msg['msg'] || msg["msgContent"];
            //escape ��Ϣ�е�html��ǩ
            message['message'] = $.util.escapeHTML(message['message']);
            //�����Э����ص������־����ͼƬ��
            message['message'] = this.protocol.processMessage(message['message']);
            // console.log("processMessage result:" + message['message']);
			
            message['message'] += this.config.urlToSummary(message['message'], cid);
			
			if(message['message'] == "")return;
			
            message['datetime'] = msg['sendTime'];

            //������id
            if (!msg['senderId']) {
                message['usernameclass'] = 'webatm-message-mime';
                message['username'] = this.username;
            } else {
                message['usernameclass'] = 'webatm-message-username';
                message['username'] = this.contacts[cid]['nickname'];
            }

            if (34 == msg['mType']) {
                message['autoresponse'] = true;
            }

            var tpl = Hogan.compile('<div class="webatm-message"><div class="status"><span class="{{usernameclass}}">{{username}}</span>{{#autoresponse}}<span class="autoresponse"> (autoresponse) </span>{{/autoresponse}}<span class="webatm-message-datetime">({{datetime}})</span></div><div class="webatm-message-content">{{{message}}}</div></div>');
            var html = tpl.render(message).replace(/^\s*/mg, '');
            html = html.replace(/\n/g, '<br/>');
            html = html.replace(/\r/g, '<br/>');

            //�����滻
            html = this.emotions.emotionReplaceCode(html);

            this.contacts[cid].log += html;

            this._redrawMessage(cid);

        },

        _redrawMessage:function (cid) {
            if (this.selectedMainTab == cid) {
                $('#webatm-log').html(this.contacts[cid].log);
                this.emotions.emotionImgDisplay("#webatm-log");
                // ��ͼƬ����������¼���߶����������·�
                setTimeout(function () {
                    $('#webatm-log')[0].scrollTop = $('#webatm-log')[0].scrollHeight;
                }, 100);
            }
        },
        renderRecentContacts:function (list) {
            this.panel.renderRecentContacts(list);
        },

        replaceMessage:function (cid, str, replace) {
            this.contacts[cid].log = this.contacts[cid].log.replace(new RegExp(str, "gm"), replace);
            this._redrawMessage(cid);
        },

        /**
         * ������ʾ����,��Ҫ�ָ��ϴα����״̬
         */
        show:function () {
            $('#webatm-window').show();
            $('#webatm-title').show();
            $('#webatm-uiwrapper').show();
            this._restoreStatus(this.winStatus);
            $('#webatm-input').focus();
        },
        hide:function () {
            $('#webatm-window').hide();
        },
        isShow:function () {
            if ($('#webatm-window').css('display') === 'block') {
                return true;
            }
            return false;
        },
        fakeTab:function (cid, name) {
            this.contacts[cid] = {
                cid:cid,
                pid:'0',
                log:'',
                // ���촰Ĭ��ֵ
                input:'',
                nickname:'',
                msgs:[],
                scrollTop:0
            };
            this.show();
            this.newTab(cid, cid);
        },
		showpic:function(url){
            jQuery(function($){
				$.use('ui-core,ui-draggable,ui-dialog', function(){
					var dialog2 = $('div.dialog', '#demo2');
					document.getElementById('showshow').innerHTML='<p class="close" onclick="FE.sys.webww.ui.chatwin.closepic();"><img onclick="FE.sys.webww.ui.chatwin.closepic();" src="'+ url+ '"/><p>';
					dialog2.dialog({
						modal: true,
						modalCSS: {
							backgroundColor: 'rgb(151, 163, 168)'
						},
						shim: true,
						center: true,
						draggable: true,
						css: {
							left: 200,
							top: 48
						}
					});               
				});
			});
		},
		closepic:function (){
			jQuery(function($){
				$.use('ui-core,ui-draggable,ui-dialog', function(){
					$('p.close').closest('div.dialog').dialog('close');     
					document.getElementById('showshow').innerHTML='';					
				});
			});
		}
    };
    FE.sys.webww.ui.chatwin = chatwin;
})(jQuery);
