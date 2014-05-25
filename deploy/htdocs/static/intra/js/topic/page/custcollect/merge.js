/**
 * @author lusheng.linls
 * @usefor ��ͨר���Զ�����Ϣ�Ѽ�ҳ�� - merge �ļ�
 * @date   2013.2.27
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
ImportJavscript.url('/static/intra/js/topic/module/survey.js');
ImportJavscript.url('/static/intra/js/topic/page/custcollect/custcollect.js');