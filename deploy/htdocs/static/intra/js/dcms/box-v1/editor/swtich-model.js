/**
 * @author hongss
 * @userfor 高级/简单编辑模式切换
 * @date  2012.12.24
 * @rely /dropin-page.js
 * @modify  
 */

(function($, D) {
    var readyFun = [
        function(){
            $('.js-switch').click(function(e){
                e.preventDefault();
                var el = $(this),
                    toModel = el.data('tomodel'),
                    txtEl = el.find('.txt'),
                    iconEl = el.find('.icon-model'),
                    tabCurEl = $('#page');
                
                tabCurEl.data('val', toModel);
                //此事件的定义写在dropin-page.js的 _levelListener 方法中
                tabCurEl.trigger('click'); 
                

                //如果有“组件编辑器”打开着就触发关闭“组件编辑器”事件；
                //此事件的定义写在init-menutab.js 的 beforeClose 回调中
                $('#module .icon-close').trigger('click');
                
                iconEl.toggleClass('simple');
                var iframe = $('#dcms_box_main').contents();
                switch (toModel){
                    case 'module':
                        txtEl.text('简单');
                        el.data('tomodel', 'label');
                        //切换到高级模式下隐藏SELECTAREA的内容
                        iframe.find('.chagenTarget').hide();
                        var select = new D.selectArea();
                        select.closeMao(iframe.find('.chagenTarget'),false);
                        // iframe.find('.position-conrainer').hide();
                        break;
                    case 'label':
                        el.data('tomodel', 'module');
                        txtEl.text('高级');
                        //切换到简单模式下显示A标签
                        //iframe.find('a.map-position-bg').show();

                        break;
                }
            });
        }
    ];
    
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