/**
 * @package FD.app.cms.addpage.merge
 * @version 1.0.110916
 * @author  hongss
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

ImportJavscript.url("/static/intra/js/dcms/module/dcms.js");
ImportJavscript.url("/static/intra/js/dcms/module/left-nav.js");
ImportJavscript.url("/static/intra/js/dcms/page/managepermission/managepermission.js");
ImportJavscript.url("/static/intra/js/dcms/module/hd.js");
