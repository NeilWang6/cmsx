/**
 * @author shanshan.hongss
 * @userfor 选中、取消选中控件
 * @date  2013.08.02
 * @rely 
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
 */

;(function($, D, ED, undefined) {
    var statusEl = $('#box_choose_level'),
    ELEMENT_CLASS_PREFIX = 'crazy-box-',
    TYPE_NAME_MAP = {
        TYPE_LAYOUT: 'layout',
        TYPE_PUBLIC: 'public',
        TYPE_NORMAL: 'normal',
        TYPE_PUBLICEDIT: 'publicEdit',
        TYPE_OPTION: 'option',
        TYPE_DEFINE: 'define',
        TYPE_EDITLABEL: 'editLabel'
    },
    STATUS_NAME_MAP = {
        STATUS_MODULE: 'module',
        STATUS_LABEL: 'label'
    },
    ARR_SHOW_LAYOUT_TYPE = [TYPE_NAME_MAP.TYPE_PUBLIC, TYPE_NAME_MAP.TYPE_NORMAL],
    isStopFire = {  //是否阻止callbacks执行，默认为false
        'layout': false,
        'public': false,
        'normal': false,
        'publicEdit': false,
        'option': false,
        'define': false,
        'editLabel': false
    },
    normalCover, editCover, editTextarea, lineCover,
    isFirst = true, timeId, 
    coverFirst = {},
    handlerList = {}, 
    /**
     * @methed [operatesMenu] 操作菜单事件绑定
     * @param config  配置项
     *        {
                iframeDoc: null, //iframe元素
                areaSelector: null,  //dropArea 选择器
                done:fn,  //函数,选择后的函数
                cancel: fn //取消选择后的函数
              }
     * @param status  状态，编辑布局(module)|编辑内容(label)
     * @param level  层级，label|cell|module|grid|layout
     * @param type  类型，标准组件(normal)|公用区块(public)|配置型组件(新规范组件，option)|修改普通标签(editLabel)
     */
    selectElem = function(config, type){
        if (!handlerList[type]){
            handlerList[type] = {};
            handlerList[type]['done'] = $.Callbacks('stopOnFalse');//stopOnFalse
            handlerList[type]['cancel'] = $.Callbacks('stopOnFalse');//stopOnFalse
            handlerList[type]['config'] = config;
        }
        if (config.done && $.type(config.done)==='function'){
            handlerList[type]['done'].add(config.done);
        }
        if (config.cancel && $.type(config.cancel)==='function'){
            handlerList[type]['cancel'].add(config.cancel);
        }
        
        if (isFirst){
            isFirst = false;
            
            normalCover = $(ED.config.SELECTOR_MODULE_COVER, config.doc);
            editCover = $(ED.config.SELECTOR_DATAEDIT_COVER, config.doc);
            editTextarea = $(ED.config.SELECTOR_EDIT_TEXTAREA, config.doc);
            lineCover = $(ED.config.SELECTOR_LINE_COVER, config.doc);
            
            var moduleClassName = ED.config.ELEMENT_CLASS_PREFIX+'module',
                layoutClassName = ED.config.ELEMENT_CLASS_PREFIX+'layout',
                bannerClassName = ED.config.ELEMENT_CLASS_PREFIX+'banner';
            //绑定内容区域的事件 config.areaSelector
            config.doc.delegate('.'+moduleClassName, 'mouseenter', config.doc, function(e){
                var moduleEl = $(this);
                
                handlerModule(moduleEl, 'done', statusEl, e, config.doc);
            });
            
            config.doc.delegate('.'+moduleClassName, 'mouseleave', config.doc,  function(e){
                var moduleEl = $(this);
                
                handlerModule(moduleEl, 'cancel', statusEl, e, config.doc);
            });
            
            var layoutCover = $(ED.config.SELECTOR_LAYOUT_COVER, config.doc);
            config.doc.delegate('.'+layoutClassName+', .'+bannerClassName, 'mouseenter', config.doc, function(e){
                var layoutEl = $(this);
                
                handlerLayout(layoutEl, 'done', statusEl, e);
            });
            config.doc.delegate('.'+layoutClassName+', .'+bannerClassName, 'mouseleave', config.doc, function(e){
                var layoutEl = $(this);
                
                handlerLayout(layoutEl, 'cancel', statusEl, e);
            });
            
            layoutCover.on('mouseenter', function(e){
                var coverEl = $(this),
                    layoutEl = coverEl.data(ED.config.TRANSPORT_DATA_ELEM);
                    
                handlerLayout(layoutEl, 'done', statusEl, e);
            });
            layoutCover.on('mouseleave', function(e){
                var coverEl = $(this),
                    layoutEl = coverEl.data(ED.config.TRANSPORT_DATA_ELEM);
                    
                handlerLayout(layoutEl, 'cancel', statusEl, e);
            });
            
            normalCover.add(editCover).on({
                'mouseleave': function(e){
                    var coverEl = $(this),
                        elem = coverEl.data(ED.config.TRANSPORT_DATA_ELEM),
                        curStatus = statusEl.find('.current').data('val'),
                        curType = getCurType(elem, curStatus);
                    //timeId = setTimeout(function(){
                    if (curType){
                        handlerModule(elem, 'cancel', statusEl, e, doc);
                    }
                    //}, 10);
                    
                },
                'mouseenter': function(e){
                    var coverEl = $(this),
                        elem = coverEl.data(ED.config.TRANSPORT_DATA_ELEM),
                        curStatus = statusEl.find('.current').data('val'),
                        curType = getCurType(elem, curStatus);
                    if (curType){
                        handlerModule(elem, 'done', statusEl, e, doc);
                    }    
                    
                }
            });
            
            
        }
        
    },
    removeSelectElem = function(config, type){
        handlerList[type]['done'].remove(config.done);
        handlerList[type]['cancel'].remove(config.cancel);
    },
 
    setStopSelectFire = function(type, isStopSelectFire){
        if ($.type(isStopSelectFire)==='boolean'){
            isStopFire[type] = isStopSelectFire;
        }
    },
    selectLayout = function(config){
        selectElem(config, TYPE_NAME_MAP.TYPE_LAYOUT);
    },
    //普通组件；页面设计
    selectNormalModule = function(config){
        selectElem(config, TYPE_NAME_MAP.TYPE_NORMAL);
    },
    //公用区块；页面设计
    selectPublicModule = function(config){
        selectElem(config, TYPE_NAME_MAP.TYPE_PUBLIC);
    },
    //新规范组件；内容编辑
    selectOptionModule = function(config){
        selectElem(config, TYPE_NAME_MAP.TYPE_OPTION);
    },
    //自定义组件；内容编辑
    selectDefineModule = function(config){
        selectElem(config, TYPE_NAME_MAP.TYPE_DEFINE);
    },
    selectPublicEditModule = function(config){
        selectElem(config, TYPE_NAME_MAP.TYPE_PUBLICEDIT);
    },
    //原规范组件；内容编辑
    selectEditLabel = function(config){
        selectElem(config, TYPE_NAME_MAP.TYPE_EDITLABEL);
    },
    
    /*
     * 删除某个菜单被选中（取消选中）时需要的执行的方法
    */
    removeSelectLayout = function(config){
        removeSelectElem(config, TYPE_NAME_MAP.TYPE_LAYOUT);
    },
    //普通组件；页面设计
    removeSelectNormalModule = function(config){
        removeSelectElem(config, TYPE_NAME_MAP.TYPE_NORMAL);
    },
    //公用区块；页面设计
    removeSelectPublicModule = function(config){
        removeSelectElem(config, TYPE_NAME_MAP.TYPE_PUBLIC);
    },
    //新规范组件；内容编辑
    removeSelectOptionModule = function(config){
        removeSelectElem(config, TYPE_NAME_MAP.TYPE_OPTION);
    },
    //自定义组件；内容编辑
    removeSelectDefineModule = function(config){
        removeSelectElem(config, TYPE_NAME_MAP.TYPE_DEFINE);
    },
    removeSelectPublicEditModule = function(config){
        removeSelectElem(config, TYPE_NAME_MAP.TYPE_PUBLICEDIT);
    },
    //原规范组件；内容编辑
    removeSelectEditLabel = function(config){
        removeSelectElem(config, TYPE_NAME_MAP.TYPE_EDITLABEL);
    },
    
    setStopOptionFire = function(isStopFire){
        setStopSelectFire(TYPE_NAME_MAP.TYPE_OPTION, isStopFire);
    };
    
    function handlerLayout(layoutEl, handlerType, statusEl, e, curStatus){
        var curStatus = curStatus || statusEl.find('.current').data('val');
                
        if (curStatus===STATUS_NAME_MAP.STATUS_MODULE && !isStopFire[TYPE_NAME_MAP.TYPE_LAYOUT]){
            handlerList[TYPE_NAME_MAP.TYPE_LAYOUT][handlerType].fire(layoutEl, e, handlerList[TYPE_NAME_MAP.TYPE_LAYOUT]['config'].coverEl);
        }
    }
    
    function handlerModule(moduleEl, handlerType, statusEl, e, doc){
    
        var curStatus = statusEl.find('.current').data('val'),
            curCoverEl = getCoverEl(doc, curStatus),
            curType = getCurType(moduleEl, curStatus);
    		
        //timeId = setTimeout(function(){
        if (!isStopFire[curType]){
            handlerList[curType][handlerType].fire(moduleEl, e, curCoverEl);
        }
        //});
        
        if (ARR_SHOW_LAYOUT_TYPE.indexOf(curType)>-1){
            var layoutEl = moduleEl.closest('.'+ED.config.ELEMENT_CLASS_PREFIX+'layout, .'+ED.config.ELEMENT_CLASS_PREFIX+'banner');
            handlerLayout(layoutEl, handlerType, statusEl, e, curStatus);
        }
    }
    
    function getCurType(moduleEl, status){
        if (!moduleEl || !moduleEl[0]){
            return ;
        }
        var elemInfo = moduleEl.data(ED.config.ELEMENT_DATA_INFO);
        if (status===STATUS_NAME_MAP.STATUS_MODULE){
            if (elemInfo && (elemInfo['type']===ED.config.PUBLIC_BLOCK_NAME
                         //add by pingchun.yupc 2013-08-08 防止线上有 source为public type为module的公共区块
                         ||elemInfo['source']===ED.config.PUBLIC_BLOCK_NAME)){
                return TYPE_NAME_MAP.TYPE_PUBLIC;
            }
            return TYPE_NAME_MAP.TYPE_NORMAL;
        }
        if (status===STATUS_NAME_MAP.STATUS_LABEL){
            var boxConfig = moduleEl.data(ED.config.ELEMENT_DATA_BOX_CONFIG),
                dsDynamic = moduleEl.data(ED.config.ATTR_DATA_DYNAMIC);
            if (elemInfo && (elemInfo['type']===ED.config.PUBLIC_BLOCK_NAME
                         ||elemInfo['source']===ED.config.PUBLIC_BLOCK_NAME)){
                return TYPE_NAME_MAP.TYPE_PUBLICEDIT;
            }
            
            if (boxConfig || dsDynamic){
                return TYPE_NAME_MAP.TYPE_OPTION;
            }
            if (moduleEl.find('.'+ED.config.CLASS_DEFINE_CELL)[0]){
                return TYPE_NAME_MAP.TYPE_DEFINE;
            }
            
            return TYPE_NAME_MAP.TYPE_EDITLABEL;
        }
    }
    
    function getCoverEl(doc, status){
        var coverEl;
        switch (status){
            case STATUS_NAME_MAP.STATUS_MODULE:
                coverEl = normalCover;
                break;
            case STATUS_NAME_MAP.STATUS_LABEL:
                coverEl = editCover;
                break;
        }
        return coverEl;
    }
    
    //定义操作方法
    ED.selectLayout = selectLayout;
    ED.selectNormalModule = selectNormalModule;
    ED.selectPublicModule = selectPublicModule;
    ED.selectOptionModule = selectOptionModule;
    ED.selectDefineModule = selectDefineModule;
    ED.selectPublicEditModule = selectPublicEditModule;
    ED.selectEditLabel = selectEditLabel;
    
    ED.removeSelectLayout = removeSelectLayout;
    ED.removeSelectNormalModule = removeSelectNormalModule;
    ED.removeSelectPublicModule = removeSelectPublicModule;
    ED.removeSelectOptionModule = removeSelectOptionModule;
    ED.removeSelectDefineModule = removeSelectDefineModule;
    ED.removeSelectPublicEditModule = removeSelectPublicEditModule;
    ED.removeSelectEditLabel = removeSelectEditLabel;
    
    ED.setStopOptionFire = setStopOptionFire;
    
})(dcms, FE.dcms, FE.dcms.box.editor);
