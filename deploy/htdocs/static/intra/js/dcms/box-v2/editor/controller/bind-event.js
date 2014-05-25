/**
 * @author shanshan.hongss
 * @userfor 
 * @date  2013.08.02
 * @rely �����ļ��������������ļ���д����
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */

;(function($, D, ED, undefined) {
    /**
     * @methed [eventBase] �¼��󶨻��������������е������¼��󶨶����ڴ�
     * @param eventName  ��ѡ���ƶ��¼����ƣ����ڶ�ͬһ�¼�ִ�ж������ʱ������null
     * @param selector  ��ѡ��ѡ����������delegate���¼�ʱ
     */
    var handlerList = {},
        eventBase = function(config){ //focus, eventType, done,  eventName, selector
        var eventName = config.eventName;
        
        if (eventName){
            if (!handlerList[eventName]){
                handlerList[eventName] = $.Callbacks('stopOnFalse');
                handlerList[eventName].add(config.done);
                //��һ��,��Ҫ���¼�
                ruteEvent(config);
            } else {
                handlerList[eventName].add(config.done);
            }
        } else {
            //��һ��,��Ҫ���¼�
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
