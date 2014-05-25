/**
 * ������Ŀͳһ����JS�ļ�
 * @author springyu
 * @date 2011-12-29
 */

/*merge start*/
(function(){
    ImportJavscript = {
        url:function(url){
            document.write("<script type=\"text/javascript\" src=\""+url+"\"></scr"+"ipt>");
        }
    };
})();
/*merge end*/

ImportJavscript.url("/static/fdevlib/js/fdev-v4/core/fdev-min.js");
ImportJavscript.url("/static/fdevlib/js/fdev-v4/widget/ui/core-min.js");
ImportJavscript.url("/static/fdevlib/js/fdev-v4/widget/fx/core-min.js");
ImportJavscript.url("/static/intra/js/dcms/module/dcms.js");
ImportJavscript.url("/static/intra/js/dcms/module/detect.js");
ImportJavscript.url("/static/intra/js/dcms/module/box/header.js");
ImportJavscript.url("/static/intra/js/dcms/module/header-menu.js");
ImportJavscript.url("/static/intra/js/dcms/module/klass.js");
