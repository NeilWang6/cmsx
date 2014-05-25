/**
 * @author shanshan.hongss
 * @userfor 操作菜单事件绑定，包括layoutMenu|moduleMenu
 * @date  2013.08.02
 * @rely bind-event.js
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
 */

;(function($, D, ED, undefined) {
    var defConfig = {
        doc: null,
        className:null,    //新增标签的className
        text:null,  //新增标签的text
        html:'',  //插入的HTML，如果有此参数，上面两个参数失效
        selector:null, //dom节点，如有此参数，前面三个参数都失效
        bindType: 'bind',
        eventType: 'click',
        done:null  //事件触发后执行的方法，可以是对象(格式与jQuery.bind对象参数一致)，当是对象的时候eventType参数失效；
    },
    layoutMenuEl,  //layout菜单节点
    moduleMenuEl,  //module菜单节点
    editMenuEl,   //编辑内容菜单节点
    /**
     * @methed [operatesMenu] 操作菜单事件绑定
     * @param type  类型，LayoutMenu|moduleMenu
     * @param menuEl  菜单节点
     * @param config  配置项，详见defConfig
     * @param eventName  事件名字，相同事件名(只要同一个菜单、同一事件类型下才会真正相同)会push到同一个事件下执行方法
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
