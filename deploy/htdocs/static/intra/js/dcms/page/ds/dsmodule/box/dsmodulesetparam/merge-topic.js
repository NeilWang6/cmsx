/**
 * @package FD.app.cms.searchpage.merge
 * @version 1.0.110926
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

ImportJavscript.url("/static/fdevlib/js/fdev-v4/core/fdev-min.js");
ImportJavscript.url("/static/intra/js/dcms/module/dcms.js");
ImportJavscript.url("/static/intra/js/dcms/box-v1/common/namespace.js");
ImportJavscript.url("/static/intra/js/dcms/box-v1/ds/topic.js");
ImportJavscript.url("/static/intra/js/dcms/module/cross-browser-localstorage.js");
ImportJavscript.url("/static/intra/js/dcms/page/ds/dsmodule/box/dsmodulesetparam/dsmoduletopic.js");
