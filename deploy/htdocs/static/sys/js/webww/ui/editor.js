/**
 * 旺旺消息编辑器，支持HTML格式,如插入表情图片等
 * 依赖于storage
 * @author xuping.nie levy.jiny
 */
// #import ui/font.js
// #import util.js
jQuery.namespace("FE.sys.webww");
var STORE = FE.sys.webww.storageCore;
(function ($) {
    var R = FE.sys.webww.ui.lib.Ri18n;

    FE.sys.webww.Editor = function (sendcallback, alertcallback, beforePasteOrDrop) {
        if (!sendcallback || !alertcallback) {
            return;
        }
        this.sendcallback = sendcallback;
        this.alertcallback = alertcallback;
        this.beforePasteOrDrop = beforePasteOrDrop;
        this.SHORTCUTKEY = 'webatm-shortcut';
        console.log("init .", "info", "editor");

        this.initDom();
        this.editor = $('#webatm-input');
        $('#webatm-send').bind('click', $.proxy(this.sendmessage, this));
        var self = this;
        this.editor.bind('keyup', function (ev) {
            self.saveRange(ev);
            var msg = self.clearHTML(self.getSendWWText());
            if (msg && msg.length > 800) {
                var length_limit = R("LENGTH_LIMIT");
                self.alertcallback(length_limit);
            }
        });
        this.editor.bind("mouseup", $.proxy(this.saveRange, this));
        this.editor.bind('paste', $.proxy(this.onPasteOrDrop, this));
        if ($.browser.msie) {
            this.bindDragDropForIE();
        } else {
            this.editor.bind('drop', $.proxy(this.onPasteOrDrop, this));
        }

        var self = this;
        STORE.ready(function () {
            var shortkey = STORE.getItem(self.SHORTCUTKEY);
            FE.sys.webww.ui.font_toolbar.init(self.editor);
            self.setShortcut(shortkey);
            //初始化完成，自动获取焦点
            self.editor.focus();
        });
    }

    FE.sys.webww.Editor.prototype = {
        lasttime:null,
        lastRange:null,
        SHORTCUTKEY:null,
        editor:null,
        sendcallback:null,
        alertcallback:null,
        fontStyles:{},

		/**
         * 读取或设置输入框的值
         * 2012-12-19 levy.jiny
         */
		getSendWWText:function(){
			if(this.editor.is('textarea'))
			   return this.editor.val();
			return this.editor.html();
		},
		setSendWWText:function(str){
			if(this.editor.is('textarea'))
			    this.editor.val(str);
			else
				this.editor.html(str);
		},
        /**
         * 清理掉html标签与样式
         * @param  {String} str   需要做清理的字符串
         * @return {String}        清理后的字符串
         */
		 

        clearHTML:function (str) {
            var div = document.createElement("div");
            str = str.replace(/<p>/ig, '');
            //'\n'会textContent或innerText被转成空格，因此先转义
            str = str.replace(/<\/p>/ig, '\\n');
            str = str.replace(/<br>/ig, '\\n');
            div.innerHTML = str;
            var text;
            if (div.textContent) {
                //多个空格替换成一个空格
                text = div.textContent;
                text = text.replace(/\s+/g, ' ');
            } else {
                text = div.innerText;

            }
            if (text) {
                text = text.replace(/\\n/g, '\n');
            }
            return text;
        },
        _getSelectionText:function () {
            if (window.getSelection) {
                return window.getSelection().toString();
            } else if (document.selection && document.selection.createRange) {
                return document.selection.createRange().text;
            }
            return '';
        },
        /**
         * 当有选择文本，则拖放选择文本，否则拖放选中的标签所在的html，
         * 由于Firefox，Chrome,Safari已经很好支持拖放，这里针对IE做兼容支持
         * 事件产生顺序是先dragstart,drag,dragenter,dragover,drop,dragend
         */
        bindDragDropForIE:function () {
            if (!$.browser.msie) {
                return;
            }
            var self = this, drop = false;
            //IE默认情况下，div不会产生drop事件，需要阻止dragover与dragenter默认事件才会产生drop事件
            var handleDragDrop = function (e) {
                switch (e.type) {
                    case "dragover":
                    case "dragenter":
                        e.preventDefault();
                        break;
                    case "drop":
                        drop = true;
                        console.log("event :" + e.type + "target id :" + e.target.id);
                        break;
                }
            }
            var onDragEnd = function (e) {
                if (drop) {
                    drop = false;
                    var text = self._getSelectionText();
                    if (!text) {
                        var html = e.target.outerHTML;
                        console.log("event :" + e.type + "src :" + html);
                        html = self.beforePasteOrDrop ? self.beforePasteOrDrop(html) : html;
                        text = self.clearHTML(html);
                    }
                    self.insertHtml(text);
                }
            }
            $(document.body).bind('dragenter', handleDragDrop);
            $(document.body).bind('dragover', handleDragDrop);
            this.editor.bind('drop', handleDragDrop);
            $(document.body).bind('dragend', onDragEnd);
        },
        /**
         * 处理paste或drop事件，清理掉html标签与样式
         */
        onPasteOrDrop:function (e) {
            var self = this;
            //延迟50ms等剪贴好后再做处理
            setTimeout(function () {
                var html = self.getSendWWText();
                html = self.beforePasteOrDrop ? self.beforePasteOrDrop(html) : html;
                var text = self.clearHTML(html);
                self.setSendWWText(text);
            }, 100);
        },

        /**
         * 组装文本消息协议头
         * 如：\\C0\\S0xa.0xc8\\F宋体\\Ttesttext
         * \C0xffff80\S0x8.0xa0\FGulimChe\I\U\Tff
         */
        createTextHead:function () {
		    //ipad上不支持字体
		    if(this.editor.is('textarea'))
				return "\\C0x000000\\S0xc.0xf0\\FArial\\T";
            var head = "";
            var color = this.editor.css('color');
            var hexcolor = color && color.colorHex();
            console.log("select hexcolor:" + hexcolor);
            if (hexcolor && hexcolor.length === 7) {
                head += "\\C0x";
                //协议里面不是按RGB,而是按BGR
                head += (hexcolor.substring(5, 7) + hexcolor.substring(3, 5) + hexcolor.substring(1, 3));
            } else {
                head += "\\C0";
            }
            var size = parseInt(this.editor.css('font-size'));
            var codes = {8:'a0', 10:'c8', 12:'f0', 14:'118', 18:'168', 24:'1e0', 36:'2d0'};
            size >= 8 && (head += ("\\S0x" + Number(size).toString(16) + ".0x" + codes[size]));

            var weight = this.editor.css('font-weight');
            weight && weight === "700" && (head += '\\B');
            var style = this.editor.css('font-style');
            style && style.toLowerCase() === "italic" && (head += '\\I');
            var decoration = this.editor.css('text-decoration');
            decoration && decoration.toLowerCase() === "underline" && (head += '\\U');

            var family = this.editor.css('font-family');
            family.replace(/\n/, '');
            family ? (head += "\\F" + family.rtrim()) : "\\F宋体";

            head += "\\T";
            console.log("createTextHead:" + head, "info", "editor");
            return head;
        },

        sendmessage:function () {
            var now = new Date();
            if (this.lasttime && (now.getTime() - this.lasttime) < 1 * 1000) {
                this.alertcallback(R('RATE_LIMIT'));
                this.editor.focus();
                return;
            }
            var msg = this.getSendWWText();
            if (FE.sys.webww.emotions) {
                msg = FE.sys.webww.emotions.replaceImg2Code(msg);
            }
            msg = this.clearHTML(msg);
            if (msg && msg != '') {
                if (msg.length <= 800) {
                    //msg = "\\C0\\S0xa.0xc8\\F宋体\\T" + msg;
                    msg = this.createTextHead() + msg;
                    if (this.sendcallback(msg)) {
                        this.setSendWWText('');
                        this.lasttime = now.getTime();
                    }
                    this.setSendWWText('');
                } else {
                    this.alertcallback(R('LENGTH_LIMIT'));
                }
            } else {
                this.setSendWWText('');
				console.log("----------------EMPTY_LIMIT");
                this.alertcallback(R("EMPTY_LIMIT"));
            }
            //发送完毕后自动获取焦点
            this.editor.focus();
        },


        /**
         * 保存光标的位置
         */
        saveRange:function (e) {
            if ($.browser.webkit || $.browser.mozilla || $.browser.opera) {
                var selection = window.getSelection();
                if (selection.anchorNode && selection.anchorNode.id !== "webatm-input") {
                    return;
                }
                var range = selection.rangeCount > 0 && selection.getRangeAt(0);
                this.lastRange = range;
            } else if ($.util.ua.ie) {
                this.lastRange = document.selection.createRange();
            }
        },

        /**
         * 在保存的光标处插入html
         * @param {Object} html
         */
        insertHtml:function (html) {
            this.editor.focus();
            if ($.browser.webkit || $.browser.mozilla || $.browser.opera) {// FireFox,Safari,Opera支持
                var selection = window.getSelection();
                var range = this.lastRange || selection.getRangeAt(0);
                range.collapse(false);
                var hasR = range.createContextualFragment(html);
                var hasR_lastChild = hasR.lastChild;
                range.insertNode(hasR);
                if (hasR_lastChild) {
                    range.setEndAfter(hasR_lastChild);
                    range.setStartAfter(hasR_lastChild)
                }
                //firefox 换行如果末尾没有<br>,需要自动再增加一个<br>,但需要光标至于最后一个<br>之前
                var lastnode = this.editor.children().last()[0];
                if (!lastnode || lastnode.nodeName !== "BR") {
                    var br = document.createElement('br');
                    range.insertNode(br);
                }

                selection.removeAllRanges();
                selection.addRange(range);
            } else if ($.browser.msie) {// IE支持
                var range = this.lastRange || document.selection.createRange();
                // garcia.wul FIX BUG: 45, IE6下，选中表情,再insert emotion,页面错误
                if (range.pasteHTML !== undefined) {
                    range.pasteHTML(html);
                    // 插入后光标位于插入内容的后面
                    range.collapse(false);
                    range.select();
                }
            } else {
                this.editor.append(html);
            }
        },

        ctrlAndEnter:function (event) {
            var keyCode = event.which || event.keyCode || event.charCode;
            if ((event.ctrlKey || event.metaKey) && 13 === keyCode) {
                event.preventDefault();
                this.sendmessage();
                event.stopPropagation();
            }
        },

        enter:function (event) {
            var keyCode = event.which || event.keyCode || event.charCode;
            if (!(event.ctrlKey || event.metaKey) && 13 === keyCode) {
                event.preventDefault();
                this.sendmessage();
                event.stopPropagation();
                return false;
            }
            if ((event.ctrlKey || event.metaKey) && 13 === keyCode) {
                this.insertHtml('<br/>');
            }
        },

        setShortcut:function (shortkey) {
            if (!shortkey) {
                shortkey = 'ctrlAndEnterKey';
            }
            if ('enter' === shortkey) {
                try {
                    this.editor.unbind('keydown', $.proxy(this.ctrlAndEnter, this));
                } catch (e) {
                }
                this.editor.bind('keydown', $.proxy(this.enter, this));
                STORE.ready(function () {
                    STORE.setItem(this.SHORTCUTKEY, 'enter');
                });
            } else {
                try {
                    this.editor.unbind('keydown', $.proxy(this.enter, this));
                } catch (e) {
                }
                this.editor.bind('keydown', $.proxy(this.ctrlAndEnter, this));
                STORE.ready(function () {
                    STORE.setItem(this.SHORTCUTKEY, 'ctrlAndEnterKey');
                });
            }
        },

        initDom:function (shortkey) {
            var sendoptionmenu = $('#webatm-sendoptionmenu')[0];
            sendoptionmenu.style.width = "130px";

            var opt1 = document.createElement('li');
            var spn1 = document.createElement('span');
            opt1.id = 'sendOption_ctrlAndEnterKey';
            spn1.className = 'selectedIcon';
            var _text1 = document.createTextNode(R('SEND_BY_CTRL_ENTER'));
            sendoptionmenu.appendChild(opt1);
            opt1.appendChild(spn1);
            opt1.appendChild(_text1);
            opt1.style.width = "130px";

            var opt2 = document.createElement('li');
            var spn2 = document.createElement('span');
            opt2.id = 'sendOption_enterKey';
            spn2.className = 'selectedIcon';
            var _text2 = document.createTextNode(R('SEND_BY_ENTER'));
            sendoptionmenu.appendChild(opt2);
            opt2.appendChild(spn2);
            opt2.appendChild(_text2);
            opt2.style.width = "130px";

            if (!shortkey) {
                shortkey = 'ctrlAndEnterKey';
            }
            if ('enter' === shortkey) {
                opt2.className = 'sendOptionSelected';
            } else {
                opt1.className = 'sendOptionSelected';
            }
            var self = this;
            $([opt1, opt2]).bind('click', function (ev, el, arg) {
                $([opt1, opt2]).removeClass('sendOptionSelected');
                var t = this;
                $(t).addClass('sendOptionSelected');
                var optid = t.id;
                var stp = 'sendOption_'.length;

                var shortkey = optid.substring(stp, optid.length - 3);

                self.setShortcut(shortkey);

            });
            $('#webatm-sendoption').bind('click', function (ev) {
                ev.preventDefault();
                var pos = $('#webatm-send').offset();
                pos.top += 25;
                $('#webatm-sendoptionmenu').show();
                $('#webatm-sendoptionmenu').offset(pos);
                ev.stopPropagation();
            });
            $(document).bind('click', function () {
                $('#webatm-sendoptionmenu').hide();
            });
        }
    }
})
    (jQuery);
