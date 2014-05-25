/**
 * @author shanshan.hongss
 * @usefor 运营工具平台 —— 公共头部
 * @date   2012.10.18
 */

define(['jquery', 'util/cookie/1.0'], function($, Cookie){
    $(function(){
        
        var extra = Cookie.get('_app_extra');
        if (extra && extra.indexOf('Android')!==-1){
            $('.doc-header').addClass('android');
            $('body').addClass('android');
        }
        //菜单显示/隐藏
        var actionEl = $('.doc-header .more-action');
        actionEl.on('touchend', function(e){
            var el = $(this);
            el.toggleClass('show-menu');
        });
        
        $(document).on('touchend', function(e){
            var targetEl = $(e.target);
            if (!targetEl.closest('.more-action')[0]){
                actionEl.removeClass('show-menu');
            }
        });
        
        var actionUl = $('.doc-header .actions');
        //刷新
        $('.refresh', actionUl).on('touchstart', function(e){
            e.preventDefault();
            location.reload();
        });
        
        //创建快捷键
        $('.add-shortcut', actionUl).on('touchstart', function(e){
            e.preventDefault();
            window.alibaba && window.alibaba.WVShortCut &&  window.alibaba.WVShortCut.shortCut();
        });
        
        //退出
        $('.exit-app', actionUl).on('touchstart', function(e){
            e.preventDefault();
            window.alibaba && window.alibaba.call("UINavigation","exitsToApp");
        });
        
        //返回
        $('.go-back').on('touchstart', function(e){
            e.preventDefault();
            var hashVal = location.hash;
            if (hashVal || location.pathname.indexOf('topic_list.htm')===-1){
                window.history.back();
            } else {
                window.alibaba && window.alibaba.call("UINavigation","exitsToApp");
            }
        });
    });
});

