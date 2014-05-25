/**
 * ������Ϣ�༭����֧��HTML��ʽ,��������ͼƬ��
 * ������storage
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
            //��ʼ����ɣ��Զ���ȡ����
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
         * ��ȡ������������ֵ
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
         * �����html��ǩ����ʽ
         * @param  {String} str   ��Ҫ��������ַ���
         * @return {String}        �������ַ���
         */
		 

        clearHTML:function (str) {
            var div = document.createElement("div");
            str = str.replace(/<p>/ig, '');
            //'\n'��textContent��innerText��ת�ɿո������ת��
            str = str.replace(/<\/p>/ig, '\\n');
            str = str.replace(/<br>/ig, '\\n');
            div.innerHTML = str;
            var text;
            if (div.textContent) {
                //����ո��滻��һ���ո�
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
         * ����ѡ���ı������Ϸ�ѡ���ı��������Ϸ�ѡ�еı�ǩ���ڵ�html��
         * ����Firefox��Chrome,Safari�Ѿ��ܺ�֧���Ϸţ��������IE������֧��
         * �¼�����˳������dragstart,drag,dragenter,dragover,drop,dragend
         */
        bindDragDropForIE:function () {
            if (!$.browser.msie) {
                return;
            }
            var self = this, drop = false;
            //IEĬ������£�div�������drop�¼�����Ҫ��ֹdragover��dragenterĬ���¼��Ż����drop�¼�
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
         * ����paste��drop�¼��������html��ǩ����ʽ
         */
        onPasteOrDrop:function (e) {
            var self = this;
            //�ӳ�50ms�ȼ����ú���������
            setTimeout(function () {
                var html = self.getSendWWText();
                html = self.beforePasteOrDrop ? self.beforePasteOrDrop(html) : html;
                var text = self.clearHTML(html);
                self.setSendWWText(text);
            }, 100);
        },

        /**
         * ��װ�ı���ϢЭ��ͷ
         * �磺\\C0\\S0xa.0xc8\\F����\\Ttesttext
         * \C0xffff80\S0x8.0xa0\FGulimChe\I\U\Tff
         */
        createTextHead:function () {
		    //ipad�ϲ�֧������
		    if(this.editor.is('textarea'))
				return "\\C0x000000\\S0xc.0xf0\\FArial\\T";
            var head = "";
            var color = this.editor.css('color');
            var hexcolor = color && color.colorHex();
            console.log("select hexcolor:" + hexcolor);
            if (hexcolor && hexcolor.length === 7) {
                head += "\\C0x";
                //Э�����治�ǰ�RGB,���ǰ�BGR
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
            family ? (head += "\\F" + family.rtrim()) : "\\F����";

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
                    //msg = "\\C0\\S0xa.0xc8\\F����\\T" + msg;
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
            //������Ϻ��Զ���ȡ����
            this.editor.focus();
        },


        /**
         * �������λ��
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
         * �ڱ���Ĺ�괦����html
         * @param {Object} html
         */
        insertHtml:function (html) {
            this.editor.focus();
            if ($.browser.webkit || $.browser.mozilla || $.browser.opera) {// FireFox,Safari,Opera֧��
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
                //firefox �������ĩβû��<br>,��Ҫ�Զ�������һ��<br>,����Ҫ����������һ��<br>֮ǰ
                var lastnode = this.editor.children().last()[0];
                if (!lastnode || lastnode.nodeName !== "BR") {
                    var br = document.createElement('br');
                    range.insertNode(br);
                }

                selection.removeAllRanges();
                selection.addRange(range);
            } else if ($.browser.msie) {// IE֧��
                var range = this.lastRange || document.selection.createRange();
                // garcia.wul FIX BUG: 45, IE6�£�ѡ�б���,��insert emotion,ҳ�����
                if (range.pasteHTML !== undefined) {
                    range.pasteHTML(html);
                    // �������λ�ڲ������ݵĺ���
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
