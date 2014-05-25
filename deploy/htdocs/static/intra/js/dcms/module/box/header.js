/**
 * @author springyu
 * @userfor 盒子功能头部JS
 * @date 2011-12-21
 */

;(function($, D) {
    var BOX_WIDTH = 952;
    var readyFun = [
    function() {
        var clearTime;
        /**
         * 显示我的草稿箱和收藏夹
         */
        $('#dcms_box_my_page').bind('mouseover', function(e) {
            e.preventDefault();
            var ww = ($(window).width() - BOX_WIDTH) / 2.0, mypageTip = $('#dcms_box_mypage_tip');
            mypageTip.css('right', ww + 104);
            //mypageTip.show(300);
        });
        $('#dcms_box_online_customer').bind('mouseover', function(e) {
            e.preventDefault();
            var ww = ($(window).width() - BOX_WIDTH) / 2.0, mypageTip = $('#dcms_box_customer_list');
            mypageTip.css('right', ww + 10);
            //mypageTip.show(300);
        });
        $('dd', '#dcms_box_customer_list').bind('mouseout', function(e) {
            var self = $(this);
            self.removeClass('current');
        });
        $('dd', '#dcms_box_customer_list').bind('mouseover', function(e) {
            var self = $(this);
            self.addClass('current');
        });
        /**
         * 显示组件库菜单
         */
        $('#dcms_box_module_bank').bind('mouseover', function(e) {
            e.preventDefault();
            var ww = ($(window).width() - BOX_WIDTH) / 2.0, moduleMenu = $('#dcms_box_module_menu');
            moduleMenu.css('right', ww + 188);
            //moduleMenu.show(300);
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
