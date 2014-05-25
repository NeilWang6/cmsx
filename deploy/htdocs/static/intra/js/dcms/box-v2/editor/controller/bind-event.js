/**
 * @author shanshan.hongss
 * @userfor 
 * @date  2013.08.02
 * @rely 依赖文件，如果依赖多个文件请写多行
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
 */

;(function($, D, ED, undefined) {
    /**
     * @methed [eventBase] 事件绑定基础方法；盒子中的所有事件绑定都基于此
     * @param eventName  必选，制定事件名称，用于对同一事件执行多个方法时，允许传null
     * @param selector  可选，选择器，用于delegate绑定事件时
     */
    var handlerList = {},
        eventBase = function(config){ //focus, eventType, done,  eventName, selector
        var eventName = config.eventName;
        
        if (eventName){
            if (!handlerList[eventName]){
                handlerList[eventName] = $.Callbacks('stopOnFalse');
                handlerList[eventName].add(config.done);
                //第一次,需要绑定事件
                ruteEvent(config);
            } else {
                handlerList[eventName].add(config.done);
            }
        } else {
            //第一次,需要绑定事件
            ruteEvent(config);
        }
    };
    
    function ruteEvent(config){
        if (config.selector){
            delegateEvent(config);
        } else {
            bindEvent(config);
        }
    }
    
    function bindEvent(config){
        config.focus.on(config.eventType, function(e){
            handleEvent(config, e, $(this));
        });
    }
    function delegateEvent(config){
        config.coverEl.delegate(config.selector, config.eventType, function(e){
            handleEvent(config, e, $(this));
        });
    }
    
    function handleEvent(config, e, focus){
        var eventName = config.eventName,
            elem = config.coverEl.data(ED.config.TRANSPORT_DATA_ELEM);
        
        if (eventName){
            handlerList[eventName].fire(elem, focus, e);
        } else {
            config.done.call(this, elem, focus, e);
        }
    }
    
    ED.eventBase = eventBase;
})(dcms, FE.dcms, FE.dcms.box.editor);
