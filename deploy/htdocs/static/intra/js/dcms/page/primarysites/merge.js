/**
 * @package FD.app.cms.sitelistnew.merge
 * @version 2.0.140228
 * @author wb-zhangchunyi
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
ImportJavscript.url("/static/intra/js/dcms/module/left-nav.js");
ImportJavscript.url("/static/intra/js/widget/tui-mult-choice.js");
ImportJavscript.url("/static/intra/js/dcms/page/primarysites/primarysites.js");