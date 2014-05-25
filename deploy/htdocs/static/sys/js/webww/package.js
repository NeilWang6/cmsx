



jQuery.add('webww-websocket', {"js":["/static/fdevlib/js/fdev-v4/widget/ui/flash-websocket-min.js","/static/fdevlib/js/fdev-v4/widget/web/websocket-min.js"],"requires":["ui-flash"],"ver":"1.0"});

jQuery.add('webww-logist', {"css":["http://style.c.aliimg.com/sys/css/logist/logist-min.css"],"js":["http://style.c.aliimg.com/sys/js/logist/logist-min.js"],"ver":"1.0"});

jQuery.add('webww-styles', {"css":["http://style.c.aliimg.com/sys/css/webww/webim-merge.css"],"ver":"1.0"});

function loadWebwwJs() {jQuery.use("ui-flash,ui-dialog,web-alitalk,util-date,util-json,ui-mouse,ui-draggable,ui-core,fx-core,webww-websocket,webww-logist,webww-styles",function() {
    jQuery.DEBUG = true;
    var timestamp = new Date().getTime();
    head.js(
        "http://style.c.aliimg.com/sys/js/webww/server.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/util.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/lib/jquery.ui.resizable.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/lib/jquery.effects.transfer.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/lib/jquery.simpletip-1.3.1.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/lib/jquery.ie6fixed.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/lib/r.i18n.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/i18n/i18n.zh_cn.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/ui/lib/twitter.hogan.2.0.0.common.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/storage-core.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/msg-pubsub/localconnect.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/msg-pubsub/tab-sync.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/msg-pubsub/pubsub.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/msg-pubsub/combo-socket.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/wwstore.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/user.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/protocol.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/core.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/history.js?timestamp=" + timestamp,
        "http://style.c.aliimg.com/sys/js/webww/biz.js?timestamp=" + timestamp,
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
        "http://style.c.aliimg.com/sys/js/webww/main.js?timestamp=" + timestamp,
        function(){
        jQuery(document).trigger("webww_load_complete")}
    );
});
}

jQuery.getScript("http://style.c.aliimg.com/sys/js/webww/head.js", loadWebwwJs);
