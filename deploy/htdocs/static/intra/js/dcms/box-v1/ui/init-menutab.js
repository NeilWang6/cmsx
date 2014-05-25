/**
 *
 */
;(function($, D) {
    var menuTab = new D.MenuTab({
        handlerEls : 'li',
        boxEls : '.tab-b',
        handlerCon : '.list-tab-t',
        boxCon : '.tab-b-con',
        closeEls : '.icon-close',
        afterShow : function(handlerEl, boxEl) {
            var val = handlerEl.data('val');
            //console.log(handlerEl);
            if(D.editPage) {
                try {
                    D.editPage._hideAll();
                } catch(e) {
                    //console.log(e);
                }

            }

            if(D.editModule) {
                try {
                    D.editModule._hideAll();
                } catch(e) {
                    //console.log(e);
                }
            }
            if(val === 'module') {
                var status = '';
                if(D.editPage) {
                    status = D.editPage.config.status;
                    switch(status) {
                        case 'edit-module':
                            D.ToolsPanel.addHtmlEModule();
                            break;
                        case 'edit-template':
                            D.ToolsPanel.addHtmlLayoutList();
                            D.toolsPanelLayoutList.init(1);
                            $('#change_background').parent().show();
                            $('#change_template').parent().hide();
                            $('#change_page_grids').parent().show();
                            break;
                        case 'edit-template-layout':
                            D.ToolsPanel.addHtmlLayout();
                            D.toolsPanelLayout();
                            $('#change_background').parent().hide();
                            break;
                        default:
                            D.ToolsPanel.addHtmlPageBackground();
                            $('#change_background').parent().hide();
                            $('#change_page_grids').parent().show();
                            var from = $('#from');
                            if (from.val()==='specialTools'){
                                $('#change_template').parent().show();
                            } else {
                                $('#change_template').parent().hide();
                            }
                            
                            D.editPage && D.BoxAttr.loadPageBackground(D.editPage.iframeDoc);
                            break;
                    }
                    D.editPage.chooseLevel = 'module';
                }
            }

            if(val === 'cell') {
                D.ToolsPanel.addHtmlCell();
                D.box.panel.library.Cell.init(1);
                if(D.editModule) {
                    D.editModule.chooseLevel = 'cell';
                }

            }
            if(val === 'label') {
                D.ToolsPanel.addHtmlLabel();
            }
            D.bottomAttr.resizeWindow();
            $('.dcms-save-success').hide();
        },
        //关闭前触发
        beforeClose : function(handlerEl) {
            closeTip(handlerEl);

        },
        //关闭后触发
        afterClose : function(handlerEl) {
            if(D.editPage) {
                D.editPage._hideAll();
            }
            if(D.editModule) {
                D.editModule._hideAll();

            }
            if(handlerEl.attr('id') === 'module') {
                this.removeTab(handlerEl.parent().find('#cell'));
            }

        }
    });
    var closeTip = function(handlerEl, fn) {

        var $dialog = $('.js-dialog'), $tip = $('section', $dialog);
        $tip.empty();
        if(handlerEl.attr('id') === 'module') {
            $tip.html('<div style="margin:0 auto;width:300px;height:100px;line-height:100px;">你即将离开组件编辑器，请确认是否保存当前操作？</div>');
        }
        if(handlerEl.attr('id') === 'cell') {
            $tip.html('<div style="margin:0 auto;width:300px;height:100px;line-height:100px;">你即将离开控件编辑器，请确认是否保存当前操作？</div>');
        }
        $.use('ui-dialog', function() {
            //如有多个浮出层，请另加ID或class
            var dialog = $dialog.dialog({
                center : true,
                fixed : true
            });
            var $close = $('.btn-cancel,.close', '.js-dialog'), $submit = $('.btn-submit', '.js-dialog');
            $submit.show();
            $('.btn-cancel', '.js-dialog').show();
            $close.unbind();
            $submit.unbind();
            $close.bind('click', function() {
                if(handlerEl.attr('id') === 'module') {
                    if($('#cell', '#box_choose_level').length > 0) {
                        menuTab.removeTab(handlerEl.parent().find('#cell'));
                    }
                }
                menuTab.removeTab(handlerEl);
                dialog.dialog('close');
                //$(this).unbind('click');
            });
            $submit.bind('click', function(event) {
                event.preventDefault();
                if(handlerEl.attr('id') === 'module') {
                    var doc = $('#dcms_box_main_module')[0].contentDocument, area = $('#design-container', doc);
                    var newContent = D.sendContent.getContainerHtml(area);
                    if(!!$.trim(newContent)) {
                        D.editPage && D.editPage.replaceElement.call(D.editPage, newContent, 'current-edit-module', handlerEl);
                        if($('#cell', '#box_choose_level').length > 0) {
                            menuTab.removeTab($('#cell', '#box_choose_level'));
                        }
                    } else {
                        alert('Module未添加任何数据，请添加后再保存！');
                    }
                }

                if(handlerEl.attr('id') === 'cell') {
                    var doc = $('#dcms_box_cell_main')[0].contentDocument, area = $('#content', doc);
                    var newContent = area.html();
                    if(!!$.trim(newContent)) {
                        newContent = $(newContent).html();
                        D.editModule.replaceElement(newContent, 'current-edit-module', handlerEl);

                    }
                }
                //menuTab.removeTab(handlerEl);
                dialog.dialog('close');
                //$(this).unbind('click');

            });
        });
    }
    D.menuTab = menuTab;
})(dcms, FE.dcms);
