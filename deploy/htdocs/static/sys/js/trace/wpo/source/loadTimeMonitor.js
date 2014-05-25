var loadTimeMonitor = function(testId){
    var addEvent = function(el, type, handler){
        if (el.addEventListener){
            el.addEventListener(type, handler, false);
        }
        else{
            el.attachEvent('on' + type, function(){
                return handler.call(el);
            });
        }
    },
    init = function(){
        var theDomReadyTime = window._DOM_READY_TIME || +new Date();

        addEvent(window, 'load', function(){
                _ON_LOAD_TIME = +new Date();
                var bodyLoadTime = _BODY_END_TIME - _PAGE_START_TIME,
                domReadyTime = theDomReadyTime - _PAGE_START_TIME,
                pageLoadTime = _ON_LOAD_TIME - _PAGE_START_TIME;
                recorder(testId, bodyLoadTime, domReadyTime, pageLoadTime, 0);
        });

    }();
}