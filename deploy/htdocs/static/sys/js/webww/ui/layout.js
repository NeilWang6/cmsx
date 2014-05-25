/**
 * 聊天窗口UI布局
 * 2012-1219 add by levy.jiny, 在ipad上div不支持contenteditable，只能改用textarea
 */

jQuery.namespace("FE.sys.webww.ui");
(function ($) {
    var R = FE.sys.webww.ui.lib.Ri18n;
    FE.sys.webww.ui.layout = {
        simpleTip: {
            baseClass: "webww-tooltip",
            position: 'bottom',
            fixed:true,
            showTime: 1,
            hideTime:1,
            showEffect: "fade",
            hideEffect: "none"
        },

        render:function () {
            var webAtmWindow = document.createElement('div');
            webAtmWindow.id = 'webatm-window';
            document.body.appendChild(webAtmWindow);
            //固定窗口位置
            if ($.util.ua.ie6) {
                $('#webatm-window').css('position', 'absolute');
            } else {
                $('#webatm-window').css('position', 'fixed');
            }
			if(jQuery.util.flash.available == false){
				console.log("layout.js: use textarea to input");
				webAtmWindow.innerHTML = '<div id="webatm-container">\
        <div id="webatm-title">\
            <div style="margin:3px"><span id="webatm-title-info"></span>\
            </div>\
            <span id="webatm-minimize" class="minimize"></span>\
            <span id="webatm-maximize" class="maximize"></span>\
            <span id="webatm-closeWin" class="close"></span>\
        </div>\
        <div id="webatm-uiwrapper">\
            <div id="webatm-mainTabWrapper">\
                <div id="webatm-mainTab">\
                    <ul class="tabs"></ul>\
                    <div class="slider">\
                        <div class="prev">&lt;</div>\
                        <div class="next">&gt;</div>\
                    </div>\
                </div>\
            </div>\
            <div style="clear:both;"></div>\
            <div id="webatm-sidebar">\
                <ul id="webatm-infoTab">\
                    <li id="webatm-companyInfo" class="tab selected"></li>\
                    <li id="webatm-recentcontactsInfo" class="tab"></li>\
					<li id="webatm-offerInfo" class="tab"></li>\
                </ul>\
                <div id="webatm-info"></div>\
            </div>\
            <div id="webatm-mainPane">\
            <div id="webatm-top"><i></i><a target="_blank" href="http://wangwang.1688.com">保障交易沟通安全，请下载阿里旺旺！</a><div id="webatm-topclose"></div></div>\
                <div id="webatm-log">\
                </div>\
                <div id="webatm-notice"></div>\
                <div id="webatm-slider"></div>\
                <div id="webatm-inputwrapper">\
                  <div unselectable="on" id="webatm-editor-toolbar" >\
                    <span unselectable="on" id="webatm-font-btn" class="font-btn"></span>\
                     <div unselectable="on" class="editor-font-toolbar" id="webatm_fontToolBar">\
                        <ul unselectable="on" class="toolbar">\
                            <li>\
                                <select class="fontFamily" id="webatm_fontToolBar_fontFamily"></select>\
                            </li>\
                            <li>\
                                <select class="fontSize" id="webatm_fontToolBar_fontSize"></select>\
                            </li>\
                            <li>\
                                <a title="bold" class="icon" href="#" id="webatm_fontToolBar_bold"><span class="bold"></span></a>\
                                <a title="italic" class="icon" href="#" id="webatm_fontToolBar_italic"><span class="italic"></span></a>\
                                <a title="underline" class="icon" href="#" id="webatm_fontToolBar_underline"><span class="underline"></span></a>\
                                <a title="color" class="icon" href="#" id="webatm_fontToolBar_color"><span class="color"></span></a>\
                            </li>\
                        </ul>\
                        <div id="webatm_fontToolBar_colorPanel" class="colorPanel" style="visibility: hidden;"></div>\
                      </div>\
                    <span unselectable="on" id="webatm-emotions-btn"></span>\
                    <ul id="webatm-emotions-selector">\
                    </ul>\
<div id="webatm-sendwrapper">\
<div id="webatm-send" class="webatm-send"></div> \
<div id="webatm-sendoption" class="webatm-sendoption"></div>\
<ul id="webatm-sendoptionmenu"></ul> \
</div>\
                  </div>\
                    <div id="webatm-editor"><textarea id="webatm-input" contenteditable="true" style="width: 305px; height: 94px;"></textarea></div>\
                </div>\
            </div>\
        </div>\
        </div>\
    <div id="demo2"><div id="showshow" class="dialog"></div></div><img id="demoimg" style="height:0px;">';
		}
		else{
		console.log("layout.js: use div.contenteditable to input");
			            webAtmWindow.innerHTML = '<div id="webatm-container">\
        <div id="webatm-title">\
            <div style="margin:3px"><span id="webatm-title-info"></span>\
            </div>\
            <span id="webatm-minimize" class="minimize"></span>\
            <span id="webatm-maximize" class="maximize"></span>\
            <span id="webatm-closeWin" class="close"></span>\
        </div>\
        <div id="webatm-uiwrapper">\
            <div id="webatm-mainTabWrapper">\
                <div id="webatm-mainTab">\
                    <ul class="tabs"></ul>\
                    <div class="slider">\
                        <div class="prev">&lt;</div>\
                        <div class="next">&gt;</div>\
                    </div>\
                </div>\
            </div>\
            <div style="clear:both;"></div>\
            <div id="webatm-sidebar">\
                <ul id="webatm-infoTab">\
                    <li id="webatm-companyInfo" class="tab selected"></li>\
                    <li id="webatm-recentcontactsInfo" class="tab"></li>\
					<li id="webatm-offerInfo" class="tab"></li>\
                </ul>\
                <div id="webatm-info"></div>\
            </div>\
            <div id="webatm-mainPane">\
            <div id="webatm-top"><i></i><a target="_blank" href="http://wangwang.1688.com">保障交易沟通安全，请下载阿里旺旺！</a><div id="webatm-topclose"></div></div>\
                <div id="webatm-log">\
                </div>\
                <div id="webatm-notice"></div>\
                <div id="webatm-slider"></div>\
                <div id="webatm-inputwrapper">\
                  <div unselectable="on" id="webatm-editor-toolbar" >\
                    <span unselectable="on" id="webatm-font-btn" class="font-btn"></span>\
                     <div unselectable="on" class="editor-font-toolbar" id="webatm_fontToolBar">\
                        <ul unselectable="on" class="toolbar">\
                            <li>\
                                <select class="fontFamily" id="webatm_fontToolBar_fontFamily"></select>\
                            </li>\
                            <li>\
                                <select class="fontSize" id="webatm_fontToolBar_fontSize"></select>\
                            </li>\
                            <li>\
                                <a title="bold" class="icon" href="#" id="webatm_fontToolBar_bold"><span class="bold"></span></a>\
                                <a title="italic" class="icon" href="#" id="webatm_fontToolBar_italic"><span class="italic"></span></a>\
                                <a title="underline" class="icon" href="#" id="webatm_fontToolBar_underline"><span class="underline"></span></a>\
                                <a title="color" class="icon" href="#" id="webatm_fontToolBar_color"><span class="color"></span></a>\
                            </li>\
                        </ul>\
                        <div id="webatm_fontToolBar_colorPanel" class="colorPanel" style="visibility: hidden;"></div>\
                      </div>\
                    <span unselectable="on" id="webatm-emotions-btn"></span>\
                    <ul id="webatm-emotions-selector">\
                    </ul>\
<div id="webatm-sendwrapper">\
<div id="webatm-send" class="webatm-send"></div> \
<div id="webatm-sendoption" class="webatm-sendoption"></div>\
<ul id="webatm-sendoptionmenu"></ul> \
</div>\
                  </div>\
                    <div id="webatm-editor"><div id="webatm-input" contenteditable="true"></div></div>\
                </div>\
            </div>\
        </div>\
        </div>\
		<div id="demo2"><div id="showshow" class="dialog"></div></div><img id="demoimg" style="height:0px;">';
		}


		    // fill layout text
            $("#webatm-companyInfo").text(R('CONTACT_INFO'));
            $('#webatm-recentcontactsInfo').text(R('RECENT_CONTACTS'));
			$('#webatm-offerInfo').text(R('OFFER_INFO'));
            $('#webatm-send').text(R('SEND'));

            $('#webatm-font-btn').removeAttr("title");
            $('#webatm-emotions-btn').removeAttr("title");

            // TODO 最大化和关闭的title需要替换成simpletip的方式
            $('#webatm-minimize').attr('title', R('MINIMIZE'));
            $('#webatm-maximize').attr('title', R('MAXIMIZE'));
            $('#webatm-closeWin').attr('title', R('CLOSE'));

            // for ie6, show font tips on above panel
            if ($.util.ua.ie6) {
                $('#webatm_fontToolBar_bold').removeAttr("title").simpletip(
                    $.extend({}, this.simpleTip,{
                        content: R('BOLD'),
                        position:"top"
                    }));
                $('#webatm_fontToolBar_italic').removeAttr("title").simpletip(
                    $.extend({}, this.simpleTip, {
                        content: R('ITALIC'),
                        position:"top"
                    }));
                $('#webatm_fontToolBar_underline').removeAttr("title").simpletip(
                    $.extend({}, this.simpleTip, {
                        content: R('UNDERLINE'),
                        position:"top"
                    }));
                $('#webatm_fontToolBar_color').removeAttr("title").simpletip(
                    $.extend({}, this.simpleTip, {
                        content: R('COLOR'),
                        position:"top"
                    }));
            }
            else {
                $('#webatm_fontToolBar_bold').removeAttr("title");
                $('#webatm_fontToolBar_italic').removeAttr("title");
                $('#webatm_fontToolBar_underline').removeAttr("title");
                $('#webatm_fontToolBar_color').removeAttr("title");
            }
			
			// 显示tips。在ipad等上不显示
			if(jQuery.util.flash.available == true){
				$('#webatm-font-btn').simpletip($.extend({}, this.simpleTip, {
					content: R('FONTS')
				}));
				$('#webatm-emotions-btn').simpletip($.extend({}, this.simpleTip, {
					content:R('EMOTIONS')
				}));
				$('#webatm_fontToolBar_bold').simpletip($.extend({}, this.simpleTip,{
						content: R('BOLD')
					}));
				$('#webatm_fontToolBar_italic').simpletip($.extend({}, this.simpleTip, {
						content: R('ITALIC')
				}));
				$('#webatm_fontToolBar_underline').simpletip($.extend({}, this.simpleTip, {
						content: R('UNDERLINE')
				}));
				$('#webatm_fontToolBar_color').simpletip($.extend({}, this.simpleTip, {
						content: R('COLOR')
				}));
			}       
        }
    };

})(jQuery);