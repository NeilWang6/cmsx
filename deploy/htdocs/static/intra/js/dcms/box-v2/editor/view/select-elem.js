/**
 * @author shanshan.hongss
 * @userfor 
 * @date  2013.08.05
 * @rely 
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
 */

;(function($, D, ED, undefined) {
    var layoutCover, normalCover, editCover, timeId, lineCover, widthEl,
    readyFun = [
        //选中普通组件
        function(doc, areaSelector){
            ED.selectNormalModule({
                doc: doc,
                areaSelector: areaSelector,
                coverEl: normalCover,
                done: function(moduleEl, e, coverEl){
                	   
                	   var eminfo=moduleEl.data('eleminfo');
                	   //旧页面组件是没有版本的
                	   var versionId=0;
                	   if(eminfo && eminfo.versionId){
                		   versionId= eminfo.versionId;
                	   }             	   
                       if(eminfo && eminfo.type==='module'){
                           $.ajax({
                               url:D.domain+'/page/app_command.html',
                               data:{
                                   action:'PublicBlockAction',
                                   event_submit_do_get_public_block_version:true,
                                   publicBlock:eminfo.id+','+versionId,
                                   //只需要改一个类型
                                   type:'module'
                               },
                               dataType: 'json'
                           }).done(function(o){
                               if(o.data &&o.status==='success'&&!o.data[0].isLatest){
                               	var updateUserId = o.data[0].userId?o.data[0].userId:'',
                               	//
                               	remark = o.data[0].remark?o.data[0].remark:updateUserId+'这家伙太懒，什么都没留下！';
                               
                            	   moduleEl.data('updateUserId',updateUserId);
                            	   
                                   if(coverEl.find('.update').length===0){
                                       var dt=coverEl.find('dt.public');
                                       dt.after('<dd class="icon module-more update module-update js-module-update"><ul class="list-more module"><li ><div class="txt">此组件有更新，是否更新？<a href="#" title="马上更新" class="module-update-trigger">马上更新</a>或<a href="javascript:void(0);" class="js-view-update-tip">查看</a>&nbsp;更新说明<a class="close" href="#">关闭</a><a href="javascript:void(0);" class="default js-direction js-view-update-tip" title="向下"></a></div></li><li class="remark js-remark"><div class="txt tip js-tip">'+remark+'</div></li></ul></dd>');                                     
                                   }
                               }
                               
                           });
                       }
                    //@ FIXME 如果把收藏按钮放到编辑器里面，就需要操作这个cover
 
                    //showLayoutMenu(moduleEl, layoutCover);
                    resetDisabled(coverEl);
                    viewMoveStyle(moduleEl.closest('.crazy-box-row'), moduleEl.closest('.crazy-box-grid').find('.crazy-box-row'), coverEl);
                    
                    spectialModuleMenu(moduleEl, coverEl);
                    D.HighLight.showLight(coverEl, moduleEl);
                },
                cancel: function(moduleEl, e, coverEl){
                    D.HighLight.hideLight(coverEl);
                    //hideLayoutMenu(layoutCover);
                    //
                    if(coverEl.find('.module-update').length > 0){
                    	coverEl.find('.module-update').remove();
                    }                   
                }
            });
        },
        //选中layout
        function(doc, areaSelector){
            ED.selectLayout({
                doc: doc,
                areaSelector: areaSelector,
                coverEl: layoutCover,
                done: function(moduleEl, e, coverEl){
                    showLayoutMenu(moduleEl, layoutCover);
                },
                cancel: function(moduleEl, e, coverEl){
                    hideLayoutMenu(layoutCover);
                }
            });
        },
        //选中公用区块
        function(doc, areaSelector){
            var PUBLIC_COVER_CLASS = 'cover-public-module';
            ED.selectPublicModule({
                doc: doc,
                areaSelector: areaSelector,
                coverEl: normalCover,
                done: function(moduleEl, e, coverEl){
                	
                    coverEl.addClass(PUBLIC_COVER_CLASS);
                    var eminfo=moduleEl.data('eleminfo');
                    if(eminfo.type==='public_block'){
                        $.ajax({
                            url:D.domain+'/page/app_command.html',
                            data:{
                                action:'PublicBlockAction',
                                event_submit_do_get_public_block_version:true,
                                publicBlock:eminfo.id+','+eminfo.versionId,
                                type:'public_block'
                            },
                            dataType: 'json'
                        }).done(function(o){
                            if(o.data &&o.status==='success'&&!o.data[0].isLatest){
                            	moduleEl.data('updateUserId',o.data[0].userId);
                                if(coverEl.find('.update').length===0){
                                    var dt=coverEl.find('dt.public');
                                    dt.after('<dd class="icon more update public-update"><ul class="list-more"><li>此公用区块有更新，是否更新？<a href="#" title="马上更新" class="update-trigger">马上更新</a></li></ul></dd>');
                                    
                                }
                            }
                            
                        });
                    }
                    
                    //showLayoutMenu(moduleEl, layoutCover);
                    resetDisabled(coverEl);
                    viewMoveStyle(moduleEl.closest('.crazy-box-row'), moduleEl.closest('.crazy-box-grid').find('.crazy-box-row'), coverEl);
                    spectialModuleMenu(moduleEl, coverEl);
                    D.HighLight.showLight(coverEl, moduleEl);
                },
                cancel: function(moduleEl, e, coverEl){
                    coverEl.removeClass(PUBLIC_COVER_CLASS);
                    coverEl.find('.public-update').remove();
                    D.HighLight.hideLight(coverEl);
                    //hideLayoutMenu(layoutCover);
                }
            });
        },
        //编辑内容，选择原规范组件
        function(doc, areaSelector){
            var EDITLABEL_COVER_CLASS = 'cover-crazy-box-editlabel-menu';
            ED.selectEditLabel({
                doc: doc,
                areaSelector: areaSelector,
                coverEl: editCover,
                done: function(moduleEl, e, coverEl){
                    coverEl.addClass(EDITLABEL_COVER_CLASS);
                    setDataMenu(moduleEl, coverEl);
                    
                    D.HighLight.showLight(coverEl, moduleEl, { height:0 });
                    //D.HighLight.showLight(lineCover, moduleEl);
                    D.HighLight.addLightClassName(moduleEl, ED.config.CLASS_EDIT_HIGHT_LIGHT);
                },
                cancel: function(moduleEl, e, coverEl){
                    coverEl.removeClass(EDITLABEL_COVER_CLASS);
                    D.HighLight.hideLight(coverEl);
                    //D.HighLight.hideLight(lineCover);
                    D.HighLight.removeLightClassName(moduleEl, ED.config.CLASS_EDIT_HIGHT_LIGHT);
                }
            });
        },
        //编辑内容，自定义组件
        function(doc, areaSelector){
            ED.selectDefineModule({
                doc: doc,
                areaSelector: areaSelector,
                coverEl: editCover,
                done: function(moduleEl, e, coverEl){
                    setDataMenu(moduleEl, coverEl);
                    D.HighLight.showLight(coverEl, moduleEl);
                    coverEl.find('.edit-option').addClass('disabled');
                },
                cancel: function(moduleEl, e, coverEl){
                    D.HighLight.hideLight(coverEl);
                    coverEl.find('.edit-option').removeClass('disabled');
                }
            });
        },
        
        function(doc, areaSelector){
            ED.selectPublicEditModule({
                doc: doc,
                areaSelector: areaSelector,
                coverEl: editCover,
                done: function(moduleEl, e, coverEl){
                    coverEl.addClass('no-edit');
                    D.HighLight.showLight(coverEl, moduleEl);
                },
                cancel: function(moduleEl, e, coverEl){
                    coverEl.removeClass('no-edit');
                    D.HighLight.hideLight(coverEl);
                }
            });
        },
        //编辑内容，新规范组件
        function(doc, areaSelector){
            ED.selectOptionModule({
                doc: doc,
                areaSelector: areaSelector,
                coverEl: editCover,
                done: function(moduleEl, e, coverEl){
                    setDataMenu(moduleEl, coverEl);
                    coverEl.find('.edit-define').addClass('disabled');
                    D.HighLight.showLight(coverEl, moduleEl, { height:0 });
                    D.HighLight.addLightClassName(moduleEl, ED.config.CLASS_EDIT_HIGHT_LIGHT);
                },
                cancel: function(moduleEl, e, coverEl){
                    D.HighLight.hideLight(coverEl);
                    //D.HighLight.hideLight(lineCover);
                    D.HighLight.removeLightClassName(moduleEl, ED.config.CLASS_EDIT_HIGHT_LIGHT);
                    coverEl.find('.edit-define').removeClass('disabled');
                }
            });
            /*ED.selectOptionModule({
                doc: doc,
                areaSelector: areaSelector,
                coverEl: editCover,
                done: function(moduleEl, e, coverEl){
                    setDataMenu(moduleEl, coverEl);
                    D.HighLight.showLight(coverEl, moduleEl);
                    coverEl.find('.edit-define').hide();
                },
                cancel: function(moduleEl, e, coverEl){
                    D.HighLight.hideLight(coverEl);
                    coverEl.find('.edit-define').show();
                }
            });*/
        }
    ];
    
    function setModuleWidth(moduleEl, coverEl){
        var strWidth = moduleEl.width();
        widthEl.text(strWidth);
        widthEl.removeClass('disabled');
    }
    
    function showLayoutMenu(moduleEl, layoutCover){
        var className = ED.config.ELEMENT_CLASS_PREFIX+'layout',
            layoutEl = moduleEl.closest('.'+className);
        
        if (!layoutEl[0]){  //如果layoutEl不存在，说明是顶部通栏
            layoutEl = moduleEl.closest('.crazy-box-banner');
        }
        
        //lineCover.addClass('yellow');
        D.HighLight.showLight(layoutCover, layoutEl, { height:0 }); 
        //D.HighLight.showLight(lineCover, layoutEl);
        D.HighLight.addLightClassName(layoutEl, ED.config.CLASS_LAYOUT_HIGHT_LIGHT);
        resetDisabled(layoutCover);
        viewMoveStyle(layoutEl, layoutEl.parent().find('.crazy-box-layout'), layoutCover, true);
        specialLayoutMenu(layoutEl, layoutCover);
    }
    function hideLayoutMenu(layoutCover){
        var layoutEl = layoutCover.data(ED.config.TRANSPORT_DATA_ELEM);
        
        layoutCover.hide();
        //lineCover.hide();
        
        D.HighLight.removeLightClassName(layoutEl, ED.config.CLASS_LAYOUT_HIGHT_LIGHT);
    }
    
    //设置数据源菜单是否出现
    function setDataMenu(moduleEl, coverEl) {
        var dataMenuEl = coverEl.find('.data-more');

        if (moduleEl.data(ED.config.ATTR_DATA_DATA_SOURCE)){
            dataMenuEl.removeClass('disabled');
            //D.box.datasource.YunYing.checkIsWaiting(moduleEl, coverEl);
        } else {
        	//coverEl.find('.js-yunying-waiting').remove();
            dataMenuEl.addClass('disabled');
        }
    }
    
    function isEmptyModule(moduleEl){
        var contentEl = moduleEl.children('.crazy-box-content')[0] || moduleEl[0];
        
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
    
    function resetDisabled(coverEl){
        coverEl.find('.disabled').removeClass('disabled');
    }
    
    function viewMoveStyle(currentEl, els, operateEl, isLayout){
        $('.movedown', operateEl).removeClass('disabled');
        $('.moveup', operateEl).removeClass('disabled');
        $('.copy', operateEl).removeClass('disabled');
        var index = els.index(currentEl);
        
        if (index===-1){  //可能是顶部通栏，或公用区块编辑
            $('.moveup', operateEl).addClass('disabled');
            $('.movedown', operateEl).addClass('disabled');
            if (currentEl.hasClass('crazy-box-module') && isEmptyModule(currentEl)){
                $('.add', operateEl).addClass('disabled');
            }
            
            if (currentEl.hasClass('crazy-box-banner')){  //如果是顶部通栏
                $('.more', operateEl).addClass('disabled');
            }
            return;
        }
        if (isLayout===true){
            if(els.length === 1) {
                $('.delect', operateEl).addClass('disabled');
            } 
        }
        
        if(index === 0) {
            $('.moveup', operateEl).addClass('disabled');

        }
        
        if(index === els.length - 1) {
            $('.movedown', operateEl).addClass('disabled');
        }
        
    }
    
    function spectialModuleMenu(moduleEl, coverEl){
        if (isEmptyModule(moduleEl)===true){
            if (onlyOneRow(moduleEl)===true){
                coverEl.find('.delect').addClass('disabled');
            }
            coverEl.find('.more').addClass('disabled');
            setModuleWidth(moduleEl, coverEl);
        } else {
            widthEl.addClass('disabled');
        }
    }
    
    //对特殊layout的菜单展示处理
    function specialLayoutMenu(layoutEl, coverEl){
        var isRightFixed = layoutEl.hasClass('layout-fixed-right'), //右浮窗
            isTopFixed = layoutEl.hasClass('layout-fixed-top'),  //上浮窗
            isBottomFixed = layoutEl.hasClass('layout-fixed-bottom'), //下浮窗
            isCross = layoutEl.hasClass('crazy-box-banner');  //顶部通栏或底部通栏
        
        if (isRightFixed || isTopFixed || isBottomFixed || isCross){
            $('.add', coverEl).addClass('disabled');
            $('.more', coverEl).addClass('disabled');
            if (isRightFixed){
                $('.moveup', coverEl).addClass('disabled');
                $('.movedown', coverEl).addClass('disabled');
                $('.title', coverEl).text('右浮窗');
            }
            if (isTopFixed){
                $('.title', coverEl).text('上浮窗');
            }
            if (isBottomFixed){
                $('.title', coverEl).text('底部浮窗');
            }
        }  else {
            $('.title', coverEl).text('布局');
        }
        
        
    }
    
    ED.initSelectModule = function(iframeDoc, areaSelector){
        layoutCover = $(ED.config.SELECTOR_LAYOUT_COVER, iframeDoc);
        normalCover = $(ED.config.SELECTOR_MODULE_COVER, iframeDoc);
        editCover = $(ED.config.SELECTOR_DATAEDIT_COVER, iframeDoc);
        lineCover = $(ED.config.SELECTOR_LINE_COVER, iframeDoc);
        widthEl = $('.width', normalCover);
        
        //如果不是页面编辑，设为公用菜单失效
        if (!$('#pageId').val()){
            normalCover.find('.setpublic').hide();
        }
        //如果是module编辑器中
        var moduleId = $('#module-moduleid').val();
        if (moduleId){
            normalCover.addClass('editor-module');
        }
        
        for (var i=0, l=readyFun.length; i<l; i++) {
            //try {
                readyFun[i].call(this, iframeDoc, areaSelector);
            /*} catch(e) {
                if (console.log) {
                    console.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }*/
        }
    };
    
})(dcms, FE.dcms, FE.dcms.box.editor);
