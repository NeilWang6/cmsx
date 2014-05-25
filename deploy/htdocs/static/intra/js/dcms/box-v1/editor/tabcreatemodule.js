/**
 * @author springyu
 * @userfor 派生CELL功能
 * @date 2011-12-21
 */

;(function($, D) {

    D.loadModule = function(obj) {
        var editModule = new D.DropInPage({
            pageUrl : '/page/box/moduleContent.html',
            dropArea : '#design-container',
            iframeName : 'dcms_box_main_module',
            mainArea : '#main_design_module',
            callback : function(doc) {
                var contentInput = $('#module-content'), content = contentInput.val(), area = $('#design-container', doc), formEl = $('#module-submit-form');
                var $win = $(window), winHeight = $win.height(), winWidth = $win.width();
                if(obj.width) {
                    area.css('width', obj.width);
                }
                //console.log(contentInput);

                // console.log(content);
                if(!!$.trim(content)) {
                    D.InsertHtml.init(content, area, 'html', doc);
                }

                //提交设计的module内容
                $('#dcms_box_module_submit').click(function(e) {
                    e.preventDefault();
                    handleTableNs(area);
                    var newContent = D.sendContent.getContainerHtml(area);
                    // var oldContent = D.editPage.iframeDoc.find('.current-edit-module');
                    // var currentParent = oldContent.parent();
                    if(!!$.trim(newContent)) {
                        D.editPage.replaceElement(newContent, 'current-edit-module');
                        if($('#cell', '#box_choose_level').length > 0) {
                            D.menuTab.removeTab($('#cell', '#box_choose_level'));
                        }
                    } else {
                        alert('Module未添加任何数据，请添加后再保存！');
                    }
                });
                //预览设计的module内容
                $('#dcms_box_module_pre').click(function(e) {
                    e.preventDefault();
                    var newContent = area.html();
                    if(!!$.trim(newContent)) {
                        $('#module-preview-content').val(newContent);
                        if(obj.width) {
                            $('#view-module-width').val(parseInt(obj.width));
                        }
                        $('#module-preview-form').submit();
                    } else {
                        alert('Module未添加任何数据，请添加后再预览！');
                    }
                });
                /* add by hongss on 2012.05.09 for 选择尺寸后 */

                var widthRadioes = $('#dcms_box_modulebar input:radio[name=radio-module-width]');
                var tipChoose = $('.tip-choose-width'), moduleContainer = $('#design-container', doc);
                var inputWidth = $('#module-width'), viewWidth = $('#view-module-width'), iWidth = inputWidth.val();

                showModule(iWidth);

                function showModule(mWidth) {
                    tipChoose.addClass('fd-hide');
                    moduleContainer.removeClass('fd-hide');
                    moduleContainer.width(mWidth);
                    inputWidth.val(mWidth);
                    viewWidth.val(mWidth);
                }

            }
        });
        editModule.insertIframe();
        D.editModule = editModule;
    };
    var handleTableNs = function(area) {
        //处理容器表格样式 没有加组件样式命名空间bug
        var $table = area.find('.cell-table-containter');
        if($table&&$table.length > 0) {
            var parentTemp = $table.parent();
            var preClassName = D.BoxTools.getClassName($table.closest('.crazy-box-module'), /^(cell-module$)|(cell-module-\d+$)/);
            var $style = parentTemp.find('style[data-for=cell-table-containter]');
            var _style = $style.html();
            if(_style.indexOf(preClassName) === -1) {
                var newStyle = _style.replace(new RegExp(".cell-table-containter", "gm"), ' .' + preClassName + ' .cell-table-containter');
                $style.html(newStyle);
            }
        }
    };
})(dcms, FE.dcms);
