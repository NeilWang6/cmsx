/**
 * @author raywu
 * @userfor 前端源码组件内容编辑界面
 * @date  2013.07.05
 */

;(function($, D, undefined) {
	D.defConfig={
		dialog:".fdwidget-dialog"
	};
    
    var PREFIX_CLASS_NAME = 'js-param-',  //跟配置参数KEY对应的class名前缀
        DIALOG_CLASS_NAME = 'fdwidget-dialog';   //对话框的class名
    //工具对象 add by hongss
    var tools = {
        returnError:function(name, message){
            console.error(name+'：'+message);
        },
        minSize: function(obj, parentObj, key){
            var minSize = Number(variable.handler('minSize', obj, key, parentObj));
            if($.type(minSize) !== 'number' || isNaN(minSize)){
				minSize=0;
			}
            
            return minSize;
        },
        maxSize: function(obj, parentObj, key){
            var maxSize = Number(obj.maxSize);
            if($.type(maxSize) !== 'number' || isNaN(maxSize)){
				maxSize=999999;
			}
            
            return maxSize;
        },
        defSize: function(obj, parentObj, key, minSize){
            var defSize = Number(variable.handler('defSize', obj, key, parentObj));
            if (!minSize){
                minSize = 0;
            }
            if(defSize<=minSize || isNaN(defSize)){
				defSize=minSize;
			}
            
            return defSize;
        },
        setCloneUpload: function(cloneNode){
            var upEls = cloneNode.find('span.local-upload');
            this.emptyFlash(upEls);
            this.localUpload(upEls);
            
            this.initColorBox(cloneNode.find('.ui-color'));
            this.initDatepicker(cloneNode.find('.ui-date'));
        },
        emptyFlash: function(els){
            els.each(function(){
                var el = $(this);
                el.html('');
                el.removeAttr('id');
                el.removeClass('ui-flash');
            });
        },
        localUpload: function(els){
            var errorMessage = {
                    'img_too_big' : '文件太大',
                    'invalid_img_type' : '文件类型不合法',
                    'img_optimization_reuired' : '大小超标',
                    'unauthorized' : '安全校验不通过',
                    'unknown' : '未知错误'
                },
                // 表单提交地址
                url = $('#dcms_upload_url').val(),
                // 按钮皮肤
                buttonSkin = 'http://img.china.alibaba.com/cms/upload/2012/081/364/463180_133354742.png';
            
            $.use('ui-flash-uploader', function() {
                els.flash({
                    module : 'uploader',
                    width : 70,
                    height : 25,
                    flash : true,
                    inputName : 'Filedata',
                    flashvars : {
                        buttonSkin : buttonSkin
                    }
                }).unbind('fileSelect.flash').bind('fileSelect.flash', function(e, o) {
                    $(this).flash('uploadAll', url, {
                        //_csrf_token: 'dcms-box'
                    }, 'image', 'fname');
                }).unbind('uploadCompleteData.flash').bind('uploadCompleteData.flash', function(e, o) {
                    var data = $.unparam(o.data);
                    if(data.success === '1') {//上传成功
                        $(this).siblings('.link-upload').find('input').val(data.url);
                        //alert('上传成功');

                    } else {//上传失败
                        alert(errorMessage[data.msg]);
                    }
                });
            });
        },
        initColorBox: function(els){
            //init ui-colorpicker 选色器
            $.use('ui-colorbox', function(){
                var colorBox = els.colorbox({
                    update:true,
                    transparent: true,
                    select:function(e, ui){
                        colorBox.colorbox('hide');
                    }
                });
            });
        },
        initDatepicker: function(els){
            //init ui-datepicker 日历控件
            $.use('ui-datepicker-time, util-date', function(){
                els.datepicker({
                    showTime:true,
                    closable:true,
                    triggerType:'focus',
                    zIndex:3000,
                    select: function(e, ui){
                        $(this).val(ui.date.format('yyyy-MM-dd hh:mm:ss'));
                    },
                    timeSelect: function(e, ui){
                        $(this).val(ui.date.format('yyyy-MM-dd hh:mm:ss'));
                    }
                });
            });
        },
        end:0
    };
    
    //变量解析对象 add by hongss
    var variable = {
        /**
		 * @methed resolveVariable 解析变量
		 * @param key 对象中的key
		 * @param obj 当前对象
		 * @param parentObj 父级对象
		 */
        resolve: function(key, obj, parentObj){
            var value = obj[key];
            //判断是否是变量，不是就退出
            if (!value || String(value).indexOf('$')!==0){
                return {'result':value};
            }
            
            var arrValue = value.replace(/^\$/,'').split('.'), 
                result = forInObj(arrValue, obj);
            if (!result){
                result = forInObj(arrValue, parentObj);
                if (!result){
                    tools.returnError(obj.name, 'key为'+key+'指定的变量('+value+')在'+JSON.stringify(parentObj)+'中不存在');
                }
            }
            return {'result':result, 'variable':arrValue};
            
            function forInObj(arr, obj){
                var tempValue = obj;
                for (var i=0, l=arr.length; i<l; i++){
                    if (!tempValue[arr[i]]){
                        return;
                    } else {
                       tempValue =  tempValue[arr[i]];
                    }
                }
                return tempValue;
            }
        },
        handler: function(subkey, obj, key, parentObj){
            var resolveResult = this.resolve(subkey, obj, parentObj), 
                value = resolveResult.result, 
                self = this;
            
            if (resolveResult.variable){
                var arrVar = resolveResult.variable,
                    className = '',
                    markName = arrVar.join('-');
                for (var i=0, l=arrVar.length; i<l; i++){
                    className += ' .'+PREFIX_CLASS_NAME+arrVar[i];
                }
                
                if ( !self.isBindEvent[markName] ){
                    this.bindChangeVal.add(function(){
                        self.isBindEvent[markName] = true;
                        var targetEl = $('.'+DIALOG_CLASS_NAME+className),
                            tabEl = targetEl.closest('.'+PREFIX_CLASS_NAME+'array'),
                            listEl = targetEl.closest('.o-list');
                        //如果是tab
                        if (tabEl[0]){
                            tabEl.on('change', className, [subkey,key,parentObj,arrVar], function(e){
                                self[subkey]($(this), key,parentObj,arrVar);
                            });
                        } else if (listEl[0]){
                            listEl.on('change', className, [subkey,key,parentObj,arrVar], function(e){
                                self[subkey]($(this), key,parentObj,arrVar);
                            });
                        } else {
                            targetEl.on('change', [subkey,key,parentObj,arrVar], function(e){
                                self[subkey]($(this), key,parentObj,arrVar);
                            });
                        }
                        
                    });
                }
            }
            return value;
        },
        bindChangeVal: $.Callbacks('stopOnFalse'),
        isBindEvent:{},
        minSize: function(targetEl, key, obj, arrVar){
            var minSize = targetEl.val(),
                containerEl = targetEl.closest('.tab-content-item, .o-content').find('.'+PREFIX_CLASS_NAME+key),
                type = obj[key].type;
            
            switch(type) {
                case 'list':
                    var ulEl = containerEl.find('.'+PREFIX_CLASS_NAME+'value'),
                        listEls = ulEl.children();
                    ulEl.data('minsize', minSize);
                    for (var i=listEls.length; i<minSize; i++){
                        var cloneNode = listEls.eq(0).clone();
                        ulEl.append(cloneNode);
                        
                        tools.setCloneUpload(cloneNode);
                    }
                    break;
                case 'tab':   //目前container没有minSize这个属性
                case 'container':
                     var tabConEl = containerEl.find('> .'+PREFIX_CLASS_NAME+'array'),
                        tabTriEl = containerEl.find('> .tui-tabs-header > .param-tab-trigger'),
                        tabContentEls = tabConEl.find('> .tab-content-item'),
                        tabTriggerEls = tabTriEl.find('> .tab-trigger-item'),
                        length = tabTriggerEls.length;
                    for (var i=length; i<defSize; i++){
                        var newTriEl = tabTriggerEls.eq(0).clone().removeClass('current');
                        tabTriEl.append(newTriEl);
                        newTriEl.find('small').text(i+1);
                        var cloneNode = tabContentEls.eq(0).clone().removeClass('current');
                        tabConEl.append(cloneNode);
                        
                        tools.setCloneUpload(cloneNode);
                    }
                    break;
            }
        },
        defSize: function(targetEl, key, obj, arrVar){
            var defSize = targetEl.val(),
                containerEl = targetEl.closest('.tab-content-item, .o-content').find('.'+PREFIX_CLASS_NAME+key),
                type = obj[key].type;
            
            switch(type) {
                case 'list':
                    var ulEl = containerEl.find('.'+PREFIX_CLASS_NAME+'value'),
                        listEls = ulEl.children(),
                        length = listEls.length;
                    for (var i=length; i<defSize; i++){
                        var cloneNode = listEls.eq(0).clone();
                        ulEl.append(cloneNode);
                        
                        tools.setCloneUpload(cloneNode);
                    }
                    for (var i=length; i>=defSize; i--){
                        listEls.eq(i).remove();
                    }
                    break;
                case 'tab':   //目前container没有defSize这个属性
                case 'container':
                    var tabConEl = containerEl.find('> .'+PREFIX_CLASS_NAME+'array'),
                        tabTriEl = containerEl.find('> .tui-tabs-header > .param-tab-trigger'),
                        tabContentEls = tabConEl.find('> .tab-content-item'),
                        tabTriggerEls = tabTriEl.find('> .tab-trigger-item'),
                        length = tabTriggerEls.length;
                    for (var i=length; i<defSize; i++){
                        var newTriEl = tabTriggerEls.eq(0).clone().removeClass('current');
                        tabTriEl.append(newTriEl);
                        newTriEl.find('small').text(i+1);
                        var cloneNode = tabContentEls.eq(0).clone().removeClass('current');
                        tabConEl.append(cloneNode);
                        
                        tools.setCloneUpload(cloneNode);
                    }
                    for (var i=length; i>=defSize; i--){
                        tabTriggerEls.eq(i).remove();
                        tabContentEls.eq(i).remove();
                    }
                    break;
            }
        },
        end:0
    };
    
    var createHtml = {
        color: function(key, value, type){
            return '<input type="text" class="ui-color '+PREFIX_CLASS_NAME+key+'" data-key="'+type+'" value="'+$.util.escapeHTML(value,true)+'" />';
        }
    }
	/*
	 * 根据配置参数组装出操作界面
	 */
	D.paramHtmlBulid={
		/*
		 * 配置参数组装HTML的初始化工厂方法
		 */
		initFactory:function(config){
			var t=this,
				group,
				item,
				contentStr='',
				styleStr='',
				contentIndex=0,
				styleIndex=0;
			if($.type(config)==='string'){
				config = eval('(' + ((typeof config === 'string')?config:'[]') + ')');
			}
            if (!config){ return '无配置项'; }
			$.each(config,function(){
                var temp;
				for(group in this){
					switch(group){
						case 'content':
							contentIndex++;
							if(contentIndex===1){
								contentStr+='<div class="fdwidget-edit-content fdwidget-form">';
							}
							contentStr+='<div class="o-group">';
							if(typeof temp !== 'undefined'){
								contentStr+=
									'<div class="o-header">\
										<h3>'+temp+'</h3>\
										<a data-operation="fold" href="#" class="trigger">︾</a>\
									</div>';
							}
							contentStr+='<div class="o-content">';
							for(item in this[group]){
								contentStr+=D.paramContentBulid.paramTypeFactory(this[group][item], this[group], item);
							}
							contentStr+='</div>';
							contentStr+='</div>';
							break;
						case 'style':
							styleIndex++;
							if(styleIndex===1){
								styleStr+=
									'<div class="fdwidget-edit-style fdwidget-form">\
										<div class="o-group">\
											<div class="o-header">\
												<h3>样式编辑</h3>\
												<a data-operation="fold" href="#" class="trigger">︾</a>\
											</div>\
											<div class="o-content">';
							}
							for(item in this[group]){
								styleStr+=D.paramStyleBulid.init(this[group][item]);
							}
							break;
						case 'name':
							temp=this[group];
							break;

					}
				}
			});
			if(contentIndex!==0){
				contentStr+='</div>';
			}
			if(styleIndex!==0){
				styleStr+='</div>';
				styleStr+='</div>';
				styleStr+='</div>';
			}
			return contentStr+styleStr;
		},
		end:0
	}
	D.paramStyleBulid={
		init:function(obj){
			var t=this,
				htmlStr='';
			htmlStr+=t.paramsWrap(obj,t.paramUnit(obj.value));
			return htmlStr;
		},
		paramsWrap:function(objStyle,paramHtml){
			var htmlStr='', briefHtml='';
			if(typeof objStyle.brief!=='undefined'&&objStyle.brief!==''){
				briefHtml+=
					'<div class="o-brief">\
						<span class="label">备注：</span>\
						<span class="value">'+objStyle.brief+'</span>\
					</div>';
			}
            htmlStr+=
				'<div class="o-item">\
					<div class="o-label">'+objStyle.name+'：</div>\
					<div class="o-value">\
						'+paramHtml+'\
					</div>\
                    '+briefHtml+'\
				</div>';
			return htmlStr;
		},
		paramUnit:function(objValue){
			var t=this,
				htmlStr='',
				v;
			if($.isPlainObject(objValue)){
				for(v in objValue){
					htmlStr+=t.paramWrap(t.paramFactory(v,objValue[v]));
				}
			}else{
				htmlStr+=t.paramWrap(t.valueTypeFactory('',objValue));
			}
			return htmlStr;
		},
		paramWrap:function(paramHtml){
			var htmlStr='';
			htmlStr+=
				'<div class="param">\
					'+paramHtml+'\
				</div>';
			return htmlStr;
		},
		paramFactory:function(key,value,name,type){
			var t=this,
				htmlStr='',
				behaviorMap={
					'text':'文本',
                    'color':'背景颜色'
				};
			if(typeof name === 'undefined'){
				name=behaviorMap[key];
			}
			if(typeof name !== 'undefined'||typeof behaviorMap[key]  !== 'undefined'){
				htmlStr+='<label>'+name+'：</label>';
			}else if(typeof type === 'undefined'&&$.type(value) !== 'object'){
				htmlStr+='<label>'+key+'：</label>';
			}
			if(typeof type === 'undefined'){
				type=key;
			}
			switch(key){
				case 'text':
					htmlStr+=t.valueTypeFactory(type,value);
					break;
				case 'color':
                    htmlStr+=createHtml.color(key, value, type);
                    break;
                default:
					if($.type(value) === 'object'&&typeof value.type !=='undefined'){
						htmlStr+=t.paramFactory(value.type,value.value,value.name,key);
					}else{
						htmlStr+=t.valueTypeFactory(type,value);
					}
			}
			return htmlStr;
		},
		valueTypeFactory:function(key,value){
			var htmlStr='',
				type=$.type(value);
			switch(type){
				case 'boolean':
					htmlStr+=
						'<select data-type="'+type+'" data-key="'+key+'">\
							<option value="true"'+(value===true?' selected':'')+'>是</option>\
							<option value="false"'+(value===false?' selected':'')+'>否</option>\
						<select>';
					break;
				default:
					htmlStr+='<textarea data-type="'+type+'" data-key="'+key+'">'+value+'</textarea>';
			}
			return htmlStr;
		},
		end:0
	}
	D.paramContentBulid={
		/*
		 * $param.type的工厂方法
		 */
		paramTypeFactory:function(obj, parentObj, key){
			var t=this,
				htmlStr='';
			switch(obj.type){
				case 'list':
					htmlStr+=t.paramsWrap(obj,t.paramTypeList(obj, parentObj, key), key);
					break;
				case 'tab':
				case 'container':
					htmlStr+=t.paramTypeTab(obj, parentObj, key);
					break;
				case 'select':
                    htmlStr+=t.paramsWrap(obj, t.paramTypeSelect(obj), key);
                    break;
                case 'checkbox':
                case 'radio':
                    htmlStr+=t.paramsWrap(obj, t.paramTypeRadio(obj), key);
                    break;
                case 'href':
                case 'url':
                case 'target':
                case 'title':
                case 'color':
                case 'date':
                case 'img':
                    htmlStr+=t.paramsWrap(obj,t.paramWrap(t.paramFactory('value',obj.value,obj.name,obj.type)), key);
                    break;
				case 'text':
                default:
					htmlStr+=t.paramsWrap(obj,t.paramUnit(obj.value, obj), key);
			}
			return htmlStr;
		},
		/*
		 * $param.type='tab' 列表类型封装的HTML，注意该类型下无$param.value，需要遍历内部$param.array
		 */
		paramTypeTab:function(obj, parentObj, key){
			var t=this,
				htmlStr='',
				tabTrigger='',
				tabContent='',
				isFixed=(typeof obj.isFixed !== 'boolean')?false:true,
                maxSize = tools.maxSize(obj, parentObj, key),
                minSize=tools.minSize(obj, parentObj, key),
                defSize = tools.defSize(obj, parentObj, key, minSize),  //defSize只在联动的时候有用
                isMove=obj.isMove;
			
            if (minSize>maxSize){
                tools.returnError(obj.name, 'maxSize的数值不能小于minSize的数值');
                minSize = maxSize;
            }
            
            tabTrigger+='<ul class="param-tab-trigger list-tabs-t">';
			tabContent+='<div class="param-tab-content '+PREFIX_CLASS_NAME+'array">';
            if ($.type(obj.array)!=='array' || !obj.array[0]){
                tools.returnError(obj.name, 'container类型时必须有array字段，且必须是数组');
                return;
            }
			$.each(obj.array,function(index){
                if(!obj.maxSize || index<obj.maxSize){
					tabTrigger += getTabTriggerHtml(index, obj.type, isFixed, isMove);
					
					tabContent += getTabContentHtml(this, index);
				}

			});
            
            //如果obj.array个数少于defSize值，取第一个值自动补充完整
            if (obj.array.length < minSize){
                for (var i=obj.array.length; i<minSize; i++){
                    tabTrigger += getTabTriggerHtml(i, obj.array[0].type, isFixed, isMove);
					
					tabContent += getTabContentHtml(obj.array[0], i);
                }
            }
            
			tabTrigger+='</ul>';
			tabContent+='</div>';
			htmlStr+=
				'<div class="param-tab '+PREFIX_CLASS_NAME+key+'" data-maxsize='+obj.maxSize+' data-minsize='+minSize+'>\
					<div class="tui-tabs-header">\
		                <h4 class="title">'+obj.name+'</h4>\
						'+tabTrigger+'\
						'+(isFixed?'':'<div class="tab-add-col"><a data-operation="add-tab" class="icon-admm icon-add" href="#">新增tab</a></div>')+'\
		            </div>\
					'+tabContent+'\
				</div>';
			return htmlStr;
            
            function getTabTriggerHtml (index, type, isFixed, isMove){
                var tabTriggerHtml = '<li class="tab-trigger-item'+(index===0?' current':'')+'">\
                                        <em>'+(type==='tab'?'选项卡':'组')+'<small>'+(index+1)+'</small></em>\
                                        '+(isFixed?'':'<a data-operation="del-tab" class="del-tab" href="#">X</a>')+
                                        (isMove===false ? '': '<a data-operation="moveup-tab" class="moveup-tab" href="#"></a><a data-operation="movedown-tab" class="movedown-tab" href="#"></a>')+'\
                                    </li>';
                
                return tabTriggerHtml;
            }
            function getTabContentHtml (obj, index){
                var tabContentHtml = '',
                    tmpHtml='';
                for(item in obj){
                    tmpHtml+=t.paramTypeFactory(obj[item], obj, item);
                }
                tabContentHtml= '<div class="tab-content-item '+(index===0?' current':'')+'">\
                                '+tmpHtml+'\
                            </div>';
                
                return tabContentHtml;
            }
		},
        paramTypeSelect:function(obj){
            if (this.checkParamOptions(obj.options, obj.name)){
                var strHtml = '<select class="'+PREFIX_CLASS_NAME+'value" data-operation="options">',
                    options = this.mergeOptions(obj);
                for (var i=0, l=options.length; i<l; i++){
                    if (typeof options[i].value!=='undefined' && typeof options[i].text!=='undefined'){
                        if (options[i].selected==='selected'){
                            strHtml += '<option selected="selected" value="'+options[i].value+'">'+options[i].text+'</option>';
                        } else {
                            strHtml += '<option value="'+options[i].value+'">'+options[i].text+'</option>';
                        }
                        
                    } else {
                        tools.returnError(obj.name, 'options数组内的格式是 {"value":"select中的value", "text":"select中的text"}');
                    }
                    
                }
                strHtml += '</select>';
                
                strHtml = this.paramWrap(strHtml, 'value');
                return strHtml;
            } else {
                return '';
            }
        },
        paramTypeRadio:function(obj){
            if (this.checkParamOptions(obj.options, obj.name)){
                var strHtml = '',
                    options = this.mergeOptions(obj),
                    inputName = 'crazy-options-'+obj.type+'-'+Math.floor(Math.random() * 10000000);
                
                for (var i=0, l=options.length; i<l; i++){
                    if (options[i].value && options[i].text){
                        var random = Math.floor(Math.random() * 10000), inputStr;
                        if (options[i].selected==='selected'){
                            inputStr = '<input class="'+PREFIX_CLASS_NAME+'value" type="'+obj.type+'" name="'+inputName+'" checked="checked" value="'+options[i].value+'" id="crazy-param-'+obj.type+'-'+random+'" />';
                        } else {
                            inputStr = '<input class="'+PREFIX_CLASS_NAME+'value" type="'+obj.type+'" name="'+inputName+'" value="'+options[i].value+'" id="crazy-param-'+obj.type+'-'+random+'" />';
                        }
                        
                        strHtml += '<label for="crazy-param-'+obj.type+'-'+random+'">'+ inputStr +options[i].text+'</label>';
                    } else {
                        tools.returnError(obj.name, 'options数组内的格式是 {"value":"select中的value", "text":"select中的text"}');
                    }
                }
                strHtml = this.paramWrap(strHtml, 'value');
                return strHtml;
            } else {
                return '';
            }
        },
        mergeOptions:function(obj){
            var resultOpts = obj.options.concat();
            if (obj.value){
                var selected = obj.value;
                if ($.type(selected)!=='array'){
                    selected = [selected];
                }
                for (var i=0, l=selected.length; i<l; i++){
                    for (var j=0, len=resultOpts.length; j<len; j++){
                        resultOpts[j] = $.extend({}, resultOpts[j]);
                        if (selected[i].value===resultOpts[j].value){
                            resultOpts[j]['selected'] = 'selected';
                            continue;
                        }
                    }
                }
            }
            
            return resultOpts;
        },
        checkParamOptions: function(options, name){
            if (!options){
                tools.returnError(name, '缺少options配置项，type为 select/redio/checkbox 时必须配置options字段');
                return false;
            }
            if ($.type(options)!=='array'){
                tools.returnError(name, 'options字段值只能是数组');
                return false;
            }
            return true;
        },
		/*
		 * $param.type='list' 列表类型封装的HTML
		 */
		paramTypeList:function(obj, parentObj, key){
			var t=this,
				htmlStr='',
				maxSize = tools.maxSize(obj, parentObj, key),
				isFixed=obj.isFixed,
                //minSizeVar = variable.handler('minSize', obj, key, parentObj),//t.resolveVariable('minSize', obj, parentObj),
				minSize=tools.minSize(obj, parentObj, key),
                defSize = tools.defSize(obj, parentObj, key, minSize),
                isMove=obj.isMove;
            
            if (minSize>maxSize){
                tools.returnError(obj.name, 'maxSize的数值不能小于minSize的数值');
                minSize = maxSize;
            }
            
			if(typeof isFixed !== 'boolean'){
				isFixed=false;
			}
			htmlStr+='<ul class="o-list '+PREFIX_CLASS_NAME+'value" data-maxsize='+maxSize+' data-minsize='+minSize+'>';
			$.each(obj.value,function(index){
				if(index<maxSize){
					htmlStr += getListHtml(this, isMove);
				}
			});
            
            //如果obj.value个数少于minSize值，取第一个值自动补充完整
            if (obj.value.length < minSize){
                for (var i=obj.value.length; i<minSize; i++){
                    htmlStr += getListHtml(obj.value[0], isMove);
                }
            }
            
			htmlStr+='</ul>';
			return htmlStr;
            
            function getListHtml(objValue, isMove){
                var htmlStr = '';
                htmlStr+=
                    '<li class="o-col">\
                        '+t.paramUnit(objValue);
                if(!isFixed){
                    htmlStr+=
                        '<div class="operation">\
                            <a data-operation="del-col" class="icon-admm icon-delete" href="#" title="删除"></a>\
                            <a data-operation="add-col" class="icon-admm icon-add" href="#" title="增加"></a>\
                            '+(isMove===false?'':'<a data-operation="moveup-col" class="icon-admm icon-moveup" href="#" title="上移"></a>\
                            <a data-operation="movedown-col" class="icon-admm icon-movedown" href="#" title="下移"></a>')+'\
                        </div>';
                }
                htmlStr+='</li>';
                return htmlStr;
            }
		},
        
		/*
		 * 对$param.value的结果进行wrap封装，每项对应一个div.o-item
		 */
		paramsWrap:function(objContent,paramHtml, key){
			var htmlStr='',
				showHtml='',
				briefHtml='';

			if(typeof objContent.isShow!=='undefined'){
				showHtml+=
					'<div class="o-action">\
						<div class="hide-trigger"><strong title="可以控制内容在区块中显不显示">显示锁</strong>状态为显示，可以<a href="#" data-operation="is-show">点击</a>来隐藏</div>\
						<div class="show-trigger"><strong title="可以控制内容在区块中显不显示">显示锁</strong>状态为隐藏，可以<a href="#" data-operation="is-show">点击</a>来显示</div>\
					</div>';
			}
			if(typeof objContent.brief!=='undefined'&&objContent.brief!==''){
				briefHtml+=
					'<div class="o-brief">\
						<span class="label">备注：</span>\
						<span class="value">'+objContent.brief+'</span>\
					</div>';
			}

			htmlStr+=
				'<div class="o-item '+PREFIX_CLASS_NAME+key+((typeof objContent.isShow!=='undefined'&&!objContent.isShow)?' is-show':'')+'"'+(typeof objContent.isShow!=='undefined'?' data-show="'+objContent.isShow+'"':'')+'>\
					<div class="o-label">'+objContent.name+'：</div>\
					<div class="o-value">\
						'+paramHtml+'\
					</div>\
					'+showHtml+'\
					'+briefHtml+'\
				</div>';
			return htmlStr;
		},
		/*
		 * $param.value中每个纯对象或字符串为一个Unit，如果是数组，则数组中每项，为一个Unit
		 */
		paramUnit:function(objValue, obj){
			var t=this,
				htmlStr='',
				v;
			
            if($.isPlainObject(objValue)){
				for(v in objValue){
					htmlStr+=t.paramWrap(t.paramFactory(v,objValue[v]));
				}
			}else{
				htmlStr+=t.paramWrap(t.valueTypeFactory('',objValue));
			}
			return htmlStr;
		},
		/*
		 * 对paramFactory的结果进行wrap封装，每项对应一个div.param
		 */
		paramWrap:function(paramHtml, key){
			var htmlStr='';
			htmlStr+=
				'<div class="param'+((key) ? ' '+PREFIX_CLASS_NAME+key :'')+'">\
					'+paramHtml+'\
				</div>';
			return htmlStr;
		},
		/*
		 * $param.value中最小单元的工厂方法
		 * @description 每个键值对应其对应操作行为
		 */
		paramFactory:function(key,value,name,type){
            var t=this,
				htmlStr='',
				behaviorMap={
					'href':'链接',
					'url':'链接',
					'target':'',
					'text':'文本',
					'title':'标题',
                    'color':'颜色',
                    'date':'时间',
					'img':'图片'
				};
			if(typeof name === 'undefined'){
				name=behaviorMap[key];
			}
			if(name===''){
                htmlStr+='';
            }else if(typeof name !== 'undefined'||typeof behaviorMap[key]  !== 'undefined'){
				htmlStr+='<label>'+name+'：</label>';
			}else if(typeof type === 'undefined'&&$.type(value) !== 'object'){
				htmlStr+='<label>'+key+'：</label>';
			}
            
			if(typeof type === 'undefined'){
				type=key;
			}
			switch(type){
				case 'text':
				case 'title':
					htmlStr+=t.valueTypeFactory(type,value);
					break;
				case 'href':
				case 'url':
					htmlStr+=
						'<div class="link-upload">\
                            <input placeholder="请输入的链接地址" class="'+PREFIX_CLASS_NAME+key+'" value="'+$.util.escapeHTML(value,true)+'" type="text" data-key="'+type+'" />\
                        </div>';
			            	/*<button type="button" data-default-title="设定链接" data-trigger-title="取消设定">设定链接</button>\
			           		<div class="popup">\
			              		<span class="arrow"></span>\
			              		<input placeholder="请输入的链接地址" value="'+$.util.escapeHTML(value,true)+'" type="text" data-key="'+type+'" class="link-addr"/>\
			              		<a class="dcms-box-btn btn-ok" href="javascript:;">OK</a>\
			            	</div>\
			          	</div>';*/
					break;
				case 'target':
					htmlStr+=
						'<select class="'+PREFIX_CLASS_NAME+key+'" data-key="'+key+'">\
							<option value="_self"'+(value==='_self'?' selected':'')+'>原窗口打开</option>\
							<option value="_blank"'+(value==='_blank'?' selected':'')+'>新窗口打开</option>\
							<option value="">页面默认</option>\
						<select>';
					break;
				case 'img':
					htmlStr+=
						'<span class="local-upload">\
						</span>\
                        <div class="link-upload">\
                            <input class="'+PREFIX_CLASS_NAME+key+'" placeholder="请输入图片的链接地址" value="'+$.util.escapeHTML(value,true)+'" type="text" data-key="'+type+'" />\
                        </div>';
						/*<div class="link-upload">\
			            	<button type="button" data-default-title="图片地址" data-trigger-title="取消设定">图片地址</button>\
			           		<div class="popup">\
			              		<span class="arrow"></span>\
			              		<input placeholder="请输入图片的链接地址" value="'+$.util.escapeHTML(value,true)+'" type="text" data-key="'+type+'" class="link-addr"/>\
			              		<a class="dcms-box-btn btn-ok" href="javascript:;">OK</a>\
			            	</div>\
			          	</div>';*/
					break;
				case 'color':
                    htmlStr+=createHtml.color(key, value, type);
                    break;
                case 'date':
                    htmlStr+='<input readonly="readonly" type="text" class="ui-date '+PREFIX_CLASS_NAME+key+'" data-key="'+type+'" value="'+$.util.escapeHTML(value,true)+'" />';
                    break;
                default:
					if($.type(value) === 'object'&&typeof value.type !=='undefined'){
						htmlStr+=t.paramFactory(value.type,value.value,value.name,key);
					}else{
						htmlStr+=t.valueTypeFactory(type,value);
					}
			}
			return htmlStr;
		},
		valueTypeFactory:function(key,value){
			var htmlStr='',
				type=$.type(value);
            switch(type){
				case 'boolean':
					htmlStr+=
						'<select class="'+PREFIX_CLASS_NAME+key+'" data-type="'+type+'" data-key="'+key+'">\
							<option value="true"'+(value===true?' selected':'')+'>是</option>\
							<option value="false"'+(value===false?' selected':'')+'>否</option>\
						<select>';
					break;
				default:
                    if (typeof value !== 'undefined' && value !== null){
                        htmlStr+='<textarea class="'+PREFIX_CLASS_NAME+key+'" data-type="'+type+'" data-key="'+key+'">'+$.util.unescapeHTML(value.toString())+'</textarea>';
                    }
			}
			return htmlStr;
		},
		end:0
	};
    
    
	/*Type
	 * 根据操作界面中的填写封装回配置参数格式
	 */
	D.paramApplyPackage={
		/*
		 * 内容区参数应用
		 */
		applyPackage:function(node,config){
			var t=this,
				attrStr='',
				config=t.initPackage(config);
			
            if($.type(config)==='string'){
				config = eval('(' + ((typeof config === 'string')?config:'[]') + ')');
			}
			node.data('boxconfig',config);
			attrStr+='[';
			$.each(config,function(index){
				if(index!==0){
					attrStr+=',';
				}
				attrStr+=JSON.stringify(this);
			});
			attrStr+=']';
			node.attr('data-boxconfig',attrStr);
		},
		/*
		 * 初始化封装
		 */
		initPackage:function(config){
			var t=this,
				contentIndex=0,
				styleIndex=0,
				item;
            if($.type(config)==='string'){
				config = eval('(' + ((typeof config === 'string')?config:'[]') + ')');
			}
			$.each(config,function(){
				if(typeof this.content !== 'undefined'){
					var node=$(D.defConfig.dialog).find('.fdwidget-edit-content .o-group').eq(contentIndex);
					this.content=D.paramApplyContent.packageFactory(this.content,node);
					contentIndex++;
				}
				if(typeof this.style !== 'undefined'){
					var node=$(D.defConfig.dialog).find('.fdwidget-edit-style .o-group').eq(0),
						result=D.paramApplyStyle.packageFactory(this.style,node,styleIndex);
					this.style=result[0];
					styleIndex=result[1];
				}
			});
			return config;
		},
		end:0
	}
	D.paramApplyStyle={
		packageFactory:function(objStyle,node,styleIndex){
			var t=this,
				obj;
			for(item in objStyle){
				obj=objStyle[item];
				obj.value=t.packageRow(obj.value,node.find('.o-item').eq(styleIndex));
				styleIndex++;
			}
			return [objStyle,styleIndex];
		},
		packageRow:function(objValue,node){
			var item,
				index=0,
				resultNode,
				result;
			if($.isPlainObject(objValue)){
				for(item in objValue){
					resultNode=node.find('.param').eq(index).find('[data-key='+item+']');
                    result = getRealValue(resultNode);
					if($.inArray(item,['text'])!==-1||typeof objValue[item].value === 'undefined'){
						objValue[item]=result;
					}else{
						objValue[item].value=result;
					}
					index++;
				}
			}else{
				resultNode = node.find('.param').eq(index).find('[data-key]');
                objValue = getRealValue(resultNode);
			}
			return objValue;
            
            function getRealValue(resultNode){
                var result;
                switch(resultNode.data('type')){
                    case 'boolean':
                        if(resultNode.val()==='true'){
                            result=true;
                        }else{
                            result=false;
                        }
                        break;
                    default:
                        result=$.util.escapeHTML(resultNode.val());
                }
                return result;
            }
		},
		end:0
	}
	D.paramApplyContent={
		/*
		 * 内容区参数封装工厂方法
		 */
		packageFactory:function(objContent,node){
			var t=this,
				obj,
				contentIndex=0,
				tabIndex=0;
            for(item in objContent){
				obj=objContent[item];
				if(typeof obj.isShow!=='undefined'){
					obj.isShow=node.find('.'+PREFIX_CLASS_NAME+item).data('show');
				}
				switch(obj.type){
					case 'list':
                        var listNode=node.find('.'+PREFIX_CLASS_NAME+item).find('.o-col');
                        
						$.each(obj.value,function(index){
							if(index<listNode.length){
								obj.value[index]=t.packageRow(this,listNode.eq(index));
							}else{
								obj.value.splice(index);
							}
						});
						if(obj.value.length<listNode.length){
							listNode.each(function(index){
								if(index>=obj.value.length){
									obj.value.push(t.packageRow(jQuery.extend(true,{},obj.value[0]),listNode.eq(index)));
								}
							});
						}
						break;
					case 'tab':
					case 'container':
                        var tabNode=node.find('.'+PREFIX_CLASS_NAME+item+' > .param-tab-content > .tab-content-item');
						$.each(obj.array,function(index){
							if(index<tabNode.length){
								obj.array[index]=t.packageFactory(this,tabNode.eq(index));
							}else{
								obj.array.splice(index);
							}
						});
						if(obj.array.length<tabNode.length){
							tabNode.each(function(index){
								if(index>=obj.array.length){
									obj.array.push(t.packageFactory(jQuery.extend(true,{},obj.array[0]),tabNode.eq(index)));
								}
							});
						}
						tabIndex++;
						contentIndex--;
						break;
					case 'select':
                        var selectEl = node.find('.'+PREFIX_CLASS_NAME+item).find('select'),
                            selectVal = selectEl.val();
                            obj.value = t.getSelectedValue(obj.options, selectVal);
                        break;
                    case 'checkbox':
                        var checkboxEls = node.find('.'+PREFIX_CLASS_NAME+item).find('input:checkbox:checked'),
                            checkboxVal = [];
                        checkboxEls.each(function(){
                            checkboxVal.push(t.getSelectedValue(obj.options, $(this).val()))
                        });
                        obj.value = checkboxVal;
                        break;
                    case 'radio':
                        var radioEl = node.find('.'+PREFIX_CLASS_NAME+item).find('input:radio:checked');
                        obj.value = t.getSelectedValue(obj.options, radioEl.val());
                        break;
                    case 'text':
					default:
                        obj.value=t.packageRow(obj.value,node.find('.'+PREFIX_CLASS_NAME+item));
				}
				contentIndex++;
			}
			return objContent;
		},
        getSelectedValue: function(options, val){
            var result = [];
            for (var i=0, l=options.length; i<l; i++){
                if (val===options[i].value){
                    result = options[i];
                    break;
                }
            }
            return result;
        },
		/*
		 * 内容区一行配置参数封装
		 */
		packageRow:function(objValue,node){
			var item,
				index=0,
				resultNode,
				result;
            if($.isPlainObject(objValue)){
				for(item in objValue){
					resultNode=node.find('.param').eq(index).find('[data-key='+item+']');
					result = getRealValue(resultNode);
					if($.inArray(item,['href','target','text','img','title','url','color','date'])!==-1||typeof objValue[item].value === 'undefined'){
						objValue[item]=result;
					}else{
						objValue[item].value=result;
					}
					index++;
				}
			}else{
				resultNode = node.find('.param').eq(index).find('[data-key]');
                objValue = getRealValue(resultNode);
			}
			return objValue;
            
            function getRealValue(resultNode){
                var result;
                switch(resultNode.data('type')){
                    case 'boolean':
                        if(resultNode.val()==='true'){
                            result=true;
                        }else{
                            result=false;
                        }
                        break;
                    default:
                        result=$.util.escapeHTML(resultNode.val());
                }
                return result;
            }
        },
		end:0
	}

	D.contentEditMutual={
		initFactory:function(){
			var t=this;
			$(document).on('click',D.defConfig.dialog+' [data-operation]',function(){
				var node=$(this);
				switch(node.data('operation')){
					case 'fold':
						t.groupMutualFold(node);
						break;
					case 'add-col':
						t.listMutualAdd(node);
						break;
					case 'del-col':
						t.listMutualDel(node);
						break;
					case 'moveup-col':
                        t.listMutualUp(node);
                        break;
                    case 'movedown-col':
                        t.listMutualDown(node);
                        break;
                    case 'add-tab':
						t.tabMutualAdd(node);
						break;
					case 'del-tab':
						t.tabMutualDel(node);
						break;
					case 'moveup-tab':
						t.tabMutualUp(node);
						break;
                    case 'movedown-tab':
						t.tabMutualDown(node);
						break;
                    case 'is-show':
						t.itemMutualShow(node);
						break;
				}
				return false;
			});
			$(document).on('click',D.defConfig.dialog+' .param-tab .tab-trigger-item',function(){
				var node=$(this);
				t.tabMutualSw(node);
				return false;
			});
            $(document).on('mouseenter',D.defConfig.dialog+' .param-tab .tab-trigger-item',function(){
				var node=$(this);
				node.find('a').show();
			});
            $(document).on('mouseleave',D.defConfig.dialog+' .param-tab .tab-trigger-item',function(){
				var node=$(this);
				node.find('a').hide();
			});
			t.paramLinkTrigger();
			
		},
		groupMutualFold:function(node){
			node.closest('.o-group').toggleClass('group-fold');
		},
		listMutualAdd:function(node){
			var ancestor=node.closest('.o-list'),
				colNodes=ancestor.find('.o-col');
			if(ancestor.data('maxsize')>colNodes.length){
				var cloneNode = colNodes.eq(0).clone();
                ancestor.append(cloneNode);
                
                tools.setCloneUpload(cloneNode);
			}else{
				alert('受布局显示上的限制，该列表最多可以添加'+ancestor.data('maxsize')+'项');
			}
		},
		listMutualDel:function(node){
			var ancestor = node.closest('.o-list'),
				colNodes = ancestor.find('.o-col'),
                minSize = ancestor.data('minsize');
			
            if(colNodes.length>1 && colNodes.length>minSize){
				node.closest('.o-col').remove();
			}else{
				if (colNodes.length===1){
                    alert('已经是最后一项，不能再移除了。');
                } else {
                    alert('不能小于'+minSize+'项');
                }
                
			}
		},
		listMutualUp: function(node){
            var colNodes=node.closest('.o-col'),
                prevNodes = colNodes.prev();
            if (prevNodes[0]){
                prevNodes.before(colNodes);
            } else {
                alert('我已经是第一了，不能再往前啦！！！');
            }
        },
        listMutualDown: function(node){
            var colNodes=node.closest('.o-col'),
                nextNodes = colNodes.next();
            if (nextNodes[0]){
                nextNodes.after(colNodes);
            } else {
                alert('我已经是最后了，不能再往后啦！！！');
            }
        },
        tabMutualAdd:function(node){
			var ancestor=node.closest('.param-tab'),
				tabTriggers=ancestor.find(' > .tui-tabs-header > .param-tab-trigger > .tab-trigger-item'),
				tabContents=ancestor.find(' > .param-tab-content > .tab-content-item');
			
            if(ancestor.data('maxsize')>tabContents.length){
				var tmpNode=tabTriggers.eq(0).clone(),
                    cloneContentEl = tabContents.eq(0).clone().removeClass('current');
				tmpNode.removeClass('current');
				tmpNode.find('em small').html(tabContents.length+1);
				ancestor.find('> .tui-tabs-header > .param-tab-trigger').append(tmpNode);
				ancestor.find('> .param-tab-content').append(cloneContentEl);
                
                tools.setCloneUpload(cloneContentEl);
			}else{
				alert('受布局显示上的限制，该tab最多可以添加'+ancestor.data('maxsize')+'项');
			}
		},
		tabMutualDel:function(node){
			var ancestor=node.closest('.param-tab'),
				tabTriggers=ancestor.find(' > .tui-tabs-header > .param-tab-trigger > .tab-trigger-item'),
				tabContents=ancestor.find(' > .param-tab-content > .tab-content-item'),
                minSize = ancestor.data('minsize');
            if(tabContents.length>1 && tabContents.length>minSize){
                tabContents.eq(node.closest('.tab-trigger-item').prevAll('.tab-trigger-item').length).remove();
				tabTriggers.last().remove();
				tabTriggers=ancestor.find(' > .tui-tabs-header > .param-tab-trigger > .tab-trigger-item');
				tabContents=ancestor.find(' > .param-tab-content > .tab-content-item');
				if(!tabContents.hasClass('current')){
					tabContents.eq(0).addClass('current');
				}
				tabTriggers.eq(ancestor.find('.tab-content-item.current').prevAll('.tab-content-item').length).addClass('current').siblings('.tab-trigger-item').removeClass('current');

			}else{
				if (tabContents.length===1){
                    alert('已经是最后一项，不能再移除了。');
                } else {
                    alert('不能小于'+minSize+'项');
                }
                
			}
		},
        tabMutualUp: function(node){
            var tabCurTrigger = node.closest('.tab-trigger-item'),
                ancestor=node.closest('.param-tab'),
                tabTriggers = ancestor.find(' > .tui-tabs-header > .param-tab-trigger > .tab-trigger-item'),
                tabContents=ancestor.find(' > .param-tab-content > .tab-content-item'),
                curIndex = tabTriggers.index(tabCurTrigger);
            if (curIndex!==0){
                var tabPrevTrigger = tabCurTrigger.prev(),
                    tabCurContent = tabContents.eq(curIndex),
                    tabPrevContent = tabContents.eq(curIndex-1);
                tabPrevTrigger.before(tabCurTrigger);
                tabPrevContent.before(tabCurContent);
            } else {
                alert('我已经是第一个啦，不能再往前啦！！！');
            }
        },
        tabMutualDown: function(node){
            var tabCurTrigger = node.closest('.tab-trigger-item'),
                ancestor=node.closest('.param-tab'),
                tabTriggers = ancestor.find('.tab-trigger-item'),
                tabContents=ancestor.find('.tab-content-item'),
                curIndex = tabTriggers.index(tabCurTrigger);
            if (curIndex!==tabTriggers.length-1){
                var tabNextTrigger = tabCurTrigger.next(),
                    tabCurContent = tabContents.eq(curIndex),
                    tabNextContent = tabContents.eq(curIndex+1);
                tabNextTrigger.after(tabCurTrigger);
                tabNextContent.after(tabCurContent);
            } else {
                alert('我已经是最后一个啦，不能再往后啦！！！');
            }
        },
		tabMutualSw:function(node){
			var ancestorTrigger=node.closest('.tab-trigger-item'),
				ancestor=ancestorTrigger.closest('.param-tab');
			if(!ancestorTrigger.hasClass('current')){
				ancestorTrigger.addClass('current');
				ancestorTrigger.siblings('.tab-trigger-item').removeClass('current');
                var index = ancestorTrigger.prevAll('.tab-trigger-item').length,
                    conContainer = ancestor.children('.param-tab-content');
				conContainer.children('.tab-content-item').eq(index).addClass('current').siblings('.tab-content-item').removeClass('current');
			}
		},
		itemMutualShow:function(node){
			var ancestor=node.closest('.o-item');
			ancestor.data('show',!ancestor.data('show'));
			ancestor.attr('data-show',ancestor.data('show'));
			ancestor.toggleClass('is-show');
		},
		paramLinkTrigger:function(){
			$(document).on('click',D.defConfig.dialog+' .link-upload button',function(){
				var self = $(this), 
                 	parent = self.closest('div.link-upload'),
                 	popup = parent.find('div.popup');
                popup.css('left',self.position().left);
                popup.css('top',self.position().top+34);
                if(popup.css('display') === "none") {
                    popup.show();
                    self.html(self.data('triggerTitle'));
                } else {
                    popup.hide();
                    self.html(self.data('defaultTitle'));
                }
                return false;
			});
			$(document).on('click',D.defConfig.dialog+' .link-upload input.link-addr',function(){
				this.select();
                return false;
			});
			$(document).on('click',D.defConfig.dialog+' .link-upload .btn-ok',function(){
                 var self = $(this), 
                 	parent = self.closest('div.link-upload'),
                 	popup = parent.find('div.popup'),
                 	button = parent.find('button');
                button.html(button.data('defaultTitle'));
                popup.hide();
                return false;
			});
            /*$(document).on('click', function(e){
                if (!$(e.target).closest('div.popup')[0]){
                    $('div.link-upload div.popup').hide();
                }
            });*/
		},
		end:0
	}
	D.skinBulid={
		init:function(o,skin){
            var htmlSkin='',
                self = this;
			this.skin = skin;
            if(typeof skin !== 'undefined'){
				htmlSkin += '<div class="fdwidget-edit-skin">\
						<div class="o-skin o-group group-fold">\
							<div class="o-header">\
								<h3>组件换肤</h3>\
								<a data-operation="fold" href="#" class="trigger">︾</a>\
							</div>\
                        <div class="o-category"><dl class="o-category-item"><dt>按颜色筛选:</dt><dd><ul>';
                if (!o.category){
                    o.category = '全部';
                }
                $.each(o.categoryCount,function(index,obj){
                    if (obj.category===o.category){
                        htmlSkin += '<li class="current" data-val="'+obj.category+'"><em>'+obj.category+'</em><i class="num"> ('+obj.count+')</i></li>';
                    } else {
                        htmlSkin += '<li data-val="'+obj.category+'"><em>'+obj.category+'</em><i class="num"> ('+obj.count+')</i></li>';
                    }
                });
                
                htmlSkin+=
					'</ul></dd></dl></div><div class="o-content">';
				htmlSkin+=self.skinHtml(o.skins, skin);
                
				htmlSkin+='</div>';
				htmlSkin+='</div>';
				htmlSkin+='</div>';
			}
			return htmlSkin;
		},
        skinHtml: function(dataSkins, skin){
            skin = skin || this.skin;
            var htmlSkin = '<ul class="o-color-card">';
            $.each(dataSkins,function(){
					/*htmlSkin+=
						'<li class="o-card-item'+(this.id===skin.id?' selected':'')+'" title="'+this.title+'" data-skin="'+$.util.escapeHTML(JSON.stringify(this),true)+'">\
							<a class="o-item" href="#">';
						$.each(this.color,function(index,color){
							htmlSkin+='<span class="color'+index+'" style="background-color:'+color+'"></span>';
						});
					htmlSkin+='</a>';
					htmlSkin+='</li>';*/
                    
                    htmlSkin += '<li class="o-card-item'+(this.id===skin.id?' selected':'')+'" title="'+this.title+'" data-skin="'+$.util.escapeHTML(JSON.stringify(this),true)+'">\
                                    <a class="c4 o-item" style="background-color:'+this.color[4]+'" href="#">\
                                        <p class="o-color-header c0"  style="background-color:'+this.color[0]+'">\
                                            <i class="c4" style="background-color:'+this.color[4]+'"></i>\
                                            <i class="c4" style="background-color:'+this.color[4]+'"></i>\
                                            <i class="c4" style="background-color:'+this.color[4]+'"></i>\
                                            <i class="c4" style="background-color:'+this.color[4]+'"></i>\
                                        </p>\
                                        <dl class="o-color-offer c3" style="background-color:'+this.color[3]+'">\
                                            <dt class="o-color-img"></dt>\
                                            <dd class="o-color-line">\
                                                <span class="long c1" style="background-color:'+this.color[1]+'"></span>\
                                                <span class="normal c1" style="background-color:'+this.color[1]+'"></span>\
                                                <span class="shot c1" style="background-color:'+this.color[1]+'"></span>\
                                            </dd>\
                                            <dd class="o-color-dual fd-clr">\
                                                <p class="big c5" style="background-color:'+this.color[5]+'">\
                                                    <i class="c4" style="background-color:'+this.color[4]+'"></i>\
                                                    <i class="c4" style="background-color:'+this.color[4]+'"></i>\
                                                    <i class="c4" style="background-color:'+this.color[4]+'"></i>\
                                                    <i class="c4 last" style="background-color:'+this.color[4]+'"></i>\
                                                </p>\
                                                <span class="long c2" style="background-color:'+this.color[2]+'"></span>\
                                                <span class="shot c6" style="background-color:'+this.color[6]+'"></span>\
                                            </dd>\
                                        </dl>\
                                    </a>\
                                    <p class="txt">'+this.title+'</p>\
                                </li>'
				});
				htmlSkin+='</ul>';
                return htmlSkin;
        },
		switchSkin:function(){
            $(document).on('click',D.defConfig.dialog+' .fdwidget-edit-skin .o-card-item',function(){
				var item=$(this).closest('.o-card-item');
				item.addClass('selected');
				item.siblings('.o-card-item').removeClass('selected');
				return false;
			});
		},
        switchCategory: function(){
            var self = this;
            $(document).on('click',D.defConfig.dialog+' .fdwidget-edit-skin .o-category li',function(){
                var curEl = $(this),
                    strVal = curEl.data('val');
                curEl.siblings('li').removeClass('current');
                curEl.addClass('current');
                
                var container = $(this).closest('.o-skin').find('.o-content');
                self.requestSkin(strVal, container);
            });
        },
        requestSkin: function(category, container){
            var data = {}, self = this;
            data['action'] = 'SkinManagerAction';
            data['event_submit_do_skins'] = 'true';
            if (category && category!=='全部'){
               data['category'] = encodeURIComponent(category);
            }
            $.ajax(D.domain+'/admin/json.html',{
                data:data,
                dataType : 'json'
            }).done(function(o){
                var strHtml = self.skinHtml(o.skins);
                container.html(strHtml);
            });
        },
		skinApply:function(node){
			var selectedNode=$(D.defConfig.dialog).find('.fdwidget-edit-skin .o-color-card .selected'),
				config=selectedNode.data('skin');
			if(config){
				node.data('skinconfig',config.id);
				node.attr('data-skinconfig',config.id);
			}
		},
		end:0
	}

	D.editDialog={
		init:function(node){
			var t=this,
				htmlStr='',
				config=node.data('boxconfig'),
				skin=node.data('skinconfig');
			if(typeof skin !=='undefined'){
				$.ajax(D.domain+'/admin/json.html',{
					data:{
						action:'SkinManagerAction',
						event_submit_do_skins:'true'
					},
					dataType : 'json'
				}).done(function(o){
					htmlStr+=D.paramHtmlBulid.initFactory(config);
					htmlStr+=D.skinBulid.init(o,skin);
					t.openDialog(node,htmlStr,config,skin);
				});
			}else{
                htmlStr+=D.paramHtmlBulid.initFactory(config);
				t.openDialog(node,htmlStr,config);
			}
		},
		openDialog:function(node,htmlStr,config,skin){
            var self = this;
            D.Msg['confirm']({
				'title' : '编辑内容',
				'body' : htmlStr,
				'onlymsg':false,
				'success':function(){
    				if (config){
                        D.paramApplyPackage.applyPackage(node,config);
                    }
                    
    				if(typeof skin !=='undefined'){
    					D.skinBulid.skinApply(node,skin);
    				}
                    
    				$(document).trigger('refreshContent',[node.parent()]);
				}
			},{
				'open':function(){
                    $(this).removeClass('ext-width');
					$(this).addClass('fdwidget-dialog');
					
                    tools.localUpload($('span.local-upload', D.defConfig.dialog));
                    
                    tools.initColorBox($(D.defConfig.dialog+' .ui-color'));
                    
                    tools.initDatepicker($(D.defConfig.dialog+' .ui-date'));
                    
                    $(D.defConfig.dialog+' section').off('focus.editText').on('focus.editText', 'input:text', function(e){
                        $(this).select();
                    });
					$(D.defConfig.dialog+' section').off('scroll.linkTrigger').on('scroll.linkTrigger',function(){
		                var self = $(this), 
		                 	popup = self.find('div.popup'),
		                 	button = self.find('.link-upload button');
		                popup.each(function(){
		            		$(this).hide();
		            	});
		            	button.each(function(){
		            		$(this).html($(this).data('defaultTitle'));
		            	});
		                return false;
					});
                    
                    variable.bindChangeVal.fire();
				},
				'close':function(){
					$(this).removeClass('fdwidget-dialog');
				}
			});
		},
		end:0
	}
	D.pageSkin={
		init:function(){
			var t=this;
			$(document).off('switchSkin.Page').on('switchSkin.Page',function(e,doc, category){
				var htmlStr='',
                    data = {};
                data['action'] = 'SkinManagerAction';
                data['event_submit_do_skins'] = 'true';
                data['pageId'] = $("#pageId").val();
                if (category && category!=='全部'){
                   data['category'] = encodeURIComponent(category);
                }
				e.preventDefault();
				$.ajax(D.domain+'/admin/json.html?_input_charset=UTF-8',{
					data:data,
					dataType : 'json'
				}).done(function(o){
					this.dataSkin = o;
                    
                    htmlStr+=t.htmlBulid(o);
					t.openDialog(htmlStr,doc);
				});
			});
		},
		htmlBulid:function(o){
			var htmlSkin='';
			htmlSkin += '<div class="o-skin">\
					<div class="o-header">\
					<div class="o-category"><dl class="o-category-item"><dt>按颜色筛选:</dt><dd><ul>';
			if (!o.category){
                o.category = '全部';
            }
            $.each(o.categoryCount,function(index,obj){
				if (obj.category===o.category){
                    htmlSkin += '<li class="current" data-val="'+obj.category+'"><em>'+obj.category+'</em><i class="num"> ('+obj.count+')</i></li>';
                } else {
                    htmlSkin += '<li data-val="'+obj.category+'"><em>'+obj.category+'</em><i class="num"> ('+obj.count+')</i></li>';
                }
			});
			htmlSkin += '</ul></dd></dl></div>\
					</div><div class="o-content">\
						<ul class="o-color-card">';
			$.each(o.skins,function(index){
				/*htmlSkin+=
					'<li class="o-card-item'+(index===0?' selected':'')+'" title="'+this.title+'" data-skin="'+$.util.escapeHTML(JSON.stringify(this),true)+'">\
						<a class="o-item" href="#">';
					$.each(this.color,function(index,color){
						htmlSkin+='<span class="color'+index+'" style="background-color:'+color+'"></span>';
					});
				htmlSkin+='</a>';
				htmlSkin+='</li>';*/
                htmlSkin += '<li class="o-card-item'+(index===0?' selected':'')+'" title="'+this.title+'" data-skin="'+$.util.escapeHTML(JSON.stringify(this),true)+'">\
                                <a class="c4 o-item" style="background-color:'+this.color[4]+'" href="#">\
                                    <p class="o-color-header c0"  style="background-color:'+this.color[0]+'">\
                                        <i class="c4" style="background-color:'+this.color[4]+'"></i>\
                                        <i class="c4" style="background-color:'+this.color[4]+'"></i>\
                                        <i class="c4" style="background-color:'+this.color[4]+'"></i>\
                                        <i class="c4" style="background-color:'+this.color[4]+'"></i>\
                                    </p>\
                                    <dl class="o-color-offer c3" style="background-color:'+this.color[3]+'">\
                                        <dt class="o-color-img"></dt>\
                                        <dd class="o-color-line">\
                                            <span class="long c1" style="background-color:'+this.color[1]+'"></span>\
                                            <span class="normal c1" style="background-color:'+this.color[1]+'"></span>\
                                            <span class="shot c1" style="background-color:'+this.color[1]+'"></span>\
                                        </dd>\
                                        <dd class="o-color-dual fd-clr">\
                                            <p class="big c5" style="background-color:'+this.color[5]+'">\
                                                <i class="c4" style="background-color:'+this.color[4]+'"></i>\
                                                <i class="c4" style="background-color:'+this.color[4]+'"></i>\
                                                <i class="c4" style="background-color:'+this.color[4]+'"></i>\
                                                <i class="c4 last" style="background-color:'+this.color[4]+'"></i>\
                                            </p>\
                                            <span class="long c2" style="background-color:'+this.color[2]+'"></span>\
                                            <span class="shot c6" style="background-color:'+this.color[6]+'"></span>\
                                        </dd>\
                                    </dl>\
                                </a>\
                                <p class="txt">'+this.title+'</p>\
                            </li>'
            });
			htmlSkin+='</ul>';
			htmlSkin+='</div>';
			htmlSkin+='</div>';
			return htmlSkin;
		},
        switchCatetory: function(doc){
            $('.colorskin-dialog').on('click', '.o-category-item li', function(){
                var curEl = $(this),
                    strVal = curEl.data('val');
                curEl.siblings('li').removeClass('current');
                curEl.addClass('current');
                
                $(document).trigger('switchSkin.Page',[doc, strVal]);
            });
        },
        
		switchSkin:function(){
			$('.colorskin-dialog').on('click', '.o-card-item', function(){
                var item=$(this).closest('.o-card-item');
				item.addClass('selected');
				item.siblings('.o-card-item').removeClass('selected');
				return false;
			});
		},
		skinApply:function(doc){
			var selectedNode=$('.colorskin-dialog .o-color-card .selected'),
				config=selectedNode.data('skin');
			if(config){
				doc.find('[data-skinconfig]').each(function(i){
					$(this).data('skinconfig',config.id);
					$(this).attr('data-skinconfig',config.id);
				});
			}
			
		},
		openDialog:function(htmlStr,doc){
			var t=this;
			D.Msg['confirm']({
				'title' : '页面换肤',
				'body' : htmlStr,
				'onlymsg':false,
                'dbClickSelector': 'ul.o-color-card li.o-card-item',
				'success':function(){
    				t.skinApply(doc);
    				$(document).trigger('refreshContent');
				}
			},{
				'open':function(){
					$(this).removeClass('ext-width');
					$(this).addClass('colorskin-dialog');
					t.switchSkin();
                    t.switchCatetory(doc);
				},
				'close':function(){
                    $(this).off('click');
					$(this).removeClass('colorskin-dialog');
				}
			});
		},
		end:0
	}
	$(document).ready(function(){
		$(document).on('editContent.FDwidget',function(e,node){
			e.preventDefault();
			D.editDialog.init(node);
		});
		
		var iframeDoc=$('iframe#dcms_box_main');
		iframeDoc.bind('load', function() {
			D.pageSkin.init();
			var doc = $(this.contentDocument.document || this.contentWindow.document);
			$('#dcms_box_page_skin').off('click.skin').on('click.skin',function(){
				$(document).trigger('switchSkin.Page',[doc]);
			});

		});
    	D.contentEditMutual.initFactory();
    	D.skinBulid.switchSkin();
        D.skinBulid.switchCategory();
    });

})(dcms, FE.dcms);
