/**
 * @author shanshan.hongss
 * @usefor 运营工具平台 —— 公共头部
 * @date   2012.10.18
 */

;(function($, T) {
    var readyFun = [
    /**
     *盒子左内里高度，左则宽度计算
     */
    function() {
        var $win = $(window), width = $win.width(), height = 0;
        //$('.dcms-box-body').css('width', width - 220);
        var sHeight = (document.documentElement.scrollHeight),cHeight = (document.documentElement.clientHeight);
       height = Math.max(sHeight,cHeight);
        $('.left-menu').css('height', height - $('.page-header').outerHeight() - $('.page-content').outerHeight());
    }, /**
     *盒子 头部下拉菜单中新建库 弹出对话框
     */
    function() {
         $('.dcms-left-nav').delegate('.new', 'click', function(event) {
             var $self = $(this), options, htmlCode = '';
           
            if(FE.dcms && FE.dcms.Msg['confirm']){
                 //盒子使用 这个分支等待盒子配合移除
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
                     htmlCode = '参数出错，请联系系统管理员！';
                 }
                 if(FE.dcms && FE.dcms.Msg['confirm']){
                     //盒子使用 这个分支等待盒子配合移除
                     FE.dcms.Msg['confirm']({
                         'title' : '请选择创建方式',
                         'body' : '<div class="header-dialog-content">' + htmlCode + '</div>',
                         'complete' : function() {
                         	$('footer', '.js-dialog').show();
                         }
                     });
                 }else{
                     //运营work平台使用
                     T.Msg['confirm']({
                         'title' : '请选择创建方式',
                         'body' : '<div class="header-dialog-content">' + htmlCode + '</div>'
                     });
                 }
            
             }
         });
    },
    // 左侧栏功能ZHULIQI
    // function() {
    //     var topLeft = $('.page-content .my-work'),
    //     topLeftButton = topLeft.find('.icon-moveposition'),
    //     contentBody = $('.dcms-box-body');
    //     //缩进
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
    //     //显示子菜单
    //     var leftMenu = $('.left-menu'),
    //     dt = leftMenu.find('dt');
    //     // dt.toggle(function(){
    //     //     dt.
    //     // },function(){})
    // },
    //头部下拉菜单
    function() {
        var menuEls = $('.page-header .main .menu'), showMenuEls = $('.page-header .last .menu_nav');

        //显示下拉菜单
        /*$('.page-header .last').delegate('.menu_nav', 'click', function(e){
         //e.preventDefault();
         var el = $(this);
         showMenuEls.removeClass('active');
         el.addClass('active');
         });

         //隐藏下拉菜单
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
