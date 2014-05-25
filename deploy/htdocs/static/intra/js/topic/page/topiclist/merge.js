/**
 * @author wangxiaojun
 * @usefor ��ͨר��list�ҳ�� - merge �ļ�
 * @date   2013.1.22
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
ImportJavscript.url("http://style.c.aliimg.com/js/common/aliclick.js");
ImportJavscript.url('/static/intra/js/topic/page/topiclist/topiclist.js');