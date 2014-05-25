/**
 * @author shanshan.hongss
 * @usefor VIP������ - merge �ļ�
 * @date   2012.09.23
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

ImportJavscript.url('/static/fdevlib/js/fdev-v4/core/fdev-min.js');
ImportJavscript.url('/static/intra/js/topic/page/vipauto/vipauto.js');