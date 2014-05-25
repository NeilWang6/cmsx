/**
 * @author cheng.zhangch
 * @date   2013.12.09
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

ImportJavscript.url("/static/fdevlib/js/gallery/appframework/appframework.js");
ImportJavscript.url("/static/fdevlib/js/lofty/port/lofty.js");
ImportJavscript.url("/static/fdevlib/js/lofty/util/cookie/1.0/cookie.js");
ImportJavscript.url("http://style.c.aliimg.com/sys/js/ali-native/3.3.0/jsbridge.js");
ImportJavscript.url("/static/intra/js/widget/wireless/header.js");
ImportJavscript.url("/static/fdevlib/js/lofty/util/template/1.0/template.js");
ImportJavscript.url('/static/intra/js/topic/wireless/wireless-topic.js');
ImportJavscript.url('/static/intra/js/topic/wireless/topicdetail.js');