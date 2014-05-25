/**
 * @author cheng.zhangch
 * @date   2014.01.25
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

ImportJavscript.url("/static/fdevlib/js/gallery/jquery/jquery-latest.js");
ImportJavscript.url("/static/fdevlib/js/lofty/port/lofty.js");
ImportJavscript.url("/static/fdevlib/js/lofty/util/template/1.0/template.js");
ImportJavscript.url('/static/intra/js/topic/qianniu/topic-recommend.js');