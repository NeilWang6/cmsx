



jQuery.add('webww-websocket', {"js":["http://style.c.aliimg.com/js/lib/fdev-v4/widget/ui/flash-websocket-min.js","http://style.c.aliimg.com/js/lib/fdev-v4/widget/web/websocket-min.js"],"requires":["ui-flash"],"ver":"1.0"});

jQuery.add('webww-logist', {"js":["http://style.c.aliimg.com/js/sys/logist/logist-min.js"],"ver":"1.0"});

jQuery.add('webww-styles', {"css":["http://style.c.aliimg.com/css/app/im/webim/v2/webim-merge.css"],"ver":"1.0"});

function loadWebwwJs() {jQuery.use("ui-flash,ui-dialog,web-alitalk,util-date,util-json,ui-mouse,ui-draggable,ui-core,fx-core,webww-websocket,webww-logist,webww-styles",function() {
    jQuery.DEBUG = true;
    var timestamp = new Date().getTime();
    head.js(
        "http://style.c.aliimg.com/sys/js/webww/util.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/lib/jquery.ui.resizable.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/lib/jquery.effects.transfer.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/lib/jquery.simpletip-1.3.1.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/lib/r.i18n.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/i18n/i18n.zh_cn.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/lib/twitter.hogan.2.0.0.common.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/biz.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/storage-core.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/notify.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/layout.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/click_show.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/editor.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/emotions.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/font.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/tab.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/panel.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/chatwin.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/contacts.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/test/chatwin-test.js?timestamp=" + timestamp,
        function(){
        jQuery(document).trigger("webww_load_complete")}
    );
});
}

jQuery.getScript("http://style.c.aliimg.com/sys/js/webww/head.js", loadWebwwJs);
