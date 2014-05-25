/**
 * ʹ�����µ���Ӫworkƽ̨��ʽ
 * @author lusheng.linls
 * @date 2013.01.18
 */

/*merge start*/
(function(){
    ImportJavscript = {
        url:function(url){
            document.write("<script type=\"text/javascript\" src=\""+url+"\"></scr"+"ipt>");
        }
    }
})();
/*merge end*/

ImportJavscript.url("/static/fdevlib/js/fdev-v4/core/fdev-min.js");
ImportJavscript.url("/static/intra/js/widget/basic.js");
ImportJavscript.url("/static/intra/js/widget/dialog.js");
ImportJavscript.url("/static/intra/js/widget/header.js");
ImportJavscript.url("/static/intra/js/widget/menu.js");
ImportJavscript.url("/static/intra/js/libra/module/header-right.js");