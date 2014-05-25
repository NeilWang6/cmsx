/**
 * @package FD.elf
 * @author  wangxiaojun
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
ImportJavscript.url("/static/fdevlib/js/fdev-v4/widget/ui/core.js");
ImportJavscript.url("/static/fdevlib/js/fdev-v4/widget/ui/progressbar-min.js");
ImportJavscript.url("/static/intra/js/elf/page/addTags/addTags.js");