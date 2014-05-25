/**
 * @author shanshan.hongss
 * @usefor ��Ӫ����ƽ̨ ���� ����ͷ��
 * @date   2012.10.18
 */

define(['jquery', 'util/cookie/1.0'], function($, Cookie){
    $(function(){
        
        var extra = Cookie.get('_app_extra');
        if (extra && extra.indexOf('Android')!==-1){
            $('.doc-header').addClass('android');
            $('body').addClass('android');
        }
        //�˵���ʾ/����
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
        //ˢ��
        $('.refresh', actionUl).on('touchstart', function(e){
            e.preventDefault();
            location.reload();
        });
        
        //������ݼ�
        $('.add-shortcut', actionUl).on('touchstart', function(e){
            e.preventDefault();
            window.alibaba && window.alibaba.WVShortCut &&  window.alibaba.WVShortCut.shortCut();
        });
        
        //�˳�
        $('.exit-app', actionUl).on('touchstart', function(e){
            e.preventDefault();
            window.alibaba && window.alibaba.call("UINavigation","exitsToApp");
        });
        
        //����
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

