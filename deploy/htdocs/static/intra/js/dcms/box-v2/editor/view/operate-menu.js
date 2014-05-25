/**
 * @author shanshan.hongss
 * @userfor �����˵�
 * @date  2013.08.06
 * @rely 
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */

;(function($, D, ED, undefined) {
    var dropInPage,
        DATA_IS_FAVORIT = 'isfavorit',
        readyFun = [
        /*����˵�*/
        //����
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
        //�������
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
        //������
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
        //ɾ��
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
        //����Ϊ��������
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
        //����
        function(doc){
            ED.moduleMenu({
                doc: doc,
                selector: '.moveup',
                done: function(elem, focus, e){
                    //�ƶ�module��ʱ�������ƶ�����row
                    elem = elem.closest('.crazy-box-row');
                    moveUpOrDownActive(elem, 'prev', 'row', doc);
                }
            }, 'moveup');
        },
        //����
        function(doc){
            ED.moduleMenu({
                doc: doc,
                selector: '.movedown',
                done: function(elem, focus, e){
                    //�ƶ�module��ʱ�������ƶ�����row
                    elem = elem.closest('.crazy-box-row');
                    moveUpOrDownActive(elem, 'next', 'row', doc);
                }
            }, 'movedown');
        },
        //��������Ĳ鿴
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
        //�ж��Ƿ��Ѿ��ղ�
        function(){
            ED.moduleMenu({
                doc: doc,
                selector: '.more',
                eventType: 'mouseenter',
                done: function(elem, focus, e){
                    var isFavorit = elem.data(DATA_IS_FAVORIT),  //true��ʾ���ղأ� false��ʾδ�ղ�
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
                    //favoritEl.data('text', 'ȡ���ղ�').text('ȡ���ղ�');
                } else {
                    favoritEl.removeClass('on-made').addClass('off-made');
                    //favoritEl.data('text', '�ղظ����').text('�ղظ����');
                }
            }
        },
        //�ղ�
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
        //ȡ���ղ�
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
        /*���ֲ˵�*/
        //����
        function(doc){
            ED.layoutMenu({
                doc: doc,
                selector: '.copy',
                done: function(elem, focus, e){
                    ED.operate.copyToNext(elem, doc);
                }
            }, 'copy');
        },
        //ɾ��
        function(doc){
            ED.layoutMenu({
                doc: doc,
                selector: '.delect',
                done: function(elem, focus, e){
                    dropInPage._deleteFn(elem);
                }
            }, 'delect');
        },
        //����
        function(doc){
            ED.layoutMenu({
                doc: doc,
                selector: '.moveup',
                done: function(elem, focus, e){
                    moveUpOrDownActive(elem, 'prev', 'layout', doc);
                }
            }, 'moveup');
        },
        //����
        function(doc){
            ED.layoutMenu({
                doc: doc,
                selector: '.movedown',
                done: function(elem, focus, e){
                    moveUpOrDownActive(elem, 'next', 'layout', doc);
                }
            }, 'movedown');
        },
        //���
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
        /*�༭���ݲ˵�*/
        //�����������
        function(doc){
            ED.editMenu({
                doc: doc,
                selector: '.attr',
                done: function(elem, focus, e){
                    $(document).trigger('box.panel.attribute.attr_handle_event', [elem, 'module']);
                }
            }, 'attr');
        },
        //�������
        function(doc){
            ED.editMenu({
                doc: doc,
                selector: '.join-data',
                done: function(elem, focus, e){
                    ED.Module.linkSouce(elem);
                }
            }, 'joinData');
        },
      
        //�޸��¹淶���
        function(doc){
            ED.editMenu({
                doc: doc,
                selector: '.edit-option',
                done: function(elem, focus, e){
                    $(document).trigger('editContent.FDwidget',[elem]);
                }
            }, 'editOption');
        },
        //�༭Դ����
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
                        focus.text('�༭Դ����');
                        dropInPage._setDefineCodeView(dropInPage.editTextarea);
                    } else {
                        focus.addClass(CLASS_NAME_CURRENT);
                        focus.text('����Դ����');
                        dropInPage._setDefineCodeEdit(defineCellEl, dropInPage.editTextarea);
                    }*/
                }
            }, 'editDefine');
        },
        //����
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
       
         //�鿴������¸�����Ϣ
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
         //�鿴�����ʾ������Ϣ
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
        //�����������
        function(doc){
            ED.moduleMenu({
                doc: doc,
                selector: '.update-trigger',
                bindType: 'delegate',
                done: function(elem, focus, e){
                    e.preventDefault();
                    e.stopPropagation();
                    var updateUserId=elem.data('updateUserId');
                  //�����Ҫȷ����ʾ
                    var htmlCode="<div class=\"dialog-content-text\">��ȷ���Ƿ񽫹������������ͬ���������飿</div>";
            		D.Msg['confirm']({
        				'title' : '��ʾ��Ϣ',
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
        	                            //��¼�Ѿ������޸�
        	                            D.BoxTools.setEdited({
        	                                'param' : editInsertSteps,
        	                                'callback' : null
        	                            });
        	                            $(document).trigger('refreshContent',[elemParent]);
        	                        } else {
        	                            D.Msg.error({
        	                                'message' : '�����������ʧ�ܣ�����ϵ������dcms����'
        	                            });
        	                        }
        	                    }).fail(function(){
        	                        D.Msg.error({
        	                            'message' : '�����������ʧ�ܣ�����ϵ������dcms����'
        	                        });
        	                    });
        					
        				}
        			});                    
                   
                }
            }, 'publicUpdate');
        },
        //����ĸ���
        function(doc){
            ED.moduleMenu({
                doc: doc,
                selector: '.module-update-trigger',
                bindType: 'delegate',
                done: function(elem, focus, e){
                    e.preventDefault();
                    e.stopPropagation();
                    var updateUserId=elem.data('updateUserId');
                    //�����Ҫȷ����ʾ
                    var htmlCode="<div class=\"dialog-content-text\">�����������������ر���������������Ҫ������д���粻ȷ��Ӱ��㣬��͸������������"+updateUserId+"ȷ�Ϻ��ٽ������������</div>";
                	
        			D.Msg['confirm']({
        				'title' : '��ʾ��Ϣ',
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
                                    //��¼�Ѿ������޸�
                                    D.BoxTools.setEdited({
                                        'param' : editInsertSteps,
                                        'callback' : null
                                    });
                                    $(document).trigger('refreshContent',[elemParent]);
                                } else {
                                    D.Msg.error({
                                        'message' : '�������ʧ�ܣ�����ϵ������dcms����'
                                    });
                                }
                            }).fail(function(){
                                D.Msg.error({
                                    'message' : '�������ʧ�ܣ�����ϵ������dcms����'
                                });
                            });

        				}
        			});
  
                }
            }, 'moduleUpdate');
        }
    ];
    
    //���ơ����������դ��
    function moveUpOrDownActive(elem, active, type, iframeDoc){
        var target = elem[active+'All']('.crazy-box-'+type).eq(0);
        
        if(target[0]) {
            D.HighLight.removeLightClassName(elem, ED.config.CLASS_LAYOUT_HIGHT_LIGHT);
            dropInPage._hideAll();
            
            D.box.editor.operate.moveToReplace(elem, target, type, iframeDoc);
        }
    }
    //�ж��Ƿ��ǿ�module
    function isEmptyModule(moduleEl){
        var contentEl = moduleEl.children('.crazy-box-content')[0] || moduleEl[0];
            //�����⣿���� ������ʱ����������ᱻ������ֻ��ԭ����������,�ָ�Ϊ���ϴ��� add by pingchun.yupc 2013-08-11
        
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
			//�������Ϊֻ��vm���͵��Զ���ؼ�
            //if(isYunYing=='true') {
				html += '<ul class="fd-hide" >';
			/*} else {
				html += '<ul class="" >';
			}*/

			html += '<li><input type="radio" name="code-type" value="html" id="crazy-box-code-html" />\
                    <label for="crazy-box-code-html">HTML����</label></li><li>\
                    <input type="radio" name="code-type" value="vm" checked="checked" id="crazy-box-code-vm" />\
                    <label for="crazy-box-code-vm">VM����</label></li></ul>\
                    <textarea class="crazy-box-textarea" placeholder="��������ش���"></textarea></div>';
        
        D.Msg['confirm']({
            title: '�༭�Զ������Դ��',
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
        //��ʷ����������Ҫ���˲���
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
