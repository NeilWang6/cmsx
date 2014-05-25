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

ImportJavscript.url("/static/fdevlib/js/fdev-v4/widget/ui/dialog-min.js");
ImportJavscript.url("/static/intra/js/dcms/module/box/pagelist.js");
ImportJavscript.url("/static/intra/js/dcms/page/box/personallib/personallibcommon.js");
ImportJavscript.url("/static/intra/js/dcms/page/box/auditpersonallib/auditpersonallib.js");
ImportJavscript.url("/static/intra/js/dcms/module/capture.js");
