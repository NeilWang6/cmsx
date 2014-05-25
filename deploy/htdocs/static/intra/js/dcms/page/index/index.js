/**
 * 首页引导，菜单整理
 * @author: shanshan.hongss
 * @createTime: 2012-07-10
 */
(function ($, D) {

   var guideclass='dcms-guide-',
   readyFun = [
        function(){
            var isGuide = $.util.cookie('_is_guide_');
            if (!isGuide || isGuide!=='false'){
                $('.'+guideclass+'1').show();
            }
        }
    ];
    D.colseGuide = function(num){
        $('.'+guideclass+num).hide();
    }
    D.showNext = function(num){
        var nextNum = parseInt(num)+1;
        D.colseGuide(num);
        $('.'+guideclass+nextNum).show();
    }
    D.setGuided = function(num, value){
        $.ajax({
            type:'POST',
            url:'http://'+location.host+'/page/add_cookie.html',
            data:{'_is_guide_':value},
            success:function(o){}
        });
        D.colseGuide(num);
    }

   $(function(){
        for (var i = 0, l = readyFun.length; i<l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if ($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
        
    });
})(dcms, FE.dcms);
