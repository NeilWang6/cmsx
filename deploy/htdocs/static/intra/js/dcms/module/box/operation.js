/**
 * @author springyu
 * @userfor 使用JS加载页面设计功能，页面操作功能
 * @date 2011-12-21
 */

;(function($, D) {

    var readyFun = [

    /**
     * box操作功能初始化
     */
    function() {
        /**
         * 编辑模块 按钮
         */
        $('a#pageBackground').bind('click', function(e) {
            e.preventDefault();
            var currObj = $(this), attrTitle = currObj.attr('title');
         
            if(attrTitle === 'background') {
                var docIframe = $('iframe#dcms_box_main').contents(), boxContent = docIframe.find(".cell-page-main");
                D.bottomAttr.addBoxOptions(boxContent, 'css', {
                    "key" : "background",
                    "type" : "background",
                    "name" : "图片"
                });
                D.showAttr(boxContent);

            }

        });
    },

    function() {
        /**
         * 复制
         */
        $('a.bar-a-copy').bind('mousedown', function(e) {
            e.preventDefault();
            var currObj = $(this), currParent = currObj.parent();
            currParent.addClass('mousedown');
        });
        $('a.bar-a-copy').bind('mouseup', function(e) {
            e.preventDefault();
            var currObj = $(this), currParent = currObj.parent();
            currParent.removeClass('mousedown');
        });
    },

    function() {
        /**
         * 删除按钮
         */
        $('a.bar-a-delete').bind('mousedown', function(e) {
            e.preventDefault();
            var currObj = $(this), currParent = currObj.parent();
            currParent.addClass('mousedown');
        });
        $('a.bar-a-delete').bind('mouseup', function(e) {
            e.preventDefault();
            var currObj = $(this), currParent = currObj.parent();
            currParent.removeClass('mousedown');
        });
    }];

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
