/**
 * @package FD.app.cms.rule.merge
 * @version 1.0.110307
 * @author  yanlong.liuyl
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

ImportJavscript.url('/static/intra/js/dcms/module/dcms.js');
ImportJavscript.url("/static/intra/js/dcms/module/page-title.js");
ImportJavscript.url('/static/intra/js/dcms/module/hd.js');
ImportJavscript.url('/static/intra/js/dcms/module/left-nav.js');