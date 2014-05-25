var domReady = function(){
    var debugmsg = [], load_events = [],load_timer,script,done,exec,
    ua = uaMonitor(),
    init = function () {
        done = true;
        clearInterval(load_timer);// kill the timer
        // execute each function in the stack in the order they were added
        while (exec = load_events.shift()) exec();
        if (script) script.onreadystatechange = '';
    },
    _addEvent = function(el, type, handler){
        if (el.addEventListener){
            el.addEventListener(type, handler, false);
        }
        else{
            el.attachEvent('on' + type, function(){
                return handler.call(el);
            });
        }
    };

    return function(func) {
        // if the init function was already ran, just run this function now and stop
        if (done) return func();
        if (!load_events[0]) {
            // for Mozilla/Opera9
            if (document.addEventListener) document.addEventListener("DOMContentLoaded", init, false);

            // for Internet Explorer
            if(ua.browser.ie){
                var proto = "javascript:void(0)";
                if (location.protocol == "https:") proto = "//0";
                document.write("<script id=__ie_onload defer src="+proto+"><\/scr"+"ipt>");
                script = document.getElementById("__ie_onload");
                script.onreadystatechange = function() {
                    debugmsg.push("script checking")
                    if (this.readyState == "complete"){
                        debugmsg.push("script load!");
                        init();
                    }
                };
                //2010-08-30 21:30 update,thanks rank!
                if(window == top) void function(){
                    if(done) return;
                    try{
                        debugmsg.push("iframe checking")
                        document.documentElement.doScroll();
                        debugmsg.push("iframe load!")
                    }catch(e){
                        setTimeout(arguments.callee, 32);
                        return;
                    }
                    init();
                }();
            }

            // for Safari
            if (ua.browser.safari) { // sniff
                load_timer = setInterval(function() {
                    if (/loaded|complete/.test(document.readyState)) init(); // call the onload handler
                }, 10);
            }
            // for other browsers set the window.onload, but also execute the old window.onload
            _addEvent(window,"load",init);
        }
        load_events.push(func);
    }
};
$E.onDOMReady = domReady();
