/**
 * @author springyu
 * @userfor 派生CELL功能
 * @date 2011-12-21
 */

;(function($, D) {
    /**
     * iframe margin-top 高度
     */
    var IFRAME_MARGIN_TOP = 40, formValid, attrDialog = $('#cell_derive_attr');

    var readyFun = [

    /**
     * 初始化CELL属性设置
     */
    function() {
        $('#dcms_box_grid_moduleattribute').bind('click', function(e) {
            e.preventDefault();
            showModuleAttr(attrDialog);
            /*$.use('ui-dialog', function() {
                attrDialog.dialog({
                    modal : false,
                    shim : true,
                    draggable : true,
                    center : true
                });
            });*/
        });
        
        $('#cell_cancel', attrDialog).bind('click', function() {
            //attrDialog.dialog('close');
            hideModuleAttr(attrDialog);
            /*
             $('#module-name').val('');
             $('#module-tags').val('');
             */
        });
        $('#cell_ok', attrDialog).bind('click', function(e) {
            if(formValid.valid() === true) {
                //attrDialog.dialog('close');
                hideModuleAttr(attrDialog);
            }
        });

        $('#module-catalog').bind('click', function(e) {
            e.preventDefault();
            var self = $(this), tree = $('div.box-create-module-tree');
            tree.show();
            tree.offset({
                'top' : self.offset().top + 24,
                'left' : self.offset().left
            });
            $('input[type=checkbox]', 'div.dtree').each(function(index, obj) {
                var catalogId = $('#catalogId').val(), self = $(obj);

                if(catalogId && parseInt(catalogId) === self.data('code')) {
                    obj.checked = true;
                    return;
                }
            });
            //console.log(self.offset());
        });
        $('a.close-btn', 'div.box-create-module-tree').bind('click', function(e) {
            $('div.box-create-module-tree').hide();
        });
    },

    /**
     * add by hongss on 2012.05.09 for 左侧元素库tab切换默认到“选择尺寸”
     */
    function() {
        $('#handle-choose-width').trigger('click');
    },

    //** load catalog

    function() {
        D.bottomAttr.loadModuleCatalog({
            'type' : 'module'
        }, function(value) {
            var _data;
            if(value && value.status === 'success') {
                _data = value.data;
                if(_data) {
                    //console.log(_data);
                    d = new D.dTree('d', 'leaf');
                    d.add(0, -1, '');
                    for(var i = 0, len = _data.length; i < len; i++) {
                        var obj = _data[i];
                        d.add(obj.code, obj.parentCode, obj.name);
                    }
                    $('#tree_body').html(d.toString());
                    d.openAll();
                }
            }
        });
    },

    function() {
        // 色系

        var moduletag, pageColor = $('span.page-color', '#module-submit-form');
        moduletag = pageColor.data('moduletag');
        pageColor.children('span').each(function(index, obj) {
            var _self = $(obj);
            if(_self.hasClass('selected')) {
                _self.removeClass('selected');
                //break;
            }
            if(moduletag && moduletag.indexOf(_self.data('color')) !== -1) {
                _self.addClass('selected');
                $('#hidden-module-color').val(_self.data('color'));
                $('#hidden-module-color').trigger('blur');
            }
        });
        $('span', pageColor).bind('click', function(e) {
            var _self = $(this), selfParent = _self.parent();
            selfParent.children().each(function(index, obj) {
                var $obj = $(obj);
                if($obj.hasClass('selected')) {
                    $obj.removeClass('selected');
                    //break;
                }

            });
            if(!_self.hasClass('selected')) {
                _self.addClass('selected');
                $('#hidden-module-color').val(_self.data('color'));
                $('#hidden-module-color').trigger('blur');
                //break;
            }
        });
    },

    /**
     * add by hongss on 2012.02.22 for 属性设置 表单验证
     */
    function() {
        var formEl = $('#module-submit-form'), els = formEl.find('[data-valid]');
        formValid = new FE.ui.Valid(els, {
            onValid : function(res, o) {
                var tip = $(this).nextAll('.dcms-validator-tip'), msg;
                if(tip.length > 1) {
                    for(var i = 1, l = tip.length; i < l; i++) {
                        tip.eq(i).remove();
                    }
                }
                if(res === 'pass') {
                    tip.removeClass('dcms-validator-error');
                } else {
                    switch (res) {
                        case 'required':
                            //dialog显示
                            msg = '请填写' + o.key;
                            break;
                        case 'float':
                            msg = '宽度必须是数字（整数表示像素，小数表示百分表）';
                            break;
                        default:
                            msg = '请填写正确的内容';
                            break;
                    }
                    tip.text(msg);
                    tip.addClass('dcms-validator-error');

                }
            }
        });

        formEl.submit(function() {
            var result = formValid.valid();
            if(result === false) {
                $.use('ui-dialog', function() {
                    attrDialog.dialog({
                        modal : false,
                        shim : true,
                        draggable : true,
                        center : true
                    });
                });
            }
            return result;
        });
    },

    /**
     * add by hongss on 2012.02.14 for 拖拽元件、保存设计的module内容
     * modify by hongss on 2012.02.22 for 保存/预览设计后的module内容
     * modify by hongss on 2012.05.09 for 选择尺寸后
     */
    function() {
        D.DropInPage.init({
            pageUrl : '/page/box/moduleContent.html',
            dropArea : '#design-container',
            callback : function(doc) {
                var contentInput = $('#module-content'), content = contentInput.val(), area = $('#design-container', doc), formEl = $('#module-submit-form');
                if(!!$.trim(content)) {
                    D.InsertHtml.init(content, area, 'html', doc);
                }

                //提交设计的module内容
                $('#dcms_box_grid_submit').click(function(e) {
                    e.preventDefault();
                    var newContent = D.sendContent.getContainerHtml(area);
                    if(!!$.trim(newContent)) {
                        contentInput.val(newContent);
                        formEl.submit();
                    } else {
                        alert('Module未添加任何数据，请添加后再保存！');
                    }
                });
                //预览设计的module内容
                $('#dcms_box_grid_pre').click(function(e) {
                    e.preventDefault();
                    var newContent = area.html();
                    if(!!$.trim(newContent)) {
                        $('#module-preview-content').val(newContent);

                        $('#module-preview-form').submit();
                    } else {
                        alert('Module未添加任何数据，请添加后再预览！');
                    }
                });
                /* add by hongss on 2012.05.09 for 选择尺寸后 */

                var widthRadioes = $('#dcms_box_modulebar input:radio[name=radio-module-width]'), tipChoose = $('.tip-choose-width'), moduleContainer = $('#design-container', doc), inputWidth = $('#module-width'), viewWidth = $('#view-module-width'), iWidth = inputWidth.val();

                //判断是否已经有radio被选中
                if(iWidth) {
                    widthRadioes.each(function(i, radioEl) {
                        radioEl = $(radioEl);
                        if(parseInt(iWidth) === parseInt(radioEl.val())) {
                            radioEl.attr('checked', 'checked');
                            showModule(iWidth);
                        }
                    });
                }

                //注册radio选中事件
                widthRadioes.live('change', function(e) {
                    var mWidth = $(this).val();
                    showModule(mWidth);
                });
                function showModule(mWidth) {
                    tipChoose.addClass('fd-hide');
                    moduleContainer.removeClass('fd-hide');
                    moduleContainer.width(mWidth);
                    inputWidth.val(mWidth);
                    viewWidth.val(mWidth);
                }
                
                // add by hongss on 2012.09.04 for 查看源码
                var dialog = $('#cell-view-code');
                $('#dcms-box-view-code').click(function(e){
                    e.preventDefault();
                    showModuleAttr(dialog);
                    var code = D.sendContent.getContainerHtml(area);
                    $('#cell-view-code .code-container').text(D.ManagePageDate.getModuleHtml(code));
                });
                
                $(' .close').click(function(e){
                    e.preventDefault();
                    hideModuleAttr(dialog);
                });

            }
        });
    },
    /**
     * 点击自动适应
     */
    function() {
        $("input[name='autoFit']").click(function(e) {
            e.stopPropagation();
            var checked = $(this)[0].checked;
            $('.width').css('display', checked ? 'none' : '');
            //checked && $('.width').val('');
        });
    },
    function() {
        $('input[type=checkbox]', 'div.dtree').bind('click', function(e) {
            var self = $(this), chk = self[0].checked;

            $('input[type=checkbox]', 'div.dtree').each(function(index, obj) {
                obj.checked = false;
                //console.log(99);

            });
            if(chk === false) {
                $('#showCatalogName').html('');
                $('#catalogId').val('');
                $('#catalogId').trigger('blur');
            } else {
                self[0].checked = true;
                var arr = findParentCatalog(self.parent());
                var showName = '';
                if(arr) {
                    var len = arr.length - 1;
                    for(var i = len; i >= 0; i--) {
                        if(i == 0) {
                            showName += arr[i];
                        } else {
                            showName += arr[i] + ">"
                        }

                    }
                }
                $('#showCatalogName').html(showName);
                $('#catalogId').val(self.data('code'));
                $('#catalogId').trigger('blur');
                $('div.box-create-module-tree').hide();
            }

            });

    }];
    var findParentCatalog = function(target, arr) {
        var arr = arr || [], name, checkbox;
        if(target && target.length > 0 && target.hasClass('dTreeNode')) {
            name = $('a.elem', target).data('name');
            checkbox = $('.checkbox', target);
            if(name) {
                if(checkbox[0]) {
                    checkbox[0].checked = true;
                }
                arr.push(name);
            }

        }
        if(target.parent().hasClass('dtree')) {
            return arr;
        }
        return arguments.callee(target.parent().prev(), arr);
    };
    
    function showModuleAttr(dialog){
        dialog.show();
        var clientWidth = $(window).width(),
            clientHeight = $(window).height(),
            elWidth = dialog.width(),
            elHeight = dialog.height(),
            elLeft = (clientWidth-elWidth)/2,
            elTop = (clientHeight-elHeight)/2;
        elTop = (elTop>0) ? elTop : 0;
        elLeft = (elLeft>0) ? elLeft : 0;
        dialog.offset({'top':elTop, 'left':elLeft});
    }
    function hideModuleAttr(dialog){
        dialog.hide();
    }
    
    $(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
})(dcms, FE.dcms);
