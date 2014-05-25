/**
 * @author lusheng.linls
 * @usefor 运营工具平台 —— 公共菜单
 * @date   2013.1.28
 */

;
(function($, T) {
    var readyFun = [

    //一级菜单


    function() {
        var menuSwitching = false;
        $('.left-menu .item').delegate('dt', 'click', function() {
            if(menuSwitching) {
                return;
            }
            menuSwitching = true;
            var el = $(this);
            el.find('i').toggleClass('icon-open');
            el.nextUntil('dt').toggle(0,function() {
                menuSwitching = false;
            });
        });
    },

    //菜单整体


    function() {
        var menuSwitching = false;
        var toolsPanel = $('#tools_panel');
        var libraContent = $('.libra-content');
        $('.js-menu-ctrl').bind('click', function() {
            var el=$(this);
            if(menuSwitching) {
                return;
            }
            menuSwitching = true;
            var left=toolsPanel.css('margin-left');
            left=left.replace('px','');
            if(!$.isNumeric(left)){
                left='0';
            }
            left=parseInt(left);
            var menuLeft=0;
            var contentLeft=210;
            if(left>=0){
                menuLeft=-185;
                contentLeft=25;
            }
            toolsPanel.animate({
                'margin-left': menuLeft
            },200,function(){
                el.siblings().toggle();
                el.toggleClass('icon-dorpright');
                menuSwitching = false;
            });
            libraContent.animate({
                'padding-left': contentLeft
            },200);
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
})(jQuery, FE.tools);