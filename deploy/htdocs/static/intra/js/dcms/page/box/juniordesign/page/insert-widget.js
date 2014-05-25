/**
 * @author shanshan.hongss
 * @userfor 插件接入
 * @date 2012-02-26
 */
;(function($, D, ED, undefined) {
    $(function(){
        responseData();
    });
    
    var pageId = $('input#pageId').val(),
        DATA_FOR_WIDGET_NAME = 'forwidget',
        PAGE_WIDGET_PREFIX_CLASS = 'box-widget-',
        objDelWidgetFn = {}, docEl,
        objOldVal, objNewVal;
    
    function responseData(){
        var data = {};
        data['action'] = 'BoxPluginAction';
        data['event_submit_do_get_page_plugin'] = true;
        data['pageId'] = pageId;
        $.when($.getScript(ED.config.STYLE_URL_HOST+'app/tools/js/dcms/box-v2/editor/model/conf-widget.js'), $.ajax({
            url:D.domain+ED.config.AJAX_JSONP_URL,
            data:data,
            type:'POST',
            dataType:'json'
        })).done(function(args1, args2){
            var arrVal = resolveChoosedWidget(args2[0].data, ED.widget),
                ulEl = getChooseWidgetEl(ED.widget, arrVal);
            showWidgetDialog(ulEl, ED.widget);
            grounpAddEditMod(ED.widget, arrVal);
        });
        
        ED.loadHandler.add(function(doc, dropInpage){
            docEl = doc;
        });
    }
    
    function getChooseWidgetEl(objWidget, choosedWidgets){
        var applyDevice = $('#daftForm input[name=applyDevice]').val(),
            objTeamHtml = {};
        for ( var p in objWidget ){
            var arrAppDev = objWidget[p].applyDevice && objWidget[p].applyDevice.split(',');
            if (arrAppDev.indexOf(applyDevice)>-1){
                var parentId = objWidget[p].parentId;
                //分组生成HTML代码
                if (!parentId || parentId==='0'){ //顶级节点
                    var h5El = $('<h6>'+objWidget[p].name+'</h6>');
                    //h5El.data(DATA_ATTR_WIDGET, objWidget[p]);
                    if (!objTeamHtml[p]){
                        objTeamHtml[p] = {};
                    }
                    objTeamHtml[p]['title'] = h5El;
                } else {  //非顶级节点
                    var spanEl = $('<span data-val="'+objWidget[p].id+'" class="item-choice">'+objWidget[p].name+'</span>');
                    //spanEl.data(DATA_ATTR_WIDGET, objWidget[p]);
                
                    if (!objTeamHtml[parentId]){
                        objTeamHtml[parentId] = {};
                    }
                    if (!objTeamHtml[parentId]['mult']){
                        objTeamHtml[parentId]['mult'] = [];
                    }
                    objTeamHtml[parentId]['mult'].push(spanEl);
                }
                
            }
        }
        
        if ( !$.isEmptyObject(objTeamHtml) ){
            $('#main_design_page .design-op').append('<a id="dcms_box_widget_join" class="btn-basic btn-gray" href="javascript:void(0);">插件接入</a>');
            //整体HTML节点
            var ulEl = $('<ul class="list-widgets" />');
            for ( var p in objTeamHtml ){
                var liEl = $('<li />'),
                    curVal = (choosedWidgets && choosedWidgets[p]) ? choosedWidgets[p].join() : '',
                    pEl = $('<p class="tui-mult-choice"><input class="value-choice" type="hidden" data-parentid="'+p+'" value="'+curVal+'" /></p>');
                
                for (var i=0, l=objTeamHtml[p]['mult'].length; i<l; i++){
                    pEl.append(objTeamHtml[p]['mult'][i]);
                }
                
                liEl.append(objTeamHtml[p]['title']);
                liEl.append(pEl);
                ulEl.append(liEl);
            }
            return ulEl;
        }
        return;
    }
    
    function resolveChoosedWidget(arrChoosed, objWidget){
        if (!arrChoosed){ return; }
        
        var objChoosed = {};
        for (var i=0, l=arrChoosed.length; i<l; i++){
            var parentId = objWidget[String(arrChoosed[i])].parentId;
            if (!objChoosed[parentId]){
                objChoosed[parentId] = [];
            }
            objChoosed[parentId].push(arrChoosed[i]);
        }
        
        return objChoosed;
    }
    
    function showWidgetDialog(ulEl, objWidget){
        if (!ulEl){ return; }
        var inputs = ulEl.find('input.value-choice');
        //单击"接入插件"出现对话框
        $('#dcms_box_widget_join').click(function(){
            
            D.Msg['confirm']({
                'title' : '添加插件',
                'body' : ulEl,
                'noclose':true,
                'onlymsg':false,
                'success':function(e){
                    e.data.dialog.dialog('close');
                    
                    setObjValToInputs(inputs, objNewVal);
                    
                    var ids = [],
                        arrOldVal = getArrFromeObj(objOldVal);
                    inputs.each(function(){
                        var inputEl = $(this),
                            val = inputEl.val(); 
                        if (val){
                            ids.push(val);
                        }
                    });
                    
                    var strIds = ids.join(',');
                    if (strIds){
                        saveWidgetInPage(strIds);
                        D.BoxTools.setEdited();
                    } else {
                        delWidgetInPage(arrOldVal.join(','));
                        D.BoxTools.setEdited();
                    }
                    
                    objVal = resolveModify(arrOldVal, ids);
                    
                    doModifyWidget(objVal, objWidget);
                }
            }, {
                'open':function(e){
                    $(e.target).addClass('dialog-join-wedget');
                    
                    //初始化选择项组件
                    var liEls = ulEl.find('li');
                    
                    liEls.each(function(){
                        var el = $(this),
                            multChoice = new FE.tools.MultChoice({
                            area:el,
                            type:'radio',
                            valueInput: el.find('.value-choice')
                        });
                    });
                    objOldVal = getObjValFromInputs(inputs);
                },
                'close':function(e){
                    objNewVal = getObjValFromInputs(inputs);
                    setObjValToInputs(inputs, objOldVal);
                    $(e.target).removeClass('dialog-join-wedget');
                }
            });
        });
    }
    
    function getObjValFromInputs(inputs){
        var objVal = {};
        inputs.each(function(){
            var inputEl = $(this),
                parentId = inputEl.data('parentid'),
                val = inputEl.val();
            if (!objVal[parentId]){
                objVal[parentId] = [];
            }
            if (val){
                objVal[parentId].push(val);
            }
        });
        return objVal;
    }
    
    function setObjValToInputs(inputs, objVal){
        inputs.each(function(){
            var inputEl = $(this),
                parentId = inputEl.data('parentid');
            if (objVal[parentId]){
                inputEl.val(objVal[parentId].join(','));
            }
        });
    }
    
    function getArrFromeObj(objVal){
        var tempArrVal = [];
        for (var p in objVal){
            tempArrVal = tempArrVal.concat(objVal[p]);
        }
        return tempArrVal;
    }
    
    function resolveModify(arrOldVal, arrNewVal){
        var objVal = {};
        
        objVal['del'] = [];
        objVal['same'] = [];
        
        for (var j=0, len=arrOldVal.length; j<len; j++){
            var isDel = true;
            for (var i=0, l=arrNewVal.length; i<l; i++){
                if (arrOldVal[j]===arrNewVal[i]){
                    objVal['same'].push(arrNewVal[i]);
                    arrNewVal.splice(i, 1);
                    isDel = false;
                    continue;
                }
            }
            if (isDel){
                objVal['del'].push(arrOldVal[j]);
                isDel = true;
            }
        }
        objVal['add'] = arrNewVal;
        return objVal;
    }
    
    function doModifyWidget(objVal, objWidget){
        var delVal = objVal.del,
            addVal = objVal.add;
        
        //处理被删除的部分
        for (var i=0, l=delVal.length; i<l; i++){
            if (!delVal[i]){ continue; }
            var delWidget = objWidget[delVal[i]];
            //删除effectMod
            delEffectMod(delWidget, objWidget);
            
            //去除editMod
            var code = objWidget[delWidget.parentId].code;
            if (objDelWidgetFn[code] && objDelWidgetFn[code]['fnName']){
                eval(objDelWidgetFn[code]['fnName']).call(window, objDelWidgetFn[code]['config']);
            }
        }
        
        //处理新增的部分
        for (var i=0, l=addVal.length; i<l; i++){
            if (!addVal[i]){ continue; }
            var choosedWidget = objWidget[addVal[i]];
            //增加effectMod
            addEffectMod(choosedWidget);
            
            //增加editMod
            addEditMod(choosedWidget);
            //添加页面级的标识添了插件的data-config
            //boxDocEl.addClass(PAGE_WIDGET_PREFIX_CLASS+objWidget[choosedWidget.parentId].code);
            setPageDataConfig(choosedWidget, objWidget);
        }
        
    }
    
    function setPageDataConfig(choosedWidget, objWidget){
        var boxDocEl = docEl.find('.cell-page-main');
            config = boxDocEl.data('config'),
            code = objWidget[choosedWidget.parentId].code;
        if (!config && $.type(config)!=='object'){
            config = {};
        }
        config[code] = {};
        config[code]['name'] = choosedWidget.name;
        boxDocEl.attr('data-config', JSON.stringify(config));
    }
    
    function grounpAddEditMod(objWidget, arrVal){
        if ( !arrVal ){ return; }
        if ($.type(arrVal)==='object'){
            var tempArrVal = [];
            for (var p in arrVal){
                tempArrVal = tempArrVal.concat(arrVal[p]);
            }
            arrVal = tempArrVal;
        }
        for (var i=0,l=arrVal.length; i<l; i++){
            addEditMod(objWidget[arrVal[i]]);
        }
    }
    
    function delEffectMod(delWidget, val){
        if (!delWidget){ return; }
        D.box.editor.loadHandler.add(function(doc, dropInpage){
            doc.find('[data-'+DATA_FOR_WIDGET_NAME+'=widgetid-'+delWidget.parentId+']').remove();
        });
        
    }
    
    function addEffectMod(choosedWidget){
        if (!choosedWidget){ return; }
        //执行效果模块处理
        D.box.editor.loadHandler.add(function(doc, dropInpage){
            doc.find('[data-'+DATA_FOR_WIDGET_NAME+'=widgetid-'+choosedWidget.parentId+']').remove();
            var div = $('<div />');
            D.InsertHtml.init({
                html:choosedWidget.effectMod,
                container:div,
                insertType:'html',
                isExecJs:false
            });
            div.children().attr('data-'+DATA_FOR_WIDGET_NAME, 'widgetid-'+choosedWidget.parentId).addClass('crazy-box-widgets');
            
            //执行效果模块的代码
            D.InsertHtml.init({
                html:div.html(),
                doc:doc,
                container:doc.find('.cell-page-main'),
                insertType:'append',
                isExecJs:false
            });
        });
    }
    
    function addEditMod(choosedWidget){
        if (!choosedWidget){ return; }
        //执行编辑模块的代码
        D.InsertHtml.init({
            html:choosedWidget.editMod,
            container:$('body'),
            insertType:'append'
        });
    }
    
    /*function groupInsertWidget(objWidget, arrVal, isModify){
        if ($.type(arrVal)==='object' && isModify===false){
            var tempArrVal = [];
            for (var p in arrVal){
                tempArrVal = tempArrVal.concat(arrVal[p]);
            }
            arrVal = tempArrVal;
        }
        for (var i=0,l=arrVal.length; i<l; i++){
            insertWidget(objWidget, arrVal[i], isNew);
        }
    }*/
    
    //接入插件
    /*function insertWidget(objWidget, val, isNew){
        var choosedWidget = objWidget[val];
        
        
       
        
    }*/
    
    function saveWidgetInPage(ids){
        var data = {};
        data['action'] = 'BoxPluginAction';
        data['event_submit_do_save_page_plugin'] = true;
        data['pageId'] = pageId;
        data['id'] = ids;
        
        $.ajax({
            url:D.domain+ED.config.AJAX_JSONP_URL,
            data:data,
            type:'POST'
        }).done(function(){
            //if (o.status==='success'){
                console.log('插件保存成功！');
            //}
        });
    }
    
    function delWidgetInPage(ids){
        var data = {};
        data['action'] = 'BoxPluginAction';
        data['event_submit_do_delete_page_plugin'] = true;
        data['pageId'] = pageId;
        data['id'] = ids;
        $.ajax({
            url:D.domain+ED.config.AJAX_JSONP_URL,
            data:data,
            type:'POST'
        }).done(function(o){
            //if (o.status==='success'){
                console.log('插件删除成功！');
            //}
        });
    }
    
    
    /**
     * @methed [widgetInterface] 插件接入接口
     * @param fnName  调用的函数名
     * @param config  函数所要用到的参数
     * @param widgetCode  插件代号，必须和插件中的code保持一致
     */
    ED.widgetInterface = function(fnName, config, widgetCode){
        eval(fnName).call(window, config);
        
        //记录用于删除插件的信息
        objDelWidgetFn[widgetCode] = {};
        objDelWidgetFn[widgetCode]['fnName'] = getRemoveFnName(fnName);
        objDelWidgetFn[widgetCode]['config'] = {
            'done':config.done,
            'cancel':config.cancel
        };
    }
    
    function getRemoveFnName(fnName){
        var arrName = fnName.split('.'),
            l = arrName.length-1;
        arrName[l] = arrName[l].replace(/^\w/, function(a){
            return 'remove'+a.toLocaleUpperCase();
        });
        return arrName.join('.');
    }
})(dcms, FE.dcms, FE.dcms.box.editor);