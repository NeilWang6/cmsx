/**
 * 封装消息协议与协议的处理
 * 跟旺旺协议相关硬编码都应该在此统一处理，禁止在其他地方硬编码导致维护困难
 */
jQuery.namespace('FE.sys.webww');
(function ($) {
    var R = FE.sys.webww.ui.lib.Ri18n;

    // 消息处理逻辑封装
    var protocol = {
        // 内部变量及初使化
        core:null,
        pubsub:FE.sys.pubsub,
        /**
         * 发送消息方法,等待pubsub模块返回
         */
        send:null,
        resource:null,
        shouldSendLogin:false,
        /**
         * 初使化方法
         *
         * @param core
         *            旺旺消息核心组件,本方法的调用者
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
            console.log("protocol.js: inited！");
            return {
                "succes":result,
                "message":message
            };
        },

        /**
         * 接收消息,所有的消息从这里来
         */
        _receiveMsg:function (msg) {
            if (msg == null || msg == '') {
                return;
            }
            var type = msg.mType;
            switch (type) {
                //用户登录消息
                case 'lg':
                    this._receiveLoginMsg(msg);
                    break;
                //收到的离线消息
                case '9':
                    this.core.onOfflineMsg(msg);
                    break;
                //登录后收到黑名单信息
                case '15':
                    this.core.onBlackList(msg);
                    break;
                //状态改变
                case '27':
                //主动订阅状态
                case '24':
                    this.core.onStatusChange(msg);
                    break;
                //被强制退出
                case '25':
                    console.log("code:25 logout ");
                    this.core.onLogout();
                    break;
                //系统通知消息
                case '36':
                case '37':
                    this.core.onSysNotify(msg);
                    break;
                //收到自动回复消息
                case '34':
                //收到系统消息
                //收到用户发出的消息处理
                case '50':
                    this.core.onMsg(msg, true);
                    break;
                //收到发送消息回执
                case '64':
                    break;
                //收到文件
                case '521':
                    this.core.onFile(msg);
                    break;
                //发消息错误提示
                case '400':
                    this.core.onFailMsg(msg);
                    break;
                case '525':
                    //收到音频或视频请求
                    this.core.onMedia(msg);
                    break;
                case '1025':
                    //被挤下线
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

        isOtherPlaceLogin:function (loginCode) { //该用户已经在别处登陆
            return loginCode === 18;
        },

        // 解码用户状态
        decodeStatus:function (predefStatus) {
            var reStr = '';
            switch (predefStatus) {
                // 在线
                case 1:
                // 离线登陆
                case 8:
                // 假在线
                case 10:
                // 手机在线
                case 12:
                // 忙碌中
                case 2:
                // 接听电话中
                case 4:
                // 稍候
                case 6:
                case 3:
                case 5:
                    reStr = 'online';
                    break;
                // 其他都是离线
                default:
                    reStr = 'offline';
                    break;
            }
            return reStr;
        },


        /**
         * 处理\T之后的消息内容
         */
        _processText:function (message, pos, urlType) {
            /**
             * 判断是否是url字符
             * TODO: 是否有更好的判断方式？
             */
            var isUrlChar = function (ch) {
                //非空白字符或ASCII字符
                return (/\S/.test(ch) && ch.charCodeAt(0) <= 128);
            };
            /**
             * 渲染url生成link,包含安全图标的生成
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
                if (ch != '\\') { // 非“\”字符，是消息内容。
                    if (urlType !== '') {
                        if (isUrlChar(ch)) { //是否url的字符
                            url += ch;
                        } else { // 非url字符，表示url结束
                            sb += renderUrl(url, urlType);
                            sb += ch;
                            urlType = '';
                            url = '';
                        }
                    } else {
                        sb += ch;
                    }
                } else { //  '\' 字符，特殊处理
                    if (++pos < message.length) {
                        ch = message.charAt(pos);
                        if (ch == '\\') {
                            sb += '\\';
                        } else if (ch == 'P' || ch == 'T' || ch == 'F' || ch == 'C' || ch == 'S' || ch == 'B' || ch == 'I' || ch == 'U' || ch == 'A') {
                            // 把位置定位到 "\"字符处，进入case 'P'，'T'等逻辑
                            pos = pos - 2;
                            break;
                        } else if ($.inArray(ch, ignoreSpecialChars) != -1) { //跳过特殊字符
                            ++pos;
                            break;
                        } else { // 非特殊字符,保留
                            sb += '\\' + ch;
                        }
                    } else {
                        sb += '\\';
                    }
                }
            }
            //url在消息结尾处
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
         * 处理字体样式
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
         * 处理消息中的特殊标记
         * @param {String} message 如:\\C0xffff80\\S0x8.0xa0\\FGulimChe\\I\\U\\Ttext
         * @isPlainText {Bool} 是否输出纯文本,默认输出为html格式
         */
        processMessage:function (message, isPlainText) {
            var pos = 0;
            var length = message.length;
            var sb = '';
            var styles = {};
            var urlType = '';
//            console.log("processMessage:" + message, "info", "protocol");
            while (pos < length) {
                if (message.charAt(pos) == '\\') { // 消息以'\'开头
                    if (++pos < length) { // “\”后还有没有新的字符。
                        var ch = message.charAt(pos);
                        switch (ch) {
                            // \P是图片
                            case 'P':
                                // 没有处理截图，临时做替换处理。
								if(++pos < length && message.charAt(pos) == '@'){
									url = '';
									while (++pos < length && message.charAt(pos) != '<' && message.charAt(pos) != '\\') { // 图片地址以“<”结束
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
									while (++pos < length && message.charAt(pos) != '<' && message.charAt(pos) != '\\') { // 图片地址以“<”结束
									}
									sb += '';
								}
                                break;
                            // \T后面是消息内容
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
                    } else { // 字符串以“\”结束。
                        sb += '\\';
                    }
                } else { //非'\'字符,直接跳过
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
         * 发送普通消息
         *
         * @param id
         *            用户id
         * @param msg
         *            发送的内容
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
         * 预发送登陆消息
         *
         * 当链接准备好会发送，否则当链接好后自动发送
         *
         * @param id
         *            用户id
         * @param msg
         *            发送的内容
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
         * 发送登陆消息
         *
         * @param isForce
         *            是否强制登陆 当非强制登陆时，如果用户旺旺处于登录状态，则不自动登陆webww，防止互踢现象
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
         * 发送收到消息的加执
         *
         * @param jRecMsg
         *            收到的消息
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
         * 订阅联系人状态
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
         * 取消订阅联系人状态
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
         * 发送登出消息
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