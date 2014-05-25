/**
 * @author springyu
 * @userfor ʹ��JS����ҳ����ƹ��ܣ�ҳ���������
 * @date 2011-12-21
 */

;(function($, D) {

    var readyFun = [

    /**
     * box�������ܳ�ʼ��
     */
    function() {
        /**
         * �༭ģ�� ��ť
         */
        $('a#pageBackground').bind('click', function(e) {
            e.preventDefault();
            var currObj = $(this), attrTitle = currObj.attr('title');
         
            if(attrTitle === 'background') {
                var docIframe = $('iframe#dcms_box_main').contents(), boxContent = docIframe.find(".cell-page-main");
                D.bottomAttr.addBoxOptions(boxContent, 'css', {
                    "key" : "background",
                    "type" : "background",
                    "name" : "ͼƬ"
                });
                D.showAttr(boxContent);

            }

        });
    },

    function() {
        /**
         * ����
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
         * ɾ����ť
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
