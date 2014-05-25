/**
 * @package FD.app.cms.box.pagelib.merge
 * @version 1.0.2012-01-10
 * @author  zhaoyang.maozy
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

ImportJavscript.url("/static/intra/js/dcms/module/trees.js");
ImportJavscript.url("/static/intra/js/dcms/module/catalog.js");
ImportJavscript.url("/static/intra/js/dcms/module/box/pagelist.js");
ImportJavscript.url("/static/fdevlib/js/fdev-v4/widget/ui/dialog-min.js");
ImportJavscript.url("/static/intra/js/dcms/module/box/favorite.js");
ImportJavscript.url("/static/intra/js/dcms/module/box/msg.js");
ImportJavscript.url("/static/intra/js/dcms/module/box/edit-page.js");
ImportJavscript.url("/static/intra/js/dcms/page/box/pagelib/pagelib.js");
