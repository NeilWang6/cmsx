/**
 * @author shanshan.hongss
 * @userfor 操作菜单
 * @date  2013.08.06
 * @rely 
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
 */

;(function($, D, ED, undefined) {
    var dropInPage,
        DATA_IS_FAVORIT = 'isfavorit',
        readyFun = [
        /*组件菜单*/
        //复制
        function(doc){
            ED.moduleMenu({
                doc: doc,
                selector: '.copy',
                done: function(elem, focus, e){
                    var target = elem.closest('.crazy-box-row');
                    ED.operate.copyElement(target, dropInPage);
                }
            }, 'copy');
        },
        //更换组件
        function(doc){
            ED.moduleMenu({
                doc: doc,
                selector: '.replace',
                done: function(elem, focus, e){
                    var elemInfo = elem.data(ED.config.ELEMENT_DATA_INFO),
                        elemAttr = {
                            'width' : parseInt(elem.css('width'))
                        }, method;
                        
                    if (!elemInfo){
                        elemInfo = elemAttr;
                    } else {
                        method = 'replace';
                        elemInfo.width = elemAttr.width;
                    }
                    D.YunYing.showModuleList.apply(D.YunYing, [elemInfo, elem, dropInPage, method]);
                }
            }, 'replace');
        },
        //添加组件
        function(doc){
            ED.moduleMenu({
                doc: doc,
                selector: '.add',
                done: function(elem, focus, e){
                    var elemInfo = elem.data(ED.config.ELEMENT_DATA_INFO),
                        elemAttr = {
                            'width' : parseInt(elem.css('width'))
                        }, method = 'add';
                    
                    if (isEmptyModule(elem)){
                        method = 'replace';
                    }
                        
                    if (!elemInfo){
                        elemInfo = elemAttr;
                    } else {
                        elemInfo.width = elemAttr.width;
                    }
                    D.YunYing.showModuleList.apply(D.YunYing, [elemInfo, elem, dropInPage, method]);
                }
            }, 'add');
        },
        //删除
        function(doc){
            ED.moduleMenu({
                doc: doc,
                selector: '.delect',
                done: function(elem, focus, e){
                    dropInPage._deleteFn(elem);
                    var coverEl = focus.closest(ED.config.SELECTOR_MODULE_COVER);
                    D.HighLight.hideLight(coverEl);
                }
            }, 'delect');
        },
        //设置为公用区块
        function(doc){
            ED.moduleMenu({
                doc: doc,
                selector: '.setpublic',
                done: function(elem, focus, e){
                    var elemInfo = elem.data(ED.config.ELEMENT_DATA_INFO);
                    ED.publicBlock && ED.publicBlock.setPublicBlock(elem,function(){
                        dropInPage._hideAll();
                    });
                }
            }, 'setpublic');
        },
        //上移
        function(doc){
            ED.moduleMenu({
                doc: doc,
                selector: '.moveup',
                done: function(elem, focus, e){
                    //移动module的时候，真正移动的是row
                    elem = elem.closest('.crazy-box-row');
                    moveUpOrDownActive(elem, 'prev', 'row', doc);
                }
            }, 'moveup');
        },
        //下移
        function(doc){
            ED.moduleMenu({
                doc: doc,
                selector: '.movedown',
                done: function(elem, focus, e){
                    //移动module的时候，真正移动的是row
                    elem = elem.closest('.crazy-box-row');
                    moveUpOrDownActive(elem, 'next', 'row', doc);
                }
            }, 'movedown');
        },
        //公共组件的查看
        function(doc){
            ED.moduleMenu({
                doc: doc,
                selector: '.show',
                eventType: 'mouseenter',
                done: function(elem, focus, e){
                    if (!elem || !elem[0]){ return; }
                    var moduleId = elem.data(ED.config.ELEMENT_DATA_INFO)['id'],
                        aEl = focus.find('a'),
                        href = aEl.data('href');
                    aEl.attr('href', href+moduleId);
                }
            }, 'show');
        },
        //判断是否已经收藏
        function(){
            ED.moduleMenu({
                doc: doc,
                selector: '.more',
                eventType: 'mouseenter',
                done: function(elem, focus, e){
                    var isFavorit = elem.data(DATA_IS_FAVORIT),  //true表示已收藏， false表示未收藏
                        id = elem.data(ED.config.ELEMENT_DATA_INFO).id;
                    
                    if (typeof isFavorit === 'undefined'){
                        $.ajax({
                            url: D.domain + ED.config.AJAX_JSONP_URL,
                            data: {
                                'action' : 'BoxFavoritAction',
                                'event_submit_do_ajaxGetFavoriteFlag' : true,
                                'favoritId' : id,
                                'favoritType' : 'BM'
                            },
                            type: 'POST',
                            dataType:'json'
                        }).done(function(o){
                            if (o.status==='success'){
                                elem.data(DATA_IS_FAVORIT, o.data.favoriteFlag);
                                setFavoritBtn(elem, focus);
                            }
                        });
                    } else {
                        setFavoritBtn(elem, focus);
                    }
                }
            }, 'checkFavorit');
            
            function setFavoritBtn(elem, focus){
                var favoritEl = focus.find('.off-made, .on-made'),
                    eleminfo = elem.data(ED.config.ELEMENT_DATA_INFO),
                    isFavorit = elem.data(DATA_IS_FAVORIT);
                favoritEl.data('type', 'BM').data('custom-id', eleminfo.id);
                if (isFavorit===true){
                    favoritEl.removeClass('off-made').addClass('on-made');
                    //favoritEl.data('text', '取消收藏').text('取消收藏');
                } else {
                    favoritEl.removeClass('on-made').addClass('off-made');
                    //favoritEl.data('text', '收藏该组件').text('收藏该组件');
                }
            }
        },
        //收藏
        function(doc){
            ED.moduleMenu({
                doc: doc,
                selector: '.off-made',
                bindType: 'delegate',
                done: function(elem, focus, e){
                    D.setFavorite.add(focus);
                    elem.data(DATA_IS_FAVORIT, true);
                }
            }, 'favorit');
        },
        //取消收藏
        function(doc){
            ED.moduleMenu({
                doc: doc,
                selector: '.on-made',
                bindType: 'delegate',
                done: function(elem, focus, e){
                    D.setFavorite.del(focus);
                    elem.data(DATA_IS_FAVORIT, false);
                }
            }, 'unfavorit');
        },
        /*布局菜单*/
        //复制
        function(doc){
            ED.layoutMenu({
                doc: doc,
                selector: '.copy',
                done: function(elem, focus, e){
                    ED.operate.copyToNext(elem, doc);
                }
            }, 'copy');
        },
        //删除
        function(doc){
            ED.layoutMenu({
                doc: doc,
                selector: '.delect',
                done: function(elem, focus, e){
                    dropInPage._deleteFn(elem);
                }
            }, 'delect');
        },
        //上移
        function(doc){
            ED.layoutMenu({
                doc: doc,
                selector: '.moveup',
                done: function(elem, focus, e){
                    moveUpOrDownActive(elem, 'prev', 'layout', doc);
                }
            }, 'moveup');
        },
        //下移
        function(doc){
            ED.layoutMenu({
                doc: doc,
                selector: '.movedown',
                done: function(elem, focus, e){
                    moveUpOrDownActive(elem, 'next', 'layout', doc);
                }
            }, 'movedown');
        },
        //添加
        function(doc){
            ED.layoutMenu({
                doc: doc,
                selector: '.add',
                done: function(elem, focus, e){
                    var gridType = ED.getGridType();
                    D.YunYing.getGrids.apply(D.YunYing, [gridType, elem, dropInPage]);
                }
            }, 'add');
        },
        /*编辑内容菜单*/
        //设置组件属性
        function(doc){
            ED.editMenu({
                doc: doc,
                selector: '.attr',
                done: function(elem, focus, e){
                    $(document).trigger('box.panel.attribute.attr_handle_event', [elem, 'module']);
                }
            }, 'attr');
        },
        //添加数据
        function(doc){
            ED.editMenu({
                doc: doc,
                selector: '.join-data',
                done: function(elem, focus, e){
                    ED.Module.linkSouce(elem);
                }
            }, 'joinData');
        },
      
        //修改新规范组件
        function(doc){
            ED.editMenu({
                doc: doc,
                selector: '.edit-option',
                done: function(elem, focus, e){
                    $(document).trigger('editContent.FDwidget',[elem]);
                }
            }, 'editOption');
        },
        //编辑源代码
        function(doc){
            var CLASS_NAME_CURRENT = 'current';
            ED.editMenu({
                doc: doc,
                selector: '.edit-define',
                done: function(elem, focus, e){
                    var defineCellEl = elem.find('.'+ED.config.CLASS_DEFINE_CELL);
                    if (!defineCellEl[0]){
                        return;
                    }
                    showEditDefine(defineCellEl, dropInPage.editTextarea);
                    /*if (focus.hasClass(CLASS_NAME_CURRENT)){
                        focus.removeClass(CLASS_NAME_CURRENT);
                        focus.text('编辑源代码');
                        dropInPage._setDefineCodeView(dropInPage.editTextarea);
                    } else {
                        focus.addClass(CLASS_NAME_CURRENT);
                        focus.text('保存源代码');
                        dropInPage._setDefineCodeEdit(defineCellEl, dropInPage.editTextarea);
                    }*/
                }
            }, 'editDefine');
        },
        //排期
        /*function(doc){
            ED.editMenu({
                doc: doc,
                selector: '.js-yunying-waiting',
                bindType: 'delegate',
                done: function(elem, focus, e){
                    var coverEl = focus.closest('.cover-crazy-box-edit');
                    D.box.datasource.YunYing.showWaiting(elem, coverEl);
                }
            }, 'waiting');
        },*/
       
         //查看组件更新更多信息
        function(doc){
            ED.moduleMenu({
                doc: doc,
                selector: '.js-view-update-tip',
                bindType: 'delegate',
                done: function(elem, focus, e){
                	e.preventDefault();
                	e.stopPropagation();
                	var $jsRemark = $('.js-remark',doc),isOpen= $jsRemark.data('status');
                     $jsRemark.toggle('slow');
                     if(isOpen){
                     	 $jsRemark.removeData('status');
                     $('.js-direction',doc).removeClass('up');
                     } else {
                     	 $jsRemark.data('status','open');
                     $('.js-direction',doc).addClass('up');
                     }
                    
                }
            }, 'jsViewUpdateTip');
        },
         //查看组件提示更新信息
        function(doc){
            ED.moduleMenu({
                doc: doc,
                selector: '.js-module-update',
                bindType: 'delegate',
                done: function(elem, focus, e){
                	e.preventDefault();
                	e.stopPropagation();
                	var $self = $(this);
                     focus.find('.module').toggle('slow');
                     
                    
                }
            }, 'jsModuleUpdate');
                ED.moduleMenu({
                doc: doc,
                selector: '.js-tip',
                bindType: 'delegate',
                done: function(elem, focus, e){
                	e.preventDefault();
                	e.stopPropagation();
                }
            }, 'jsTip');
        },
        //公共组件更新
        function(doc){
            ED.moduleMenu({
                doc: doc,
                selector: '.update-trigger',
                bindType: 'delegate',
                done: function(elem, focus, e){
                    e.preventDefault();
                    e.stopPropagation();
                    var updateUserId=elem.data('updateUserId');
                  //组件需要确认提示
                    var htmlCode="<div class=\"dialog-content-text\">请确认是否将公用区块的内容同步到该区块？</div>";
            		D.Msg['confirm']({
        				'title' : '提示信息',
        				'body' : '<div class="header-dialog-content">' + htmlCode + '</div>',
        				'success' : function() {
        					 var eminfo=elem.data('eleminfo'),spm = elem.data('spm');
        	                    $.ajax({
        	                        url:D.domain+'/page/app_command.html',
        	                        data:{
        	                            action:'PublicBlockAction',
        	                            event_submit_do_get_public_block_content:true,
        	                            moduleId:eminfo.id,
        	                            spm:spm
        	                        },
        	                        dataType: 'json'
        	                    }).done(function(o){
        	                        var htmlCode, widget, oDiv,target=elem,elemParent = elem.parent();
        	                        if(o.data &&o.status==='success'){
        	                            htmlCode = o.data.htmlcode, oDiv = $('<div/>');
        	                            D.InsertHtml.init(htmlCode, oDiv, 'html', false);
        	                            widget = oDiv.children().not('link,style,script');
        	                            widget.attr('data-eleminfo', JSON.stringify(o.data.eleminfo));

        	                            htmlCode = oDiv.html();
        	                            var opts = {
        	                                'mod' : 'replace',
        	                                'target' : target,
        	                                'className' : 'cell-module',
        	                                'type' : 'module'
        	                            },
        	                                insertConfig = {
        	                                'html' : htmlCode,
        	                                'container' : target,
        	                                'insertType' : 'replaceWith',
        	                                'doc' : doc,
        	                                'isEdit' : true
        	                            }, isNew = false;
        	                            
        	                            htmlCode = D.ManagePageDate.handleStyle(htmlCode, opts, isNew);
        	                            insertConfig['html'] = htmlCode;
        	                            
        	                            var editInsertSteps = D.InsertHtml.init(insertConfig);
        	                            //记录已经做了修改
        	                            D.BoxTools.setEdited({
        	                                'param' : editInsertSteps,
        	                                'callback' : null
        	                            });
        	                            $(document).trigger('refreshContent',[elemParent]);
        	                        } else {
        	                            D.Msg.error({
        	                                'message' : '公用组件更新失败，请联系旺旺：dcms答疑'
        	                            });
        	                        }
        	                    }).fail(function(){
        	                        D.Msg.error({
        	                            'message' : '公用组件更新失败，请联系旺旺：dcms答疑'
        	                        });
        	                    });
        					
        				}
        			});                    
                   
                }
            }, 'publicUpdate');
        },
        //组件的更新
        function(doc){
            ED.moduleMenu({
                doc: doc,
                selector: '.module-update-trigger',
                bindType: 'delegate',
                done: function(elem, focus, e){
                    e.preventDefault();
                    e.stopPropagation();
                    var updateUserId=elem.data('updateUserId');
                    //组件需要确认提示
                    var htmlCode="<div class=\"dialog-content-text\">因组件功能升级，相关变更的配置项可能需要重新填写，如不确定影响点，请和该组件的制作者"+updateUserId+"确认后再进行组件升级。</div>";
                	
        			D.Msg['confirm']({
        				'title' : '提示信息',
        				'body' : '<div class="header-dialog-content">' + htmlCode + '</div>',
        				'success' : function() {
        					var eminfo=elem.data('eleminfo');
                            var moduleContent=D.BoxTools.handleDynamic(elem.parent().html());
                            $.ajax({
                                url:D.domain+'/page/app_command.html?_input_charset=UTF-8',
                                data:{
                                    action:'PublicBlockAction',
                                    event_submit_do_get_public_block_content:true,
                                    moduleId:eminfo.id,
                                    type:eminfo.type,
                                    moduleContent:moduleContent                            
                                },
                                type:'POST',
                                dataType: 'json'
                            }).done(function(o){
                                var htmlCode, widget, oDiv,target=elem,elemParent = elem.parent();
                                if(o.data &&o.status==='success'){
                                    htmlCode = o.data.htmlcode, oDiv = $('<div/>');
                                    D.InsertHtml.init(htmlCode, oDiv, 'html', false);
                                    widget = oDiv.children().not('link,style,script');
                                    widget.attr('data-eleminfo', JSON.stringify(o.data.eleminfo));

                                    htmlCode = oDiv.html();
                                    var opts = {
                                        'mod' : 'replace',
                                        'target' : target,
                                        'className' : 'cell-module',
                                        'type' : 'module'
                                    },
                                        insertConfig = {
                                        'html' : htmlCode,
                                        'container' : target,
                                        'insertType' : 'replaceWith',
                                        'doc' : doc,
                                        'isEdit' : true
                                    }, isNew = false;
                                    
                                    htmlCode = D.ManagePageDate.handleStyle(htmlCode, opts, isNew);
                                    insertConfig['html'] = htmlCode;
                                    
                                    var editInsertSteps = D.InsertHtml.init(insertConfig);
                                    //记录已经做了修改
                                    D.BoxTools.setEdited({
                                        'param' : editInsertSteps,
                                        'callback' : null
                                    });
                                    $(document).trigger('refreshContent',[elemParent]);
                                } else {
                                    D.Msg.error({
                                        'message' : '组件更新失败，请联系旺旺：dcms答疑'
                                    });
                                }
                            }).fail(function(){
                                D.Msg.error({
                                    'message' : '组件更新失败，请联系旺旺：dcms答疑'
                                });
                            });

        				}
        			});
  
                }
            }, 'moduleUpdate');
        }
    ];
    
    //上移、下移组件或栅格
    function moveUpOrDownActive(elem, active, type, iframeDoc){
        var target = elem[active+'All']('.crazy-box-'+type).eq(0);
        
        if(target[0]) {
            D.HighLight.removeLightClassName(elem, ED.config.CLASS_LAYOUT_HIGHT_LIGHT);
            dropInPage._hideAll();
            
            D.box.editor.operate.moveToReplace(elem, target, type, iframeDoc);
        }
    }
    //判断是否是空module
    function isEmptyModule(moduleEl){
        var contentEl = moduleEl.children('.crazy-box-content')[0] || moduleEl[0];
            //有问题？？？ 添加组件时，空组件不会被更换，只在原组件下面添加,恢复为线上代码 add by pingchun.yupc 2013-08-11
        
        if ($.trim($(contentEl).html())){
            return false;
        } else {
            return true;
        }
    }
    
    function onlyOneRow(moduleEl){
        var rowEls = moduleEl.closest('.crazy-box-row').siblings();
        if (rowEls[0]){
            return false;
        } else {
            return true;
        }
    }
    
    function showEditDefine(defineCellEl, editTextarea){
        var dialogEl = $('.js-dialog'),
            isYunYing = $('#isYunYing');
            dialogEl.css('width', 'auto');
        var html = '<div id="crazy-box-edit-textarea">';
			//需求更改为只有vm类型的自定义控件
            //if(isYunYing=='true') {
				html += '<ul class="fd-hide" >';
			/*} else {
				html += '<ul class="" >';
			}*/

			html += '<li><input type="radio" name="code-type" value="html" id="crazy-box-code-html" />\
                    <label for="crazy-box-code-html">HTML代码</label></li><li>\
                    <input type="radio" name="code-type" value="vm" checked="checked" id="crazy-box-code-vm" />\
                    <label for="crazy-box-code-vm">VM代码</label></li></ul>\
                    <textarea class="crazy-box-textarea" placeholder="请输入相关代码"></textarea></div>';
        
        D.Msg['confirm']({
            title: '编辑自定义组件源码',
            body: html,
            //noclose: true,
            open: function(){
                var textarea = dialogEl.find('#crazy-box-edit-textarea');
                
                dropInPage._setDefineCodeEdit(defineCellEl, textarea);
            },
            success: function(e){
                var textarea = dialogEl.find('#crazy-box-edit-textarea');
                
                dropInPage._setDefineCodeView(textarea, defineCellEl);
                $(document).trigger('refreshContent');
            },
            close: function(){
                dialogEl.removeAttr('style');
            }
        });
    }
    
    ED.initMenuHandler = function(iframeDoc, obj){
        //历史遗留问题需要传此参数
        dropInPage = obj;
        for (var i=0, l=readyFun.length; i<l; i++) {
            //try {
                readyFun[i].call(this, iframeDoc);
            /*} catch(e) {
                if (console.log) {
                    console.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }*/
        }
    }
})(dcms, FE.dcms, FE.dcms.box.editor);
