/**
 * ����������ʽ����
 * ��editor���ʹ��
 * ���ܰ�����
 * �ı����壬�����С��������ɫ�����壬б�壬���»���
 * ���󶨿�ݼ�Ctrl+= ctrl+- Ctrl+B Ctrl+I Ctrl+U
 * ���Զ�������ʽ���ã��´λ��Զ�����
 * @author xuping.nie
 */
jQuery.namespace("FE.sys.webww.ui");
(function ($) {
    var font_toolbar = {
        init:function (editor) {
            this.editor = editor;
            this._fontfamilyOptions = ['Arial', 'Arial Black', 'Courier New', 'Times New Roman', 'Verdana', '����', '����', '΢���ź�', '����', '����_GB2312', '����_GB2312', '��Բ'];
            this._fontsizeOptions = [8, 10, 12, 14, 18, 24, 36];
            this._fontcolors = ["#000000", "#993300", "#333300", "#003300", "#003366", "#000080", "#333399", "#333333", "#800000", "#FF6600", "#808000", "#008000", "#008080", "#0000FF", "#666699", "#808080", "#FF0000", "#FF9900", "#99CC00", "#339966", "#33CCCC", "#3366FF", "#800080", "#999999", "#FF00FF", "#FFCC00", "#FFFF00", "#00FFFF", "#00FFFF", "#00CCFF", "#993366", "#C0C0C0", "#FF99CC", "#FFCC99", "#FFFF99", "#CCFFCC", "#CCFFFF", "#99CCFF", "#CC99FF"];
            this.FONT_STYLES = 'webww-fontstyles';
            this._fontFamily = $("#webatm_fontToolBar_fontFamily");
            this._fontSize = $("#webatm_fontToolBar_fontSize");
            this._fontBold = $("#webatm_fontToolBar_bold");
            this._fontItalic = $("#webatm_fontToolBar_italic");
            this._fontUnderline = $("#webatm_fontToolBar_underline");
            this._fontColor = $("#webatm_fontToolBar_color");
            this._fontColorPanel = $("#webatm_fontToolBar_colorPanel");
            this._isiniting = true;
            this.initFontDom();
            this._colorPanel = (new FE.sys.webww.ui.clickShow()).init({
                targetId:"#webatm_fontToolBar_color",
                contentId:"#webatm_fontToolBar_colorPanel",
                needMask:false,
                excursion:[0, "bottom"],
                unShow:function () {
                    $("#webatm_fontToolBar_color").addClass("selected");
                    // 2012-07-09 garcia.wul ����Send��ť�Ƶ������������ɫѡ��򱻵�ס��
                    $('#webatm_fontToolBar_colorPanel').css('z-index',
                        parseInt($("#webatm-container")[0].style.zIndex, 10) + 1);
                    // IE6��,��ɫѡ���������z-index���ú�.���ɻᱻSend��ס
                    if ($.util.ua.ie6) {
                        $("#webatm_fontToolBar_colorPanel").css("top", "-88px");
                        // ����,IE6�µ�heightҲ����������
                        $("#webatm_fontToolBar_colorPanel").css("height", "80px");
                    }
                },
                unHidden:function () {
                    $("#webatm_fontToolBar_color").removeClass("selected");
                }
            });
            this.bindFontToolBarEvent();
            this.store = FE.sys.webww.storageCore;
            this.loadStyles();

            var offset = $.util.ua.ie6 ?[-12, -40]:[-8, -40];
            this._fontToolbar = (new FE.sys.webww.ui.clickShow()).init({
                targetId:"#webatm-font-btn",
                contentId:"#webatm_fontToolBar",
                needMask:false,
                excursion:offset,
                unShow:function () {
                    $("#webatm-font-btn").addClass("selected");
                },
                unHidden:function () {
                    $("#webatm-font-btn").removeClass("selected");
                }
            });
            this._isiniting = false;
        },
        initFontDom:function () {
            var self = this;
            var initColorPanel = function () {
                var ul = document.createElement('ul');
                self._fontColorPanel[0].appendChild(ul);
                for (var i = 0; i < self._fontcolors.length; i++) {
                    var li = document.createElement('li');
                    var a = document.createElement('a');
                    a.href = '#';
                    var span = document.createElement('span');
                    $(span).css('background', self._fontcolors[i]);
                    a.appendChild(span);
                    li.appendChild(a);
                    ul.appendChild(li);
                }
            }
            var initFontSelect = function (selectElement, options) {
                for (var i = 0; i < options.length; i++) {
                    var option = document.createElement('option');
                    option.value = options[i];
                    var text = document.createTextNode(options[i]);
                    option.appendChild(text);
                    selectElement.appendChild(option);
                }
            }
            initFontSelect(this._fontFamily[0], this._fontfamilyOptions);
            initFontSelect(this._fontSize[0], this._fontsizeOptions);
            initColorPanel();
        },
        bindFontToolBarEvent:function () {
            var self = this,
                handler = {
                    onFontFamilyButtonChange:function (e) {
                        self.editor.css("font-family", self._fontFamily[0].value);
                        self.saveStyles();
                    },
                    onFontSizeButtonChange:function (e) {
                        self.editor.css("font-size", self._fontSize[0].value + "px");
                        self.editor.css("line-height", self._fontSize[0].value + "px");
                        self.saveStyles();
                    },
                    onBoldButtonClick:function (e) {
                        e && e.preventDefault();
                        if (self._fontBold.hasClass("selected")) {
                            self.editor.css("font-weight", 400);
                            //400 ��ͬ�� normal
                            self._fontBold.removeClass("selected");
                        } else {
                            self.editor.css("font-weight", 700);
                            // 700 ��ͬ�� bold
                            self._fontBold.addClass("selected");
                        }
                        self.saveStyles();
                    },
                    onItalicButtonClick:function (e) {
                        e && e.preventDefault();
                        if (self._fontItalic.hasClass("selected")) {
                            self.editor.css("font-style", "normal");
                            self._fontItalic.removeClass("selected");
                        } else {
                            self.editor.css("font-style", "italic");
                            self._fontItalic.addClass("selected");
                        }
                        self.saveStyles();
                    },
                    onUnderlineButtonClick:function (e) {
                        e && e.preventDefault();
                        if (self._fontUnderline.hasClass("selected")) {
                            self.editor.css("text-decoration", "none");
                            self._fontUnderline.removeClass("selected");
                        } else {
                            self.editor.css("text-decoration", "underline");
                            self._fontUnderline.addClass("selected");
                        }
                        self.saveStyles();
                    },
                    onColorPanelClick:function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var target = e.target,
                            select = null;
                        if (target.tagName.toLowerCase() === "span") select = target;
                        else if (target.tagName.toLowerCase() === "a") select = target.firstChild;
                        if (select) {
                            target = $(select).css("background-color");
                            self.editor.css("color", target);
                            self._fontColor.removeClass("selected")
                        }
                        self.saveStyles();
                    }
                };
            self.handler = handler;
            this._fontFamily.bind("change", handler.onFontFamilyButtonChange);
            this._fontSize.bind("change", handler.onFontSizeButtonChange);
            this._fontBold.bind("click", handler.onBoldButtonClick);
            this._fontItalic.bind("click", handler.onItalicButtonClick);
            this._fontUnderline.bind("click", handler.onUnderlineButtonClick);
            this._fontColorPanel.bind("click", handler.onColorPanelClick)
            this.setShortcut();
        },
        setShortcut:function () {
            var self = this;
            var handler = this.handler;
            var fontsizeEl = self._fontSize[0];
            var changeFontSize = function (incSize) {
                var curIndex = fontsizeEl.selectedIndex;
                if (incSize && curIndex + 1 < fontsizeEl.options.length) {
                    curIndex++;
                } else if (!incSize && curIndex > 0) {
                    curIndex--;
                }
                fontsizeEl.options[curIndex].selected = true;
                handler.onFontSizeButtonChange();
            };

            var shortcutHandler = function (e) {
                var keyCode = e.which || e.keyCode || e.charCode;
                if (e.ctrlKey || e.metaKey) {
                    //����Ŵ�����С
                    switch (keyCode) {
                        //'=' or mac '+'
                        case 61:
                        //С���� +
                        case 107:
                        // '+'
                        case 187:
                            e.preventDefault();
                            e.stopPropagation();
                            changeFontSize(true);
                            break;
                        //С����- or mac '-'
                        case 109:
                        //'-'
                        case '189':
                            e.preventDefault();
                            e.stopPropagation();
                            changeFontSize(false);
                            break
                    }
                    //����ı�֣���б�����»���
                    var chr = String.fromCharCode(keyCode);
                    console.log("shortcut keyCode:" + keyCode + ' chr:' + chr);
                    switch (chr) {
                        // ctrl+B
                        case 'b':
                        case 'B':
                            handler.onBoldButtonClick(e);
                            break;
                        // ctrl+I
                        case 'i':
                        case 'I':
                            handler.onItalicButtonClick(e);
                            break;
                        // ctrl+U
                        case 'u':
                        case 'U':
                            handler.onUnderlineButtonClick(e);
                            break;
                    }
                }
            };
            if ($.util.ua.ie) {
                this._fontSize[0].title = "�����С(ctrl_alt_+,ctrl_alt_-)";
            } else {
                this._fontSize[0].title = "�����С(ctrl+,ctrl-)";
            }
            this.editor.bind('keydown', $.proxy(shortcutHandler, this));
        },
        /**
         * ��������ʽ�����ڴ洢��
         */
        saveStyles:function () {
            if(this._isiniting){
                return;
            }
            var a = [];
            a[0] = this._fontFamily.val();
            a[1] = this._fontSize.val();

            if (this._fontBold.hasClass("selected")) {
                a[2] = "bold";
            }
            if (this._fontItalic.hasClass("selected")) {
                a[3] = "italic";
            }
            if (this._fontUnderline.hasClass("selected")) {
                a[4] = "underline";
            }
            var color = this.editor.css("color");
            a[5] = color && color.colorHex();

            console.log("saveStyles: " + a);
            this.store.setJson(this.FONT_STYLES, a);
        },
        /**
         *�Ӵ洢�м��ر����������ʽ
         */
        loadStyles:function () {
            var a = this.store.getJson(this.FONT_STYLES);
            if (a && a.length > 0) {
                //TODO:IE6�����Զ��ָ�����������С������Ҫselect��ֵ
                console.log("loadStyles: " + a[0]);
                this._fontFamily[0].value = a[0];
                this.handler.onFontFamilyButtonChange();
                this._fontSize[0].value = a[1].match(/\d+/)[0];
                this.handler.onFontSizeButtonChange();
                a[2] == "bold" && this.handler.onBoldButtonClick();
                a[3] == "italic" && this.handler.onItalicButtonClick();
                a[4] == "underline" && this.handler.onUnderlineButtonClick();
                a[5] && this.editor.css("color", a[5]);
            }
        }
    }
    FE.sys.webww.ui.font_toolbar = font_toolbar;
})(jQuery);