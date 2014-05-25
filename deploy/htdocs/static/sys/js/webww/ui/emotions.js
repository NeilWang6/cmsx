/**
 * @author xuping.nie 将emotion处理模块化并进行优化 editor by levy.jiny
 */
jQuery.namespace("FE.sys.webww");
(function ($) {
    var R = FE.sys.webww.ui.lib.Ri18n;

    var emotions = {
        editor:null,
        emotionUrlTemplate: Hogan.compile("http://img.alibaba.com/simg/sprites/env/webatm/emotions/{{{id}}}.gif"),
        simpleTip: {
            baseClass: "webww-tooltip",
            position: 'bottom',
            fixed:true,
            showTime: 1,
            hideTime:1,
            showEffect: "fade",
            hideEffect: "none"
        },

        // 插入到input panel时的那个图片模板
        inseredEmotionTemplate: Hogan.compile('<img src="http://img.alibaba.com/simg/sprites/env/webatm/emotions/{{{id}}}.gif" data-code="{{{dataCode}}}">'),

        emotionsReg:new RegExp("(/\\:\\^_\\^|/\\:\\^\\$\\^|/\\:Q|/\\:815|/\\:809|/\\:\\^O\\^|/\\:081|/\\:087|/\\:086|/\\:H|/\\:012|/\\:806|/\\:b|/\\:\\^x\\^|/\\:814|/\\:\\^W\\^|/\\:080|/\\:066|/\\:807|/\\:805|/\\:071|/\\:072|/\\:065|/\\:804|/\\:813|/\\:818|/\\:015|/\\:084|/\\:801|/\\:811|/\\:\\?|/\\:077|/\\:083|/\\:817|/\\:\\!|/\\:068|/\\:079|/\\:028|/\\:026|/\\:007|/\\:816|/\\:&apos;&quot;&quot;|/\\:802|/\\:027|/\\:\\(Zz\\...\\)|/\\:\\*\\&amp\\;\\*|/\\:810|/\\:\\&gt;_\\&lt;|/\\:018|/\\:&gt;O&lt;|/\\:020|/\\:044|/\\:819|/\\:085|/\\:812|/\\:&quot;|/\\:&gt;M&lt;|/\\:&gt;@&lt;|/\\:076|/\\:069|/\\:O=O|/\\:O|/\\:067|/\\:043|/\\:P|/\\:808|/\\:&gt;W&lt;|/\\:073|/\\:008|/\\:803|/\\:074|/\\:036|/\\:039|/\\:045|/\\:046|/\\:048|/\\:047|/\\:girl|/\\:man|/\\:052|/\\:\\(OK\\)|/\\:8\\*8|/\\:\\)-\\(|/\\:lip|/\\:-F|/\\:-W|/\\:Y|/\\:qp|/\\:\\$|/\\:%|/\\:\\(&amp;\\)|/\\:@|/\\:~B|/\\:U\\*U|/\\:clock|/\\:R|/\\:C|/\\:plane|/\\:075)", "g"),

        /**
         * init emotions
         * @param editor
         */
        init:function (editor) {
            var self = this;
            self.editor = editor;

            self.initEmotionsSelections();

            self.initClickShow();

            // binding pick any emotions' event
            $(".webatm-emotion-item span").bind("click", self, self.onSelectOneEmotion);

            if (!$.browser.msie || $.browser.version != "6.0") {
                if(jQuery.util.flash.available == true)
					self.zoomEmotions();
            }

            return true;
        },

        /**
         * define the action when click the emotion selection button
         */
        initClickShow: function() {
            this.emotionsToolbar = (new FE.sys.webww.ui.clickShow()).init({
                targetId:"#webatm-emotions-btn",
                contentId:"#webatm-emotions-selector",
                needMask:false,
                excursion: [-3, -295],
                unShow:function () {
                    $("#webatm-emotions-btn").addClass("selected");
                    FE.sys.webww.emotions.fixEmotionsSelectionCoverInfoTabIE6ForUnshow();
                },
                unHidden:function () {
                    $("#webatm-emotions-btn").removeClass("selected");
                    FE.sys.webww.emotions.fixEmotionsSelectionCoverInfoTabIE6ForUnHidden();
                }
            });
        },

        /**
         * generate emotion items
         */
        initEmotionsSelections: function() {
            var emotionsSelection = $("#webatm-emotions-selector");
            emotionsSelection.empty();

            var startTime = new Date().getTime();
            var backgroundTemplate = Hogan.compile("url('http://img.china.alibaba.com/cms/upload/2012/132/783/387231_412880957.gif') no-repeat -0px -{{{height}}}px");
            var i = 0;
            $.each(this.emotions, function(key, value) {
                var listItem = $('<li></li>');
                listItem.addClass("webatm-emotion-item");
                listItem.css("padding", "4px 4px 4px 4px");
                var oneEmotion = $("<span></span>");
                oneEmotion.css("background", backgroundTemplate.render({
                    height: i * 24}));
                if ($.util.ua.ie6) {
                    oneEmotion.attr('title', R(value.t));
                }
                else if(jQuery.util.flash.available == true){
                    oneEmotion.simpletip($.extend({},
                    FE.sys.webww.emotions.simpleTip,
                    {content: R(value.t)}));
                }
                oneEmotion.attr("code", key);
                oneEmotion.attr("data-id", i);
                ++ i;
                listItem.append(oneEmotion);
                emotionsSelection.append(listItem);
            });
            console.log('渲染时间: ' + (new Date().getTime() - startTime));
        },

        /**
         * When select any emotion, do these actions
         * @param e
         */
        onSelectOneEmotion: function(e) {
            e.preventDefault();
            var self = e.data;
            self.insertEmotion($(this).attr("code"));
        },

        /**
         * Insert emotion to input panel
         * @param code
         */
        // 2012-05-29 garcia.wul 以为Firefox <= 11对contenteditable支持有问题,因此插入表情前需要将输入框设置为contenteditable=true
		// 2012-12-19 levy.jiny 当为textarea时表情显示为符号
        insertEmotion: function(code) {
            var self = this;
			if($("#webatm-input").is('div')){
				$("#webatm-input").attr("contenteditable", "true");

				var emotion = self.inseredEmotionTemplate.render({
					id: self.emotions[code].id,
					dataCode:self.unescape(code, true)
				});
				if ($.browser.msie && (parseInt($.browser.version) <= 8)) {
					emotion += " ";
				}
				
				self.editor.insertHtml(emotion);
			}else{
			    var value = $("#webatm-input").val();
			    $("#webatm-input").val(value + code)
			}
        },

        zoomEmotions: function() {
            $(".webatm-emotion-item span").hover(function() {
                var dataId = $(this).attr("data-id");
                var zoom = $("<div></div>");
                zoom.addClass("webatm-emotion-zoom");

                if (dataId % 11 < 5) {
                    zoom.css("right", "0");
                }
                else {
                    zoom.css("left", "0");
                }
                if (dataId % 9 > 4) {
                    zoom.css("top", "70%");
                }
                else {
                    zoom.css("top", "0");
                }
                zoom.css("display", "block");
                var emotions = FE.sys.webww.emotions;
                var image = $("<img />")
                var url = emotions.emotionUrlTemplate.render({
                    id : emotions.emotions[$(this).attr("code")].id})
                image.attr("src", url);
                zoom.append(image);
                $(this).append(zoom);
            }, function() {
                $(this).find(".webatm-emotion-zoom").remove();
            });
        },

        _isIE67: function() {
            if ($.browser.msie) {
                var ieVersion = parseInt($.browser.version, 10);
                return ieVersion === 6 || ieVersion === 7;
            }
            return false;
        },

        /**
         * 解决IE6下,表情选择框不能挡住webatm-info标签下的BUG
         */
        fixEmotionsSelectionCoverInfoTabIE6ForUnshow: function() {
            if (!FE.sys.webww.emotions._isIE67()) {
                return;
            }
            // 当表情选择框肯定不会需要挡住联系人信息时
            if ($("#webatm-container").outerWidth() > 570) {
                return;
            }

            $("#webatm-infoTab").css("display", "none");
        },

        fixEmotionsSelectionCoverInfoTabIE6ForUnHidden: function() {
            if (!FE.sys.webww.emotions._isIE67()) {
                return;
            }

            $("#webatm-infoTab").css("display", "block");
        },

        /**
         * 替换html中标签图标成code
         */
        replaceImg2Code : function(html) {
            var html = html.replace(/<img[^>]*code="([^"]*)"[^>]*>/ig, "\\T$1\\T");
            return html;
        },

        /**
         * 表情符号替换
         */
        emotionReplaceCode : function(msgHtml) {
            msgHtml = this.emotionReplaceSpecificCode(msgHtml);
            msgHtml = msgHtml.replace(this.emotionsReg , "<img class='webatm-emotion' data-code='$1' />");
            return msgHtml;
        },

        /**
         * 特殊的表情替换
         */
        emotionReplaceSpecificCode : function(msgHtml) {
            if(msgHtml == null) {
                return "";
            }
            msgHtml = msgHtml.replace(/\/:\'\"\"/g, '/:&apos;&quot;&quot;');
            msgHtml = msgHtml.replace(/\/:\*\&\*/g, '/:*&amp;*');
            msgHtml = msgHtml.replace(/\/:\>_\</g, '/:&gt;_&lt;');
            msgHtml = msgHtml.replace(/\/:\>O\</g, '/:&gt;O&lt;');
            msgHtml = msgHtml.replace(/\/:\>M\</g, '/:&gt;M&lt;');
            msgHtml = msgHtml.replace(/\/:\>@\</g, '/:&gt;@&lt;');
            msgHtml = msgHtml.replace(/\/:\>W\</g, '/:&gt;W&lt;');
            msgHtml = msgHtml.replace(/\/:\"/g, '/:&quot;');
            msgHtml = msgHtml.replace(/\/:\(\&\)/g, '/:(&amp;)');
            return msgHtml;
        },

        /**
         * 替换标记的表情图片
         * @param target 目标容器
         */
        emotionImgDisplay: function(target) {
            var self = this;
            $(".webatm-emotion").attr("src", function() {
                var code = $(this).attr("data-code");
                code = self.emotionReplaceSpecificCode(code);
                return self.emotionUrlTemplate.render({
                    id: self.emotions[code].id});
            }).removeClass("webatm-emotion");
        },

        unescape : function(s, quote) {
            s = s.replace(/\&amp;/g, "&");
            s = s.replace(/\&lt;/g, "<");
            s = s.replace(/\&gt;/g, ">");
            s = s.replace(/\&nbsp;/g, " ");
            if(quote === undefined) {
                var quote = false;
            }
            if(quote) {
                s = s.replace(/\&quot;/g, '"');
                s = s.replace(/\&apos;/g, "'");
            }
            return s;
        },

        escape : function(s, quote) {
            s = s.replace(/\s/g, "&nbsp;");
            s = s.replace(/\&/g, "&amp;");
            s = s.replace(/</g, "&lt;");
            s = s.replace(/>/g, "&gt;");
            if(quote === undefined) {
                var quote = false;
            }
            if(quote) {
                s = s.replace(/\'/g, "&apos;");
                s = s.replace(/\"/g, "&quot;");
            }
            return s;
        },

        // 表情集合
        emotions:{
            "/:^_^":{
                t:"Smile",
                id:"0"
            },
            "/:^$^":{
                t:"Shy",
                id:"1"
            },
            "/:Q":{
                t:"Tongue",
                id:"2"
            },
            "/:815":{
                t:"Snicker",
                id:"3"
            },
            "/:809":{
                t:"Admire",
                id:"4"
            },
            "/:^O^":{
                t:"Laugh",
                id:"5"
            },
            "/:081":{
                t:"Dance",
                id:"6"
            },
            "/:087":{
                t:"Blow Kisses",
                id:"7"
            },
            "/:086":{
                t:"Comfort",
                id:"8"
            },
            "/:H":{
                t:"Hug",
                id:"9"
            },
            "/:012":{
                t:"Come on",
                id:"10"
            },
            "/:806":{
                t:"Victory",
                id:"11"
            },
            "/:b":{
                t:"Excellent",
                id:"12"
            },
            "/:^x^":{
                t:"Kiss",
                id:"13"
            },
            "/:814":{
                t:"Infatuated",
                id:"14"
            },
            "/:^W^":{
                t:"Grin",
                id:"15"
            },
            "/:080":{
                t:"Search",
                id:"16"
            },
            "/:066":{
                t:"Call",
                id:"17"
            },
            "/:807":{
                t:"Account",
                id:"18"
            },
            "/:805":{
                t:"Moneygrubber",
                id:"19"
            },
            "/:071":{
                t:"Good Idea",
                id:"20"
            },
            "/:072":{
                t:"Grimace",
                id:"21"
            },
            "/:065":{
                t:"Angel",
                id:"22"
            },
            "/:804":{
                t:"Bye",
                id:"23"
            },
            "/:813":{
                t:"Slobber",
                id:"24"
            },
            "/:818":{
                t:"Enjoy",
                id:"25"
            },
            "/:015":{
                t:"Erotomania",
                id:"26"
            },
            "/:084":{
                t:"Bemused",
                id:"27"
            },
            "/:801":{
                t:"Think",
                id:"28"
            },
            "/:811":{
                t:"Confused",
                id:"29"
            },
            "/:?":{
                t:"Question",
                id:"30"
            },
            "/:077":{
                t:"No Money",
                id:"31"
            },
            "/:083":{
                t:"Bored",
                id:"32"
            },
            "/:817":{
                t:"Doubt",
                id:"33"
            },
            "/:!":{
                t:"Sh",
                id:"34"
            },
            "/:068":{
                t:"Childish",
                id:"35"
            },
            "/:079":{
                t:"Shake",
                id:"36"
            },
            "/:028":{
                t:"Got a Cold",
                id:"37"
            },
            "/:026":{
                t:"Embarrassed",
                id:"38"
            },
            "/:007":{
                t:"Giggle",
                id:"39"
            },
            "/:816":{
                t:"Not Really",
                id:"40"
            },
            "/:&apos;&quot;&quot;":{
                t:"No Choice",
                id:"41"
            },
            "/:802":{
                t:"Perspire",
                id:"42"
            },
            "/:027":{
                t:"Miserable",
                id:"43"
            },
            "/:(Zz...)":{
                t:"Sleepy",
                id:"44"
            },
            "/:*&amp;*":{
                t:"Dizzy",
                id:"45"
            },
            "/:810":{
                t:"Sad",
                id:"46"
            },
            "/:&gt;_&lt;":{
                t:"Grievance",
                id:"47"
            },
            "/:018":{
                t:"Weep",
                id:"48"
            },
            "/:&gt;O&lt;":{
                t:"Cry",
                id:"49"
            },
            "/:020":{
                t:"Howl",
                id:"50"
            },
            "/:044":{
                t:"Speechless",
                id:"51"
            },
            "/:819":{
                t:"Sorry",
                id:"52"
            },
            "/:085":{
                t:"Bye",
                id:"53"
            },
            "/:812":{
                t:"Frown",
                id:"54"
            },
            "/:&quot;":{
                t:"Tired",
                id:"55"
            },
            "/:&gt;M&lt;":{
                t:"Ill",
                id:"56"
            },
            "/:&gt;@&lt;":{
                t:"Puke",
                id:"57"
            },
            "/:076":{
                t:"Bad Luck",
                id:"58"
            },
            "/:069":{
                t:"Surprise",
                id:"59"
            },
            "/:O":{
                t:"Shock",
                id:"60"
            },
            "/:067":{
                t:"Shut up",
                id:"61"
            },
            "/:043":{
                t:"Slap",
                id:"62"
            },
            "/:P":{
                t:"Disdain",
                id:"63"
            },
            "/:808":{
                t:"Fury",
                id:"64"
            },
            "/:&gt;W&lt;":{
                t:"Angry",
                id:"65"
            },
            "/:073":{
                t:"God of Wealth",
                id:"66"
            },
            "/:008":{
                t:"Be Helpful",
                id:"67"
            },
            "/:803":{
                t:"Good Luck",
                id:"68"
            },
            "/:074":{
                t:"Waiter",
                id:"69"
            },
            "/:O=O":{
                t:"Boss",
                id:"70"
            },
            "/:036":{
                t:"Evil",
                id:"71"
            },
            "/:039":{
                t:"Fight Alone",
                id:"72"
            },
            "/:045":{
                t:"CS",
                id:"73"
            },
            "/:046":{
                t:"Invisible Man",
                id:"74"
            },
            "/:048":{
                t:"Bomb",
                id:"75"
            },
            "/:047":{
                t:"Scream",
                id:"76"
            },
            "/:girl":{
                t:"Beauty",
                id:"77"
            },
            "/:man":{
                t:"Handsome Guy",
                id:"78"
            },
            "/:052":{
                t:"Fortune Cat",
                id:"79"
            },
            "/:(OK)":{
                t:"OK",
                id:"80"
            },
            "/:8*8":{
                t:"Applause",
                id:"81"
            },
            "/:)-(":{
                t:"Shake Hands",
                id:"82"
            },
            "/:lip":{
                t:"Lip",
                id:"83"
            },
            "/:-F":{
                t:"Rose",
                id:"84"
            },
            "/:-W":{
                t:"Languished Rose",
                id:"85"
            },
            "/:Y":{
                t:"Love",
                id:"86"
            },
            "/:qp":{
                t:"Heartbreak",
                id:"87"
            },
            "/:$":{
                t:"Money",
                id:"88"
            },
            "/:%":{
                t:"Shopping",
                id:"89"
            },
            "/:(&amp;)":{
                t:"Gift",
                id:"90"
            },
            "/:@":{
                t:"Mail",
                id:"91"
            },
            "/:~B":{
                t:"Phone",
                id:"92"
            },
            "/:U*U":{
                t:"Cheers",
                id:"93"
            },
            "/:clock":{
                t:"Clock",
                id:"94"
            },
            "/:R":{
                t:"Wait",
                id:"95"
            },
            "/:C":{
                t:"Late",
                id:"96"
            },
            "/:plane":{
                t:"Plane",
                id:"97"
            },
            "/:075":{
                t:"Alipay",
                id:"98"
            }
        }
    };
    FE.sys.webww.emotions = emotions;
})(jQuery);
