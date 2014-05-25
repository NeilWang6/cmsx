/**
 * ��װ��ϢЭ����Э��Ĵ���
 * ������Э�����Ӳ���붼Ӧ���ڴ�ͳһ������ֹ�������ط�Ӳ���뵼��ά������
 */
jQuery.namespace('FE.sys.webww');
(function ($) {
    var R = FE.sys.webww.ui.lib.Ri18n;

    // ��Ϣ�����߼���װ
    var protocol = {
        // �ڲ���������ʹ��
        core:null,
        pubsub:FE.sys.pubsub,
        /**
         * ������Ϣ����,�ȴ�pubsubģ�鷵��
         */
        send:null,
        resource:null,
        shouldSendLogin:false,
        /**
         * ��ʹ������
         *
         * @param core
         *            ������Ϣ�������,�������ĵ�����
         *
         */
        init:function (core) {
            console.log("protocol.js: init ...");
            this.core = core;
            var result = false;
            var message = '';
            var rs = this.resource = this.pubsub.subscribe('wwmessage', $.proxy(this._receiveMsg, this), $.proxy(this._stateChange, this));
            if (!rs.getState()) {
                result = false;
                message = 'connecting';
            } else {
                result = true;
                message = 'connected';
            }

            this.send = rs.send;
            console.log("protocol.js: inited��");
            return {
                "succes":result,
                "message":message
            };
        },

        /**
         * ������Ϣ,���е���Ϣ��������
         */
        _receiveMsg:function (msg) {
            if (msg == null || msg == '') {
                return;
            }
            var type = msg.mType;
            switch (type) {
                //�û���¼��Ϣ
                case 'lg':
                    this._receiveLoginMsg(msg);
                    break;
                //�յ���������Ϣ
                case '9':
                    this.core.onOfflineMsg(msg);
                    break;
                //��¼���յ���������Ϣ
                case '15':
                    this.core.onBlackList(msg);
                    break;
                //״̬�ı�
                case '27':
                //��������״̬
                case '24':
                    this.core.onStatusChange(msg);
                    break;
                //��ǿ���˳�
                case '25':
                    console.log("code:25 logout ");
                    this.core.onLogout();
                    break;
                //ϵͳ֪ͨ��Ϣ
                case '36':
                case '37':
                    this.core.onSysNotify(msg);
                    break;
                //�յ��Զ��ظ���Ϣ
                case '34':
                //�յ�ϵͳ��Ϣ
                //�յ��û���������Ϣ����
                case '50':
                    this.core.onMsg(msg, true);
                    break;
                //�յ�������Ϣ��ִ
                case '64':
                    break;
                //�յ��ļ�
                case '521':
                    this.core.onFile(msg);
                    break;
                //����Ϣ������ʾ
                case '400':
                    this.core.onFailMsg(msg);
                    break;
                case '525':
                    //�յ���Ƶ����Ƶ����
                    this.core.onMedia(msg);
                    break;
                case '1025':
                    //��������
                    console.log("code:1025 logout ");
                    this.core.onLogout();
                    break;
                default:
                    console.log("unsupport code:" + type);
            }
        },

        _receiveLoginMsg:function (msg) {
            var loginCode = msg.loginCode;
            var failMs = '';
            if (loginCode !== 0) {
                if (loginCode !== 18) {
                   failMs = R("LOGIN_ERROR", loginCode);
                } else {
                   failMs = R("LOGINED_OTHER_PLACE", loginCode);
                }
                console.log("log failed !" + failMs);
                this.core.onLogin(false, loginCode, failMs);
            } else {
                this.core.onLogin(true, loginCode, failMs);
            }
        },

        isOtherPlaceLogin:function (loginCode) { //���û��Ѿ��ڱ𴦵�½
            return loginCode === 18;
        },

        // �����û�״̬
        decodeStatus:function (predefStatus) {
            var reStr = '';
            switch (predefStatus) {
                // ����
                case 1:
                // ���ߵ�½
                case 8:
                // ������
                case 10:
                // �ֻ�����
                case 12:
                // æµ��
                case 2:
                // �����绰��
                case 4:
                // �Ժ�
                case 6:
                case 3:
                case 5:
                    reStr = 'online';
                    break;
                // ������������
                default:
                    reStr = 'offline';
                    break;
            }
            return reStr;
        },


        /**
         * ����\T֮�����Ϣ����
         */
        _processText:function (message, pos, urlType) {
            /**
             * �ж��Ƿ���url�ַ�
             * TODO: �Ƿ��и��õ��жϷ�ʽ��
             */
            var isUrlChar = function (ch) {
                //�ǿհ��ַ���ASCII�ַ�
                return (/\S/.test(ch) && ch.charCodeAt(0) <= 128);
            };
            /**
             * ��Ⱦurl����link,������ȫͼ�������
             */
            var renderUrl = function (url, type) {
                var link = url,
                    icon = '';
                /^http:/i.test(url) || (link = ("http://" + url));
				if(link.indexOf('alibaba.com') > 0 || link.indexOf('taobao.com') > 0 || link.indexOf('1688.com') > 0 || link.indexOf('alipay.com') > 0|| link.indexOf('etao.com') > 0|| link.indexOf('tmall.com') > 0){
					if(link.indexOf('?') > 0){
						link = '<a href="' + link + '&asker=ATC_cnwebww" target="_blank">' + url + '</a>';
					}
					else{
						link = '<a href="' + link + '?asker=ATC_cnwebww" target="_blank">' + url + '</a>';
					}
				}
				else{
					link = '<a href="' + link + '" target="_blank">' + url + '</a>';
				}
				   
                if (type === '0') {
                    icon = "<span class='webatm-security-secure'></span>";
                } else if (type === '1') {
                    icon = "<span class='webatm-security-unknown'></span>";
                }
                return icon + link;
            };

            var ignoreSpecialChars = ['D', 'R', 'E'];
            var sb = "",
                url = "",
                length = message.length;
            while (++pos < length) {
                var ch = message.charAt(pos);
                if (ch != '\\') { // �ǡ�\���ַ�������Ϣ���ݡ�
                    if (urlType !== '') {
                        if (isUrlChar(ch)) { //�Ƿ�url���ַ�
                            url += ch;
                        } else { // ��url�ַ�����ʾurl����
                            sb += renderUrl(url, urlType);
                            sb += ch;
                            urlType = '';
                            url = '';
                        }
                    } else {
                        sb += ch;
                    }
                } else { //  '\' �ַ������⴦��
                    if (++pos < message.length) {
                        ch = message.charAt(pos);
                        if (ch == '\\') {
                            sb += '\\';
                        } else if (ch == 'P' || ch == 'T' || ch == 'F' || ch == 'C' || ch == 'S' || ch == 'B' || ch == 'I' || ch == 'U' || ch == 'A') {
                            // ��λ�ö�λ�� "\"�ַ���������case 'P'��'T'���߼�
                            pos = pos - 2;
                            break;
                        } else if ($.inArray(ch, ignoreSpecialChars) != -1) { //���������ַ�
                            ++pos;
                            break;
                        } else { // �������ַ�,����
                            sb += '\\' + ch;
                        }
                    } else {
                        sb += '\\';
                    }
                }
            }
            //url����Ϣ��β��
            if (url !== '') {
                sb += renderUrl(url, urlType);
            }

            return {
                text:sb,
                pos:pos,
                url:url
            };
        },
        /**
         * ����������ʽ
         * @param  {Object} styles
         */
        _processStyles:function (styles) {
            var style = '';
            styles.family && (style += ('font-family:' + styles.family + ';'));
            styles.bold && (style += 'font-weight:700;');
            styles.italic && (style += 'font-style:italic;');
            styles.underline && (style += 'text-decoration:underline;');
            var color = styles['color'];
            if (color && color.substring(0, 2) === '0x' && color.length > 3) {
                style += 'color:';
                if (color.length === 4) {
                    style += ('#' + color.substring(2, 4) + '0000');
                }
                if (color.length === 6) {
                    style += ('#' + color.substring(4, 6) + color.substring(2, 4) + '00');
                }
                if (color.length === 8) {
                    style += ('#' + color.substring(6, 8) + color.substring(4, 6) + color.substring(2, 4));
                }
                style += ';';
            }
            if (styles['size']) {
                var size = parseInt(styles['size']);
                style += ('font-size:' + size + 'px;');
                style += ('line-height:' + size + 'px;');
            }
            return style;
        },
        /**
         * ������Ϣ�е�������
         * @param {String} message ��:\\C0xffff80\\S0x8.0xa0\\FGulimChe\\I\\U\\Ttext
         * @isPlainText {Bool} �Ƿ�������ı�,Ĭ�����Ϊhtml��ʽ
         */
        processMessage:function (message, isPlainText) {
            var pos = 0;
            var length = message.length;
            var sb = '';
            var styles = {};
            var urlType = '';
//            console.log("processMessage:" + message, "info", "protocol");
            while (pos < length) {
                if (message.charAt(pos) == '\\') { // ��Ϣ��'\'��ͷ
                    if (++pos < length) { // ��\������û���µ��ַ���
                        var ch = message.charAt(pos);
                        switch (ch) {
                            // \P��ͼƬ
                            case 'P':
                                // û�д����ͼ����ʱ���滻����
								if(++pos < length && message.charAt(pos) == '@'){
									url = '';
									while (++pos < length && message.charAt(pos) != '<' && message.charAt(pos) != '\\') { // ͼƬ��ַ�ԡ�<������
										url += message.charAt(pos);
									}
										
									if($.util.ua.ie6){
										sb += '<img src="' + url + '" style="width:100px;height:100px;"  onclick="FE.sys.webww.ui.chatwin.showpic(\''+url+'\')"/>';
									}
									else{
										var w = 260;
										var h = 260;										
										if($('#demoimg').width() > w){
											$("#demoimg").attr("src",url);
											h = w * $('#demoimg').height() / $('#demoimg').width();
											sb += '<img src="' + url + '" style="width:' + w + 'px;height:' + h + 'px;"  onclick="FE.sys.webww.ui.chatwin.showpic(\''+url+'\')"/>';
										}
										else{
											sb += '<img src="' + url + '" style="max-width:'+w+'px;max-height:'+h+'px;" onclick="FE.sys.webww.ui.chatwin.showpic(\''+url+'\')"/>';
										}
									}
								}
								else{
									while (++pos < length && message.charAt(pos) != '<' && message.charAt(pos) != '\\') { // ͼƬ��ַ�ԡ�<������
									}
									sb += '';
								}
                                break;
                            // \T��������Ϣ����
                            case 'T':
                                var result = this._processText(message, pos, urlType);
                                if (!isPlainText) {
                                    if (sb !== '') {
                                        sb += '</span>';
                                    }
                                    var style = this._processStyles(styles);
                                    sb += '<span style="' + style + '">';
                                }
                                sb += result.text;
                                pos = result.pos;
                                urlType = '';
                                break;
                            case 'F':
                                //font family
                                styles['family'] = '';
                                while (++pos < length && message.charAt(pos) != '\\') {
                                    styles['family'] += message.charAt(pos);
                                }
                                break;
                            case 'C':
                                //font color
                                styles['color'] = '';
                                while (++pos < length && message.charAt(pos) != '\\') {
                                    styles['color'] += message.charAt(pos);
                                }
                                break;
                            case 'S':
                                //font size
                                styles['size'] = '';
                                while (++pos < length && message.charAt(pos) != '\\') {
                                    styles['size'] += message.charAt(pos);
                                }
                                break;
                            case 'B':
                                //font:bold
                                styles['bold'] = true;
                                break;
                            case 'I':
                                //font:italic
                                styles['italic'] = true;
                                break;
                            case 'U':
                                //font:underline
                                styles['underline'] = true;
                                break;
                            case 'A':
                                while (++pos < length && message.charAt(pos) != '\\') {
                                    urlType = message.charAt(pos);
                                }
                                break;
                        }
                    } else { // �ַ����ԡ�\��������
                        sb += '\\';
                    }
                } else { //��'\'�ַ�,ֱ������
                    ++pos;
                }
            }
            if (!isPlainText) {
                sb += '</span>';
            }
            return sb;
        },

        _stateChange:function (state) {
            if (state === 0) {
                console.log("_stateChange state=0 (close)");
                this.core.onLogout();
            } else if (state === 1) {
                console.log("_stateChange state=1 (ready) ");
                if (this.shouldSendLogin) {
                    this._sendLoginMsg();
                    this.shouldSendLogin = false;
                }
            }
        },

        /**
         * ������ͨ��Ϣ
         *
         * @param id
         *            �û�id
         * @param msg
         *            ���͵�����
         */
        sendMsg:function (id, msg, count) {
            var self = this;
            var time = this._getTime();
            var jMsg = {
                'mType':'1',
                'targetId':id,
                'msg':msg,
                'sendTime':time,
                'ackSeq':count
            };
            this.send(jMsg);
            return jMsg;
        },

        /**
         * Ԥ���͵�½��Ϣ
         *
         * ������׼���ûᷢ�ͣ��������Ӻú��Զ�����
         *
         * @param id
         *            �û�id
         * @param msg
         *            ���͵�����
         */
        prepareSendLoginMsg:function (isForce) {
            this.shouldSendLogin = true;
			console.log("in prepareSendLoginMsg");
            if (this.resource && this.resource.getState()) {
                this._sendLoginMsg(isForce);
                this.shouldSendLogin = false;
            }
        },
        /**
         * ���͵�½��Ϣ
         *
         * @param isForce
         *            �Ƿ�ǿ�Ƶ�½ ����ǿ�Ƶ�½ʱ������û��������ڵ�¼״̬�����Զ���½webww����ֹ��������
         */
        _sendLoginMsg:function (isForce) {
		    console.log("in _sendLoginMsg");
            var isForce = isForce === true ? "1" : "0";
            var jMsg = {
                'mType':'lg',
                'isForce':isForce
            };
            this.send(jMsg);
        },

        /**
         * �����յ���Ϣ�ļ�ִ
         *
         * @param jRecMsg
         *            �յ�����Ϣ
         *
         */
        sendBackMsg:function (jRecMsg) {
            var jBackMsg = {
                'mType':'2',
                'senderId':jRecMsg.senderId,
                'ackSeq':jRecMsg.ackSeq
            };
            this.send(jBackMsg);
        },
        /**
         *
         * @param jRecMsg
         *
         */
        sendOfflineBackMsg:function (jaMsgs) {
            var jBackMsg = {
                'mType':'6',
                'sendTime':jaMsgs[jaMsgs.length - 1].sendTime
            };
            this.send(jBackMsg);
        },
        /**
         * ������ϵ��״̬
         *
         * @param ids
         *
         */
        feedState:function (ids) {
            if (ids == null || ids.length == 0) return;
            var jFeedMsg = {
                'mType':'3',
                'mIds':ids
            };
            this.send(jFeedMsg);
        },
        /**
         * ȡ��������ϵ��״̬
         *
         * @param ids
         *
         */
        cancelFeedState:function (ids) {
            if (ids == null || ids.length == 0) return;
            var jFeedMsg = {
                'mType':'5',
                'mIds':ids
            };
            this.send(jFeedMsg);
        },
        _getTime:function () {
            var dt=new Date().format("yyyy-MM-dd hh:mm:ss");
            return dt;
        },
        /**
         * ���͵ǳ���Ϣ
         */
        logout:function () {
            var jLogoutMsg = {
                'mType':'7'
            };
            this.send(jLogoutMsg);
        }
    };

    FE.sys.webww.protocol = protocol;
})(jQuery);