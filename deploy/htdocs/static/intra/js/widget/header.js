/**
 * @author shanshan.hongss
 * @usefor ��Ӫ����ƽ̨ ���� ����ͷ��
 * @date   2012.10.18
 */

;(function($, T) {
    var readyFun = [
    /**
     *����������߶ȣ������ȼ���
     */
    function() {
        var $win = $(window), width = $win.width(), height = 0;
        //$('.dcms-box-body').css('width', width - 220);
        var sHeight = (document.documentElement.scrollHeight),cHeight = (document.documentElement.clientHeight);
       height = Math.max(sHeight,cHeight);
        $('.left-menu').css('height', height - $('.page-header').outerHeight() - $('.page-content').outerHeight());
    }, /**
     *���� ͷ�������˵����½��� �����Ի���
     */
    function() {
         $('.dcms-left-nav').delegate('.new', 'click', function(event) {
             var $self = $(this), options, htmlCode = '';
           
            if(FE.dcms && FE.dcms.Msg['confirm']){
                 //����ʹ�� �����֧�ȴ���������Ƴ�
                 var $footer = $('footer', '.js-dialog');
                 $footer.hide();
             }else{
                 var $footer = $('footer', '.js-dialog-basic');
                 $footer.hide();
             }
             options = $self.data('options');
             if(options) {
                 if( options instanceof Array) {

                     for(var i = 0; i < options.length; i++) {
                         if(i === 0) {
                             htmlCode += '<a class="btn-basic btn-blue" ';
                         } else {
                             htmlCode += '<a class="btn-basic  btn-gray" ';
                         }

                         var object = options[i], title = '';
                         for(var name in object) {
                             title = object['title'];
                             htmlCode += ' ' + name + '=' + object[name];
                         }
                         htmlCode += '>' + title + '</a>';
                         title = '';
                     }

                 } else {
                     htmlCode = '������������ϵϵͳ����Ա��';
                 }
                 if(FE.dcms && FE.dcms.Msg['confirm']){
                     //����ʹ�� �����֧�ȴ���������Ƴ�
                     FE.dcms.Msg['confirm']({
                         'title' : '��ѡ�񴴽���ʽ',
                         'body' : '<div class="header-dialog-content">' + htmlCode + '</div>',
                         'complete' : function() {
                         	$('footer', '.js-dialog').show();
                         }
                     });
                 }else{
                     //��Ӫworkƽ̨ʹ��
                     T.Msg['confirm']({
                         'title' : '��ѡ�񴴽���ʽ',
                         'body' : '<div class="header-dialog-content">' + htmlCode + '</div>'
                     });
                 }
            
             }
         });
    },
    // ���������ZHULIQI
    // function() {
    //     var topLeft = $('.page-content .my-work'),
    //     topLeftButton = topLeft.find('.icon-moveposition'),
    //     contentBody = $('.dcms-box-body');
    //     //����
    //     topLeftButton.click(function(){
    //         if( $(this).hasClass('toright') ) {
    //             topLeft.removeClass('move-moveend--182')
    //             topLeft.addClass('move-moveend-0');
    //             $(this).removeClass('toright')
    //             $('#tools_panel').removeClass('move-moveend--182').addClass('move-moveend-0');
    //             contentBody.removeClass('move-paddingend19-500ms').addClass('move-paddingend201-500ms');
    //         }else{
    //             topLeft.removeClass('move-moveend-0');
    //             topLeft.addClass('move-moveend--182');
    //             $(this).addClass('toright');    
    //             $('#tools_panel').removeClass('move-moveend-0').addClass('move-moveend--182'); 
    //             contentBody.removeClass('move-paddingend201-500ms').addClass('move-paddingend19-500ms');           
    //         }
    //     });
    //     //��ʾ�Ӳ˵�
    //     var leftMenu = $('.left-menu'),
    //     dt = leftMenu.find('dt');
    //     // dt.toggle(function(){
    //     //     dt.
    //     // },function(){})
    // },
    //ͷ�������˵�
    function() {
        var menuEls = $('.page-header .main .menu'), showMenuEls = $('.page-header .last .menu_nav');

        //��ʾ�����˵�
        /*$('.page-header .last').delegate('.menu_nav', 'click', function(e){
         //e.preventDefault();
         var el = $(this);
         showMenuEls.removeClass('active');
         el.addClass('active');
         });

         //���������˵�
         $(document).click(function(e){
         var el = $(e.target).closest('.menu_nav'),
         menuEl = showMenuEls.filter(el);

         if (menuEl.length===0){
         showMenuEls.removeClass('active');
         menuEls.hide();
         }
         });*/
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
