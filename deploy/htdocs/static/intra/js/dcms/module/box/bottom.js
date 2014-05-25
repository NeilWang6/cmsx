/**
 * @author springyu
 * @userfor 底部属性js
 * @date 2011-12-21
 */
;(function($, D) {

    /**
     * iframe margin-top 高度
     */
    var IFRAME_MARGIN_TOP = 40;
    /**
     * 属性面板高度
     */
    var ATTRIBUTE_HEIGHT = 152;
    var CURRENT = 'current';
    var BOPTIONS = 'boptions';
    var readyFun = [
    /**
     * 初始化帮定事件
     */
    function() {
        $('li.toolbar a.description').live('click', function(e) {
            e.preventDefault();
            var self = $(this), _sVal = self.data(BOPTIONS), selfParent = self.parentsUntil('.toolbar-comm');
            D.bottomAttr.clearToolBarCheck();
            self.parent().addClass(CURRENT);

            D.bottomAttr.hideAttr();
           
             
            $('#' + _sVal).show();
            
            
            //end;
            // console.log(_sVal);
             D.bottomAttr.onlyCurrentValid(_sVal);
      
            //D.bottomAttr.showDialog(self);
			if (self.attr('id')==='datasource'){
				var _dsModuleId;
			
		 $('div.dsmodule-attr').each(function(index, obj) {
                var self = $(obj), $html;
                var extra = self.data(D.bottomAttr.CONSTANTS['extra']);
                if(extra && extra.obj) {
                    $html = $(extra.obj);
				_dsModuleId=$html.attr('data-dsmoduleid');
                }
            });
				D.bottomAttr.initDsModule(_dsModuleId);

            }
        });
    },

    function() {
        $('a.close-btn', 'div.dialog').click(function() {
            D.bottomAttr.closeDialog();
        });
    },

    /**
     * 对话框拖动
     */
    function() {
        $.use('ui-draggable', function() {
            var con = 'document';
            if($.browser.mozilla) {
                con = 'html';
            }
            $('div.dialog').draggable({
                handle : '.nav',
                containment : con
            });
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
