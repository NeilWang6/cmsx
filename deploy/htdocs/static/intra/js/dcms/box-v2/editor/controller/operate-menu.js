/**
 * @author shanshan.hongss
 * @userfor �����˵��¼��󶨣�����layoutMenu|moduleMenu
 * @date  2013.08.02
 * @rely bind-event.js
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */

;(function($, D, ED, undefined) {
    var defConfig = {
        doc: null,
        className:null,    //������ǩ��className
        text:null,  //������ǩ��text
        html:'',  //�����HTML������д˲�����������������ʧЧ
        selector:null, //dom�ڵ㣬���д˲�����ǰ������������ʧЧ
        bindType: 'bind',
        eventType: 'click',
        done:null  //�¼�������ִ�еķ����������Ƕ���(��ʽ��jQuery.bind�������һ��)�����Ƕ����ʱ��eventType����ʧЧ��
    },
    layoutMenuEl,  //layout�˵��ڵ�
    moduleMenuEl,  //module�˵��ڵ�
    editMenuEl,   //�༭���ݲ˵��ڵ�
    /**
     * @methed [operatesMenu] �����˵��¼���
     * @param type  ���ͣ�LayoutMenu|moduleMenu
     * @param menuEl  �˵��ڵ�
     * @param config  ��������defConfig
     * @param eventName  �¼����֣���ͬ�¼���(ֻҪͬһ���˵���ͬһ�¼������²Ż�������ͬ)��push��ͬһ���¼���ִ�з���
     */
    operatesMenu = function(type, menuEl, config, eventName){
        var focus, focusHtml, coverEl;
        
        if (!layoutMenuEl || !moduleMenuEl || !editMenuEl){
            layoutMenuEl = $(ED.config.SELECTOR_LAYOUT_COVER, config.doc);
            moduleMenuEl = $(ED.config.SELECTOR_MODULE_COVER, config.doc);
            editMenuEl = $(ED.config.SELECTOR_DATAEDIT_COVER, config.doc);
        }
        config = $.extend({}, defConfig, config);
        
        if (config.selector){
            switch (type){
                case 'LayoutMenu':
                    focus = $(config.selector, layoutMenuEl);
                    coverEl = layoutMenuEl;
                    break;
                case 'ModuleMenu':
                    focus = $(config.selector, moduleMenuEl);
                    coverEl = moduleMenuEl;
                    break;
                case 'EditMenu':
                    focus = $(config.selector, editMenuEl);
                    coverEl = editMenuEl;
                    break;
            }
        } else {
            if (config.html){
                focusHtml = config.html;
            } else {
                focusHtml = '<li class='+config.className+'>'+config.text+'</li>';
            }
            focus = $(focusHtml).appendTo(menuEl);
        }
        
        var data = {
            focus: focus,
            eventType: config.eventType,
            done: config.done,
            coverEl: coverEl,
            selector: config.selector,
            eventName: getEventName(type, eventName, config.eventType)
        };
        ED.eventBase(data);
    },
    layoutMenu = function(config, eventName){
        operatesMenu('LayoutMenu', layoutMenuEl, config, eventName);
    },
    moduleMenu = function(config, eventName){
        operatesMenu('ModuleMenu', moduleMenuEl, config, eventName);
    },
    editMenu = function(config, eventName){
        operatesMenu('EditMenu', editMenuEl, config, eventName);
    };
    
    function getEventName(type, eventName, eventType){
        if (eventName){
            return eventName + type + eventType;
        }
    }
    
    ED.layoutMenu = layoutMenu;
    ED.moduleMenu = moduleMenu;
    ED.editMenu = editMenu;
})(dcms, FE.dcms, FE.dcms.box.editor);
