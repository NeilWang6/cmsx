/**
 * @package FD.app.cms.editpage.merge
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

ImportJavscript.url("/static/fdevlib/js/fdev-v4/widget/web/valid.js");
ImportJavscript.url("/static/intra/js/dcms/module/dcms.js");
ImportJavscript.url("/static/intra/js/dcms/module/page-title.js");
ImportJavscript.url("/static/intra/js/dcms/module/hd.js");
ImportJavscript.url("/static/intra/js/dcms/module/left-nav.js");
ImportJavscript.url("/static/intra/js/dcms/module/fdlint.js");

ImportJavscript.url("/static/intra/js/dcms/module/codemirror/lib/codemirror.js");
ImportJavscript.url("/static/intra/js/dcms/module/codemirror/lib/util/match-highlighter.js");
ImportJavscript.url("/static/intra/js/dcms/module/codemirror/mode/xml/xml.js");
ImportJavscript.url("/static/intra/js/dcms/module/codemirror/mode/javascript/javascript.js");
ImportJavscript.url("/static/intra/js/dcms/module/codemirror/mode/css/css.js");

ImportJavscript.url("/static/intra/js/dcms/page/editpage/editpage.js");
ImportJavscript.url("/static/intra/js/dcms/page/applypermission/apply.js");
