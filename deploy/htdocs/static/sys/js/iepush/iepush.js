/**
 * Created by JetBrains RubyMine.
 * User: ianva
 * Date: 11-12-6
 * Time: 上午11:19
 * To change this template use File | Settings | File Templates.
 */
;(function($,undefined){

$.use('ui-position',function(){

    $.widget('ui.iepush', {
        options : {
            offset : '0 0',
            tipAlign:'left bottom',
            wrapAlign:'right top',
            duration : false,
            animate : false,
			render : $("#doc"),
			limitTop: 300
        },
        _create: function(){
             var bank = '<div class="ui-iepush-section"><a href="http://survey.china.alibaba.com/index.php?sid=27344&lang=zh-Hans">银行使用情况有奖调查</a></div>';
             if( this.checkBrowser() ){
                aliclick("",'?tracelog=iepush_init');
                this.tip = $('<div class="ui-iepush ui-iepush-icon"><div class="ui-iepush-section"><a onmousedown="return aliclick(this,\'?tracelog=iepush_link\')" class="ui-iepush-link" href="http://page.1688.com/promotion/ie8.html" target="_blank">升级浏览器<br/>，交易更安全</a></div>'+bank+'</div>');
             }else{
                this.tip = $('<div class="ui-iepush">'+bank+'</div>');
             }
            this.option('render').append(this.tip);
            this.position();
            this.bind();

        },
        checkBrowser : function(){
            return jQuery.util.ua.ie67;
        },
        position : function(){
            var
                viewHeight = document.documentElement.clientHeight,
				elTop = this.element[0].offsetTop,
                defaultOffset = this.option('offset').split(' '),
                offsetLeft = defaultOffset[0]-0,
                offsetTop = defaultOffset[1]-0 + viewHeight + $(window).scrollTop() - elTop,
				offsetTop = offsetTop<this.option('limitTop')?this.option('limitTop'):offsetTop;

            if(!jQuery.util.ua.ie6 ){
                this.tip.css('position','fixed');
            }
            this.tip.position({
                of: this.element,
                my: this.option('tipAlign'),
                at: this.option('wrapAlign'),
                offset: offsetLeft+' '+offsetTop,
                collision:'none none'
            });

        },
        close: function(){
            if(this.option('animate')){
                this.tip.animate({
                    opacity: 0
                },500);
            }else{
              this.tip.css('display','none');
            }
        },
        open: function(){
            if(this.option('animate')){
                this.tip.animate({
                    opacity: 1
                },500);
            }else{
                this.tip.css('display','');
            }
        },
        bind : function(){
            var
                self = this;

            $(window).scroll(function(){
                 self.position();
            });
            $(window).resize(function(){
                 self.position();
            });
            if(this.option('duration')){
                setTimeout(function(){
                    self.close();
                },this.option('duration'));
            }
        }

    });
    $('#content').iepush();
});
})(jQuery);
