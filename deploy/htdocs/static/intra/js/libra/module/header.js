/**
 * @author lusheng.linls
 * @usefor 运营工具平台 —— 公共头部
 * @date   2013.3.19
 */

;(function($, T) {
    var readyFun = [
    /**
     * 宽度计算
     */
    function() {
        var win = $(window);
        var leftMenu = $('.libra-left-menu');
        var content=$('.libra-content');
        var header=$('.libra-page-header');
        win.resize(function(){
            win.trigger('libra-event-menu-recount');
        });
        win.scroll(function(){
            win.trigger('libra-event-menu-recount');
        });
        win.delegate(null,'libra-event-menu-recount',function(){
            leftMenu.css('height','auto');//菜单重新计算自身的高度
            leftMenu.css('height', Math.max(leftMenu.outerHeight(),content.outerHeight(),document.documentElement.clientHeight-header.outerHeight()));
        });
        win.trigger('libra-event-menu-recount');
    },

    //菜单整体
    function() {
        var _self = this;
        //左侧菜单按钮点击切换
        $('#libra-tools-panel').on('click','dt',function(){
            
            if( $(this).find('i.libra-icon-close ').hasClass('libra-icon-open') ) {
                $('#libra-tools-panel').find('i.libra-icon-close ').removeClass('libra-icon-open');
                $(this).find('i.libra-icon-close ').removeClass('libra-icon-open');
            } else {
                $('#libra-tools-panel').find('i.libra-icon-close ').removeClass('libra-icon-open');
                $(this).find('i.libra-icon-close ').addClass('libra-icon-open');
            }        
        })
        //菜单展开
        var domLeftTitles = $('.libra-item dt')
        domLeftTitles.click(function(e){
            if( $(this).nextUntil('dt').is(':hidden') ) {
                $('.libra-item dd').hide(200);
                $(this).nextUntil('dt').slideToggle(200);
             }else {
                $('.libra-item dd').hide(200);
             }
        })

        //移动动画
        var topLeftButton = $('#libra-tools-panel').find('.libra-js-menu-ctrl'),
        contentBody = $('.libra-content');

        //缩进
        topLeftButton.click(function(){
            var formEq = $('.tab-b li').index($('.tab-b .current'))
            if( $(this).hasClass('toright') ) {
                $(this).removeClass('toright')
                $('.libra-tools-panel').css({'margin-left':'0px','transition':'margin-left 500ms'});
                // contentBody.removeClass('move-moveend--182').addClass('move-moveend-0');
                contentBody.css({'padding-left':'215px','transition':'padding-left 500ms'});
                //数据分类页的缩进
                if( $('#search-series')[0] ) {
                    var searchSeries = $('#search-series').find('.fix-bottom-total').css({'left':'210px','transition':'left 500ms'})
                }
                //专场 管理内的分页缩进
                if($('#fixBottomPageList')[0]) {
                    var bottompageleft = $('#fixBottomPageList').offset().left - 182;
                    $('#fixBottomPageList').css({'margin-left': (parseInt($('#fixBottomPageList').offset().left) + 182) + 'px','transition':'margin-left 500ms'});
                }
                if( formEq == 1 || formEq == 0 || formEq == 2 || formEq == 3) {
                    $('#fixBottomPageList').width(_self.saveLeft)
                }
            }else{
                $(this).addClass('toright');    
                $('.libra-tools-panel').css({'margin-left':'-182px','transition':'margin-left 500ms'});
                // contentBody.removeClass('move-moveend-0').addClass('move-moveend--182'); 
                contentBody.css({'padding-left':'32px','transition':'padding-left 500ms'});
                if($('#fixBottomPageList')[0]) {
                    var bottompageleft = $('#fixBottomPageList').offset().left - 182;
                    $('#fixBottomPageList').css({'margin-left': (parseInt($('#fixBottomPageList').offset().left) - 182) + 'px','transition':'margin-left 500ms'});
                }
                //数据分类页的缩进
                if( $('#search-series')[0] ) {
                    $('#search-series').find('.fix-bottom-total').css({'left':'26px','transition':'left 500ms'})
                }
                //专场 管理内的分页缩进
                if( formEq == 1 || formEq == 0 ) {
                    var maxLeft = 0;               
                    $('.detail').eq(formEq).find('div.sample').each(function(){
                        if($(this).offset().left > maxLeft) {
                            maxLeft = $(this).offset().left
                        }
                    })
                    _self.saveLeft = $('#fixBottomPageList').width();
                    if(maxLeft >= 711){maxLeft = 711}
                    if(maxLeft <= 457){maxLeft = 457}
                    $('#fixBottomPageList').width(maxLeft + 288)                   
                }else if( formEq == 2 || formEq == 3 ) {
                    _self.saveLeft = $('#fixBottomPageList').width();
                    var val = $('#fixBottomPageList').width() + 180;
                    if( val >= 999 ) {val = 999}
                    if(  val <= 809) {val = 809}
                    $('#fixBottomPageList').width('999px')      
                }
            }

        });
    },
    //头部高亮
    function(){
        var htmlHref = window.location.pathname.split('.')[0].split('/')
        var showTools =['series','topic_config','search','audit_status','ct_name_list_manage','suppliers','audit_member','audit_offer'];
        var showTag = ['add_offer_tags','add_member_tags']
        htmlHref = htmlHref[htmlHref.length - 1];
        $(showTools).each(function(){
            if( this == htmlHref ) {
                $('.libra-navgation .menu-layout').addClass('nowapply')
                return;
            }
        })

        $(showTag).each(function(){
            if( this == htmlHref ) {
                $('.libra-navgation .menu-template').addClass('nowapply')
                return;                
            }
        })
    },
    //公告
    function(){
        FE.sys.Dcms.Drive.request($('.libra-announcement-info'), {
            success: function(){},
            error: function(){}
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
